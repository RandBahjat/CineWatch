const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Parse URL pathname safely
  let safePath = '';
  try {
    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    safePath = decodeURIComponent(parsedUrl.pathname);
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
    return;
  }

  if (safePath === '/app' || safePath === '/app/') {
    res.writeHead(302, { 'Location': '/cinewatch-app/' });
    res.end();
    return;
  }

  // M3U8 Stream Proxy (Injects required referer and rewrites nested playlists)
  if (safePath === '/api/anime-m3u8') {
    let parsed = new URL(req.url, `http://localhost:${PORT}`);
    const streamTarget = parsed.searchParams.get('url');
    if (!streamTarget) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing url parameter');
      return;
    }

    const host = req.headers.host || `localhost:${PORT}`;
    const proto = req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = `${proto}://${host}`;

    fetch(streamTarget, {
      headers: {
        'Referer': 'https://megavid.buzz/',
        'Origin': 'https://megavid.buzz',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    })
      .then(async response => {
        if (!response.ok) {
          res.writeHead(response.status, { 'Access-Control-Allow-Origin': '*' });
          res.end(`Upstream error: ${response.status}`);
          return;
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('mpegurl') || streamTarget.includes('.m3u8') || contentType.includes('application/octet-stream') || contentType.includes('text/plain')) {
          const text = await response.text();
          // Rewrite nested m3u8 playlists so child playlists also route through proxy
          const rewritten = text.split('\n').map(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return line;
            try {
              const fullUrl = new URL(trimmed, streamTarget).href;
              // If it's a playlist or on cp.megavid.buzz, proxy it; if it's a direct .ts on cdn.api-webs.com, leave as-is
              if (fullUrl.includes('.m3u8') || fullUrl.includes('cp.megavid.buzz')) {
                return `${baseUrl}/api/anime-m3u8?url=${encodeURIComponent(fullUrl)}`;
              }
              return fullUrl;
            } catch (e) {
              return line;
            }
          }).join('\n');

          res.writeHead(200, {
            'Content-Type': 'application/vnd.apple.mpegurl',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
          });
          res.end(rewritten);
        } else {
          // Pass-through binary (e.g. segments or keys if proxied)
          res.writeHead(200, {
            'Content-Type': contentType || 'video/MP2T',
            'Access-Control-Allow-Origin': '*'
          });
          const arrayBuf = await response.arrayBuffer();
          res.end(Buffer.from(arrayBuf));
        }
      })
      .catch(err => {
        res.writeHead(500, { 'Access-Control-Allow-Origin': '*' });
        res.end(`Proxy error: ${err.message}`);
      });
    return;
  }

  // Direct Anime Source Proxy (bypasses CORS restrictions)
  if (safePath === '/api/anime-source') {
    let parsed = new URL(req.url, `http://localhost:${PORT}`);
    const malId = parsed.searchParams.get('malId') || '21';
    const ep = parsed.searchParams.get('ep') || '1';
    const mode = parsed.searchParams.get('mode') || 'sub';
    const targetUrl = `https://megavid.buzz/mal/${malId}/${ep}/${mode}/source`;
    const host = req.headers.host || `localhost:${PORT}`;
    const proto = req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = `${proto}://${host}`;

    fetch(targetUrl, {
      headers: {
        'Referer': 'https://megavid.buzz/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    })
      .then(r => r.json())
      .then(data => {
        if (data && data.source) {
          data.rawSource = data.source;
          data.embedUrl = `https://megavid.buzz/mal/${malId}/${ep}/${mode}`;
          if (data.source.includes('.m3u8') || data.source.includes('cp.megavid.buzz')) {
            data.source = `${baseUrl}/api/anime-m3u8?url=${encodeURIComponent(data.source)}`;
          }
        }
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(data));
      })
      .catch(err => {
        res.writeHead(500, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ error: err.message }));
      });
    return;
  }

  // Default to index.html for root or directory
  let filePath = path.join(ROOT_DIR, safePath);

  // Prevent directory traversal attacks
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.stat(filePath, (err2, stats2) => {
      if (err2 || !stats2.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head><title>404 Not Found</title></head>
          <body style="background:#111;color:#fff;font-family:sans-serif;text-align:center;padding:50px;">
            <h1>404 - File Not Found</h1>
            <p>The requested file <code>${safePath}</code> was not found.</p>
            <a href="/" style="color:#e50914;">Return to CineWatch Home</a>
          </body>
          </html>
        `);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      // Support Range requests (useful for video/audio streaming)
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stats2.size - 1;
        const chunksize = (end - start) + 1;
        const fileStream = fs.createReadStream(filePath, { start, end });

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stats2.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType,
        });
        fileStream.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': stats2.size,
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });
        fs.createReadStream(filePath).pipe(res);
      }
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n========================================`);
  console.log(`🚀 CineWatch Local Host Server Running!`);
  console.log(`📡 Local:    http://localhost:${PORT}`);
  console.log(`🌐 Network:  http://127.0.0.1:${PORT}`);
  console.log(`========================================\n`);
});

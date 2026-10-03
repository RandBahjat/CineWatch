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

async function translateVTT(vttText, targetLang) {
  const blocks = vttText.split(/\r?\n\r?\n/);
  const parsed = [];
  let header = "";
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();
    if (!block) continue;
    if (i === 0 && block.toUpperCase().startsWith('WEBVTT')) {
      header = block;
      continue;
    }
    const lines = block.split(/\r?\n/);
    if (lines.length >= 2 && lines[0].includes('-->')) {
      const text = lines.slice(1).join('\n').replace(/<\/?[^>]+(>|$)/g, "");
      parsed.push({ meta: lines[0], text });
    } else if (lines.length >= 3 && lines[1].includes('-->')) {
      const text = lines.slice(2).join('\n').replace(/<\/?[^>]+(>|$)/g, "");
      parsed.push({ meta: lines.slice(0,2).join('\n'), text });
    } else {
      parsed.push({ meta: '', text: block });
    }
  }

  const chunks = [];
  let curTexts = [];
  let curLen = 0;
  for (const p of parsed) {
    if (curLen + p.text.length > 3000) {
      chunks.push(curTexts);
      curTexts = [];
      curLen = 0;
    }
    curTexts.push(p.text);
    curLen += p.text.length + 10;
  }
  if (curTexts.length > 0) chunks.push(curTexts);

  let translatedTexts = [];
  const results = await Promise.all(chunks.map(async chunk => {
    try {
      const q = chunk.join(' \n ~|~ \n ');
      const params = new URLSearchParams();
      params.append('q', q);
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t`, {
        method: 'POST',
        body: params
      });
      const data = await res.json();
      const combined = data[0].map(x => x[0]).join('');
      return combined.split(/~\|~/).map(s => s.trim());
    } catch (e) {
      return chunk; // fallback to original on error
    }
  }));

  translatedTexts = results.flat();
  
  let outVTT = header + "\n\n";
  for (let i = 0; i < parsed.length; i++) {
    const p = parsed[i];
    const t = translatedTexts[i] || p.text;
    if (p.meta) {
      outVTT += p.meta + "\n" + t + "\n\n";
    } else {
      outVTT += t + "\n\n";
    }
  }
  
  return outVTT.trim();
}

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
  
  // Twilio SMS Proxy Route
  if (safePath === '/api/send-sms') {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      res.end();
      return;
    }
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body || '{}');
          const sid = payload.accountSid || process.env.TWILIO_ACCOUNT_SID || '';
          const token = payload.authToken || process.env.TWILIO_AUTH_TOKEN || '';
          const from = payload.from || process.env.TWILIO_FROM_PHONE || '';
          const to = payload.to;
          const msgBody = payload.body || '🎬 CineWatch: Your VIP subscription has been approved!';

          if (!to) {
            res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({ error: 'Missing destination phone number' }));
            return;
          }

          const endpoint = 'https://api.twilio.com/2010-04-01/Accounts/' + encodeURIComponent(sid) + '/Messages.json';
          const formData = new URLSearchParams();
          formData.append('To', to);
          formData.append('From', from);
          formData.append('Body', msgBody);

          const twRes = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': 'Basic ' + Buffer.from(sid + ':' + token).toString('base64'),
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
          });

          const twData = await twRes.json();
          res.writeHead(twRes.status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify(twData));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }
  }

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

        const arrayBuf = await response.arrayBuffer();
        const buf = Buffer.from(arrayBuf);
        const head = buf.subarray(0, 100).toString('utf8');
        const isM3u8 = head.includes('#EXTM3U') || streamTarget.includes('.m3u8');

        if (isM3u8) {
          const text = buf.toString('utf8');
          const isMaster = text.includes('#EXT-X-STREAM-INF');
          // Rewrite nested playlists so child playlists also route through proxy
          const rewritten = text.split('\n').map(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) {
              if (trimmed.startsWith('#EXT-X-KEY:') && trimmed.includes('URI="')) {
                return trimmed.replace(/URI="([^"]+)"/, (m, uri) => {
                  try {
                    const fullKey = new URL(uri, streamTarget).href;
                    return `URI="${baseUrl}/api/anime-m3u8?url=${encodeURIComponent(fullKey)}"`;
                  } catch (e) { return m; }
                });
              }
              return line;
            }
            try {
              const fullUrl = new URL(trimmed, streamTarget).href;
              // Proxy ALL urls (variant playlists, TS segments, etc) to ensure correct Referer
              return `${baseUrl}/api/anime-m3u8?url=${encodeURIComponent(fullUrl)}`;
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
          // Pass-through binary (e.g. segments or keys)
          const contentType = response.headers.get('content-type') || 'video/MP2T';
          res.writeHead(200, {
            'Content-Type': contentType === 'image/jpeg' ? 'video/MP2T' : contentType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=86400'
          });
          res.end(buf);
        }
      })
      .catch(err => {
        res.writeHead(500, { 'Access-Control-Allow-Origin': '*' });
        res.end(`Proxy error: ${err.message}`);
      });
    return;
  }

  // Direct Anime Source Proxy (bypasses CORS restrictions)
  
  // WebVTT Subtitle Proxy (bypasses 403 & CORS on anime subtitle tracks)
  if (safePath === '/api/anime-sub') {
    let parsed = new URL(req.url, `http://localhost:${PORT}`);
    const subTarget = parsed.searchParams.get('url');
    const targetLang = parsed.searchParams.get('lang'); // optional
    if (!subTarget) {
      res.writeHead(400, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
      res.end('Missing url');
      return;
    }

    let origin = 'https://hls.dramahot.top';
    try {
      origin = new URL(subTarget).origin;
    } catch(e) {}

    fetch(subTarget, {
      headers: {
        'Referer': `${origin}/`,
        'Origin': origin,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    })
      .then(async response => {
        if (!response.ok) {
          if (targetLang) {
            console.warn(`Upstream block on ${subTarget}, translation may fail`);
          }
          res.writeHead(302, { 'Location': subTarget });
          res.end();
          return;
        }
        let text = await response.text();
        
        if (targetLang) {
          try {
            text = await translateVTT(text, targetLang);
          } catch(e) {
            console.error('Translation error:', e);
          }
        }
        
        res.writeHead(200, {
          'Content-Type': 'text/vtt; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400'
        });
        res.end(text);
      })
      .catch(err => {
        res.writeHead(500, { 'Access-Control-Allow-Origin': '*' });
        res.end(err.message);
      });
    return;
  }

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
      .then(async r => {
        const data = await r.json();
        
        if (mode === 'dub') {
          try {
            const subUrl = `https://megavid.buzz/mal/${malId}/${ep}/sub/source`;
            const subR = await fetch(subUrl, { headers: { 'Referer': 'https://megavid.buzz/', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
            const subData = await subR.json();
            if (subData && subData.tracks && subData.tracks.length > 0) {
              data.tracks = subData.tracks;
            }
          } catch(e) {
            console.error('Failed to fetch sub tracks for dub override:', e);
          }
        }

        if (data && data.source) {
          data.rawSource = data.source;
          data.embedUrl = `https://megavid.buzz/mal/${malId}/${ep}/${mode}`;
          data.source = `${baseUrl}/api/anime-m3u8?url=${encodeURIComponent(data.source)}`;
        }
        if (data && data.tracks && data.tracks.length > 0) {
          data.tracks = data.tracks.map(t => ({
            ...t,
            rawFile: t.file,
            file: `${baseUrl}/api/anime-sub?url=${encodeURIComponent(t.file)}`
          }));
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

function startServer(portToUse) {
  server.listen(portToUse, '0.0.0.0', () => {
    console.log(`\n========================================`);
    console.log(`🚀 CineWatch Local Host Server Running!`);
    console.log(`📡 Local:    http://localhost:${portToUse}`);
    console.log(`🌐 Network:  http://127.0.0.1:${portToUse}`);
    console.log(`========================================\n`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠️ Port ${PORT} is busy, trying port ${PORT + 1}...`);
    PORT += 1;
    startServer(PORT);
  } else {
    console.error('Server error:', err);
  }
});

startServer(PORT);

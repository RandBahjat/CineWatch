const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

// Parse CLI flags
const args = process.argv.slice(2);
let customPort = null;
let shouldOpenBrowser = true;

for (const arg of args) {
  if (arg.startsWith('--port=')) {
    customPort = parseInt(arg.split('=')[1], 10);
  } else if (arg === '--no-open') {
    shouldOpenBrowser = false;
  } else if (arg === '--open') {
    shouldOpenBrowser = true;
  }
}

let PORT = customPort || parseInt(process.env.PORT, 10) || 3500;
const ROOT_DIR = path.join(__dirname, 'cinewatch-app');
const WEBSITE_DIR = __dirname;

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.m3u8': 'application/vnd.apple.mpegurl',
  '.ts': 'video/mp2t',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // Global CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Parse requested path
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Health / Status Check Endpoint
  if (pathname === '/api/status' || pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      app: 'CineWatch Localhost Server',
      port: PORT,
      uptimeSeconds: Math.floor(process.uptime()),
      endpoints: ['/api/stream', '/api/anime-source', '/api/anime-m3u8']
    }));
    return;
  }

  // M3U8 Anime Stream Proxy (Injects required referer, rewrites child playlists & segments)
  if (pathname === '/api/anime-m3u8') {
    const streamTarget = parsedUrl.searchParams.get('url');
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
          // Pass-through binary (e.g. segments or keys)
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

  // Direct Anime Source Proxy (bypasses CORS restrictions for MegaCloud / HiAnime streams)
  if (pathname === '/api/anime-source') {
    const malId = parsedUrl.searchParams.get('malId') || '21';
    const ep = parsedUrl.searchParams.get('ep') || '1';
    const mode = parsedUrl.searchParams.get('mode') || 'sub';
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

  // Direct Stream Extractor API endpoint (Consumet / FlixHQ / VidCloud)
  if (pathname === '/api/stream') {
    const tmdbId = parsedUrl.searchParams.get('tmdbId');
    const title = parsedUrl.searchParams.get('title') || '';
    const type = parsedUrl.searchParams.get('type') || 'movie';
    const season = parsedUrl.searchParams.get('season') || '1';
    const episode = parsedUrl.searchParams.get('episode') || '1';

    const queryProviders = async () => {
      const endpoints = [
        `https://consumet-api-production-e852.up.railway.app/movies/flixhq/${encodeURIComponent(title)}`,
        `https://api-consumet.onrender.com/movies/flixhq/${encodeURIComponent(title)}`,
        `https://c.delusionz.xyz/movies/flixhq/${encodeURIComponent(title)}`
      ];

      for (const ep of endpoints) {
        try {
          const r = await fetch(ep, { signal: AbortSignal.timeout(4000) });
          if (!r.ok) continue;
          const data = await r.json();
          if (data && data.results && data.results.length > 0) {
            const match = data.results[0];
            const baseUrl = ep.split('/movies/flixhq/')[0];
            const infoRes = await fetch(`${baseUrl}/movies/flixhq/info?id=${encodeURIComponent(match.id)}`, { signal: AbortSignal.timeout(4000) });
            if (!infoRes.ok) continue;
            const infoData = await infoRes.json();

            let epId = infoData.id;
            if (infoData.episodes && infoData.episodes.length > 0) {
              const targetEp = infoData.episodes.find(e => e.season === parseInt(season) && e.number === parseInt(episode)) || infoData.episodes[0];
              if (targetEp) epId = targetEp.id;
            }

            const watchRes = await fetch(`${baseUrl}/movies/flixhq/watch?episodeId=${encodeURIComponent(epId)}&mediaId=${encodeURIComponent(match.id)}`, { signal: AbortSignal.timeout(4000) });
            if (!watchRes.ok) continue;
            const watchData = await watchRes.json();
            if (watchData && watchData.sources && watchData.sources.length > 0) {
              const master = watchData.sources.find(s => s.quality === 'auto' || s.isM3U8) || watchData.sources[0];
              return {
                success: true,
                streamUrl: master.url,
                subtitles: watchData.subtitles || []
              };
            }
          }
        } catch (e) {}
      }
      return { success: false };
    };

    queryProviders().then(result => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });
    return;
  }

  // Support /website or /site path to view root CineWatch website
  let baseDir = ROOT_DIR;
  if (pathname.startsWith('/website/') || pathname === '/website') {
    baseDir = WEBSITE_DIR;
    pathname = pathname.replace(/^\/website/, '') || '/';
  } else if (pathname.startsWith('/site/') || pathname === '/site') {
    baseDir = WEBSITE_DIR;
    pathname = pathname.replace(/^\/site/, '') || '/';
  }

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  let filePath = path.join(baseDir, pathname);

  // Seamless Sync: If requesting core shared files, serve directly from the root workspace
  // so whatever is edited in VS Code / IDE is instantly live in the CineWatch app!
  const sharedFiles = [
    '/movies-data.js',
    '/series-data.js',
    '/anime-data.js',
    '/movie.js',
    '/movie.css',
    '/browse-fix.css',
    '/api.js',
    '/ai-assistant.js'
  ];
  if (sharedFiles.includes(pathname)) {
    const parentPath = path.join(WEBSITE_DIR, pathname);
    if (fs.existsSync(parentPath)) {
      filePath = parentPath;
    }
  }

  // Security: prevent directory traversal outside baseDir and WEBSITE_DIR
  if (!filePath.startsWith(ROOT_DIR) && !filePath.startsWith(WEBSITE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback: check if requesting index.html
      const fallback = path.join(baseDir, 'index.html');
      fs.readFile(fallback, (err2, data) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`
            <!DOCTYPE html>
            <html>
            <head><title>404 Not Found - CineWatch</title></head>
            <body style="background:#0b0c10;color:#e50914;font-family:sans-serif;text-align:center;padding:60px;">
              <h1>404 - File Not Found</h1>
              <p style="color:#aaa;">The requested route <code>${pathname}</code> does not exist.</p>
              <a href="/" style="color:#fff;background:#e50914;padding:10px 20px;text-decoration:none;border-radius:6px;display:inline-block;margin-top:20px;">Return to CineWatch App</a>
            </body>
            </html>
          `);
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Support HTTP Range requests (crucial for smooth video seeking & streaming)
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      });
      fileStream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stats.size,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

function openBrowser(url) {
  const startCmd = process.platform === 'win32' ? 'start ""' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  exec(`${startCmd} "${url}"`, () => {});
}

function startServer(portToUse) {
  server.listen(portToUse, '0.0.0.0', () => {
    const localIp = getLocalIp();
    const localUrl = `http://localhost:${portToUse}`;
    const networkUrl = `http://${localIp}:${portToUse}`;

    console.log(`\n==========================================================`);
    console.log(` 🎬  CINEWATCH LOCALHOST SERVER ACTIVE`);
    console.log(`==========================================================`);
    console.log(` 📡 Local PC:        \x1b[36m${localUrl}\x1b[0m`);
    console.log(` 📱 Mobile / Wi-Fi:  \x1b[32m${networkUrl}\x1b[0m`);
    console.log(` 🌐 Website Mode:    \x1b[33m${localUrl}/website/\x1b[0m`);
    console.log(` 📁 Serving Root:    ${ROOT_DIR}`);
    console.log(` ⚡ Active Proxies:  /api/stream, /api/anime-source, /api/anime-m3u8`);
    console.log(` 🔄 Live Hot Sync:   movies-data.js, series-data.js, movie.js`);
    console.log(`==========================================================`);
    console.log(` Press Ctrl+C anytime to stop the server.\n`);

    if (shouldOpenBrowser) {
      // Slight delay so the server socket is fully established
      setTimeout(() => {
        openBrowser(localUrl);
      }, 500);
    }
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠️ Port ${PORT} is occupied, automatically trying port ${PORT + 1}...`);
    PORT += 1;
    startServer(PORT);
  } else {
    console.error('Server error:', err);
  }
});

// Clean shutdown on interrupt
process.on('SIGINT', () => {
  console.log('\nStopping CineWatch Localhost Server...');
  server.close(() => {
    process.exit(0);
  });
});

startServer(PORT);

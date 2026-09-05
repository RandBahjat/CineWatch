const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

let PORT = parseInt(process.env.PORT, 10) || 3500;
const ROOT_DIR = path.join(__dirname, 'cinewatch-app');

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
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.m3u8': 'application/vnd.apple.mpegurl',
  '.ts': 'video/mp2t'
};

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Parse requested path
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Direct Stream Extractor API endpoint
  if (pathname === '/api/stream') {
    const tmdbId = parsedUrl.searchParams.get('tmdbId');
    const title = parsedUrl.searchParams.get('title') || '';
    const type = parsedUrl.searchParams.get('type') || 'movie';
    const season = parsedUrl.searchParams.get('season') || '1';
    const episode = parsedUrl.searchParams.get('episode') || '1';

    // Query upstream direct stream providers (Consumet / FlixHQ / VidCloud)
    const queryProviders = async () => {
      const endpoints = [
        `https://consumet-api-production-e852.up.railway.app/movies/flixhq/${encodeURIComponent(title)}`,
        `https://api-consumet.onrender.com/movies/flixhq/${encodeURIComponent(title)}`,
        `https://c.delusionz.xyz/movies/flixhq/${encodeURIComponent(title)}`
      ];

      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, { signal: AbortSignal.timeout(4000) });
          if (!res.ok) continue;
          const data = await res.json();
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

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  let filePath = path.join(ROOT_DIR, pathname);

  // Seamless Sync: Serve shared data and movie.js directly from root directory
  // so whatever you edit in movie.js or data files is instantly live in the app!
  const sharedFiles = ['/movies-data.js', '/series-data.js', '/anime-data.js', '/movie.js'];
  if (sharedFiles.includes(pathname)) {
    const parentPath = path.join(__dirname, pathname);
    if (fs.existsSync(parentPath)) {
      filePath = parentPath;
    }
  }

  // Security: prevent directory traversal outside ROOT_DIR or __dirname
  if (!filePath.startsWith(ROOT_DIR) && !filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback: check if requesting root index.html
      const fallback = path.join(ROOT_DIR, 'index.html');
      fs.readFile(fallback, (err2, data) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
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

function startServer(portToUse) {
  server.listen(portToUse, '0.0.0.0', () => {
    const localIp = getLocalIp();
    console.log(`\n======================================================`);
    console.log(`🚀 CineWatch Localhost Server Active!`);
    console.log(`📡 Localhost:   http://localhost:${portToUse}`);
    console.log(`📱 Network:     http://${localIp}:${portToUse}`);
    console.log(`📁 Serving:     ${ROOT_DIR}`);
    console.log(`======================================================\n`);
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

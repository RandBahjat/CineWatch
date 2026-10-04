const http = require('http');
const fs = require('fs');
const path = require('path');

let PORT = parseInt(process.env.PORT, 10) || 3000;
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

// ==========================================
// VIDLINK NATIVE WASM STREAM RESOLVER & CACHE
// ==========================================
const VIDLINK_REFERER = 'https://vidlink.pro/';
const VIDLINK_ORIGIN = 'https://vidlink.pro';
const VIDLINK_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

let wasmBootPromise = null;
function bootVidlinkWasm() {
  if (wasmBootPromise) return wasmBootPromise;
  wasmBootPromise = (async () => {
    globalThis.window = globalThis;
    globalThis.self = globalThis;
    globalThis.document = { createElement: () => ({}), body: { appendChild: () => {} } };

    const sodium = require('libsodium-wrappers');
    await sodium.ready;
    globalThis.sodium = sodium;

    const engineDir = path.join(__dirname, 'vidlink-engine');
    eval(fs.readFileSync(path.join(engineDir, 'script.js'), 'utf8'));

    const go = new Dm();
    const wasmBuf = fs.readFileSync(path.join(engineDir, 'fu.wasm'));
    const { instance } = await WebAssembly.instantiate(wasmBuf, go.importObject);
    go.run(instance);

    await new Promise(r => setTimeout(r, 600));
    if (typeof globalThis.getAdv !== 'function') throw new Error('getAdv not found after WASM boot');
  })();
  return wasmBootPromise;
}

const streamCache = new Map();

async function resolveVidlinkStream(id, season, episode) {
  const cacheKey = `${id}_${season || ''}_${episode || ''}`;
  if (streamCache.has(cacheKey)) {
    const cached = streamCache.get(cacheKey);
    if (Date.now() - cached.timestamp < 30 * 60 * 1000) {
      return cached.data;
    }
  }

  await bootVidlinkWasm();
  const token = globalThis.getAdv(String(id));
  if (!token) throw new Error('Failed to generate stream token');

  const apiUrl = season
    ? `https://vidlink.pro/api/b/tv/${token}/${season}/${episode || 1}?multiLang=0`
    : `https://vidlink.pro/api/b/movie/${token}?multiLang=0`;

  const res = await fetch(apiUrl, {
    headers: { Referer: VIDLINK_REFERER, Origin: VIDLINK_ORIGIN, 'User-Agent': VIDLINK_UA }
  });
  if (!res.ok) throw new Error(`VidLink API responded with HTTP ${res.status}`);
  const data = await res.json();
  if (data) {
    streamCache.set(cacheKey, { timestamp: Date.now(), data });
  }
  return data;
}

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');

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
        
        // Strip formatting tags (like <i>, </i>, <b>, </b>, <u>, </u>, <font...>, </font>) that render as literal text
        text = text.replace(/<\/?(i|b|u|font|c|v)[^>]*>/gi, '');
        
        if (targetLang) {
          try {
            text = await translateVTT(text, targetLang);
            text = text.replace(/<\/?(i|b|u|font|c|v)[^>]*>/gi, '');
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

  if (safePath === '/api/movie-sub') {
    let parsed = new URL(req.url, `http://localhost:${PORT}`);
    const rawTitle = parsed.searchParams.get('title');
    const rawType = parsed.searchParams.get('type') || 'movie';
    const cinemetaType = (rawType === 'tv' || rawType === 'series') ? 'series' : 'movie';
    const season = parsed.searchParams.get('season') || '1';
    const ep = parsed.searchParams.get('ep') || '1';
    const targetLang = parsed.searchParams.get('lang') || 'ckb';
    const trackIndex = Math.max(0, parseInt(parsed.searchParams.get('track') || '0', 10));
    const SUBDL_API_KEY = process.env.SUBDL_API_KEY || 'subdl_2L68yhBx3c0uQlMPHERfXvgmRKw89akcsNrEhp2SVvs';

    if (!rawTitle) {
      res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ error: 'Missing title' }));
      return;
    }

    (async () => {
      try {
        const searchTitles = [
          rawTitle,
          rawTitle.replace(/\s*[\(\[\{].*?[\)\]\}]/g, '').trim(),
          rawTitle.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
        ];
        
        let imdbId = null;
        for (const titleCandidate of searchTitles) {
          if (!titleCandidate) continue;
          try {
            const searchUrl = `https://v3-cinemeta.strem.io/catalog/${cinemetaType}/top/search=${encodeURIComponent(titleCandidate)}.json`;
            const r1 = await fetch(searchUrl);
            const d1 = await r1.json();
            if (d1.metas && d1.metas.length > 0 && d1.metas[0].imdb_id) {
              imdbId = d1.metas[0].imdb_id;
              break;
            }
          } catch (e) {}
        }

        // 1. Fetch official human-translated Kurdish subtitles from SubDL
        if (targetLang === 'ckb' || targetLang === 'ku') {
          try {
            const candidateUrls = [];
            const cleanTitle = searchTitles[1] || rawTitle;

            // Search by film_name
            candidateUrls.push(`https://api.subdl.com/api/v1/subtitles?api_key=${SUBDL_API_KEY}&languages=KU&film_name=${encodeURIComponent(cleanTitle)}&unpack=1`);
            
            // Search by imdb_id if available
            if (imdbId) {
              candidateUrls.push(`https://api.subdl.com/api/v1/subtitles?api_key=${SUBDL_API_KEY}&languages=KU&imdb_id=${imdbId}&unpack=1`);
            }

            let allMatchingTracks = [];

            for (const queryUrl of candidateUrls) {
              try {
                const subdlRes = await fetch(queryUrl);
                const subdlData = await subdlRes.json();
                if (subdlData.status && subdlData.subtitles && subdlData.subtitles.length > 0) {
                  for (const subItem of subdlData.subtitles) {
                    if (!subItem.unpack_files || subItem.unpack_files.length === 0) continue;

                    if (cinemetaType === 'series') {
                      const reqSeason = parseInt(season, 10);
                      const reqEp = parseInt(ep, 10);

                      // Find matching file in unpack_files
                      for (const upFile of subItem.unpack_files) {
                        const fileSeason = upFile.season !== undefined ? parseInt(upFile.season, 10) : parseInt(subItem.season, 10);
                        const fileEp = upFile.episode !== undefined ? parseInt(upFile.episode, 10) : parseInt(subItem.episode, 10);

                        let isMatch = false;
                        if (fileSeason === reqSeason && fileEp === reqEp) {
                          isMatch = true;
                        } else {
                          // Check filename pattern (e.g. S01E01 or 1x01)
                          const fileName = (upFile.name || '').toLowerCase();
                          const sPattern = `s${String(reqSeason).padStart(2,'0')}e${String(reqEp).padStart(2,'0')}`;
                          const altPattern = `${reqSeason}x${String(reqEp).padStart(2,'0')}`;
                          if (fileName.includes(sPattern) || fileName.includes(altPattern)) {
                            isMatch = true;
                          }
                        }

                        if (isMatch) {
                          allMatchingTracks.push({
                            release_name: subItem.release_name || upFile.name || cleanTitle,
                            author: subItem.author || '',
                            url: upFile.url
                          });
                        }
                      }
                    } else {
                      // Movie: add first valid unpack file
                      const upFile = subItem.unpack_files[0];
                      if (upFile && upFile.url) {
                        allMatchingTracks.push({
                          release_name: subItem.release_name || subItem.name || cleanTitle,
                          author: subItem.author || '',
                          url: upFile.url
                        });
                      }
                    }
                  }
                }
              } catch (e) {}
              if (allMatchingTracks.length > 0) break;
            }

            // Deduplicate tracks by url
            const seenUrls = new Set();
            allMatchingTracks = allMatchingTracks.filter(t => {
              if (seenUrls.has(t.url)) return false;
              seenUrls.add(t.url);
              return true;
            });

            if (allMatchingTracks.length > 0) {
              const totalTracks = allMatchingTracks.length;
              const chosen = (allMatchingTracks.length > trackIndex ? allMatchingTracks[trackIndex] : allMatchingTracks[0]);
              const srtDlUrl = 'https://dl.subdl.com' + chosen.url;
              const fileRes = await fetch(srtDlUrl);
              if (fileRes.ok) {
                let nativeSrt = await fileRes.text();
                if (!nativeSrt.toUpperCase().includes('WEBVTT')) {
                  nativeSrt = "WEBVTT\n\n" + nativeSrt.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
                }

                const trackName = (chosen.author ? `${chosen.author} - ` : '') + (chosen.release_name || `Track ${trackIndex + 1}`);

                res.writeHead(200, {
                  'Content-Type': 'text/vtt; charset=utf-8',
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Private-Network': 'true',
                  'Access-Control-Expose-Headers': 'X-Subtitle-Total-Tracks, X-Subtitle-Source, X-Subtitle-Track-Name',
                  'X-Subtitle-Total-Tracks': String(totalTracks),
                  'X-Subtitle-Source': 'subdl-native',
                  'X-Subtitle-Track-Name': encodeURIComponent(trackName),
                  'Cache-Control': 'public, max-age=86400'
                });
                res.end(nativeSrt);
                return;
              }
            }
          } catch (subdlErr) {
            console.warn('[SubDL] Kurdish lookup error:', subdlErr.message);
          }

          // If no SubDL Kurdish subtitle exists, respond with 404 and search hints
          res.writeHead(404, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Private-Network': 'true'
          });
          res.end(JSON.stringify({
            error: 'No Kurdish subtitle found on SubDL',
            title: rawTitle,
            kurdSubtitleSearch: `https://www.google.com/search?q=site%3Akurdsubtitle.net+${encodeURIComponent(rawTitle)}`
          }));
          return;
        }

        res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: 'Unsupported language' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: err.message }));
      }
    })();
    return;
  }

  // Direct Stream Resolver for ArtPlayer (Movies and Series)
  if (safePath === '/api/stream') {
    let parsed = new URL(req.url, `http://localhost:${PORT}`);
    const tmdbId = parsed.searchParams.get('tmdbId') || parsed.searchParams.get('id');
    const title = parsed.searchParams.get('title') || '';
    const type = parsed.searchParams.get('type') || 'movie';
    const season = parsed.searchParams.get('season') || '';
    const episode = parsed.searchParams.get('episode') || '';
    const isTv = type === 'tv' || type === 'series' || Boolean(season);

    const host = req.headers.host || `localhost:${PORT}`;
    const proto = req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = `${proto}://${host}`;

    (async () => {
      try {
        if (!tmdbId) {
          res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ success: false, error: 'Missing tmdbId' }));
          return;
        }

        const data = await resolveVidlinkStream(tmdbId, isTv ? (season || 1) : null, isTv ? (episode || 1) : null);
        const qualitiesObj = data?.stream?.qualities;

        if (!qualitiesObj || Object.keys(qualitiesObj).length === 0) {
          if (data?.stream?.playlist) {
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({
              success: true,
              streamUrl: data.stream.playlist,
              qualities: [{ quality: 'Auto', url: data.stream.playlist }],
              tracks: []
            }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ success: false, error: 'No stream available' }));
          return;
        }

        // Sort descending by resolution (1080 -> 720 -> 480 -> 360)
        const sortedKeys = Object.keys(qualitiesObj).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
        const qualities = sortedKeys.map(k => {
          const qData = qualitiesObj[k];
          const referer = qData.headers?.referer || 'https://filmboom.top/';
          const proxiedUrl = `${baseUrl}/api/stream-media?url=${encodeURIComponent(qData.url)}&referer=${encodeURIComponent(referer)}`;
          return {
            quality: k + 'p',
            url: proxiedUrl,
            rawUrl: qData.url
          };
        });

        const primaryStreamUrl = qualities[0].url;

        // Subtitle tracks: Kurdish from SubDL engine + English and other tracks from stream
        let tracks = [];
        if (title) {
          let kuApi = `${baseUrl}/api/movie-sub?title=${encodeURIComponent(title)}&type=${isTv ? 'series' : 'movie'}`;
          if (isTv) kuApi += `&season=${season || 1}&ep=${episode || 1}`;
          tracks.push({
            label: 'Kurdish (Sorani)',
            file: kuApi,
            srclang: 'ku',
            default: true
          });
        }

        if (data.stream.captions && Array.isArray(data.stream.captions)) {
          for (const cap of data.stream.captions) {
            if (cap.url) {
              tracks.push({
                label: cap.language || 'English',
                file: cap.url,
                srclang: (cap.language || '').toLowerCase().slice(0, 2) || 'en'
              });
            }
          }
        }

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          success: true,
          streamUrl: primaryStreamUrl,
          qualities: qualities,
          tracks: tracks
        }));
      } catch (err) {
        console.error('Error resolving movie/tv stream:', err.message);
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    })();
    return;
  }

  // Streaming Media Proxy with Range and Referer bypass for ArtPlayer
  if (safePath === '/api/stream-media') {
    let parsed = new URL(req.url, `http://localhost:${PORT}`);
    const targetUrl = parsed.searchParams.get('url');
    const referer = parsed.searchParams.get('referer') || 'https://filmboom.top/';

    if (!targetUrl) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing url parameter');
      return;
    }

    const range = req.headers.range;
    const isBcdnNoXw = targetUrl.includes('bcdn.hakunaymatata.com');
    const headerAttempts = isBcdnNoXw
      ? [
          { 'User-Agent': 'curl/8.21.0' },
          { 'User-Agent': VIDLINK_UA, 'Referer': referer, 'Origin': referer.replace(/\/$/, '') }
        ]
      : [
          { 'User-Agent': VIDLINK_UA, 'Referer': referer, 'Origin': referer.replace(/\/$/, '') },
          { 'User-Agent': 'curl/8.21.0' }
        ];

    (async () => {
      let upstream = null;
      for (const h of headerAttempts) {
        try {
          const opt = { ...h };
          if (range) opt['Range'] = range;
          const uRes = await fetch(targetUrl, { headers: opt });
          if (uRes.status === 200 || uRes.status === 206) {
            upstream = uRes;
            break;
          }
          if (!upstream) upstream = uRes;
        } catch (e) {}
      }

      if (!upstream) {
        res.writeHead(502, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
        res.end('Upstream error');
        return;
      }

      const outHeaders = {
        'Content-Type': upstream.headers.get('content-type') || 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      };
      const cl = upstream.headers.get('content-length');
      if (cl) outHeaders['Content-Length'] = cl;
      const cr = upstream.headers.get('content-range');
      if (cr) outHeaders['Content-Range'] = cr;

      res.writeHead(upstream.status, outHeaders);
      const reader = upstream.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
      res.end();
    })().catch(err => {
      .catch(err => {
        console.error('Stream media proxy error:', err.message);
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
        }
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
    })
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

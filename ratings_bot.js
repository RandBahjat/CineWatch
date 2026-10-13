/**
 * CineWatch — Smart IMDb Ratings Bot
 * 
 * Automatically and constantly fetches the latest IMDb ratings for:
 *   - Movies (movies-data.js & fourk-data.js)
 *   - TV Series & Episode Ratings (series-data.js)
 *   - Anime & Anime Episode Ratings (anime-data.js)
 * 
 * Modes:
 *   node ratings_bot.js                  # Run smart batch update (prioritizes new/recent titles)
 *   node ratings_bot.js --daemon         # Run continuously in background (updates every 2 hours)
 *   node ratings_bot.js --recent         # Check all 2025-2026 releases
 *   node ratings_bot.js --title="Name"   # Update a specific title immediately
 *   node ratings_bot.js --force          # Force re-check bypassing cache
 *   node ratings_bot.js --batch=50       # Custom batch size
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Paths
const ROOT_DIR = __dirname;
const APP_DIR = path.join(ROOT_DIR, 'cinewatch-app');
const CACHE_FILE = path.join(ROOT_DIR, '.ratings_bot_cache.json');
const KEY_FILE = path.join(ROOT_DIR, '.omdb_key');

// Helper: Sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 1. Resolve API Key
function getApiKey() {
  const argKey = process.argv.find(a => a.startsWith('--key='));
  if (argKey) {
    const key = argKey.split('=')[1].trim();
    if (key) {
      try { fs.writeFileSync(KEY_FILE, key, 'utf8'); } catch (e) {}
      return key;
    }
  }

  if (process.env.OMDB_API_KEY && process.env.OMDB_API_KEY.trim()) {
    return process.env.OMDB_API_KEY.trim();
  }

  if (fs.existsSync(KEY_FILE)) {
    return fs.readFileSync(KEY_FILE, 'utf8').trim();
  }

  return '69bc6809'; // Default CineWatch OMDb key
}

// 2. Cache & State Management
function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    }
  } catch (e) {}
  return { lastRun: null, items: {} };
}

function saveCache(cache) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
  } catch (e) {}
}

// 3. Load & Evaluate Data Files
function loadDataFile(filename, varName) {
  const filePath = path.join(ROOT_DIR, filename);
  if (!fs.existsSync(filePath)) return null;

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const sandbox = { window: {} };
    vm.runInNewContext(content, sandbox);
    return sandbox.window[varName] || null;
  } catch (err) {
    console.error(`[Bot] Error loading ${filename}:`, err.message);
    return null;
  }
}

// 4. Save Data Files (Safely Syncs Root + cinewatch-app)
function saveDataFile(filename, headerComment, varName, data) {
  const content = `${headerComment}\n\nwindow.${varName} = ${JSON.stringify(data, null, 2)};\n`;

  // Write to root
  const rootPath = path.join(ROOT_DIR, filename);
  try {
    fs.writeFileSync(rootPath, content, 'utf8');
  } catch (err) {
    console.error(`[Bot] Error writing ${rootPath}:`, err.message);
    return false;
  }

  // Sync to cinewatch-app
  if (fs.existsSync(APP_DIR)) {
    const appPath = path.join(APP_DIR, filename);
    try {
      fs.writeFileSync(appPath, content, 'utf8');
      const rootStat = fs.statSync(rootPath);
      fs.utimesSync(appPath, rootStat.atime, rootStat.mtime);
    } catch (e) {}
  }

  return true;
}

// 5. Clean Title for Robust IMDb / OMDb Search
function generateSearchQueries(title, year) {
  const queries = [];
  if (!title) return queries;

  const raw = String(title).trim();
  // Strip parentheticals like (2026), (The Donovans), (1999), (TV)
  const clean = raw.replace(/\s*\([^)]*\)/g, '').trim();
  // Strip " the Movie" or " - The Series"
  const noSuffix = clean.replace(/\s+(the Movie|The Movie|the Series|The Series)$/i, '').trim();

  queries.push({ t: clean, y: year });
  if (noSuffix !== clean) {
    queries.push({ t: noSuffix, y: year });
  }

  // Try without year
  if (year) {
    queries.push({ t: clean, y: null });
    if (noSuffix !== clean) {
      queries.push({ t: noSuffix, y: null });
    }
  }

  // If colon present (e.g. "Avatar: Seven Havens", "Star Trek: Strange New Worlds")
  if (clean.includes(':')) {
    const parts = clean.split(':').map(p => p.trim());
    if (parts[0]) queries.push({ t: parts[0], y: year });
    if (parts[1]) queries.push({ t: parts[1], y: year });
  }

  return queries;
}

// 6. Query OMDb with Smart Fallbacks
let globalQuotaExhausted = false;

async function queryOmdb(apiKey, queryObj, type = null) {
  if (globalQuotaExhausted) return null;

  let url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(queryObj.t)}`;
  if (queryObj.y) url += `&y=${queryObj.y}`;
  if (type) url += `&type=${type}`;

  await sleep(160); // Respect rate limits

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.Response === 'True') {
      return data;
    }

    if (data.Error && data.Error.includes('Request limit reached')) {
      console.warn('\n⚠️ [Bot] OMDb API daily quota reached. Pausing further requests until next cycle.');
      globalQuotaExhausted = true;
      return null;
    }

    return null;
  } catch (err) {
    return null;
  }
}

async function queryOmdbSeason(apiKey, imdbIdOrTitle, seasonNum) {
  if (globalQuotaExhausted) return null;

  let url = `https://www.omdbapi.com/?apikey=${apiKey}&Season=${seasonNum}`;
  if (imdbIdOrTitle.startsWith('tt')) {
    url += `&i=${imdbIdOrTitle}`;
  } else {
    url += `&t=${encodeURIComponent(imdbIdOrTitle)}`;
  }

  await sleep(160);

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.Response === 'True' && Array.isArray(data.Episodes)) {
      return data.Episodes;
    }
    return null;
  } catch (err) {
    return null;
  }
}

// 7. Main Bot Execution Cycle
async function runRatingsBotCycle(options = {}) {
  const {
    force = false,
    batchSize = 40,
    titleFilter = null,
    recentOnly = false,
    typeFilter = 'all' // 'all', 'movie', 'series', 'anime'
  } = options;

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('❌ [Bot] No OMDb API Key available.');
    return;
  }

  const cache = loadCache();
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const SEVEN_DAYS_MS = 7 * ONE_DAY_MS;

  console.log(`\n🤖 [CineWatch Ratings Bot] Starting update scan at ${new Date().toLocaleTimeString()}...`);

  // Load all data
  const movies = loadDataFile('movies-data.js', '_MOVIES_DATA') || [];
  const series = loadDataFile('series-data.js', '_SERIES_DATA') || [];
  const anime = loadDataFile('anime-data.js', '_ANIME_DATA') || [];
  const fourk = loadDataFile('fourk-data.js', '_FOURK_DATA') || [];

  let moviesModified = false;
  let seriesModified = false;
  let animeModified = false;
  let fourkModified = false;

  let totalTitlesScanned = 0;
  let totalTitlesUpdated = 0;
  let totalEpisodesUpdated = 0;

  // Build Unified Queue with Smart Priority Scoring
  const queue = [];

  function addItemToQueue(item, category, listRef, isEpisodeContainer = false) {
    if (!item || !item.title) return;

    if (titleFilter && !item.title.toLowerCase().includes(titleFilter.toLowerCase())) {
      return;
    }

    if (typeFilter !== 'all') {
      if (typeFilter === 'movie' && category !== 'movie' && category !== 'fourk') return;
      if (typeFilter === 'series' && category !== 'series') return;
      if (typeFilter === 'anime' && category !== 'anime') return;
    }

    const key = `${category}:${item.title.toLowerCase().trim()}`;
    const cached = cache.items[key] || {};
    const lastChecked = cached.lastChecked || 0;
    const timeSinceCheck = now - lastChecked;

    const isRecent = item.year >= 2025;
    if (recentOnly && !isRecent) return;

    // Check interval: Recent items checked every 24h; older items checked every 7 days
    const checkInterval = isRecent ? ONE_DAY_MS : SEVEN_DAYS_MS;
    const isDue = force || !cached.lastChecked || timeSinceCheck > checkInterval;

    if (isDue) {
      // Priority score: higher = processed first
      let priority = 1;
      if (!cached.lastChecked) priority += 100; // Never checked before
      if (isRecent) priority += 50;             // New releases (ratings fluctuate)
      if (!item.rating || item.rating === 'TBR' || item.rating === 'N/A' || item.rating === 0) priority += 30;

      queue.push({ item, category, key, cached, isEpisodeContainer, priority });
    }
  }

  movies.forEach(m => addItemToQueue(m, 'movie', movies, false));
  series.forEach(s => addItemToQueue(s, 'series', series, true));
  anime.forEach(a => addItemToQueue(a, 'anime', anime, true));
  fourk.forEach(f => addItemToQueue(f, 'fourk', fourk, false));

  // Sort queue by priority descending
  queue.sort((a, b) => b.priority - a.priority);

  const processQueue = queue.slice(0, batchSize);
  console.log(`[Bot] Found ${queue.length} items due for check. Processing top ${processQueue.length} priority items.`);

  for (let i = 0; i < processQueue.length; i++) {
    if (globalQuotaExhausted) break;

    const { item, category, key, cached, isEpisodeContainer } = processQueue[i];
    totalTitlesScanned++;

    const queries = generateSearchQueries(item.title, item.year);
    const searchType = (category === 'movie' || category === 'fourk') ? 'movie' : (category === 'series' ? 'series' : null);

    let omdbData = null;

    // If we already know the IMDb ID from cache, query by ID for 100% precision
    if (cached.imdbId) {
      await sleep(160);
      try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${cached.imdbId}`);
        if (res.ok) {
          const d = await res.json();
          if (d.Response === 'True') omdbData = d;
        }
      } catch (e) {}
    }

    // Otherwise, try title search variations
    if (!omdbData) {
      for (const q of queries) {
        omdbData = await queryOmdb(apiKey, q, searchType);
        if (omdbData) break;
      }
    }

    if (!omdbData) {
      cache.items[key] = {
        ...cached,
        lastChecked: now,
        notFound: true
      };
      continue;
    }

    // Found match on IMDb!
    const imdbId = omdbData.imdbID;
    const rawRating = omdbData.imdbRating;
    let titleUpdated = false;

    if (rawRating && rawRating !== 'N/A') {
      const parsedRating = parseFloat(rawRating);
      const existingRating = parseFloat(item.rating);

      if (isNaN(existingRating) || Math.abs(existingRating - parsedRating) >= 0.1) {
        const oldVal = item.rating;
        // Keep type consistency with file conventions
        item.rating = category === 'fourk' ? parsedRating : String(rawRating);
        console.log(`  ⭐ [${category.toUpperCase()}] "${item.title}" (${item.year || 'N/A'}): Rating updated ${oldVal || 'TBR'} ➔ ${rawRating}`);

        titleUpdated = true;
        totalTitlesUpdated++;

        if (category === 'movie') moviesModified = true;
        if (category === 'series') seriesModified = true;
        if (category === 'anime') animeModified = true;
        if (category === 'fourk') fourkModified = true;
      }
    }

    // If TV show or Anime, update all episode ratings!
    if (isEpisodeContainer && Array.isArray(item.seasons) && item.seasons.length > 0) {
      for (const seasonObj of item.seasons) {
        if (globalQuotaExhausted) break;

        const seasonNum = seasonObj.season;
        const episodes = seasonObj.episodes || [];
        if (!episodes.length) continue;

        const epList = await queryOmdbSeason(apiKey, imdbId || item.title, seasonNum);
        if (!epList || !Array.isArray(epList)) continue;

        const epMap = new Map();
        epList.forEach(e => {
          const num = parseInt(e.Episode, 10);
          if (!isNaN(num)) epMap.set(num, e);
        });

        for (const localEp of episodes) {
          const epNum = parseInt(localEp.episode, 10);
          const omdbEp = epMap.get(epNum);

          if (omdbEp && omdbEp.imdbRating && omdbEp.imdbRating !== 'N/A') {
            const epRating = parseFloat(omdbEp.imdbRating);
            const oldRating = typeof localEp.rating === 'number' ? localEp.rating : parseFloat(localEp.rating);

            if (isNaN(oldRating) || Math.abs(oldRating - epRating) >= 0.1) {
              localEp.rating = epRating;
              totalEpisodesUpdated++;
              titleUpdated = true;

              if (category === 'series') seriesModified = true;
              if (category === 'anime') animeModified = true;
            }
          }
        }
      }
    }

    cache.items[key] = {
      imdbId: imdbId || cached.imdbId,
      rating: rawRating,
      lastChecked: now,
      title: item.title,
      year: item.year
    };
  }

  // Save updated files if any changes occurred
  if (moviesModified) {
    saveDataFile(
      'movies-data.js',
      '// CineWatch — Movies Data\n// Edit this file to add, remove, or reorder movies.\n// Push to GitHub (or save — auto-sync will handle it) for changes to go live.',
      '_MOVIES_DATA',
      movies
    );
    console.log('  💾 Saved updated movies-data.js (Root + cinewatch-app)');
  }

  if (seriesModified) {
    saveDataFile(
      'series-data.js',
      '// CineWatch — Series Data\n// Edit this file to add, remove, or reorder TV shows and series.\n// Push to GitHub (or save — auto-sync will handle it) for changes to go live.',
      '_SERIES_DATA',
      series
    );
    console.log('  💾 Saved updated series-data.js (Root + cinewatch-app)');
  }

  if (animeModified) {
    saveDataFile(
      'anime-data.js',
      '// CineWatch - Anime Data',
      '_ANIME_DATA',
      anime
    );
    console.log('  💾 Saved updated anime-data.js (Root + cinewatch-app)');
  }

  if (fourkModified) {
    saveDataFile(
      'fourk-data.js',
      '// CineWatch — 4K Ultra HD Movies & Series Data\n// Edit this file to add, remove, or edit 4K titles.\n// Set is4k: true on every entry.',
      '_FOURK_DATA',
      fourk
    );
    console.log('  💾 Saved updated fourk-data.js (Root + cinewatch-app)');
  }

  cache.lastRun = now;
  saveCache(cache);

  console.log(`\n📊 [Bot Cycle Summary]`);
  console.log(`  • Items Scanned:     ${totalTitlesScanned}`);
  console.log(`  • Titles Updated:    ${totalTitlesUpdated}`);
  console.log(`  • Episodes Updated:  ${totalEpisodesUpdated}`);
  console.log(`  • Next check queue:  ${queue.length - totalTitlesScanned} items remaining`);
}

// 8. CLI Handler & Daemon Runner
async function main() {
  const args = process.argv.slice(2);
  const isDaemon = args.includes('--daemon');
  const isForce = args.includes('--force');
  const isRecent = args.includes('--recent');
  const isAll = args.includes('--all');

  const titleArg = args.find(a => a.startsWith('--title='));
  const titleFilter = titleArg ? titleArg.split('=')[1].replace(/^["']|["']$/g, '').trim() : null;

  const batchArg = args.find(a => a.startsWith('--batch='));
  const batchSize = isAll ? 99999 : (batchArg ? parseInt(batchArg.split('=')[1], 10) : 40);

  const intervalArg = args.find(a => a.startsWith('--interval='));
  const intervalMinutes = intervalArg ? parseInt(intervalArg.split('=')[1], 10) : 120; // 2 hours default

  const typeArg = args.find(a => a.startsWith('--type='));
  const typeFilter = typeArg ? typeArg.split('=')[1].toLowerCase().trim() : 'all';

  console.log('========================================================');
  console.log('   CineWatch Smart IMDb Ratings Bot (24/7 Active)      ');
  console.log('========================================================');
  console.log(`Config: Daemon=${isDaemon} | Force=${isForce} | Batch=${batchSize} | Type=${typeFilter}`);
  if (titleFilter) console.log(`Filter: Title="${titleFilter}"`);
  console.log('========================================================');

  // Run first cycle
  await runRatingsBotCycle({
    force: isForce,
    batchSize,
    titleFilter,
    recentOnly: isRecent,
    typeFilter
  });

  if (isDaemon) {
    console.log(`\n⏳ [Bot Daemon] Standing by. Next scan in ${intervalMinutes} minutes... (Press Ctrl+C to stop)`);
    setInterval(async () => {
      globalQuotaExhausted = false; // Reset daily flag on new intervals
      try {
        await runRatingsBotCycle({
          force: false,
          batchSize,
          titleFilter: null,
          recentOnly: false,
          typeFilter: 'all'
        });
      } catch (cycleErr) {
        console.error('[Bot Daemon] Cycle error:', cycleErr.message);
      }
      console.log(`\n⏳ [Bot Daemon] Next scan in ${intervalMinutes} minutes...`);
    }, intervalMinutes * 60 * 1000);
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('Fatal Bot Error:', err);
    process.exit(1);
  });
}

module.exports = {
  runRatingsBotCycle,
  queryOmdb
};

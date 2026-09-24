/**
 * CineWatch — Automated Episode Ratings Updater (IMDb / OMDb)
 * 
 * Fetches the latest IMDb ratings for all TV series and episodes,
 * then updates series-data.js automatically.
 * 
 * Usage:
 *   node update-ratings.js --key=YOUR_OMDB_KEY
 *   node update-ratings.js --title="Monster"
 *   node update-ratings.js (uses saved key or process.env.OMDB_API_KEY)
 */

const fs = require('fs');
const path = require('path');

// 1. Resolve API Key
function getApiKey() {
  const argKey = process.argv.find(a => a.startsWith('--key='));
  if (argKey) {
    const key = argKey.split('=')[1].trim();
    if (key) {
      try {
        fs.writeFileSync(path.join(__dirname, '.omdb_key'), key, 'utf8');
        console.log('[Auth] Saved OMDb API key for future runs.');
      } catch (e) {}
      return key;
    }
  }

  if (process.env.OMDB_API_KEY) {
    return process.env.OMDB_API_KEY.trim();
  }

  const keyFile = path.join(__dirname, '.omdb_key');
  if (fs.existsSync(keyFile)) {
    return fs.readFileSync(keyFile, 'utf8').trim();
  }

  return null;
}

// Helper: Sleep to respect rate limits (150ms between requests)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('====================================================');
  console.log('  CineWatch — Episode Ratings Updater (IMDb / OMDb)  ');
  console.log('====================================================\n');

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('❌ Error: No OMDb API Key found.\n');
    console.log('Please provide a free OMDb API key:');
    console.log('  1. Get a free key at: https://www.omdbapi.com/apikey.aspx');
    console.log('  2. Run locally: node update-ratings.js --key=YOUR_KEY');
    console.log('  3. Or in GitHub Actions: Add OMDB_API_KEY in Repository Secrets.\n');
    process.exit(1);
  }

  // CLI Arguments
  const titleFilterArg = process.argv.find(a => a.startsWith('--title='));
  const titleFilter = titleFilterArg ? titleFilterArg.split('=')[1].toLowerCase().trim() : null;

  const limitArg = process.argv.find(a => a.startsWith('--limit='));
  const limitCount = limitArg ? parseInt(limitArg.split('=')[1], 10) : null;

  // 2. Load series-data.js
  const seriesDataPath = path.join(__dirname, 'series-data.js');
  if (!fs.existsSync(seriesDataPath)) {
    console.error('❌ Error: series-data.js not found.');
    process.exit(1);
  }

  console.log('[1/4] Loading series data...');
  const fileContent = fs.readFileSync(seriesDataPath, 'utf8');
  global.window = {};

  try {
    eval(fileContent);
  } catch (err) {
    console.error('❌ Error parsing series-data.js:', err.message);
    process.exit(1);
  }

  const seriesList = global.window._SERIES_DATA;
  if (!Array.isArray(seriesList) || seriesList.length === 0) {
    console.error('❌ Error: No series found in window._SERIES_DATA.');
    process.exit(1);
  }

  console.log(`[1/4] Loaded ${seriesList.length} TV series from series-data.js.\n`);

  // Filter series if requested
  let targetSeries = seriesList;
  if (titleFilter) {
    targetSeries = seriesList.filter(s => s.title && s.title.toLowerCase().includes(titleFilter));
    console.log(`[Filter] Matching series for "${titleFilter}": ${targetSeries.length} found.`);
  }
  if (limitCount && limitCount > 0) {
    targetSeries = targetSeries.slice(0, limitCount);
    console.log(`[Limit] Processing first ${targetSeries.length} series.`);
  }

  let totalUpdatedEpisodes = 0;
  let totalUpdatedShows = 0;
  let totalApiRequests = 0;

  console.log('[2/4] Fetching latest IMDb ratings from OMDb...\n');

  for (let sIdx = 0; sIdx < targetSeries.length; sIdx++) {
    const show = targetSeries[sIdx];
    const seasons = show.seasons || [];

    if (!seasons.length) continue;

    // Clean title for search (remove parentheses notes like "(2026)" or "(The Donovans)")
    const cleanTitle = show.title.replace(/\s*\([^)]*\)/g, '').trim();
    let showUpdated = false;

    console.log(`📺 [${sIdx + 1}/${targetSeries.length}] "${show.title}" (${seasons.length} season${seasons.length > 1 ? 's' : ''})`);

    for (const seasonObj of seasons) {
      const seasonNum = seasonObj.season;
      const episodes = seasonObj.episodes || [];
      if (!episodes.length) continue;

      let apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(cleanTitle)}&Season=${seasonNum}`;
      if (show.year) {
        apiUrl += `&y=${show.year}`;
      }

      totalApiRequests++;
      await sleep(150); // Respect rate limit

      try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
          console.warn(`    ⚠️ HTTP ${res.status} fetching Season ${seasonNum}`);
          continue;
        }

        const data = await res.json();
        if (data.Response !== 'True' || !Array.isArray(data.Episodes)) {
          // If search with year failed, retry without year
          if (show.year) {
            const fallbackUrl = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(cleanTitle)}&Season=${seasonNum}`;
            totalApiRequests++;
            await sleep(150);
            const fallbackRes = await fetch(fallbackUrl);
            const fallbackData = fallbackRes.ok ? await fallbackRes.json() : null;
            if (fallbackData && fallbackData.Response === 'True' && Array.isArray(fallbackData.Episodes)) {
              data.Episodes = fallbackData.Episodes;
            } else {
              console.log(`    ℹ️ Season ${seasonNum}: ${data.Error || 'Not found on IMDb'}`);
              continue;
            }
          } else {
            console.log(`    ℹ️ Season ${seasonNum}: ${data.Error || 'Not found on IMDb'}`);
            continue;
          }
        }

        // Map IMDb episodes by episode number
        const omdbEpMap = new Map();
        for (const ep of data.Episodes) {
          const epNum = parseInt(ep.Episode, 10);
          if (!isNaN(epNum)) {
            omdbEpMap.set(epNum, ep);
          }
        }

        for (const localEp of episodes) {
          const epNum = parseInt(localEp.episode, 10);
          const omdbEp = omdbEpMap.get(epNum);

          if (omdbEp && omdbEp.imdbRating && omdbEp.imdbRating !== 'N/A') {
            const newRating = parseFloat(omdbEp.imdbRating);
            const oldRating = typeof localEp.rating === 'number' ? localEp.rating : parseFloat(localEp.rating);

            if (isNaN(oldRating) || oldRating !== newRating) {
              localEp.rating = newRating;
              totalUpdatedEpisodes++;
              showUpdated = true;
              console.log(`    ✨ S${seasonNum}E${epNum} "${localEp.title || omdbEp.Title}": Rating updated ${oldRating || 'TBR'} ➔ ${newRating}`);
            }
          }
        }
      } catch (fetchErr) {
        console.warn(`    ⚠️ Network error on Season ${seasonNum}:`, fetchErr.message);
      }
    }

    if (showUpdated) {
      totalUpdatedShows++;
    }
  }

  console.log('\n[3/4] Updating data files...');

  if (totalUpdatedEpisodes === 0) {
    console.log('✅ All episode ratings are already completely up-to-date with IMDb! No file changes needed.');
  } else {
    // Generate new series-data.js content
    const newContent = `// CineWatch — Series Data\n// Edit this file to add, remove, or reorder TV shows and series.\n// Push to GitHub (or save — auto-sync will handle it) for changes to go live.\n\nwindow._SERIES_DATA = ${JSON.stringify(seriesList, null, 2)};\n`;

    // Create backup first
    try {
      fs.copyFileSync(seriesDataPath, `${seriesDataPath}.bak`);
    } catch (e) {}

    // Write to root series-data.js
    fs.writeFileSync(seriesDataPath, newContent, 'utf8');
    console.log(`✅ Updated ${seriesDataPath}`);

    // Sync to cinewatch-app/series-data.js if it exists
    const appSeriesPath = path.join(__dirname, 'cinewatch-app', 'series-data.js');
    if (fs.existsSync(path.dirname(appSeriesPath))) {
      try {
        fs.writeFileSync(appSeriesPath, newContent, 'utf8');
        console.log(`✅ Synced to ${appSeriesPath}`);
      } catch (e) {}
    }
  }

  console.log('\n====================================================');
  console.log(`  Summary:`);
  console.log(`  • TV Series Checked:   ${targetSeries.length}`);
  console.log(`  • Shows Updated:       ${totalUpdatedShows}`);
  console.log(`  • Episodes Updated:    ${totalUpdatedEpisodes}`);
  console.log(`  • Total API Requests:  ${totalApiRequests}`);
  console.log('====================================================\n');
}

main().catch(err => {
  console.error('Fatal error in ratings updater:', err);
  process.exit(1);
});

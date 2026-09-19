const https = require('https');
const zlib = require('zlib');
const readline = require('readline');
const fs = require('fs');

global.window = global;
require('../series-data.js');

const seriesList = window._SERIES_DATA;
const cache = require('./airdates_cache.json');

// Map series title to IMDb ID
const SERIES_IMDB_MAP = {
  "Steven Universe Future": "tt13714610",
  "Spider-Man: The Animated Series": "tt0112175",
  "Money Heist": "tt6468322",
  "Ben 10: Ultimate Alien": "tt1622696",
  "Teenage Mutant Ninja Turtles": "tt1877889"
};

const imdbToSeriesTitle = new Map();
const targetImdbIds = new Set();

seriesList.forEach(s => {
  let imdbId = SERIES_IMDB_MAP[s.title] || cache[s.title]?.imdbId;
  if (imdbId) {
    imdbToSeriesTitle.set(imdbId, s.title);
    targetImdbIds.add(imdbId);
  }
});

console.log(`Targeting ${targetImdbIds.size} / ${seriesList.length} series by IMDb ID...`);

const epTconstToSeries = new Map();

console.log('Downloading & streaming IMDb title.episode.tsv.gz...');
https.get('https://datasets.imdbws.com/title.episode.tsv.gz', (res) => {
  const gunzip = zlib.createGunzip();
  const rl = readline.createInterface({ input: res.pipe(gunzip) });

  let lineCount = 0;
  rl.on('line', (line) => {
    lineCount++;
    if (lineCount === 1) return;
    const [tconst, parentTconst, seasonNumber, episodeNumber] = line.split('\t');
    if (targetImdbIds.has(parentTconst)) {
      epTconstToSeries.set(tconst, {
        imdbId: parentTconst,
        title: imdbToSeriesTitle.get(parentTconst),
        season: parseInt(seasonNumber, 10),
        episode: parseInt(episodeNumber, 10)
      });
    }
  });

  rl.on('close', () => {
    console.log(`Found ${epTconstToSeries.size} episodes across target series!`);
    console.log('Downloading & streaming IMDb title.ratings.tsv.gz...');

    https.get('https://datasets.imdbws.com/title.ratings.tsv.gz', (resRatings) => {
      const gunzipRatings = zlib.createGunzip();
      const rlRatings = readline.createInterface({ input: resRatings.pipe(gunzipRatings) });

      const finalRatingsMap = {}; // seriesTitle -> { "S1E1": 8.5 }

      let rCount = 0;
      rlRatings.on('line', (line) => {
        rCount++;
        if (rCount === 1) return;
        const [tconst, avgRating, numVotes] = line.split('\t');
        if (epTconstToSeries.has(tconst)) {
          const ep = epTconstToSeries.get(tconst);
          if (!finalRatingsMap[ep.title]) {
            finalRatingsMap[ep.title] = {};
          }
          finalRatingsMap[ep.title][`S${ep.season}E${ep.episode}`] = parseFloat(avgRating);
        }
      });

      rlRatings.on('close', () => {
        let totalRatingsCount = 0;
        for (const show in finalRatingsMap) {
          totalRatingsCount += Object.keys(finalRatingsMap[show]).length;
        }
        console.log(`\nSuccessfully mapped ${totalRatingsCount} official IMDb episode ratings across ${Object.keys(finalRatingsMap).length} series!`);
        fs.writeFileSync('scratch/imdb_episode_ratings.json', JSON.stringify(finalRatingsMap, null, 2), 'utf8');
        console.log('Saved to scratch/imdb_episode_ratings.json');
      });
    });
  });
});

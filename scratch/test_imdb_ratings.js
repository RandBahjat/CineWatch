const https = require('https');
const zlib = require('zlib');
const readline = require('readline');

// Test parent ID for Slow Horses (tt5875444) and Breaking Bad (tt0903747)
const TARGET_SERIES = new Set(['tt5875444', 'tt0903747']);
const episodeToSeries = new Map(); // epTconst -> { parentTconst, season, episode }

console.log('Downloading and streaming title.episode.tsv.gz...');

https.get('https://datasets.imdbws.com/title.episode.tsv.gz', (res) => {
  const gunzip = zlib.createGunzip();
  const rl = readline.createInterface({ input: res.pipe(gunzip) });

  let lineCount = 0;
  rl.on('line', (line) => {
    lineCount++;
    if (lineCount === 1) return; // header
    const [tconst, parentTconst, seasonNumber, episodeNumber] = line.split('\t');
    if (TARGET_SERIES.has(parentTconst)) {
      episodeToSeries.set(tconst, {
        parent: parentTconst,
        season: parseInt(seasonNumber, 10),
        episode: parseInt(episodeNumber, 10)
      });
    }
  });

  rl.on('close', () => {
    console.log(`Finished reading episodes! Found ${episodeToSeries.size} episodes for target series.`);

    // Now stream title.ratings.tsv.gz
    console.log('Downloading and streaming title.ratings.tsv.gz...');
    https.get('https://datasets.imdbws.com/title.ratings.tsv.gz', (resRatings) => {
      const gunzipRatings = zlib.createGunzip();
      const rlRatings = readline.createInterface({ input: resRatings.pipe(gunzipRatings) });

      const ratings = {};
      let rCount = 0;
      rlRatings.on('line', (line) => {
        rCount++;
        if (rCount === 1) return;
        const [tconst, avgRating, numVotes] = line.split('\t');
        if (episodeToSeries.has(tconst)) {
          const epInfo = episodeToSeries.get(tconst);
          ratings[`${epInfo.parent}_S${epInfo.season}E${epInfo.episode}`] = {
            rating: parseFloat(avgRating),
            votes: parseInt(numVotes, 10)
          };
        }
      });

      rlRatings.on('close', () => {
        console.log(`Finished reading ratings! Mapped ${Object.keys(ratings).length} episode ratings.`);
        console.log('Sample Slow Horses S1E1:', ratings['tt5875444_S1E1']);
        console.log('Sample Breaking Bad S5E14 (Ozymandias):', ratings['tt0903747_S5E14']);
      });
    });
  });
});

const fs = require('fs');

global.window = global;
require('../series-data.js');

const seriesList = window._SERIES_DATA;
const ratingsMap = require('./imdb_episode_ratings.json');

console.log(`Starting to apply IMDb ratings to ${seriesList.length} series...`);

let totalEps = 0;
let ratedEps = 0;

seriesList.forEach(s => {
  const showRatings = ratingsMap[s.title] || {};
  s.seasons?.forEach(sn => {
    sn.episodes?.forEach(ep => {
      totalEps++;
      const key = `S${sn.season}E${ep.episode}`;
      const r = showRatings[key];
      if (r !== undefined && r !== null && !isNaN(r)) {
        ep.rating = r;
        ratedEps++;
      }
    });
  });
});

console.log(`Matched ${ratedEps} / ${totalEps} episodes with official IMDb ratings (${((ratedEps / totalEps) * 100).toFixed(1)}%)`);

function serializeCompact(data) {
  let json = JSON.stringify(data, null, 2);
  // Compact episodes with airDate and rating
  json = json.replace(
    /\{\s*"episode":\s*(\d+),\s*"title":\s*("(?:[^"\\]|\\.)*"),\s*"airDate":\s*("(?:[^"\\]|\\.)*"),\s*"rating":\s*([0-9.]+)\s*\}/g,
    '{ "episode": $1, "title": $2, "airDate": $3, "rating": $4 }'
  );
  // Compact episodes with only airDate
  json = json.replace(
    /\{\s*"episode":\s*(\d+),\s*"title":\s*("(?:[^"\\]|\\.)*"),\s*"airDate":\s*("(?:[^"\\]|\\.)*")\s*\}/g,
    '{ "episode": $1, "title": $2, "airDate": $3 }'
  );
  // Compact episodes with only rating
  json = json.replace(
    /\{\s*"episode":\s*(\d+),\s*"title":\s*("(?:[^"\\]|\\.)*"),\s*"rating":\s*([0-9.]+)\s*\}/g,
    '{ "episode": $1, "title": $2, "rating": $3 }'
  );
  // Compact base episodes
  json = json.replace(
    /\{\s*"episode":\s*(\d+),\s*"title":\s*("(?:[^"\\]|\\.)*")\s*\}/g,
    '{ "episode": $1, "title": $2 }'
  );

  return `// CineWatch — Series Data
// Edit this file to add, remove, or reorder TV shows and series.
// Push to GitHub (or save — auto-sync will handle it) for changes to go live.

window._SERIES_DATA = ${json};
`;
}

const output = serializeCompact(seriesList);
fs.writeFileSync('scratch/series_data_with_ratings.js', output, 'utf8');
console.log('Written to scratch/series_data_with_ratings.js, size:', fs.statSync('scratch/series_data_with_ratings.js').size);

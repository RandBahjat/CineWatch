const fs = require('fs');

global.window = global;
require('../series-data.js');

const originalData = window._SERIES_DATA;
const map = require('./complete_airdates_map.json');

console.log('Original series count:', originalData.length);

let totalEps = 0;
let updatedEps = 0;

originalData.forEach(s => {
  const seriesMap = map[s.title] || {};
  s.seasons?.forEach(sn => {
    sn.episodes?.forEach(ep => {
      totalEps++;
      const key = `S${sn.season}E${ep.episode}`;
      const airdate = seriesMap[key];
      if (airdate) {
        ep.airDate = airdate;
        updatedEps++;
      }
    });
  });
});

console.log(`Updated ${updatedEps} / ${totalEps} episodes with air dates (${((updatedEps/totalEps)*100).toFixed(1)}%)`);

// Generate JS output with the exact header
const output = `// CineWatch — Series Data
// Edit this file to add, remove, or reorder TV shows and series.
// Push to GitHub (or save — auto-sync will handle it) for changes to go live.

window._SERIES_DATA = ${JSON.stringify(originalData, null, 2)};
`;

fs.writeFileSync('scratch/series_data_updated.js', output, 'utf8');
console.log('Written to scratch/series_data_updated.js');

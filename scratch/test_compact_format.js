const fs = require('fs');

global.window = global;
require('../series-data.js');

const originalData = window._SERIES_DATA;
const map = require('./complete_airdates_map.json');

originalData.forEach(s => {
  const seriesMap = map[s.title] || {};
  s.seasons?.forEach(sn => {
    sn.episodes?.forEach(ep => {
      const key = `S${sn.season}E${ep.episode}`;
      const airdate = seriesMap[key];
      if (airdate) {
        ep.airDate = airdate;
      }
    });
  });
});

function serializeSeriesData(data) {
  let json = JSON.stringify(data, null, 2);
  // Collapse single-line episode objects:
  // Match { "episode": 1, ... } block and collapse into one line
  json = json.replace(/\{\s*"episode":\s*(\d+),\s*"title":\s*("(?:[^"\\]|\\.)*"),\s*"airDate":\s*("(?:[^"\\]|\\.)*")\s*\}/g, '{ "episode": $1, "title": $2, "airDate": $3 }');
  json = json.replace(/\{\s*"episode":\s*(\d+),\s*"title":\s*("(?:[^"\\]|\\.)*")\s*\}/g, '{ "episode": $1, "title": $2 }');
  return `// CineWatch — Series Data
// Edit this file to add, remove, or reorder TV shows and series.
// Push to GitHub (or save — auto-sync will handle it) for changes to go live.

window._SERIES_DATA = ${json};
`;
}

const output = serializeSeriesData(originalData);
fs.writeFileSync('scratch/series_data_compact.js', output, 'utf8');
console.log('Compact file size:', fs.statSync('scratch/series_data_compact.js').size);

const fs = require('fs');

global.window = {};
eval(fs.readFileSync('movies-data.js', 'utf8'));
const movies = window._MOVIES_DATA || [];

eval(fs.readFileSync('series-data.js', 'utf8'));
const series = window._SERIES_DATA || [];

eval(fs.readFileSync('anime-data.js', 'utf8'));
const anime = window._ANIME_DATA || [];

function inspect(name, list) {
  let hasKurdish = 0;
  let missing = [];
  list.forEach(m => {
    if (m.overviewKurdish && m.overviewKurdish.trim().length > 0) {
      hasKurdish++;
    } else {
      missing.push(m.title);
    }
  });
  console.log(`${name}: total=${list.length}, withKurdish=${hasKurdish}, missingKurdish=${missing.length}`);
  if (missing.length > 0) {
    console.log(`  Sample missing: ${missing.slice(0, 10).join(', ')}`);
  }
}

inspect('Movies', movies);
inspect('Series', series);
inspect('Anime', anime);

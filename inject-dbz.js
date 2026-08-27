const fs = require('fs');
const animeDataPath = 'anime-data.js';
const dbzDataPath = 'dbz.txt';

let animeData = fs.readFileSync(animeDataPath, 'utf8');
const dbzData = fs.readFileSync(dbzDataPath, 'utf8');

if (!animeData.includes('title: "Dragon Ball Z Kai"')) {
    animeData = animeData.replace('window._ANIME_DATA = [', 'window._ANIME_DATA = [\n' + dbzData);
    fs.writeFileSync(animeDataPath, animeData);
    console.log('Injected successfully');
} else {
    console.log('Already exists');
}

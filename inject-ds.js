const fs = require('fs');
const animeDataPath = 'anime-data.js';
const dsDataPath = 'ds.txt';

let animeData = fs.readFileSync(animeDataPath, 'utf8');
const dsData = fs.readFileSync(dsDataPath, 'utf8');

if (!animeData.includes('title: "Demon Slayer: Kimetsu no Yaiba"')) {
    animeData = animeData.replace('window._ANIME_DATA = [', 'window._ANIME_DATA = [\n' + dsData);
    fs.writeFileSync(animeDataPath, animeData);
    console.log('Injected successfully');
} else {
    console.log('Already exists');
}

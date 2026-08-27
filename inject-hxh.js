const fs = require('fs');
const animeDataPath = 'anime-data.js';
const hxhDataPath = 'hxh.txt';

let animeData = fs.readFileSync(animeDataPath, 'utf8');
const hxhData = fs.readFileSync(hxhDataPath, 'utf8');

if (!animeData.includes('title: "Hunter x Hunter"')) {
    animeData = animeData.replace('window._ANIME_DATA = [', 'window._ANIME_DATA = [\n' + hxhData);
    fs.writeFileSync(animeDataPath, animeData);
    console.log('Injected successfully');
} else {
    console.log('Already exists');
}

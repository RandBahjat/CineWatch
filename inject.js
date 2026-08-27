const fs = require('fs');
const animeDataPath = 'anime-data.js';
const aotDataPath = 'aot.txt';

let animeData = fs.readFileSync(animeDataPath, 'utf8');
const aotData = fs.readFileSync(aotDataPath, 'utf8');

if (!animeData.includes('title: "Attack on Titan"')) {
    animeData = animeData.replace('window._ANIME_DATA = [', 'window._ANIME_DATA = [\n' + aotData);
    fs.writeFileSync(animeDataPath, animeData);
    console.log('Injected successfully');
} else {
    console.log('Already exists');
}

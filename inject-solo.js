const fs = require('fs');
const animeDataPath = 'anime-data.js';
const soloDataPath = 'solo.txt';

let animeData = fs.readFileSync(animeDataPath, 'utf8');
const soloData = fs.readFileSync(soloDataPath, 'utf8');

if (!animeData.includes('title: "Solo Leveling"')) {
    animeData = animeData.replace('window._ANIME_DATA = [', 'window._ANIME_DATA = [\n' + soloData);
    fs.writeFileSync(animeDataPath, animeData);
    console.log('Injected successfully');
} else {
    console.log('Already exists');
}

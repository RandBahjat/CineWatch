const fs = require('fs');
const animeDataPath = 'anime-data.js';
const opmDataPath = 'opm.txt';

let animeData = fs.readFileSync(animeDataPath, 'utf8');
const opmData = fs.readFileSync(opmDataPath, 'utf8');

if (!animeData.includes('title: "One Punch Man"')) {
    animeData = animeData.replace('window._ANIME_DATA = [', 'window._ANIME_DATA = [\n' + opmData);
    fs.writeFileSync(animeDataPath, animeData);
    console.log('Injected successfully');
} else {
    console.log('Already exists');
}

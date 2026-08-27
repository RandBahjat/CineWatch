const fs = require('fs');
const animeDataPath = 'anime-data.js';
const blDataPath = 'bluelock.txt';

let animeData = fs.readFileSync(animeDataPath, 'utf8');
const blData = fs.readFileSync(blDataPath, 'utf8');

if (!animeData.includes('title: "BLUE LOCK"')) {
    const replacement = 'window._ANIME_DATA = [\n' + blData + ',\n';
    animeData = animeData.replace('window._ANIME_DATA = [', replacement);
    fs.writeFileSync(animeDataPath, animeData);
    console.log('Injected successfully');
} else {
    console.log('Already exists');
}

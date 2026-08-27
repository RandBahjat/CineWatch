const fs = require('fs');
const animeDataPath = 'anime-data.js';
const cmDataPath = 'cm.txt';

let animeData = fs.readFileSync(animeDataPath, 'utf8');
const cmData = fs.readFileSync(cmDataPath, 'utf8');

if (!animeData.includes('title: "Chainsaw Man"')) {
    animeData = animeData.replace('window._ANIME_DATA = [', 'window._ANIME_DATA = [\n' + cmData);
    fs.writeFileSync(animeDataPath, animeData);
    console.log('Injected successfully');
} else {
    console.log('Already exists');
}

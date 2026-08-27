const fs = require('fs');
const animeDataPath = 'anime-data.js';
const jjkDataPath = 'jjk.txt';

let animeData = fs.readFileSync(animeDataPath, 'utf8');
const jjkData = fs.readFileSync(jjkDataPath, 'utf8');

if (!animeData.includes('title: "JUJUTSU KAISEN"')) {
    animeData = animeData.replace('window._ANIME_DATA = [', 'window._ANIME_DATA = [\n' + jjkData);
    fs.writeFileSync(animeDataPath, animeData);
    console.log('Injected successfully');
} else {
    console.log('Already exists');
}

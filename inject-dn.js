const fs = require('fs');
const animeDataPath = 'anime-data.js';
const dnDataPath = 'dn.txt';

let animeData = fs.readFileSync(animeDataPath, 'utf8');
const dnData = fs.readFileSync(dnDataPath, 'utf8');

if (!animeData.includes('title: "Death Note"')) {
    animeData = animeData.replace('window._ANIME_DATA = [', 'window._ANIME_DATA = [\n' + dnData);
    fs.writeFileSync(animeDataPath, animeData);
    console.log('Injected successfully');
} else {
    console.log('Already exists');
}

const fs = require('fs');
const animeDataPath = 'anime-data.js';
const haikyuDataPath = 'haikyu.txt';

let animeData = fs.readFileSync(animeDataPath, 'utf8');
const haikyuData = fs.readFileSync(haikyuDataPath, 'utf8');

if (!animeData.includes('title: "Haikyu!!"')) {
    const replacement = 'window._ANIME_DATA = [\n' + haikyuData + ',\n';
    animeData = animeData.replace('window._ANIME_DATA = [', replacement);
    fs.writeFileSync(animeDataPath, animeData);
    console.log('Injected successfully');
} else {
    console.log('Already exists');
}

const fs = require('fs');
const animeDataPath = 'anime-data.js';
const tgDataPath = 'tokyoghoul.txt';

let animeData = fs.readFileSync(animeDataPath, 'utf8');
const tgData = fs.readFileSync(tgDataPath, 'utf8');

if (!animeData.includes('title: "Tokyo Ghoul"')) {
    const replacement = 'window._ANIME_DATA = [\n' + tgData + ',\n';
    animeData = animeData.replace('window._ANIME_DATA = [', replacement);
    fs.writeFileSync(animeDataPath, animeData);
    console.log('Injected successfully');
} else {
    console.log('Already exists');
}

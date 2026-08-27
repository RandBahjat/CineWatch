const fs = require('fs');
const animeDataPath = 'anime-data.js';
const vinlandDataPath = 'vinland.txt';

let animeData = fs.readFileSync(animeDataPath, 'utf8');
const vinlandData = fs.readFileSync(vinlandDataPath, 'utf8');

if (!animeData.includes('title: "Vinland Saga"')) {
    // We add a comma and new line to vinland data
    const replacement = 'window._ANIME_DATA = [\n' + vinlandData + ',\n';
    animeData = animeData.replace('window._ANIME_DATA = [', replacement);
    fs.writeFileSync(animeDataPath, animeData);
    console.log('Injected successfully');
} else {
    console.log('Already exists');
}

const fs = require('fs');
const animeDataPath = 'anime-data.js';
const yuDataPath = 'yugioh.txt';

let animeData = fs.readFileSync(animeDataPath, 'utf8');
const yuData = fs.readFileSync(yuDataPath, 'utf8');

if (!animeData.includes('title: "Yu-Gi-Oh! Duel Monsters"')) {
    // Find the last closing bracket
    const arrayCloseIdx = animeData.lastIndexOf(']');
    
    // Check if the previous object ends with a comma
    let beforeBracket = animeData.substring(0, arrayCloseIdx).trim();
    if (!beforeBracket.endsWith(',')) {
        beforeBracket += ',\n';
    } else {
        beforeBracket += '\n';
    }
    
    // Inject at the bottom
    const newContent = beforeBracket + yuData + '\n]\n';
    fs.writeFileSync(animeDataPath, newContent);
    console.log('Injected successfully at the bottom');
} else {
    console.log('Already exists');
}

const fs = require('fs');

const filePath = 'anime-data.js';
let content = fs.readFileSync(filePath, 'utf8');

const tgStartIdx = content.indexOf('title: "Tokyo Ghoul"');
if (tgStartIdx === -1) {
    console.log("Could not find Tokyo Ghoul");
    process.exit(1);
}

const openBrace = content.lastIndexOf('{', tgStartIdx);
// Find the end of Tokyo Ghoul object
// Since it's the last object, we can find the last ]
let arrayClose = content.lastIndexOf(']');
let closeBrace = content.lastIndexOf('}', arrayClose);

let block = content.substring(openBrace, closeBrace + 1);

// Remove it from the current position
content = content.replace(block + ',\n\n\n\n\n\n', '');
content = content.replace(block + ',\n', '');
content = content.replace(block + '\n', '');
content = content.replace(block, '');

// If there's an extra trailing comma at the end now, remove it
let beforeArrayClose = content.lastIndexOf(']', content.length);
if (beforeArrayClose !== -1) {
    let checkStr = content.substring(0, beforeArrayClose).trim();
    if (checkStr.endsWith(',')) {
        content = checkStr.substring(0, checkStr.length - 1) + '\n]';
    }
}

// Add it to the top
const replacement = 'window._ANIME_DATA = [\n  ' + block.trim() + ',\n';
content = content.replace('window._ANIME_DATA = [', replacement);

fs.writeFileSync(filePath, content);
console.log('Moved Tokyo Ghoul to the top of the array.');

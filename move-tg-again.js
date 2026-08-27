const fs = require('fs');
let content = fs.readFileSync('anime-data.js', 'utf8');

const tgStartIdx = content.indexOf('title: "Tokyo Ghoul"');
const openBrace = content.lastIndexOf('{', tgStartIdx);
let arrayClose = content.lastIndexOf(']');
let closeBrace = content.lastIndexOf('}', arrayClose);
let block = content.substring(openBrace, closeBrace + 1);

// Remove the block from the bottom
let newContent = content.substring(0, openBrace).trim();
if (newContent.endsWith(',')) {
    newContent = newContent.substring(0, newContent.length - 1);
}
newContent += '\n\n]\n';

// Add to top
const replacement = 'window._ANIME_DATA = [\n  ' + block + ',\n';
newContent = newContent.replace('window._ANIME_DATA = [', replacement);

fs.writeFileSync('anime-data.js', newContent);
console.log('Moved to top!');

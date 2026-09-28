const fs = require('fs');

let cleanText = fs.readFileSync('scratch/index_clean.html', 'utf8');
let currentText = fs.readFileSync('index.html', 'utf8');

// The script containing translations starts with:
// function updateLanguage(lang) {
// and ends after the `switch (lang) { ... }`

let startMarker = 'function updateLanguage(lang) {';
let endMarker = 'updateLanguage(savedLang);'; // this is usually at the bottom of the translation script

let startIndex = cleanText.indexOf(startMarker);
let endIndex = cleanText.indexOf(endMarker, startIndex) + endMarker.length;

if (startIndex === -1 || endIndex === -1) {
    console.error('Markers not found in clean text');
    process.exit(1);
}

let cleanBlock = cleanText.substring(startIndex, endIndex);

let curStartIndex = currentText.indexOf(startMarker);
let curEndIndex = currentText.indexOf(endMarker, curStartIndex) + endMarker.length;

if (curStartIndex === -1 || curEndIndex === -1) {
    console.error('Markers not found in current text');
    process.exit(1);
}

let newText = currentText.substring(0, curStartIndex) + cleanBlock + currentText.substring(curEndIndex);

fs.writeFileSync('index.html', newText, 'utf8');
console.log('Successfully transplanted clean translations!');

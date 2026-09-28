const fs = require('fs');

let cleanText = fs.readFileSync('scratch/index_clean.html', 'utf16le');
let currentText = fs.readFileSync('index.html', 'utf8'); // Wait, is index.html UTF-8? Let's assume yes.

let startMarker = 'function changeLanguage(langCode) {';

let startIndex = cleanText.indexOf(startMarker);
let endIndex = cleanText.indexOf('</script>', startIndex);

if (startIndex === -1 || endIndex === -1) {
    console.error('Markers not found in clean text');
    process.exit(1);
}

let cleanBlock = cleanText.substring(startIndex, endIndex);

let curStartIndex = currentText.indexOf(startMarker);
let curEndIndex = currentText.indexOf('</script>', curStartIndex);

if (curStartIndex === -1 || curEndIndex === -1) {
    console.error('Markers not found in current text');
    process.exit(1);
}

let newText = currentText.substring(0, curStartIndex) + cleanBlock + currentText.substring(curEndIndex);

fs.writeFileSync('index.html', newText, 'utf8');
console.log('Successfully transplanted clean translations!');

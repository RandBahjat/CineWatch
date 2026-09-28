const fs = require('fs');
const { execSync } = require('child_process');

let currentBuf = fs.readFileSync('index.html');

let curStr = currentBuf.toString('utf8');
let curStartIndex = curStr.indexOf('function changeLanguage(langCode) {');
let curEndIndex = curStr.indexOf('</script>', curStartIndex);

if (curStartIndex === -1 || curEndIndex === -1) {
    console.error('Markers not found in current text');
    process.exit(1);
}

// Convert string indices to buffer byte indices
let curStartByte = Buffer.byteLength(curStr.substring(0, curStartIndex), 'utf8');
let curEndByte = Buffer.byteLength(curStr.substring(0, curEndIndex), 'utf8');

const cleanBuf = execSync('git cat-file -p 8a5fa322:index.html');
let cleanStr = cleanBuf.toString('utf8');
let cleanStartIndex = cleanStr.indexOf('function changeLanguage(langCode) {');
let cleanEndIndex = cleanStr.indexOf('</script>', cleanStartIndex);

let cleanStartByte = Buffer.byteLength(cleanStr.substring(0, cleanStartIndex), 'utf8');
let cleanEndByte = Buffer.byteLength(cleanStr.substring(0, cleanEndIndex), 'utf8');

let cleanBlockBuf = cleanBuf.slice(cleanStartByte, cleanEndByte);

let newBuf = Buffer.concat([
    currentBuf.slice(0, curStartByte),
    cleanBlockBuf,
    currentBuf.slice(curEndByte)
]);

fs.writeFileSync('index.html', newBuf);
console.log('Successfully transplanted clean translations via raw buffers!');

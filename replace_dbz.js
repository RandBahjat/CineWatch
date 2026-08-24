const fs = require('fs');

const dataFile = 'anime-data.js';
let content = fs.readFileSync(dataFile, 'utf8');

// Find the start of the Dragon Ball Z object
const searchStr = '"title": "Dragon Ball Z"';
const dbzIndex = content.indexOf(searchStr);

if (dbzIndex === -1) {
    console.error('Dragon Ball Z not found');
    process.exit(1);
}

// Find the opening brace of this object
let startIdx = dbzIndex;
while (startIdx > 0 && content[startIdx] !== '{') {
    startIdx--;
}

// Find the closing brace of this object
let endIdx = startIdx;
let braceCount = 0;
let inString = false;
let escape = false;

for (let i = startIdx; i < content.length; i++) {
    const char = content[i];
    if (escape) {
        escape = false;
        continue;
    }
    if (char === '\\') {
        escape = true;
        continue;
    }
    if (char === '"') {
        inString = !inString;
        continue;
    }
    if (!inString) {
        if (char === '{') braceCount++;
        else if (char === '}') braceCount--;
        
        if (braceCount === 0) {
            endIdx = i;
            break;
        }
    }
}

const dbzJson = fs.readFileSync('dbz.json', 'utf8');

// The replacement content
const newContent = content.substring(0, startIdx) + dbzJson + content.substring(endIdx + 1);

fs.writeFileSync(dataFile, newContent, 'utf8');
console.log('Replaced Dragon Ball Z in anime-data.js');

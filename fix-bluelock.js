const fs = require('fs');

const filePath = 'anime-data.js';
let content = fs.readFileSync(filePath, 'utf8');

const blStartIdx = content.indexOf('title: "BLUE LOCK"');
if (blStartIdx === -1) {
    console.log("Could not find Blue Lock");
    process.exit(1);
}

const openBrace = content.lastIndexOf('{', blStartIdx);
if (openBrace === -1) {
    console.log("Could not find start of Blue Lock");
    process.exit(1);
}

// Find the end of Blue Lock
// Since it's the last item, we'll find the last `]` and `}` before it.
const nextTitle = content.indexOf('title: "', blStartIdx + 20);
let closeBrace;
if (nextTitle !== -1) {
    closeBrace = content.lastIndexOf('}', nextTitle);
} else {
    // End of the file/array
    let arrayClose = content.lastIndexOf(']');
    closeBrace = content.lastIndexOf('}', arrayClose);
}

let blockToReplace = content.substring(openBrace, closeBrace + 1);

// Extract all episodes from blockToReplace
let match;
let allEpisodes = [];
let episodeRegex = /\{\s*episode:\s*(\d+),\s*title:\s*"([^"]+)"\s*\}/g;

while ((match = episodeRegex.exec(blockToReplace)) !== null) {
    allEpisodes.push({
        title: match[2]
    });
}

if (allEpisodes.length === 0) {
    console.log("Could not parse any episodes.");
    process.exit(1);
}

console.log("Found " + allEpisodes.length + " episodes for Blue Lock.");

let newSeasonsArrayStr = 'seasons: [\n';
newSeasonsArrayStr += '      {\n';
newSeasonsArrayStr += '        season: 1,\n';
newSeasonsArrayStr += '        episodes: [\n';

for (let i = 0; i < allEpisodes.length; i++) {
    let ep = allEpisodes[i];
    newSeasonsArrayStr += '          {\n';
    newSeasonsArrayStr += '            episode: ' + (i + 1) + ',\n';
    newSeasonsArrayStr += '            title: "' + ep.title + '"\n';
    newSeasonsArrayStr += '          }' + (i === allEpisodes.length - 1 ? '' : ',') + '\n';
}

newSeasonsArrayStr += '        ]\n';
newSeasonsArrayStr += '      }\n';
newSeasonsArrayStr += '    ]\n  }';

// We need to replace the old seasons block with the new one.
// Let's just find the start of the seasons block inside the `blockToReplace`
const seasonsStartIdx = blockToReplace.indexOf('seasons: [');
const beforeSeasons = blockToReplace.substring(0, seasonsStartIdx);

const newBlock = beforeSeasons + newSeasonsArrayStr;

content = content.replace(blockToReplace, newBlock);
fs.writeFileSync(filePath, content);
console.log('Fixed Blue Lock seasons to 1 season correctly');

const fs = require('fs');

const filePath = 'anime-data.js';
let content = fs.readFileSync(filePath, 'utf8');

const hxhStartIdx = content.indexOf('animeSlug: "hunter-x-hunter-2011"');
if (hxhStartIdx === -1) {
    console.log("Could not find Hunter x Hunter");
    process.exit(1);
}

const seasonsStartIdx = content.indexOf('seasons: [', hxhStartIdx);
if (seasonsStartIdx === -1) {
    console.log("Could not find seasons array for Hunter x Hunter");
    process.exit(1);
}

// Find the end of the HxH entry. Since it's the last entry, it might be followed by `\n]` or `];`.
let remainingContent = content.substring(seasonsStartIdx);
let nextAnimeIdx = remainingContent.lastIndexOf(']');
if (nextAnimeIdx === -1) {
    console.log("Could not find end of array");
    process.exit(1);
}

let hxhSeasonsBlock = remainingContent.substring(0, nextAnimeIdx);

let match;
let allEpisodes = [];
let episodeRegex = /\{\s*episode:\s*(\d+),\s*title:\s*"([^"]+)"\s*\}/g;

while ((match = episodeRegex.exec(hxhSeasonsBlock)) !== null) {
    allEpisodes.push({
        episode: parseInt(match[1]),
        title: match[2]
    });
}

if (allEpisodes.length === 0) {
    console.log("Could not parse any episodes. Length of block: " + hxhSeasonsBlock.length);
    process.exit(1);
}

console.log("Found " + allEpisodes.length + " episodes.");

const seasonCounts = [26, 12, 20, 17, 61, 12];
let newSeasonsArrayStr = 'seasons: [\n';

let epIndex = 0;
for (let s = 0; s < seasonCounts.length; s++) {
    newSeasonsArrayStr += '      {\n';
    newSeasonsArrayStr += '        season: ' + (s + 1) + ',\n';
    newSeasonsArrayStr += '        episodes: [\n';
    
    let count = seasonCounts[s];
    for (let e = 0; e < count; e++) {
        if (epIndex >= allEpisodes.length) break;
        let ep = allEpisodes[epIndex];
        newSeasonsArrayStr += '          {\n';
        newSeasonsArrayStr += '            episode: ' + (e + 1) + ',\n';
        newSeasonsArrayStr += '            title: "' + ep.title + '"\n';
        newSeasonsArrayStr += '          }' + (e === count - 1 ? '' : ',') + '\n';
        epIndex++;
    }
    
    newSeasonsArrayStr += '        ]\n';
    newSeasonsArrayStr += '      }' + (s === seasonCounts.length - 1 ? '' : ',') + '\n';
}

newSeasonsArrayStr += '    ]\n  }';

// We want to replace everything from `seasons: [` to the `  }` of HxH.
let blockToReplace = remainingContent.substring(0, remainingContent.lastIndexOf('}') + 1);

let finalContent = content.substring(0, seasonsStartIdx) + newSeasonsArrayStr + '\n\n]';
fs.writeFileSync(filePath, finalContent);
console.log('Fixed HxH seasons correctly');

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
    console.log("Could not parse any episodes.");
    process.exit(1);
}

// Ensure episodes are sorted by absolute episode number since the previous fix resetted them per season
// Wait, the previous fix resetted the episode numbers (1-26, 1-12, etc.).
// I need to fetch them from the original API or map them sequentially because I lost the original sequential numbering.
// Since allEpisodes currently holds the resetted numbers, I should just ignore match[1] and rely on the array index!
// We know there are exactly 148 episodes.
if (allEpisodes.length !== 148) {
    console.log("Expected 148 episodes, found " + allEpisodes.length);
}

// User's breakdown:
// Season 1: 1-62 (62 episodes)
// Season 2: 63-136 (74 episodes)
// Season 3: 137-148 (12 episodes)
const seasonCounts = [62, 74, 12];
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

let finalContent = content.substring(0, seasonsStartIdx) + newSeasonsArrayStr + '\n\n]';
fs.writeFileSync(filePath, finalContent);
console.log('Fixed HxH seasons to 3 seasons correctly');

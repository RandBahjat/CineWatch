const fs = require('fs');

const filePath = 'anime-data.js';
let content = fs.readFileSync(filePath, 'utf8');

// Parse the file or use a regex/string replacement, but since it's a huge JS file, 
// using eval to parse the array, modify it, and then write it back might be tricky because of formatting.
// Instead, let's write a targeted script to extract the seasons string for Hunter x Hunter.

// The seasons array for HxH starts after "animeSlug: "hunter-x-hunter-2011""
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

// Find the end of the seasons array for HxH.
// We can just extract all episodes using regex from this block.
let remainingContent = content.substring(seasonsStartIdx);
let match;
let allEpisodes = [];
let episodeRegex = /\{\s*episode:\s*(\d+),\s*title:\s*"([^"]+)"\s*\}/g;

// Find where the HxH entry ends (next anime or end of file)
let nextAnimeIdx = remainingContent.indexOf('title: "One Piece"'); 
if (nextAnimeIdx === -1) nextAnimeIdx = remainingContent.indexOf('];');

let hxhSeasonsBlock = remainingContent.substring(0, nextAnimeIdx);

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

console.log("Found " + allEpisodes.length + " episodes.");

// TMDB Split:
// Season 1: 26 episodes (1-26)
// Season 2: 12 episodes (27-38)
// Season 3: 20 episodes (39-58)
// Season 4: 17 episodes (59-75)
// Season 5: 61 episodes (76-136)
// Season 6: 12 episodes (137-148)

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
        // Note: TMDB resets episode numbers per season!
        newSeasonsArrayStr += '          {\n';
        newSeasonsArrayStr += '            episode: ' + (e + 1) + ',\n';
        newSeasonsArrayStr += '            title: "' + ep.title + '"\n';
        newSeasonsArrayStr += '          }' + (e === count - 1 ? '' : ',') + '\n';
        epIndex++;
    }
    
    newSeasonsArrayStr += '        ]\n';
    newSeasonsArrayStr += '      }' + (s === seasonCounts.length - 1 ? '' : ',') + '\n';
}

newSeasonsArrayStr += '    ]\n  },';

// Replace the old seasons block with the new one
let beforeBlock = content.substring(0, seasonsStartIdx);
let afterBlock = content.substring(seasonsStartIdx + hxhSeasonsBlock.lastIndexOf('}') + 1);

let newContent = beforeBlock + newSeasonsArrayStr + '\n\n' + content.substring(seasonsStartIdx + nextAnimeIdx - 5);

// The exact replacement might be tricky, let's use a simpler approach.
// We'll replace the text between `seasons: [\n      {\n        season: 1,` and the end of the HxH object.

let startStr = 'animeSlug: "hunter-x-hunter-2011",';
let startIndex = content.indexOf(startStr);
let endStr = 'title: "One Piece",';
let endIndex = content.indexOf(endStr);

let targetBlock = content.substring(startIndex, endIndex);

let newTargetBlock = targetBlock.substring(0, targetBlock.indexOf('seasons: ['));
newTargetBlock += newSeasonsArrayStr + '\n ';

content = content.replace(targetBlock, newTargetBlock);
fs.writeFileSync(filePath, content);
console.log('Fixed HxH seasons correctly');

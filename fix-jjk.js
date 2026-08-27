const fs = require('fs');

const filePath = 'anime-data.js';
let content = fs.readFileSync(filePath, 'utf8');

const jjkStartIdx = content.indexOf('animeSlug: "jujutsu-kaisen"');
if (jjkStartIdx === -1) {
    console.log("Could not find Jujutsu Kaisen");
    process.exit(1);
}

const seasonsStartIdx = content.indexOf('seasons: [', jjkStartIdx);
if (seasonsStartIdx === -1) {
    console.log("Could not find seasons array for Jujutsu Kaisen");
    process.exit(1);
}

// Find the end of the JJK entry.
// JJK is before "Hunter x Hunter" (or another anime).
// Wait, JJK is around line 21406, let's find the next anime Slug or end of file.
let remainingContent = content.substring(seasonsStartIdx);
let nextAnimeIdx = remainingContent.indexOf('title: "Hunter x Hunter"');
if (nextAnimeIdx === -1) {
    // If not found, try finding the next block
    nextAnimeIdx = remainingContent.indexOf('title: "One Piece"');
    if (nextAnimeIdx === -1) {
        nextAnimeIdx = remainingContent.lastIndexOf(']');
    }
}

// Let's use `animeSlug:` instead of title just to be safe.
let nextAnimeSlugIdx = remainingContent.indexOf('animeSlug:', 10);
if (nextAnimeSlugIdx !== -1) {
    // The previous `title:` should be before `animeSlug:`
    let titleStr = 'title: "';
    let beforeSlug = remainingContent.lastIndexOf(titleStr, nextAnimeSlugIdx);
    if (beforeSlug !== -1 && beforeSlug > 0) {
        nextAnimeIdx = beforeSlug;
    }
}

let jjkSeasonsBlock = remainingContent.substring(0, nextAnimeIdx);

let match;
let allEpisodes = [];
let episodeRegex = /\{\s*episode:\s*(\d+),\s*title:\s*"([^"]+)"\s*\}/g;

while ((match = episodeRegex.exec(jjkSeasonsBlock)) !== null) {
    allEpisodes.push({
        title: match[2]
    });
}

if (allEpisodes.length === 0) {
    console.log("Could not parse any episodes.");
    process.exit(1);
}

console.log("Found " + allEpisodes.length + " episodes for Jujutsu Kaisen.");

// Combine into one season
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
newSeasonsArrayStr += '    ]\n  },';

// Replace
// we want to replace from seasonsStartIdx up to the '},' before the next anime
let blockToReplace = content.substring(seasonsStartIdx, seasonsStartIdx + jjkSeasonsBlock.lastIndexOf('}') + 2); // get the `},`

let finalContent = content.replace(blockToReplace, newSeasonsArrayStr);

fs.writeFileSync(filePath, finalContent);
console.log('Fixed JJK seasons to 1 season correctly');

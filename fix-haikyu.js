const fs = require('fs');

const filePath = 'anime-data.js';
let content = fs.readFileSync(filePath, 'utf8');

const hkStartIdx = content.indexOf('title: "Haikyu!!"');
if (hkStartIdx === -1) {
    console.log("Could not find Haikyu!!");
    process.exit(1);
}

const openBrace = content.lastIndexOf('{', hkStartIdx);
if (openBrace === -1) {
    console.log("Could not find start of Haikyu!!");
    process.exit(1);
}

const seasonsStartIdx = content.indexOf('seasons: [', hkStartIdx);

let nextAnimeIdx = content.indexOf('animeSlug:', seasonsStartIdx);
let closeBrace;
if (nextAnimeIdx !== -1) {
    let nextTitle = content.lastIndexOf('title: "', nextAnimeIdx);
    closeBrace = content.lastIndexOf('}', nextTitle);
} else {
    let arrayClose = content.lastIndexOf(']');
    closeBrace = content.lastIndexOf('}', arrayClose);
}

let blockToReplace = content.substring(openBrace, closeBrace + 1);

let match;
let allEpisodes = [];
let episodeRegex = /\{\s*episode:\s*(\d+),\s*title:\s*"((?:\\.|[^"\\])*)"\s*\}/g;

while ((match = episodeRegex.exec(blockToReplace)) !== null) {
    allEpisodes.push({
        title: match[2]
    });
}

if (allEpisodes.length === 0) {
    console.log("Could not parse any episodes.");
    process.exit(1);
}

console.log("Found " + allEpisodes.length + " episodes for Haikyu!!.");

const seasonCounts = [25, 25, 10, 25];
let newSeasonsArrayStr = 'seasons: [\n';

let epIndex = 0;
for (let s = 0; s < seasonCounts.length; s++) {
    newSeasonsArrayStr += '      {\n';
    newSeasonsArrayStr += '        season: ' + (s + 1) + ',\n';
    newSeasonsArrayStr += '        episodes: [\n';
    
    let count = seasonCounts[s];
    for (let e = 0; e < count; e++) {
        let epTitle = "Episode " + (e + 1);
        if (epIndex < allEpisodes.length) {
            epTitle = allEpisodes[epIndex].title;
        }
        newSeasonsArrayStr += '          {\n';
        newSeasonsArrayStr += '            episode: ' + (e + 1) + ',\n';
        newSeasonsArrayStr += '            title: "' + epTitle + '"\n';
        newSeasonsArrayStr += '          }' + (e === count - 1 ? '' : ',') + '\n';
        epIndex++;
    }
    
    newSeasonsArrayStr += '        ]\n';
    newSeasonsArrayStr += '      }' + (s === seasonCounts.length - 1 ? '' : ',') + '\n';
}

newSeasonsArrayStr += '    ]\n  }';

const bSeasonsStartIdx = blockToReplace.indexOf('seasons: [');
const beforeSeasons = blockToReplace.substring(0, bSeasonsStartIdx);

const newBlock = beforeSeasons + newSeasonsArrayStr;

content = content.replace(blockToReplace, newBlock);
fs.writeFileSync(filePath, content);
console.log('Fixed Haikyu!! seasons to 4 seasons correctly');

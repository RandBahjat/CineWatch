const fs = require('fs');

let content = fs.readFileSync('anime-data.js', 'utf8');
const startIdx = content.indexOf('title: "BLUE LOCK"');
if (startIdx === -1) {
    console.log("Not found");
    process.exit(1);
}

const openBrace = content.lastIndexOf('{', startIdx);
let arrayClose = content.lastIndexOf(']');
let closeBrace = content.lastIndexOf('}', arrayClose);

let block = content.substring(openBrace, closeBrace + 1);
console.log("Block length: ", block.length);

let match;
let count = 0;
// regex that allows escaped quotes
let episodeRegex = /\{\s*episode:\s*(\d+),\s*title:\s*"((?:\\.|[^"\\])*)"\s*\}/g;

let allEpisodes = [];
while ((match = episodeRegex.exec(block)) !== null) {
    allEpisodes.push({title: match[2]});
}
console.log("Found episodes:", allEpisodes.length);

if (allEpisodes.length > 0) {
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

    const seasonsStartIdx = block.indexOf('seasons: [');
    const beforeSeasons = block.substring(0, seasonsStartIdx);
    const newBlock = beforeSeasons + newSeasonsArrayStr;

    content = content.replace(block, newBlock);
    fs.writeFileSync('anime-data.js', content);
    console.log('Fixed correctly');
}

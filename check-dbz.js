const fs = require('fs');
const content = fs.readFileSync('anime-data.js', 'utf8');
const startIdx = content.indexOf('title: "Dragon Ball Z Kai"');
if (startIdx === -1) {
    console.log("NOT FOUND");
} else {
    const endIdx = content.indexOf('animeSlug: ', startIdx);
    console.log("Found at", startIdx);
    console.log(content.substring(startIdx, endIdx + 50));
    
    // Check seasons
    const seasonIdx = content.indexOf('seasons: [', startIdx);
    if (seasonIdx !== -1) {
        const seasonEndIdx = content.indexOf(']', seasonIdx);
        console.log(content.substring(seasonIdx, seasonIdx + 150));
    }
}

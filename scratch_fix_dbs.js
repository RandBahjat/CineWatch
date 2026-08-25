const fs = require('fs');
let f = fs.readFileSync('anime-data.js', 'utf8');
let idx = f.indexOf('"title": "Dragon Ball Super"');
if (idx !== -1) {
    let before = f.substring(0, idx);
    let after = f.substring(idx);
    after = after.replace(/"id":/g, 'videoUrl:');
    after = after.replace(/"description":/g, 'overview:');
    after = after.replace(/"([a-zA-Z0-9_]+)":/g, '$1:');
    fs.writeFileSync('anime-data.js', before + after);
    console.log('Fixed DBS');
} else {
    console.log('DBS not found');
}

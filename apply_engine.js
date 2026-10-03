const fs = require('fs');

const engineText = fs.readFileSync('engine.txt', 'utf8');

function updateFile(filePath) {
    const original = fs.readFileSync(filePath, 'utf8');
    const marker = '// High-precision Monotonic Clock for Cross-Origin Embed Players';
    const idx = original.indexOf(marker);
    if (idx === -1) {
        console.error('Marker not found in ' + filePath);
        return false;
    }
    const updated = original.substring(0, idx) + engineText.trim() + '\n';
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('Successfully updated ' + filePath + ' (' + updated.length + ' bytes)');
    return true;
}

updateFile('movie.js');
updateFile('cinewatch-app/movie.js');

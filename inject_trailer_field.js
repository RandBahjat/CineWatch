const fs = require('fs');
const path = require('path');

const files = [
  'movies-data.js',
  'series-data.js',
  'anime-data.js',
  'cinewatch-app/movies-data.js',
  'cinewatch-app/series-data.js',
  'cinewatch-app/anime-data.js'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  
  // Replace lines matching videoUrl: "..." that are not inside episodes array
  // In series/anime, top-level items have videoUrl. Episodes might also have videoUrl.
  // We want to add trailerUrl right after videoUrl on the main titles.
  const lines = content.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    newLines.push(line);
    
    // Check if line contains videoUrl:
    if (/^\s*videoUrl:\s*['"][^'"]*['"],?/.test(line)) {
      // Check if next line already has trailerUrl
      const nextLine = lines[i + 1] || '';
      if (!nextLine.includes('trailerUrl:')) {
        const indent = line.match(/^\s*/)[0];
        newLines.push(`${indent}trailerUrl: "",`);
        count++;
      }
    }
  }
  
  fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
  console.log(`Updated ${filePath}: added trailerUrl to ${count} items.`);
});

const fs = require('fs');
let code = fs.readFileSync('movie.js', 'utf8');

// Match `id: "anything",` and any trailing comments until newline
const regex = /^\s*id:\s*"[^"]+",?[^\n]*\n/gm;

const matches = code.match(regex);
console.log(`Found ${matches ? matches.length : 0} IDs to remove.`);

if (matches) {
  code = code.replace(regex, '');
  fs.writeFileSync('movie.js', code, 'utf8');
  console.log("Successfully stripped all IDs from movie.js!");
}

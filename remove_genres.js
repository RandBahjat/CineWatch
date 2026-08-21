const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const removeList = [
  'data-genre="Action"',
  'data-genre="Animation"',
  'data-genre="Horror"',
  'data-genre="Drama"',
  'data-genre="Sci-Fi"',
  'data-genre="Science-Fiction"'
];

let lines = content.split('\n');
lines = lines.filter(line => {
  for (let str of removeList) {
    if (line.includes(str)) return false;
  }
  return true;
});

fs.writeFileSync('index.html', lines.join('\n'));
console.log('Removed genre buttons.');

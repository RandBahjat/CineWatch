const fs = require('fs');
const html = fs.readFileSync('embvid_home.html', 'utf8');

// Search for links, routes, or embed examples
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.toLowerCase().includes('embed') || l.toLowerCase().includes('api') || l.toLowerCase().includes('player') || l.toLowerCase().includes('stream')) {
    console.log(`Line ${i + 1}: ${l.trim().slice(0, 140)}`);
  }
});

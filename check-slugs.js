const content = require('fs').readFileSync('anime-data.js', 'utf8');
const slugs = [...content.matchAll(/animeSlug:\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Total slugs:', slugs.length);
console.log('Unique slugs:', new Set(slugs).size);
const counts = {};
slugs.forEach(s => counts[s] = (counts[s] || 0) + 1);
console.log('Duplicates:', Object.keys(counts).filter(k => counts[k] > 1));

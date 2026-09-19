const fs = require('fs');

const html = fs.readFileSync('scratch/mapple_page.html', 'utf8');

// Search for any URLs, streams, embeds, APIs
const urls = [...html.matchAll(/https?:\/\/[^"'\\<>]+/g)].map(m => m[0]);
const uniqueDomains = [...new Set(urls.map(u => {
  try { return new URL(u).hostname; } catch(e) { return u; }
}))];
console.log('Domains found in Mapple HTML:', uniqueDomains);

// Look for player configurations
const scripts = html.split('<script');
scripts.forEach((s, i) => {
  if (s.includes('player') || s.includes('stream') || s.includes('source') || s.includes('server')) {
    console.log(`Script ${i} mentions keywords, length: ${s.length}`);
    const lines = s.split('\n');
    lines.forEach(l => {
      if (/source|stream|player|embed|server/i.test(l) && l.length < 300) {
        console.log('  line:', l.trim());
      }
    });
  }
});

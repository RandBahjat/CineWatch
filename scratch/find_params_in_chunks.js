const fs = require('fs');

async function check() {
  const html = fs.readFileSync('scratch/mapple_page.html', 'utf8');
  const chunkUrls = [...html.matchAll(/src=["'](\/_next\/static\/chunks\/[^"']+)["']/g)].map(m => m[1]);

  for (const c of chunkUrls) {
    const fullUrl = 'https://mapple.fun' + c;
    try {
      const res = await fetch(fullUrl);
      const text = await res.text();
      for (const param of ['nextButton', 'autoPlay', 'watchParty', 'theme=']) {
        if (text.includes(param)) {
          console.log(`Chunk ${c} has ${param}:`);
          const idx = text.indexOf(param);
          console.log('  snippet:', text.slice(Math.max(0, idx - 100), idx + 100).replace(/\s+/g, ' '));
        }
      }
    } catch(e) {}
  }
  console.log('Done checking chunks.');
}
check();

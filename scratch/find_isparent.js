const fs = require('fs');
async function f() {
  const html = fs.readFileSync('scratch/mapple_page.html', 'utf8');
  const chunkUrls = [...html.matchAll(/src=["'](\/_next\/static\/chunks\/[^"']+)["']/g)].map(m => m[1]);
  for (const c of chunkUrls) {
    try {
      const res = await fetch('https://mapple.fun' + c);
      const text = await res.text();
      if (text.includes('isParentMappletv')) {
        console.log('Found in chunk:', c);
        const idx = text.indexOf('isParentMappletv');
        console.log(text.substring(idx - 300, idx + 400));
      }
    } catch(e) {}
  }
}
f();

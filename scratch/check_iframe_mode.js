const fs = require('fs');
async function f() {
  const html = fs.readFileSync('scratch/mapple_page.html', 'utf8');
  const chunkUrls = [...html.matchAll(/src=["'](\/_next\/static\/chunks\/[^"']+)["']/g)].map(m => m[1]);
  for (const c of chunkUrls) {
    try {
      const res = await fetch('https://mapple.fun' + c);
      const text = await res.text();
      if (text.includes('iframe-mode') || text.includes('isInIframeWrapper')) {
        console.log('Found in chunk:', c);
        let idx = text.indexOf('iframe-mode');
        if (idx !== -1) console.log('iframe-mode:', text.substring(idx - 100, idx + 300));
        idx = text.indexOf('isInIframeWrapper');
        if (idx !== -1) console.log('isInIframeWrapper:', text.substring(idx - 100, idx + 300));
      }
    } catch(e) {}
  }
}
f();

const fs = require('fs');
const html = fs.readFileSync('scratch/mapple_page.html', 'utf8');
const cssUrls = [...html.matchAll(/href=["'](\/_next\/static\/css\/[^"']+)["']/g)].map(m => m[1]);
console.log('CSS urls:', cssUrls);

async function checkCss() {
  for (const u of cssUrls) {
    const res = await fetch('https://mapple.fun' + u);
    const text = await res.text();
    if (text.includes('isInIframe') || text.includes('iframe-mode')) {
      console.log('Found in CSS:', u);
      let idx = text.indexOf('isInIframe');
      if (idx !== -1) console.log(text.substring(idx - 50, idx + 200));
      idx = text.indexOf('iframe-mode');
      if (idx !== -1) console.log(text.substring(idx - 50, idx + 200));
    }
  }
}
checkCss();

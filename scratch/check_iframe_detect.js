const fs = require('fs');

async function checkIframeDetection() {
  const html = fs.readFileSync('scratch/mapple_page.html', 'utf8');
  const chunkUrls = [...html.matchAll(/src=["'](\/_next\/static\/chunks\/[^"']+)["']/g)].map(m => m[1]);

  for (const c of chunkUrls) {
    const fullUrl = 'https://mapple.fun' + c;
    try {
      const res = await fetch(fullUrl);
      const text = await res.text();
      
      const regex = /(?:isEmbed|embedded|inIframe|window\.self|window\.top|window\.parent|document\.referrer|frameElement)/gi;
      let m;
      while ((m = regex.exec(text)) !== null) {
        console.log(`Chunk ${c} matched ${m[0]}:`);
        console.log('  snippet:', text.substring(Math.max(0, m.index - 80), m.index + 80).replace(/\s+/g, ' '));
      }
    } catch(e) {}
  }
}
checkIframeDetection();

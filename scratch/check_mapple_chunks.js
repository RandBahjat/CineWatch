const fs = require('fs');

async function checkChunks() {
  const html = fs.readFileSync('scratch/mapple_page.html', 'utf8');
  const chunkUrls = [...html.matchAll(/src=["'](\/_next\/static\/chunks\/[^"']+)["']/g)].map(m => m[1]);
  console.log('Total chunks:', chunkUrls.length);

  for (const c of chunkUrls) {
    const fullUrl = 'https://mapple.fun' + c;
    try {
      const res = await fetch(fullUrl);
      const text = await res.text();
      // Search for mobile detection or iframe detection or player selection
      const mobileMatch = text.match(/isMobile|iPhone|Android|maxTouchPoints|screen\.width|window\.innerWidth/gi);
      const serverMatch = text.match(/server|provider|vidapi|vidsrc|embed|source/gi);
      const themeMatch = text.match(/autoPlay|nextButton|watchParty|theme/gi);
      
      if (themeMatch) {
        console.log('--- Chunk with params:', c);
        // find snippet
        const idx = text.indexOf('nextButton');
        if (idx !== -1) {
          console.log('nextButton context:', text.substring(Math.max(0, idx - 200), idx + 200));
        }
      }
    } catch(e) {
      console.error('Error fetching', c, e.message);
    }
  }
}
checkChunks();

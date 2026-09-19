const fs = require('fs');
async function f() {
  const html = fs.readFileSync('scratch/mapple_page.html', 'utf8');
  const chunkUrls = [...html.matchAll(/src=["'](\/_next\/static\/chunks\/[^"']+)["']/g)].map(m => m[1]);
  const allParams = new Set();
  for (const c of chunkUrls) {
    try {
      const res = await fetch('https://mapple.fun' + c);
      const text = await res.text();
      const matches = [...text.matchAll(/searchParams(?:\.get|\.has)\(["']([^"']+)["']\)/g)].map(m => m[1]);
      matches.forEach(p => allParams.add(p));
    } catch(e) {}
  }
  console.log('All searchParams across all chunks:', [...allParams]);
}
f();

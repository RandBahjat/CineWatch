const fs = require('fs');

async function main() {
  const res = await fetch('https://www.themoviedb.org/tv/40351-green-lantern-the-animated-series', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync('scratch/tmdb_gl.html', html, 'utf8');

  // Let's also check if TMDB API or a public endpoint works
  console.log('Saved tmdb_gl.html');
}

main().catch(console.error);

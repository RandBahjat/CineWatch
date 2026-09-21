const fs = require('fs');

async function parseShow() {
  const html = fs.readFileSync('scratch/tmdb_gl.html', 'utf8');

  // Backdrop
  const backdropMatch = html.match(/data-src=\"([^\"]+w1920[^\"]+)\"/) || html.match(/style=\"background-image:\s*url\('?([^'\)\"]+)'?\)/) || html.match(/content=\"(https:\/\/media\.themoviedb\.org\/t\/p\/w[^\"]+)\"/);
  
  // Posters & images
  const ogImages = [];
  const ogImgRegex = /property="og:image"\s+content="([^"]+)"/g;
  let m;
  while ((m = ogImgRegex.exec(html)) !== null) {
    ogImages.push(m[1]);
  }

  // Genres
  const genresMatch = html.match(/<span class="genres">([\s\S]*?)<\/span>/);
  let genres = [];
  if (genresMatch) {
    const gRegex = /<a[^>]*>([^<]+)<\/a>/g;
    let gm;
    while ((gm = gRegex.exec(genresMatch[1])) !== null) {
      genres.push(gm[1].trim());
    }
  }

  // Certification / Age
  const certMatch = html.match(/<span class="certification">([^<]+)<\/span>/);
  const cert = certMatch ? certMatch[1].trim() : 'TV-Y7';

  // Rating
  const ratingMatch = html.match(/data-percent="([^"]+)"/);
  const rating = ratingMatch ? (parseFloat(ratingMatch[1]) / 10).toFixed(1) : '8.0';

  // Overview
  const overviewMatch = html.match(/<div class="overview"[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/);
  const overview = overviewMatch ? overviewMatch[1].trim() : '';

  // People / creators / directors
  const people = [];
  const peopleRegex = /<li class="profile">[\s\S]*?<p><a[^>]*>([^<]+)<\/a><\/p>[\s\S]*?<p class="character">([^<]+)<\/p>/g;
  let pm;
  while ((pm = peopleRegex.exec(html)) !== null) {
    people.push({ name: pm[1].trim(), role: pm[2].trim() });
  }

  // Cast
  const cast = [];
  const castRegex = /<li class="card">[\s\S]*?<p><a[^>]*>([^<]+)<\/a><\/p>[\s\S]*?<p class="character">([^<]+)<\/p>/g;
  let cm;
  while ((cm = castRegex.exec(html)) !== null) {
    cast.push(cm[1].trim());
  }

  console.log('OG Images:', ogImages);
  console.log('Genres:', genres);
  console.log('Cert:', cert);
  console.log('Rating:', rating);
  console.log('Overview:', overview);
  console.log('People:', people);
  console.log('Cast (first 10):', cast.slice(0, 10));

  // Now fetch season 1
  console.log('Fetching Season 1...');
  const s1Res = await fetch('https://www.themoviedb.org/tv/40351-green-lantern-the-animated-series/season/1', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const s1Html = await s1Res.text();
  fs.writeFileSync('scratch/tmdb_gl_s1.html', s1Html, 'utf8');
  console.log('Saved tmdb_gl_s1.html');
}

parseShow().catch(console.error);

const fs = require('fs');

const html = fs.readFileSync('scratch/tmdb_monster.html', 'utf8');

// Title
const titleMatch = html.match(/<title>([^<]+)<\/title>/);
console.log('Title:', titleMatch ? titleMatch[1] : 'none');

// OG Image
const ogImages = [];
const ogImgRegex = /property="og:image"\s+content="([^"]+)"/g;
let m;
while ((m = ogImgRegex.exec(html)) !== null) {
  ogImages.push(m[1]);
}
console.log('OG Images:', ogImages);

// Backdrop
const backdropMatch = html.match(/data-src="([^"]+w1920[^"]+)"/) || html.match(/style="background-image:\s*url\('?([^'\)\"]+)'?\)/);
console.log('Backdrop Match:', backdropMatch ? backdropMatch[1] : 'none');

// Overview
const overviewMatch = html.match(/<div class="overview"[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/);
console.log('Overview:', overviewMatch ? overviewMatch[1].trim() : 'none');

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
console.log('Genres:', genres);

// Certification
const certMatch = html.match(/<span class="certification">([^<]+)<\/span>/);
console.log('Cert:', certMatch ? certMatch[1].trim() : 'none');

// Rating
const ratingMatch = html.match(/data-percent="([^"]+)"/);
console.log('Rating:', ratingMatch ? (parseFloat(ratingMatch[1]) / 10).toFixed(1) : 'none');

// Year / Release date
const yearMatch = html.match(/<span class="tag release_date">\(([^)]+)\)<\/span>/);
console.log('Release Date / Year:', yearMatch ? yearMatch[1] : 'none');

// Cast
const cast = [];
const castRegex = /<li class="card">[\s\S]*?<p><a[^>]*>([^<]+)<\/a><\/p>[\s\S]*?<p class="character">([^<]+)<\/p>/g;
let cm;
while ((cm = castRegex.exec(html)) !== null) {
  cast.push(`${cm[1].trim()} (${cm[2].trim()})`);
}
console.log('Cast (first 10):', cast.slice(0, 10));

// Crew / Director / Creators
const people = [];
const peopleRegex = /<li class="profile">[\s\S]*?<p><a[^>]*>([^<]+)<\/a><\/p>[\s\S]*?<p class="character">([^<]+)<\/p>/g;
let pm;
while ((pm = peopleRegex.exec(html)) !== null) {
  people.push({ name: pm[1].trim(), role: pm[2].trim() });
}
console.log('People:', people);

// Check Season 1
const s1Html = fs.readFileSync('scratch/tmdb_monster_s1.html', 'utf8');
const epMatches = s1Html.match(/class="episode_title"[\s\S]*?<\/a>/g);
console.log('Season 1 episode count:', epMatches ? epMatches.length : 0);
if (epMatches) {
  console.log('First 5 episodes:', epMatches.slice(0, 5));
}

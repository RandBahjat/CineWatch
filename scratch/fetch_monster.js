const fs = require('fs');

async function main() {
  const res = await fetch('https://www.themoviedb.org/tv/299939-monster-the-lizzie-borden-story', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  fs.writeFileSync('scratch/tmdb_monster.html', html, 'utf8');

  // Let's also check season 1
  const s1Res = await fetch('https://www.themoviedb.org/tv/299939-monster-the-lizzie-borden-story/season/1', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const s1Html = await s1Res.text();
  fs.writeFileSync('scratch/tmdb_monster_s1.html', s1Html, 'utf8');

  console.log('Saved tmdb_monster.html and tmdb_monster_s1.html');
}

main().catch(console.error);

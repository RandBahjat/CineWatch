const fs = require('fs');

const html = fs.readFileSync('scratch/tmdb_monster_s1.html', 'utf8');

const blocks = html.split('<div class="card');
const episodes = [];

for (let i = 1; i < blocks.length; i++) {
  const b = blocks[i];
  const numMatch = b.match(/data-episode-number="(\d+)"/);
  if (!numMatch) continue;
  const epNum = parseInt(numMatch[1], 10);

  const titleMatch = b.match(/class="episode_title"[\s\S]*?<h3><a[^>]*>([^<]+)<\/a>/);
  let title = titleMatch ? titleMatch[1].trim() : `Episode ${epNum}`;
  title = title.replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"');

  const dateMatch = b.match(/<span class="date">([^<]+)<\/span>/);
  let airDate = dateMatch ? dateMatch[1].trim() : '2026-10-01';

  const ratingMatch = b.match(/data-percent="([^"]+)"/);
  let rating = ratingMatch ? parseFloat((parseFloat(ratingMatch[1]) / 10).toFixed(1)) : 7.5;

  episodes.push({
    episode: epNum,
    title,
    airDateRaw: airDate,
    rating
  });
}

console.log(JSON.stringify(episodes, null, 2));

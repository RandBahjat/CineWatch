const fs = require('fs');

const html = fs.readFileSync('scratch/tmdb_gl_s1.html', 'utf8');

// Match each episode block
const episodes = [];
const blocks = html.split('<div class="card');

for (let i = 1; i < blocks.length; i++) {
  const b = blocks[i];
  
  const numMatch = b.match(/data-episode-number="(\d+)"/);
  if (!numMatch) continue;
  const epNum = parseInt(numMatch[1], 10);

  // Title
  const titleMatch = b.match(/class="episode_title"[\s\S]*?<h3><a[^>]*>([^<]+)<\/a>/);
  let title = titleMatch ? titleMatch[1].trim() : '';
  title = title.replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"');

  // Air date
  const dateMatch = b.match(/<span class="date">([^<]+)<\/span>/);
  let airDate = dateMatch ? dateMatch[1].trim() : '';

  // Rating
  const ratingMatch = b.match(/data-percent="([^"]+)"/);
  let rating = ratingMatch ? parseFloat((parseFloat(ratingMatch[1]) / 10).toFixed(1)) : null;

  episodes.push({
    episode: epNum,
    title,
    airDateRaw: airDate,
    rating
  });
}

console.log(`Parsed ${episodes.length} episodes from TMDB:`);
console.log(JSON.stringify(episodes.slice(0, 5), null, 2));
console.log(JSON.stringify(episodes.slice(episodes.length - 2), null, 2));

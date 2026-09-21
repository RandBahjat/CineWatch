const fs = require('fs');

async function parseSeason() {
  const html = fs.readFileSync('scratch/tmdb_gl_s1.html', 'utf8');

  // Episodes in TMDB
  // Each episode card has: class="card" or class="episode_card" or id="episode_..."
  const episodeRegex = /<div class="card">[\s\S]*?<div class="wrapper">[\s\S]*?<a[^>]*class="open_modal" title="([^"]+)"[^>]*>[\s\S]*?<span class="episode_number">(\d+)<\/span>[\s\S]*?<span class="date">([^<]+)<\/span>[\s\S]*?<div class="overview">[\s\S]*?<p>([\s\S]*?)<\/p>/g;
  
  // Also check ratings or another format
  console.log('Searching episodes...');
  
  // Let's also check TVMaze episodes
  const tvmazeRes = await fetch('https://api.tvmaze.com/singlesearch/shows?q=Green%20Lantern%20The%20Animated%20Series&embed=episodes');
  const tvmazeData = await tvmazeRes.json();
  const tvmazeEpisodes = tvmazeData._embedded.episodes;

  console.log('TVMaze episodes count:', tvmazeEpisodes.length);
  
  // Let's print out all 26 episodes from TVMaze
  tvmazeEpisodes.forEach(ep => {
    console.log(`E${ep.number}: "${ep.name}", airDate: "${ep.airdate}", rating: ${ep.rating.average}`);
  });
}

parseSeason().catch(console.error);

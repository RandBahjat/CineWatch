global.window = global;
require('../series-data.js');

const seriesList = window._SERIES_DATA;

async function testSample() {
  const sample = seriesList.slice(0, 5);
  for (const s of sample) {
    console.log(`\n--- Fetching: ${s.title} (${s.year}) ---`);
    const q = encodeURIComponent(s.title);
    const res = await fetch(`https://api.tvmaze.com/singlesearch/shows?q=${q}&embed=episodes`);
    if (!res.ok) {
      console.log(`Failed to fetch ${s.title}: ${res.status}`);
      continue;
    }
    const data = await res.json();
    console.log(`TVMaze matched: "${data.name}" (IMDb: ${data.externals?.imdb})`);
    
    // Map episodes:
    const map = {};
    (data._embedded?.episodes || []).forEach(e => {
      map[`S${e.season}E${e.number}`] = {
        name: e.name,
        airdate: e.airdate
      };
    });

    let matchedCount = 0;
    let totalCount = 0;
    s.seasons.forEach(sn => {
      sn.episodes.forEach(ep => {
        totalCount++;
        const key = `S${sn.season}E${ep.episode}`;
        if (map[key] && map[key].airdate) {
          matchedCount++;
        }
      });
    });
    console.log(`Episodes matched: ${matchedCount} / ${totalCount}`);
    // Print first 2 episodes
    s.seasons[0]?.episodes.slice(0, 2).forEach(ep => {
      const key = `S${s.seasons[0].season}E${ep.episode}`;
      console.log(`  ${key}: "${ep.title}" -> Airdate: ${map[key]?.airdate}`);
    });
  }
}

testSample();

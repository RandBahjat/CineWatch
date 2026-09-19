const fs = require('fs');

global.window = global;
require('../series-data.js');

const seriesList = window._SERIES_DATA;

// Explicit show ID overrides for TVMaze
const SHOW_OVERRIDES = {
  "Spider-Man: The Animated Series": 1611,
  "Money Heist": 27436,
  "Ben 10: Ultimate Alien": 1263,
  "Teenage Mutant Ninja Turtles": 668,
  "Daredevil: Born Again": 47754,
  "Miraculous: Tales of Ladybug & Cat Noir": 5557,
  "Marvel's Spider-Man": 21928
};

async function buildAll() {
  console.log(`Starting comprehensive airdate mapping for ${seriesList.length} series...`);
  const cache = {};

  for (let i = 0; i < seriesList.length; i++) {
    const s = seriesList[i];
    let episodesData = [];
    
    // Check override ID
    const overrideId = SHOW_OVERRIDES[s.title];
    if (overrideId) {
      try {
        const res = await fetch(`https://api.tvmaze.com/shows/${overrideId}/episodes?specials=1`);
        if (res.ok) episodesData = await res.json();
      } catch (e) {}
    }

    if (!episodesData || episodesData.length === 0) {
      try {
        const q = encodeURIComponent(s.title);
        const res = await fetch(`https://api.tvmaze.com/singlesearch/shows?q=${q}&embed=episodes`);
        if (res.ok) {
          const show = await res.json();
          episodesData = show._embedded?.episodes || [];
        }
      } catch (e) {}
    }

    const map = {};
    const titleMap = {};

    episodesData.forEach(e => {
      if (e.airdate) {
        if (e.season && e.number) {
          map[`S${e.season}E${e.number}`] = e.airdate;
        }
        if (e.name) {
          const cleanName = e.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          titleMap[cleanName] = e.airdate;
        }
      }
    });

    // Special mappings for Ben 10 Ultimate Alien
    if (s.title === "Ben 10: Ultimate Alien") {
      // Local season 3 episodes correspond to TVMaze season 2 episodes 13..32
      s.seasons.find(sn => sn.season === 3)?.episodes.forEach((ep, idx) => {
        const tvmazeEpNum = 12 + idx + 1;
        if (map[`S2E${tvmazeEpNum}`]) {
          map[`S3E${ep.episode}`] = map[`S2E${tvmazeEpNum}`];
        }
      });
    }

    // Special mappings for Money Heist
    if (s.title === "Money Heist") {
      // Local season 2 episodes correspond to TVMaze season 1 episodes 10..15
      s.seasons.find(sn => sn.season === 2)?.episodes.forEach((ep, idx) => {
        const tvmazeEpNum = 9 + idx + 1;
        if (map[`S1E${tvmazeEpNum}`]) {
          map[`S2E${ep.episode}`] = map[`S1E${tvmazeEpNum}`];
        }
      });
    }

    // Daredevil: Born Again
    if (s.title === "Daredevil: Born Again") {
      map['S1E10'] = '2025-04-15';
    }

    // Marvel's Spider-Man
    if (s.title === "Marvel's Spider-Man") {
      map['S1E0'] = '2017-07-24';
    }

    // Assign to series
    let matchedInSeries = 0;
    let totalInSeries = 0;

    s.seasons.forEach(sn => {
      sn.episodes.forEach(ep => {
        totalInSeries++;
        const key = `S${sn.season}E${ep.episode}`;
        let airdate = map[key];

        // Fallback by title match
        if (!airdate && ep.title) {
          const cleanName = ep.title.toLowerCase().replace(/[^a-z0-9]/g, '');
          airdate = titleMap[cleanName];
        }

        if (airdate) {
          matchedInSeries++;
          map[key] = airdate;
        }
      });
    });

    cache[s.title] = map;

    await new Promise(r => setTimeout(r, 120));
    console.log(`[${i + 1}/${seriesList.length}] ${s.title}: ${matchedInSeries}/${totalInSeries} episodes matched`);
  }

  fs.writeFileSync('scratch/complete_airdates_map.json', JSON.stringify(cache, null, 2));
  console.log('Saved to scratch/complete_airdates_map.json');
}

buildAll();

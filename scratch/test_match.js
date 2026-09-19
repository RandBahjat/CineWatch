const fs = require('fs');

global.window = global;
require('../series-data.js');

const seriesList = window._SERIES_DATA;
console.log('Total series:', seriesList.length);

async function checkMatches() {
  let matched = 0;
  let unmatched = [];

  for (let i = 0; i < seriesList.length; i++) {
    const s = seriesList[i];
    const q = encodeURIComponent(s.title);
    try {
      const res = await fetch(`https://api.tvmaze.com/singlesearch/shows?q=${q}`);
      if (res.ok) {
        const data = await res.json();
        matched++;
      } else {
        unmatched.push({ title: s.title, year: s.year });
      }
    } catch (e) {
      unmatched.push({ title: s.title, error: e.message });
    }
    // Rate limit friendly
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`Matched ${matched} / ${seriesList.length}`);
  console.log('Unmatched:', unmatched);
}

checkMatches();

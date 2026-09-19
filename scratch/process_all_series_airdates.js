const fs = require('fs');

global.window = global;
require('../series-data.js');

const seriesList = window._SERIES_DATA;

async function processAll() {
  console.log(`Starting scan of all ${seriesList.length} series...`);
  const results = {};
  const issues = [];
  let totalSeriesMatched = 0;
  let totalEpisodesWithAirdate = 0;
  let totalEpisodesInSeries = 0;

  for (let i = 0; i < seriesList.length; i++) {
    const s = seriesList[i];
    const seriesTitle = s.title;
    let episodesInThisSeries = 0;
    s.seasons.forEach(sn => episodesInThisSeries += (sn.episodes?.length || 0));
    totalEpisodesInSeries += episodesInThisSeries;

    // Try search
    let tvData = null;
    try {
      const q = encodeURIComponent(seriesTitle);
      const res = await fetch(`https://api.tvmaze.com/singlesearch/shows?q=${q}&embed=episodes`);
      if (res.ok) {
        tvData = await res.json();
      }
    } catch (e) {
      // ignore
    }

    // If not found or mismatch, try without punctuation / colons
    if (!tvData && seriesTitle.includes(':')) {
      try {
        const q = encodeURIComponent(seriesTitle.split(':')[0].trim());
        const res = await fetch(`https://api.tvmaze.com/singlesearch/shows?q=${q}&embed=episodes`);
        if (res.ok) {
          tvData = await res.json();
        }
      } catch (e) {}
    }

    if (!tvData) {
      issues.push({ title: seriesTitle, reason: 'Show not found on TVMaze' });
      continue;
    }

    totalSeriesMatched++;
    const epMap = {};
    (tvData._embedded?.episodes || []).forEach(e => {
      if (e.season && e.number && e.airdate) {
        epMap[`S${e.season}E${e.number}`] = e.airdate;
      }
    });

    results[seriesTitle] = {
      imdbId: tvData.externals?.imdb,
      episodes: epMap
    };

    let matchedInSeries = 0;
    s.seasons.forEach(sn => {
      sn.episodes.forEach(ep => {
        const key = `S${sn.season}E${ep.episode}`;
        if (epMap[key]) {
          matchedInSeries++;
          totalEpisodesWithAirdate++;
        }
      });
    });

    if (matchedInSeries < episodesInThisSeries) {
      issues.push({
        title: seriesTitle,
        reason: `Partial episode match: ${matchedInSeries}/${episodesInThisSeries}`,
        unmatched: s.seasons.flatMap(sn => 
          sn.episodes.filter(ep => !epMap[`S${sn.season}E${ep.episode}`])
            .map(ep => `S${sn.season}E${ep.episode}: ${ep.title}`)
        ).slice(0, 5)
      });
    }

    // Friendly delay
    await new Promise(r => setTimeout(r, 120));
    if ((i + 1) % 25 === 0 || i === seriesList.length - 1) {
      console.log(`Processed ${i + 1}/${seriesList.length} series... (Current matched eps: ${totalEpisodesWithAirdate}/${totalEpisodesInSeries})`);
    }
  }

  console.log('\n--- SCAN SUMMARY ---');
  console.log(`Total Series: ${seriesList.length}`);
  console.log(`Series Matched: ${totalSeriesMatched}`);
  console.log(`Total Episodes: ${totalEpisodesInSeries}`);
  console.log(`Episodes with Airdate: ${totalEpisodesWithAirdate} (${((totalEpisodesWithAirdate/totalEpisodesInSeries)*100).toFixed(1)}%)`);
  console.log(`Issues count: ${issues.length}`);

  fs.writeFileSync('scratch/airdates_cache.json', JSON.stringify(results, null, 2));
  fs.writeFileSync('scratch/issues.json', JSON.stringify(issues, null, 2));
  console.log('Saved cache to scratch/airdates_cache.json and issues to scratch/issues.json');
}

processAll();

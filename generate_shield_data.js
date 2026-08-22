const https = require('https');
const fs = require('fs');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  try {
    const shows = await fetchJson('https://api.tvmaze.com/search/shows?q=agents%20of%20s.h.i.e.l.d.');
    const show = shows[0].show;
    const episodesData = await fetchJson('https://api.tvmaze.com/shows/' + show.id + '/episodes');
    
    const seasons = {};
    for (const ep of episodesData) {
      if (!seasons[ep.season]) seasons[ep.season] = [];
      seasons[ep.season].push({
        episode: ep.number,
        title: ep.name.replace(/'/g, "\\'")
      });
    }
    
    let seasonsArray = [];
    for (const s of Object.keys(seasons)) {
      let epStr = seasons[s].map(e => `          { episode: ${e.episode}, title: '${e.title}' }`).join(',\n');
      seasonsArray.push(`      {
        season: ${s},
        episodes: [
${epStr}
        ]
      }`);
    }

    const seriesData = `  {
    title: 'Agents of S.H.I.E.L.D.',
    type: 'TV Show',
    year: 2013,
    rating: 7.5,
    age: 'TV-14',
    duration: '45m',
    genres: [
      'Action',
      'Adventure',
      'Sci-Fi'
    ],
    poster: 'https://image.tmdb.org/t/p/w600_and_h900_face/gHUCCMy1vvj58tzE3dZqeC9B19L.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/mBaXZ95R2OxueZhvQbcEWy2DqyO.jpg',
    videoUrl: '1403',
    overview: 'Agent Phil Coulson assembles a small group of highly skilled agents from the global law-enforcement organization known as S.H.I.E.L.D. Together, they investigate the new, the strange and the unknown around the globe, protecting the ordinary from the extraordinary.',
    director: 'Maurissa Tancharoen, Jed Whedon, Joss Whedon',
    cast: [
      'Clark Gregg',
      'Ming-Na Wen',
      'Chloe Bennet',
      'Iain De Caestecker',
      'Elizabeth Henstridge'
    ],
    trending: false,
    featured: false,
    is4k: false,
    seasons: [
${seasonsArray.join(',\n')}
    ]
  }`;

    fs.writeFileSync('agents_chunk.txt', seriesData);
    console.log('Generated agents_chunk.txt');
  } catch(e) {
    console.error(e);
  }
}
run();

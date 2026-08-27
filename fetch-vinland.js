const fs = require('fs');

async function run() {
  const showRes = await fetch('https://api.tvmaze.com/search/shows?q=vinland%20saga');
  const shows = await showRes.json();
  const vinland = shows.find(s => s.show.name.toLowerCase() === 'vinland saga').show;
  
  const epRes = await fetch('https://api.tvmaze.com/shows/' + vinland.id + '/episodes');
  const episodes = await epRes.json();
  
  const seasonsMap = {};
  episodes.forEach(ep => {
    if (!seasonsMap[ep.season]) seasonsMap[ep.season] = [];
    seasonsMap[ep.season].push({
      episode: ep.number,
      title: (ep.name || '').replace(/"/g, '\\"')
    });
  });
  
  let out = `  {
    title: "Vinland Saga",
    type: "TV Show",
    isAnime: true,
    year: 2019,
    rating: 8.7,
    age: "TV-MA",
    duration: "24m",
    genres: [
      "Animation",
      "Action",
      "Adventure",
      "Drama",
      "History"
    ],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/1c1qEqL1sN0b4pEn80963wXW2K.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/b3z6q80mGq85XbE0qEa7Q5w1D7.jpg",
    videoUrl: "88803",
    anilistId: 101348,
    animeSlug: "vinland-saga",
    overview: "For a thousand years, the Vikings have made quite a name and reputation for themselves as the strongest families with a thirst for violence. Thorfinn, the son of one of the Vikings' greatest warriors, spends his boyhood in a battlefield enhancing his skills in his adventure to redeem his most-desired revenge after his father was murdered.",
    director: "Shuhei Yabuta",
    cast: [
      "Yuto Uemura",
      "Shunsuke Takeuchi",
      "Kensho Ono",
      "Akio Otsuka"
    ],
    trending: true,
    featured: false,
    is4k: false,
    seasons: [
`;

  const seasons = Object.keys(seasonsMap).sort((a,b) => Number(a)-Number(b));
  
  seasons.forEach((seasonStr, index) => {
    const season = parseInt(seasonStr);
    out += '      {\n';
    out += '        season: ' + season + ',\n';
    out += '        episodes: [\n';
    
    const eps = seasonsMap[season].filter(ep => ep.episode !== null);
    
    eps.forEach((ep, i) => {
        out += '          {\n';
        out += '            episode: ' + ep.episode + ',\n';
        out += '            title: "' + ep.title + '"\n';
        out += '          }' + (i === eps.length - 1 ? '' : ',') + '\n';
    });
    
    out += '        ]\n';
    out += '      }' + (index === seasons.length - 1 ? '' : ',') + '\n';
  });
  out += '    ]\n  }';
  
  fs.writeFileSync('vinland.txt', out);
  console.log('done');
}
run().catch(console.error);

const fs = require('fs');

async function run() {
  const showRes = await fetch('https://api.tvmaze.com/search/shows?q=attack%20on%20titan');
  const shows = await showRes.json();
  const aot = shows.find(s => s.show.name === 'Attack on Titan').show;
  
  const epRes = await fetch('https://api.tvmaze.com/shows/' + aot.id + '/episodes');
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
    title: "Attack on Titan",
    type: "TV Show",
    isAnime: true,
    year: 2013,
    rating: 9.1,
    age: "TV-MA",
    duration: "24m",
    genres: [
      "Animation",
      "Action",
      "Adventure",
      "Fantasy"
    ],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/hTP1DtLWHlNIGqqwOaFtUkHU4Cv.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/tMefBSflR6PGQLvLuwzC4ih33w9.jpg",
    videoUrl: "1429",
    anilistId: 16498,
    animeSlug: "attack-on-titan",
    overview: "Several hundred years ago, humans were nearly exterminated by Titans. Titans are typically several stories tall, seem to have no intelligence, devour human beings and, worst of all, seem to do it for the pleasure rather than as a food source. A small percentage of humanity survived by walling themselves in a city protected by extremely high walls, even taller than the biggest Titans. Flash forward to the present and the city has not seen a Titan in over 100 years. Teenage boy Eren and his foster sister Mikasa witness something horrific as the city walls are destroyed by a Colossal Titan that appears out of thin air. As the smaller Titans flood the city, the two kids watch in horror as their mother is eaten alive. Eren vows that he will murder every single Titan and take revenge for all of mankind.",
    director: "Hajime Isayama",
    cast: [
      "Yuki Kaji",
      "Yui Ishikawa",
      "Marina Inoue",
      "Hiroshi Kamiya"
    ],
    trending: true,
    featured: true,
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
  out += '    ]\n  },';
  
  fs.writeFileSync('aot.txt', out);
  console.log('done');
}
run().catch(console.error);

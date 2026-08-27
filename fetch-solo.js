const fs = require('fs');

async function run() {
  const showRes = await fetch('https://api.tvmaze.com/search/shows?q=solo%20leveling');
  const shows = await showRes.json();
  const solo = shows.find(s => s.show.name.toLowerCase().includes('solo leveling')).show;
  
  const epRes = await fetch('https://api.tvmaze.com/shows/' + solo.id + '/episodes');
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
    title: "Solo Leveling",
    type: "TV Show",
    isAnime: true,
    year: 2024,
    rating: 8.9,
    age: "TV-14",
    duration: "24m",
    genres: [
      "Animation",
      "Action",
      "Adventure",
      "Fantasy"
    ],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/geCRueVbNjHRvX3q4t188fV8Evy.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/tEunVUqi33X5U8YnIurSnd8bH8v.jpg",
    videoUrl: "127532",
    anilistId: 151807,
    animeSlug: "solo-leveling",
    overview: "In a world where hunters, humans who possess magical abilities, must battle deadly monsters to protect the human race from certain annihilation, a notoriously weak hunter named Sung Jinwoo finds himself in a seemingly endless struggle for survival. One day, after narrowly surviving an overwhelmingly powerful double dungeon that nearly wipes out his entire party, a mysterious program called the System chooses him as its sole player and in turn, gives him the extremely rare ability to level up in strength, possibly beyond any known limits. Follow Jinwoo's journey as he fights against all kinds of enemies, both man and monster, to discover the secrets of the dungeons and the true source of his powers.",
    director: "Shunsuke Nakashige",
    cast: [
      "Taito Ban",
      "Genta Nakamura",
      "Reina Ueda",
      "Daisuke Hirakawa"
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
  
  fs.writeFileSync('solo.txt', out);
  console.log('done');
}
run().catch(console.error);

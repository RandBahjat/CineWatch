const fs = require('fs');

async function run() {
  const showRes = await fetch('https://api.tvmaze.com/search/shows?q=hunter%20x%20hunter');
  const shows = await showRes.json();
  // Find the 2011 version (which usually has ID 46298 on TMDB and matches the TVMaze version we want)
  let hxh = shows.find(s => s.show.name.toLowerCase() === 'hunter x hunter' && s.show.premiered && s.show.premiered.startsWith('2011'));
  if (!hxh) hxh = shows.find(s => s.show.name.toLowerCase() === 'hunter x hunter');
  hxh = hxh.show;
  
  const epRes = await fetch('https://api.tvmaze.com/shows/' + hxh.id + '/episodes');
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
    title: "Hunter x Hunter",
    type: "TV Show",
    isAnime: true,
    year: 2011,
    rating: 9.0,
    age: "TV-14",
    duration: "24m",
    genres: [
      "Animation",
      "Action",
      "Adventure",
      "Fantasy"
    ],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/1QepByFcxuwzVOzM5nlxU34u8wS.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/uc8v0m8aYgO5Ff8uE7d1L0TksYx.jpg",
    videoUrl: "46298",
    anilistId: 11061,
    animeSlug: "hunter-x-hunter-2011",
    overview: "Twelve-year-old Gon Freecss one day discovers that the father he had always been told was dead was alive and well. His Father, Ging, is a Hunter—a member of society's elite with a license to go anywhere or do almost anything. Gon, determined to follow in his father's footsteps, decides to take the Hunter Examination and eventually find his father to prove himself as a Hunter in his own right.",
    director: "Hiroshi Koujina",
    cast: [
      "Megumi Han",
      "Mariya Ise",
      "Keiji Fujiwara",
      "Miyuki Sawashiro"
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
  out += '    ]\n  },';
  
  fs.writeFileSync('hxh.txt', out);
  console.log('done');
}
run().catch(console.error);

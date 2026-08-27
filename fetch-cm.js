const fs = require('fs');

async function run() {
  const showRes = await fetch('https://api.tvmaze.com/search/shows?q=chainsaw%20man');
  const shows = await showRes.json();
  const cm = shows.find(s => s.show.name.toLowerCase().includes('chainsaw man')).show;
  
  const epRes = await fetch('https://api.tvmaze.com/shows/' + cm.id + '/episodes');
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
    title: "Chainsaw Man",
    type: "TV Show",
    isAnime: true,
    year: 2022,
    rating: 8.7,
    age: "TV-MA",
    duration: "24m",
    genres: [
      "Animation",
      "Action",
      "Adventure",
      "Fantasy"
    ],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/npdB6eFzizki0WaZ1OvKcJrWe97.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/9ns9463dwOeo1CK1JU2sRAFUMHZ.jpg",
    videoUrl: "114410",
    anilistId: 127230,
    animeSlug: "chainsaw-man",
    overview: "Denji, desperate young man saddled with huge debt, merge with devil dog Pochita, gain power to transform into Chainsaw Man. Join Public Safety Devil Hunters, fight brutal demon, seek simple life, uncover dark conspiracy in bloody, chaotic world.",
    director: "Tatsuki Fujimoto",
    cast: [
      "Kikunosuke Toya, Tomori Kusunoki, Shogo Sakata, Fairouz Ai, Ryan Colt Levy"
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
  
  fs.writeFileSync('cm.txt', out);
  console.log('done');
}
run().catch(console.error);

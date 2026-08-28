const fs = require('fs');

async function run() {
  const epRes = await fetch('https://api.tvmaze.com/shows/74706/episodes');
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
    title: "Beauty in Black",
    type: "TV Show",
    year: 2024,
    rating: 7.2,
    age: "TV-MA",
    duration: "45m",
    genres: [
      "Drama"
    ],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/1y3m3YV4y9iS1QxV22CXY0D2rE7.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/uLqPudg1L14sT9lJ5E6uC5K26B3.jpg",
    videoUrl: "246246",
    overview: "A stripper's fate takes a turn when she crosses paths with the wealthy, dysfunctional family behind a cosmetics dynasty and a devious trafficking scheme.",
    director: "Tyler Perry",
    cast: [
      "Taylor Polidore Williams",
      "Amber Reign Smith",
      "Crystle Stewart",
      "Ricco Ross"
    ],
    trending: true,
    featured: false,
    seasons: [
`;

  // Fix poster and backdrop
  out = out.replace("https://www.themoviedb.org/t/p/w600_and_h900_face/1y3m3YV4y9iS1QxV22CXY0D2rE7.jpg", "https://image.tmdb.org/t/p/w600_and_h900_face/xO1zHtc6wW1Oikp2L97gJcdQ6Y8.jpg");
  out = out.replace("https://image.tmdb.org/t/p/original/uLqPudg1L14sT9lJ5E6uC5K26B3.jpg", "https://image.tmdb.org/t/p/original/6K5w17E49tG2O0a9wN8C2D8p8z3.jpg");

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
  
  fs.writeFileSync('beauty.txt', out);
  console.log('done');
}
run().catch(console.error);

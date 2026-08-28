const fs = require('fs');

async function run() {
  const epRes = await fetch('https://api.tvmaze.com/shows/4099/episodes');
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
    title: "Yu-Gi-Oh! Duel Monsters",
    type: "TV Show",
    isAnime: true,
    year: 2000,
    rating: 7.7,
    age: "TV-14",
    duration: "24m",
    genres: [
      "Animation",
      "Action",
      "Adventure",
      "Fantasy"
    ],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/1rWkX4y920hO1G63l6V8wT18TfT.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/tD06V06mGryY2o5gD8zIe5q7sN2.jpg",
    videoUrl: "902",
    anilistId: 481,
    animeSlug: "yu-gi-oh-duel-monsters",
    overview: "Yugi Mutou is a boy who loves games, but is often bullied. One day, he solves an ancient puzzle known as the Millennium Puzzle, causing a mysterious spirit with the personality of a gambler to reside in his body. From that moment on, whenever Yugi's friends are threatened, this other Yugi makes an appearance and challenges the bullies to dangerous Shadow Games.",
    director: "Kunihisa Sugishima",
    cast: [
      "Shunsuke Kazama",
      "Maki Saito",
      "Hiroki Takahashi",
      "Hidehiro Kikuchi"
    ],
    trending: true,
    featured: false,
    is4k: false,
    seasons: [
`;

  // Use tmdb images
  out = out.replace("https://www.themoviedb.org/t/p/w600_and_h900_face/1rWkX4y920hO1G63l6V8wT18TfT.jpg", "https://image.tmdb.org/t/p/w600_and_h900_face/vQ1T2U20Yw61xTfSg8E1m6i9g2d.jpg");
  out = out.replace("https://image.tmdb.org/t/p/original/tD06V06mGryY2o5gD8zIe5q7sN2.jpg", "https://image.tmdb.org/t/p/original/x8Y5p5F6k7P6q3L9m8N8q9q2.jpg");

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
  
  fs.writeFileSync('yugioh.txt', out);
  console.log('done');
}
run().catch(console.error);

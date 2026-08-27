const fs = require('fs');

async function run() {
  // Use 'haikyu' to search TVMaze
  const showRes = await fetch('https://api.tvmaze.com/search/shows?q=haikyu');
  const shows = await showRes.json();
  const haikyu = shows.find(s => s.show.name.toLowerCase().includes('haikyu')).show;
  
  const epRes = await fetch('https://api.tvmaze.com/shows/' + haikyu.id + '/episodes');
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
    title: "Haikyu!!",
    type: "TV Show",
    isAnime: true,
    year: 2014,
    rating: 8.6,
    age: "TV-14",
    duration: "24m",
    genres: [
      "Animation",
      "Comedy",
      "Drama",
      "Sports"
    ],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/1QepByFcxuwzVOzM5nlxU34u8wS.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/uc8v0m8aYgO5Ff8uE7d1L0TksYx.jpg",
    videoUrl: "60863",
    anilistId: 20464,
    animeSlug: "haikyu",
    overview: "Inspired by a small-statured pro volleyball player, Shouyou Hinata creates a volleyball team in his last year of middle school. Unfortunately the team is matched up against the \\"King of the Court\\" Tobio Kageyama's team in their first tournament and inevitably lose. After the crushing defeat, Hinata vows to surpass Kageyama. After entering high school, Hinata joins the volleyball team only to find that Tobio has also joined.",
    director: "Susumu Mitsunaka",
    cast: [
      "Ayumu Murase",
      "Kaito Ishikawa",
      "Satoshi Hino",
      "Miyu Irino"
    ],
    trending: true,
    featured: false,
    is4k: false,
    seasons: [
`;

  // Fix poster and backdrop to Haikyu placeholders (using TMDB keys)
  out = out.replace("https://www.themoviedb.org/t/p/w600_and_h900_face/1QepByFcxuwzVOzM5nlxU34u8wS.jpg", "https://image.tmdb.org/t/p/w600_and_h900_face/rF5hD66Q07Yqgq76y4S4sB2kHwe.jpg");
  out = out.replace("https://image.tmdb.org/t/p/original/uc8v0m8aYgO5Ff8uE7d1L0TksYx.jpg", "https://image.tmdb.org/t/p/original/6x1ZEm3m7aBtzR78uDk2l8xWqWb.jpg");

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
  
  fs.writeFileSync('haikyu.txt', out);
  console.log('done');
}
run().catch(console.error);

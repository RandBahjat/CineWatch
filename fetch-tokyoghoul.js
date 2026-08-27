const fs = require('fs');

async function run() {
  const showRes = await fetch('https://api.tvmaze.com/search/shows?q=tokyo%20ghoul');
  const shows = await showRes.json();
  const tokyoghoul = shows.find(s => s.show.name.toLowerCase().includes('tokyo ghoul')).show;
  
  const epRes = await fetch('https://api.tvmaze.com/shows/' + tokyoghoul.id + '/episodes');
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
    title: "Tokyo Ghoul",
    type: "TV Show",
    isAnime: true,
    year: 2014,
    rating: 7.8,
    age: "TV-MA",
    duration: "24m",
    genres: [
      "Animation",
      "Action",
      "Drama",
      "Horror"
    ],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/1QepByFcxuwzVOzM5nlxU34u8wS.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/6x1ZEm3m7aBtzR78uDk2l8xWqWb.jpg",
    videoUrl: "61374",
    anilistId: 20605,
    animeSlug: "tokyo-ghoul",
    overview: "Tokyo has become a cruel and merciless city—a place where vicious creatures called “ghouls” exist alongside humans. The citizens of this once great metropolis live in constant fear of these bloodthirsty savages and their thirst for human flesh. However, the greatest threat these ghouls pose is their dangerous ability to masquerade as humans and blend in with society.",
    director: "Shuhei Morita",
    cast: [
      "Natsuki Hanae",
      "Sora Amamiya",
      "Kana Hanazawa",
      "Mamoru Miyano"
    ],
    trending: true,
    featured: false,
    is4k: false,
    seasons: [
`;

  // Fix poster and backdrop to Tokyo Ghoul placeholders (using TMDB keys)
  out = out.replace("https://www.themoviedb.org/t/p/w600_and_h900_face/1QepByFcxuwzVOzM5nlxU34u8wS.jpg", "https://image.tmdb.org/t/p/w600_and_h900_face/32m2tJ9394hXh76k3qK6P3nL32Y.jpg");
  out = out.replace("https://image.tmdb.org/t/p/original/6x1ZEm3m7aBtzR78uDk2l8xWqWb.jpg", "https://image.tmdb.org/t/p/original/x8J2G8N8vP0VvE3Z7gN8P2h4L8N.jpg");

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
  
  fs.writeFileSync('tokyoghoul.txt', out);
  console.log('done');
}
run().catch(console.error);

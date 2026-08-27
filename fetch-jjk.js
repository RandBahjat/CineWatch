const fs = require('fs');

async function run() {
  const showRes = await fetch('https://api.tvmaze.com/search/shows?q=jujutsu%20kaisen');
  const shows = await showRes.json();
  const jjk = shows.find(s => s.show.name.toLowerCase().includes('jujutsu kaisen')).show;
  
  const epRes = await fetch('https://api.tvmaze.com/shows/' + jjk.id + '/episodes');
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
    title: "JUJUTSU KAISEN",
    type: "TV Show",
    isAnime: true,
    year: 2020,
    rating: 8.6,
    age: "TV-MA",
    duration: "24m",
    genres: [
      "Animation",
      "Action",
      "Adventure",
      "Fantasy"
    ],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/hFWP5HkbVEe40hrptcgHQpSeaUu.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/m99F2Y8p30r8yG48VbTzLz94ZTo.jpg",
    videoUrl: "95479",
    anilistId: 113415,
    animeSlug: "jujutsu-kaisen",
    overview: "Yuji Itadori is a boy with tremendous physical strength, though he lives a completely ordinary high school life. One day, to save a classmate who has been attacked by curses, he eats the finger of Ryomen Sukuna, taking the curse into his own soul. From then on, he shares one body with Ryomen Sukuna. Guided by the most powerful of sorcerers, Satoru Gojo, Itadori is admitted to Tokyo Jujutsu High School, an organization that fights the curses... and thus begins the heroic tale of a boy who became a curse to exorcise a curse, a life from which he could never turn back.",
    director: "Sunghoo Park",
    cast: [
      "Junya Enoki",
      "Yuma Uchida",
      "Asami Seto",
      "Yuichi Nakamura"
    ],
    trending: true,
    featured: false,
    is4k: false,
    seasons: [
`;

  // Fix backdrop image since the one copied is Demon Slayer's backdrop
  out = out.replace("https://image.tmdb.org/t/p/original/m99F2Y8p30r8yG48VbTzLz94ZTo.jpg", "https://image.tmdb.org/t/p/original/6K2LdEXv1UymW7hZ3xTtvLzE2Zt.jpg");

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
  
  fs.writeFileSync('jjk.txt', out);
  console.log('done');
}
run().catch(console.error);

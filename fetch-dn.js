const fs = require('fs');

async function run() {
  const showRes = await fetch('https://api.tvmaze.com/search/shows?q=death%20note');
  const shows = await showRes.json();
  const dn = shows.find(s => s.show.name.toLowerCase().includes('death note')).show;
  
  const epRes = await fetch('https://api.tvmaze.com/shows/' + dn.id + '/episodes');
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
    title: "Death Note",
    type: "TV Show",
    isAnime: true,
    year: 2006,
    rating: 8.6,
    age: "TV-14",
    duration: "24m",
    genres: [
      "Animation",
      "Mystery",
      "Thriller",
      "Supernatural"
    ],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/tC9pILVbWU4ylKUXGE6MhsgeKzo.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/m99F2Y8p30r8yG48VbTzLz94ZTo.jpg",
    videoUrl: "13916",
    anilistId: 1535,
    animeSlug: "death-note",
    overview: "Light Yagami is an ace student with great prospects—and he's bored out of his mind. But all that changes when he finds the Death Note, a notebook dropped by a rogue Shinigami death god. Any human whose name is written in the notebook dies, and Light has vowed to use the power of the Death Note to rid the world of evil. But will Light succeed in his noble goal, or will the Death Note turn him into the very thing he fights against?",
    director: "Tetsuro Araki",
    cast: [
      "Mamoru Miyano",
      "Kappei Yamaguchi",
      "Aya Hirano",
      "Shido Nakamura"
    ],
    trending: true,
    featured: false,
    is4k: false,
    seasons: [
`;

  // Provide proper backdrop since the one above is a placeholder Demon Slayer backdrop
  out = out.replace("https://image.tmdb.org/t/p/original/m99F2Y8p30r8yG48VbTzLz94ZTo.jpg", "https://image.tmdb.org/t/p/original/1S8zD4GWWVl5k7e9gJIfL9ZJ1tE.jpg");

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
  
  fs.writeFileSync('dn.txt', out);
  console.log('done');
}
run().catch(console.error);

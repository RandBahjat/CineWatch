const fs = require('fs');

async function run() {
  const showRes = await fetch('https://api.tvmaze.com/search/shows?q=one%20punch%20man');
  const shows = await showRes.json();
  const opm = shows.find(s => s.show.name === 'One-Punch Man' || s.show.name === 'One Punch Man').show;
  
  const epRes = await fetch('https://api.tvmaze.com/shows/' + opm.id + '/episodes');
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
    title: "One Punch Man",
    type: "TV Show",
    isAnime: true,
    year: 2015,
    rating: 8.8,
    age: "TV-14",
    duration: "24m",
    genres: [
      "Animation",
      "Action",
      "Comedy",
      "Sci-Fi"
    ],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/iE3s0lG5QVdEHOEZno7EQyicKLW.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/sMO1v5TUf8GOJHbJieOUHqOSKEi.jpg",
    videoUrl: "63639",
    anilistId: 21087,
    animeSlug: "one-punch-man",
    overview: "Saitama is a hero who only became a hero for fun. After three years of \"special\" training, though, he's become so strong that he's practically invincible. In fact, he's too strong—even his mightiest opponents are taken out with a single punch, and it turns out that being devastatingly powerful is actually kind of a bore.",
    director: "Shingo Natsume",
    cast: [
      "Makoto Furukawa",
      "Kaito Ishikawa",
      "Yuki Kaji",
      "Aoi Yuki"
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
  
  fs.writeFileSync('opm.txt', out);
  console.log('done');
}
run().catch(console.error);

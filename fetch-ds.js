const fs = require('fs');

async function run() {
  const showRes = await fetch('https://api.tvmaze.com/search/shows?q=demon%20slayer');
  const shows = await showRes.json();
  const ds = shows.find(s => s.show.name.includes('Demon Slayer')).show;
  
  const epRes = await fetch('https://api.tvmaze.com/shows/' + ds.id + '/episodes');
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
    title: "Demon Slayer: Kimetsu no Yaiba",
    type: "TV Show",
    isAnime: true,
    year: 2019,
    rating: 8.7,
    age: "TV-MA",
    duration: "24m",
    genres: [
      "Animation",
      "Action",
      "Adventure",
      "Fantasy"
    ],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/xUfRZu2mi8jH6SnDOUUVb70z6TX.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/m99F2Y8p30r8yG48VbTzLz94ZTo.jpg",
    videoUrl: "85937",
    anilistId: 101922,
    animeSlug: "demon-slayer",
    overview: "It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko, the sole survivor, has been transformed into a demon herself. Though devastated by this grim reality, Tanjiro resolves to become a “demon slayer” so that he can turn his sister back into a human, and kill the demon that massacred his family.",
    director: "Haruo Sotozaki",
    cast: [
      "Natsuki Hanae",
      "Akari Kito",
      "Hiro Shimono",
      "Yoshitsugu Matsuoka"
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
  
  fs.writeFileSync('ds.txt', out);
  console.log('done');
}
run().catch(console.error);

const fs = require('fs');

async function run() {
  const showRes = await fetch('https://api.tvmaze.com/search/shows?q=blue%20lock');
  const shows = await showRes.json();
  const bluelock = shows.find(s => s.show.name.toLowerCase() === 'blue lock').show;
  
  const epRes = await fetch('https://api.tvmaze.com/shows/' + bluelock.id + '/episodes');
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
    title: "BLUE LOCK",
    type: "TV Show",
    isAnime: true,
    year: 2022,
    rating: 8.2,
    age: "TV-14",
    duration: "24m",
    genres: [
      "Animation",
      "Action",
      "Drama",
      "Sports"
    ],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/tvOq4K0tDNYYeq13tUf6n4lS4Jk.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/t6LctQfWf6X16GzKq771V333p98.jpg",
    videoUrl: "131041",
    anilistId: 137822,
    animeSlug: "blue-lock",
    overview: "After a disastrous defeat at the 2018 World Cup, Japan's team struggles to regroup. But what's missing? An absolute Ace Striker, who can guide them to the win. The Japan Football Union is hell-bent on creating a striker who hungers for goals and thirsts for victory, and who can be the decisive instrument in turning around a losing match...and to do so, they've gathered 300 of Japan's best and brightest youth players. Who will emerge to lead the team...and will they be able to out-muscle and out-ego everyone who stands in their way?",
    director: "Tetsuaki Watanabe",
    cast: [
      "Kazuki Ura",
      "Tasuku Kaito",
      "Yuki Ono",
      "Soma Saito"
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
  out += '    ]\n  }';
  
  fs.writeFileSync('bluelock.txt', out);
  console.log('done');
}
run().catch(console.error);

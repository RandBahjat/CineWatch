const fs = require('fs');

async function run() {
  const showRes = await fetch('https://api.tvmaze.com/search/shows?q=dragon%20ball%20kai');
  const shows = await showRes.json();
  const dbz = shows.find(s => s.show.name === 'Dragon Ball Kai').show;
  
  const epRes = await fetch('https://api.tvmaze.com/shows/' + dbz.id + '/episodes');
  const episodes = await epRes.json();
  
  const allEpisodes = episodes.filter(ep => ep.number !== null).map(ep => ({
    episode: ep.number,
    title: (ep.name || '').replace(/"/g, '\\"')
  }));
  
  let out = `  {
    title: "Dragon Ball Z Kai",
    type: "TV Show",
    isAnime: true,
    year: 2009,
    rating: 8.3,
    age: "TV-14",
    duration: "24m",
    genres: [
      "Animation",
      "Action",
      "Adventure",
      "Sci-Fi"
    ],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/1QepByFcxuwzVOzM5nlxU34u8wS.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/uc8v0m8aYgO5Ff8uE7d1L0TksYx.jpg",
    videoUrl: "61709",
    anilistId: 6033,
    animeSlug: "dragon-ball-z-kai",
    overview: "Revisiting the acclaimed Dragon Ball Z series, this remastered and condensed version removes original filler episodes to more closely follow Akira Toriyama's manga, delivering faster-paced action, updated animation sequences, and a re-recorded voice track as Goku and his friends defend Earth from increasingly powerful cosmic threats.",
    director: "Yasuhiro Nowatari",
    cast: [
      "Masako Nozawa",
      "Ryo Horikawa",
      "Toshio Furukawa",
      "Mayumi Tanaka"
    ],
    trending: true,
    featured: false,
    is4k: false,
    seasons: [
`;

  out = out.replace("https://www.themoviedb.org/t/p/w600_and_h900_face/1QepByFcxuwzVOzM5nlxU34u8wS.jpg", "https://image.tmdb.org/t/p/w600_and_h900_face/dkuJWQWbJ3W753X7F81k2MtdrXq.jpg");
  out = out.replace("https://image.tmdb.org/t/p/original/uc8v0m8aYgO5Ff8uE7d1L0TksYx.jpg", "https://image.tmdb.org/t/p/original/vI3n2tM32JEqB3kR58sN7m7aZkF.jpg");

  const seasonCounts = [26, 26, 25, 20, 35, 26];
  
  let epIndex = 0;
  for (let s = 0; s < seasonCounts.length; s++) {
    out += '      {\n';
    out += '        season: ' + (s + 1) + ',\n';
    out += '        episodes: [\n';
    
    let count = seasonCounts[s];
    for (let e = 0; e < count; e++) {
        let epTitle = "Episode " + (e + 1);
        if (epIndex < allEpisodes.length) {
            epTitle = allEpisodes[epIndex].title;
        }
        out += '          {\n';
        out += '            episode: ' + (e + 1) + ',\n';
        out += '            title: "' + epTitle + '"\n';
        out += '          }' + (e === count - 1 ? '' : ',') + '\n';
        epIndex++;
    }
    
    out += '        ]\n';
    out += '      }' + (s === seasonCounts.length - 1 ? '' : ',') + '\n';
  }
  
  out += '    ]\n  },';
  
  fs.writeFileSync('dbz.txt', out);
  console.log('done');
}
run().catch(console.error);

const fs = require('fs');

async function fetchDbz() {
  const res = await fetch('https://api.tvmaze.com/singlesearch/shows?q=dragon%20ball%20z&embed=episodes');
  const data = await res.json();
  
  const episodes = data._embedded.episodes;
  const seasonsMap = {};
  
  let absoluteCount = 1;
  episodes.forEach(e => {
    if (!seasonsMap[e.season]) {
      seasonsMap[e.season] = { season: e.season, episodes: [] };
    }
    seasonsMap[e.season].episodes.push({
      episode: e.number,
      title: e.name || `Episode ${e.number}`,
      absoluteEpisode: absoluteCount
    });
    absoluteCount++;
  });
  
  const dbz = {
    title: "Dragon Ball Z",
    type: "TV Show",
    isAnime: true,
    year: 1989,
    rating: 8.8,
    age: "TV-14",
    duration: "24m",
    genres: ["Animation", "Action", "Adventure", "Sci-Fi", "Fantasy"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/dB4EDhre2dsC2kxYDavyKWqLQwi.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/jZqOqD6bteT9v5g4b9zH9q6f7D9.jpg",
    videoUrl: "12971",
    anilistId: 813,
    animeSlug: "dragon-ball-z",
    overview: "After learning that he is from another planet, a warrior named Goku and his friends are prompted to defend it from an onslaught of extraterrestrial enemies.",
    director: "Akira Toriyama",
    cast: [
      "Masako Nozawa",
      "Ryo Horikawa",
      "Toshio Furukawa",
      "Mayumi Tanaka",
      "Hiromi Tsuru"
    ],
    trending: false,
    featured: false,
    is4k: false,
    seasons: Object.values(seasonsMap)
  };
  
  fs.writeFileSync('dbz.json', JSON.stringify(dbz, null, 2));
  console.log('Saved dbz.json');
}

fetchDbz().catch(console.error);

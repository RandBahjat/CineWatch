const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('dbzkai_tvmaze.json', 'utf8'));
const seasonsMap = {};

raw.forEach(ep => {
  const s = ep.season;
  if (!seasonsMap[s]) {
    seasonsMap[s] = { season: s, episodes: [] };
  }
  seasonsMap[s].episodes.push({
    episode: ep.number,
    title: ep.name,
    duration: "24m"
  });
});

let absoluteCount = 1;
const seasons = Object.values(seasonsMap).map(s => {
  s.episodes.forEach(e => {
    e.absoluteEpisode = absoluteCount++;
  });
  return s;
});

const animeData = {
  title: "Dragon Ball Z Kai",
  type: "TV Show",
  isAnime: true,
  year: 2009,
  rating: 8.5,
  age: "TV-14",
  duration: "24m",
  genres: ["Animation", "Action", "Adventure", "Comedy", "Sci-Fi & Fantasy"],
  poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/ojsPI8fNwcecKLhVC4rB4ZZhFMc.jpg",
  backdrop: "https://www.themoviedb.org/t/p/original/oz5zbMBKCUsb7hsbjdxvK8yagPD.jpg",
  videoUrl: "61709",
  anilistId: 6033,
  animeSlug: "dragon-ball-z-kai",
  overview: "Rejoin Goku and his friends in a series of cosmic battles! Toei has redubbed, recut, and cleaned up the animation of the original 1989 animated series. The show's story arc has been refined to better follow the comic book series on which it is based. The show also features a new opening and ending. In the series, martial artist Goku, and his various friends, battle increasingly powerful enemies to defend the world against evil. Can Earth's defender defeat demons, aliens, and other villains?",
  director: "Akira Toriyama",
  cast: [
    "Masako Nozawa",
    "Ryo Horikawa",
    "Toshio Furukawa",
    "Mayumi Tanaka",
    "Ryusei Nakao"
  ],
  trending: false,
  featured: false,
  is4k: false,
  seasons: seasons
};

const str = '  ,\n  ' + JSON.stringify(animeData, null, 4).replace(/\n/g, '\n  ') + '\n];';
fs.writeFileSync('dbzkai_append.txt', str);

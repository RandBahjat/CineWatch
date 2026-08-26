const fs = require('fs');
const data = JSON.parse(fs.readFileSync('bleach_tvmaze.json', 'utf8'));

const overview = data.summary.replace(/<[^>]*>?/gm, ''); // strip HTML

const seasonsMap = {};
data._embedded.episodes.forEach(ep => {
  if (!seasonsMap[ep.season]) {
    seasonsMap[ep.season] = [];
  }
  seasonsMap[ep.season].push({
    episode: ep.number,
    title: ep.name,
    duration: "24m",
    overview: ep.summary ? ep.summary.replace(/<[^>]*>?/gm, '') : "",
    thumbnail: ep.image ? ep.image.original : "",
    videoUrl: "" // to be filled or handled dynamically
  });
});

const seasonsArray = Object.keys(seasonsMap).sort((a,b)=>a-b).map(s => {
  return {
    season: parseInt(s),
    episodes: seasonsMap[s]
  };
});

const bleachObj = {
  id: "bleach_" + data.id,
  title: "Bleach",
  type: "TV Show",
  year: 2004,
  rating: 8.4,
  age: "TV-14",
  duration: "24m",
  genres: ["Animation", "Action", "Adventure", "Fantasy"],
  poster: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/2Eewbc7HcIxWAyCQjHQ5C3m5c7A.jpg",
  backdrop: "https://image.tmdb.org/t/p/original/4kL1OIPmQhCBLtWbTID5T1XoQ9.jpg",
  videoUrl: "",
  overview: overview,
  director: "Noriyuki Abe",
  cast: ["Masakazu Morita", "Fumiko Orikasa", "Noriaki Sugiyama", "Hiroki Yasumoto", "Kentarō Itō"],
  trending: true,
  seasons: seasonsArray
};

// We will generate the JS code to append to anime-data.js
let outputStr = JSON.stringify(bleachObj, null, 2);

// Fix up the syntax to match JS object without quotes around keys where possible, or just parse it into the array
fs.writeFileSync('bleach_entry.txt', ',\n' + outputStr);
console.log('Done generating bleach_entry.txt');

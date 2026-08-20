const fs = require('fs');

const tvmaze = JSON.parse(fs.readFileSync('tvmaze-simpsons.json', 'utf8'));
const episodes = tvmaze._embedded.episodes;

const seasonsMap = {};
episodes.forEach(ep => {
  if (!seasonsMap[ep.season]) {
    seasonsMap[ep.season] = { season: ep.season, episodes: [] };
  }
  seasonsMap[ep.season].episodes.push({
    episode: ep.number,
    title: ep.name.replace(/"/g, "'")
  });
});

const seasonsArr = Object.values(seasonsMap).sort((a, b) => a.season - b.season);

const simpsonsObj = {
  title: 'The Simpsons',
  type: 'TV Show',
  year: 1989,
  rating: 8.0,
  age: 'TV-14',
  duration: '30m',
  genres: ['Animation', 'Comedy', 'Family'],
  poster: 'https://image.tmdb.org/t/p/w600_and_h900_face/vHILt9y8YjWkQk0Y620X2e1f06x.jpg',
  backdrop: 'https://image.tmdb.org/t/p/original/r0Q6eeN9L1DgQ9pL4HBRXyYc522.jpg',
  videoUrl: '456',
  overview: 'Set in Springfield, the average American town, the show focuses on the antics and everyday adventures of the Simpson family; Homer, Marge, Bart, Lisa and Maggie, as well as a virtual cast of thousands.',
  director: 'Matt Groening',
  cast: ['Dan Castellaneta, Julie Kavner, Nancy Cartwright, Yeardley Smith, Hank Azaria, Harry Shearer'],
  trending: false,
  featured: false,
  is4k: false,
  seasons: seasonsArr
};

// Now read series-data.js
let seriesJs = fs.readFileSync('series-data.js', 'utf8');

// The file should start with 'const SERIES = [' or 'window.SERIES = ['
// Let's find the first '[' character and insert our object right after it.
const bracketIndex = seriesJs.indexOf('[');
if (bracketIndex !== -1) {
  const insertString = '\n  ' + JSON.stringify(simpsonsObj, null, 2).replace(/\n/g, '\n  ') + ',';
  seriesJs = seriesJs.slice(0, bracketIndex + 1) + insertString + seriesJs.slice(bracketIndex + 1);
  fs.writeFileSync('series-data.js', seriesJs);
  console.log('Successfully added The Simpsons!');
} else {
  console.error('Could not find array start in series-data.js');
}

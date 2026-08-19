const seasons = [3, 3, 4, 3];
let seasonStr = '';
for(let i = 0; i < seasons.length; i++) {
  seasonStr += '      {\n        season: ' + (i+1) + ',\n        episodes: [\n';
  for(let j = 0; j < seasons[i]; j++) {
    seasonStr += '          { episode: ' + (j+1) + ', title: \'Episode ' + (j+1) + '\' }' + (j < seasons[i]-1 ? ',' : '') + '\n';
  }
  seasonStr += '        ]\n      }' + (i < seasons.length-1 ? ',' : '') + '\n';
}

const show = `  {
    title: "Sherlock",
    type: "TV Show",
    year: 2010,
    rating: 9.1,
    age: "TV-14",
    duration: "1h 28m",
    genres: [
      "Mystery",
      "Crime",
      "Drama"
    ],
    poster: "https://image.tmdb.org/t/p/w600_and_h900_face/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/tD0hKgbUOpDla9L6Z1q0t8Ww0W5.jpg",
    videoUrl: "19885",
    overview: "A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London.",
    director: "Steven Moffat, Mark Gatiss",
    cast: [
      "Benedict Cumberbatch, Martin Freeman, Una Stubbs, Rupert Graves, Louise Brealey, Mark Gatiss"
    ],
    trending: true,
    featured: true,
    is4k: false,
    seasons: [
${seasonStr}    ]
  },`;

const fs = require('fs');
fs.writeFileSync('sherlock.txt', show);

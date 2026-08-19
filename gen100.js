const seasons = [13, 16, 16, 13, 13, 13, 16];
let seasonStr = '';
for(let i = 0; i < seasons.length; i++) {
  seasonStr += '      {\n        season: ' + (i+1) + ',\n        episodes: [\n';
  for(let j = 0; j < seasons[i]; j++) {
    seasonStr += '          { episode: ' + (j+1) + ', title: \'Episode ' + (j+1) + '\' }' + (j < seasons[i]-1 ? ',' : '') + '\n';
  }
  seasonStr += '        ]\n      }' + (i < seasons.length-1 ? ',' : '') + '\n';
}

const show = `  {
    title: "The 100",
    type: "TV Show",
    year: 2014,
    rating: 7.6,
    age: "TV-14",
    duration: "43m",
    genres: [
      "Sci-Fi",
      "Drama",
      "Action"
    ],
    poster: "https://image.tmdb.org/t/p/w600_and_h900_face/wcaB6CCRXmZYjuIG0HM1Xw3lOxc.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/hTExot1sfn7dHZjGrk0VIdv2R5T.jpg",
    videoUrl: "48866",
    overview: "100 years in the future, when the Earth has been abandoned due to radioactivity, the last surviving humans live on an ark orbiting the planet — but the ark won't last forever. So the repressive regime picks 100 expendable juvenile delinquents to send down to Earth to see if the planet is still habitable.",
    director: "Jason Rothenberg",
    cast: [
      "Eliza Taylor, Marie Avgeropoulos, Bob Morley, Lindsey Morgan, Richard Harmon"
    ],
    trending: false,
    featured: false,
    is4k: false,
    seasons: [
${seasonStr}    ]
  }`;

const fs = require('fs');
fs.writeFileSync('the100.txt', show);

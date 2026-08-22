const fs = require('fs');
let code = fs.readFileSync('series-data.js', 'utf8');

// The block I want to remove exactly as it is in the file
const myBlock = `{
    title: 'You',
    type: 'TV Show',
    year: 2018,
    rating: 8,
    age: 'TV-MA',
    duration: '45m',
    genres: ['Mystery', 'Crime', 'Drama'],
    poster: 'https://image.tmdb.org/t/p/w600_and_h900_face/uXZt12k2f63uSg3n3m4x9Tq66Vd.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/mBaXZ95R2OxueZhvQbcEWy2DqyO.jpg',
    videoUrl: '78191',
    overview: 'A dangerously charming, obsessive man goes to extreme measures to insert himself into the lives of women who fascinate him.',
    director: 'Greg Berlanti',
    cast: ['Penn Badgley', 'Victoria Pedretti', 'Elizabeth Lail', 'Ambyr Childers'],
    trending: true,
    featured: true,
    is4k: false,
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          { episode: 1, title: 'Pilot', duration: '49m' },
          { episode: 2, title: 'The Last Nice Guy in New York', duration: '46m' },
          { episode: 3, title: 'Maybe', duration: '43m' },
          { episode: 4, title: 'The Captain', duration: '43m' }
        ]
      }
    ]
  },
  `;

// Instead of string match, I will use regex to find and remove the 'You' object I previously injected.
code = code.replace(/\{\s*title:\s*'You'[\s\S]*?\}\s*\]\s*\},?\s*/m, '');

// Now we format the new block
const seasonsArr = [1,2,3,4,5].map(s => `
      {
        season: ${s},
        episodes: [
${[1,2,3,4,5,6,7,8,9,10].map(e => `          {
            episode: ${e},
            title: 'Episode ${e}'
          }`).join(',\n')}
        ]
      }`).join(',');

const youBlock = `
    title: 'You',
    type: 'TV Show',
    year: 2018,
    rating: 8.0,
    age: 'TV-MA',
    duration: '45m',
    genres: [
      'Mystery',
      'Crime',
      'Drama'
    ],
    poster: 'https://image.tmdb.org/t/p/w600_and_h900_face/uXZt12k2f63uSg3n3m4x9Tq66Vd.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/mBaXZ95R2OxueZhvQbcEWy2DqyO.jpg',
    videoUrl: '78191',
    overview: 'A dangerously charming, obsessive man goes to extreme measures to insert himself into the lives of women who fascinate him.',
    director: 'Greg Berlanti',
    cast: [
      'Penn Badgley',
      'Victoria Pedretti',
      'Elizabeth Lail',
      'Ambyr Childers'
    ],
    trending: false,
    featured: false,
    is4k: false,
    seasons: [${seasonsArr}
    ]`;

// We want to insert it at page 6 (index 100 to 119). So index 100.
// Let's split the code by `  },\n  {` to get array elements.
let parts = code.split('  },\n  {');
if (parts.length > 100) {
  parts.splice(100, 0, youBlock);
  code = parts.join('  },\n  {');
  fs.writeFileSync('series-data.js', code);
  console.log('Successfully inserted at page 6 (index 100).');
} else {
  // If not enough items, just append to the end.
  parts.push(youBlock);
  code = parts.join('  },\n  {');
  fs.writeFileSync('series-data.js', code);
  console.log('Not enough items, appended to the end.');
}

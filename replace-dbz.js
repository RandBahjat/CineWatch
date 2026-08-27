const fs = require('fs');
let content = fs.readFileSync('anime-data.js', 'utf8');

const startIdx = content.indexOf('title: "Dragon Ball Z Kai"');
if (startIdx === -1) {
    console.log("DBZ Kai not found");
    process.exit(1);
}

// Find start of object
const openBrace = content.lastIndexOf('{', startIdx);
if (openBrace === -1) {
    console.log("Could not find start of DBZ Kai object");
    process.exit(1);
}

// Find the end of DBZ Kai object
// Since DBZ Kai is likely the last object, let's find the animeSlug for it, and then find its seasons array.
const slugIdx = content.indexOf('animeSlug: "dragon-ball-z-kai"', startIdx);
const seasonsIdx = content.indexOf('seasons:', slugIdx);
// Find the end of the seasons array
const nextAnime = content.indexOf('animeSlug:', seasonsIdx);
let closeBrace;
if (nextAnime !== -1) {
    // If there is another anime, find the title before it
    const nextTitle = content.lastIndexOf('title: "', nextAnime);
    closeBrace = content.lastIndexOf('}', nextTitle);
} else {
    // No next anime, so it's the last one
    const lastArrayClose = content.lastIndexOf(']');
    closeBrace = content.lastIndexOf('}', lastArrayClose);
}

if (closeBrace === -1) {
    console.log("Could not find end of DBZ Kai object");
    process.exit(1);
}

// The string to replace
let toReplace = content.substring(openBrace, closeBrace + 1);

// Generate new DBZ Kai string
const newDbz = `  {
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
    poster: "https://image.tmdb.org/t/p/w600_and_h900_face/dkuJWQWbJ3W753X7F81k2MtdrXq.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/vI3n2tM32JEqB3kR58sN7m7aZkF.jpg",
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

let seasonsCount = [26, 26, 25, 20, 35, 26];
let currentEpTotal = 1;
let seasonsStr = '';
for (let s = 0; s < seasonsCount.length; s++) {
    seasonsStr += '      {\n';
    seasonsStr += '        season: ' + (s + 1) + ',\n';
    seasonsStr += '        episodes: [\n';
    
    let count = seasonsCount[s];
    for (let e = 0; e < count; e++) {
        seasonsStr += '          {\n';
        seasonsStr += '            episode: ' + (e + 1) + ',\n';
        seasonsStr += '            title: "Episode ' + (e + 1) + '"\n';
        seasonsStr += '          }' + (e === count - 1 ? '' : ',') + '\n';
        currentEpTotal++;
    }
    
    seasonsStr += '        ]\n';
    seasonsStr += '      }' + (s === seasonsCount.length - 1 ? '' : ',') + '\n';
}

const finalNewDbz = newDbz + seasonsStr + '    ]\n  }';

// replace only the FIRST occurrence of toReplace to be safe
content = content.replace(toReplace, finalNewDbz.trim());
fs.writeFileSync('anime-data.js', content);
console.log("DBZ Kai replaced successfully.");

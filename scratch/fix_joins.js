const fs = require('fs');
let text = fs.readFileSync('movie.js', 'utf8');

text = text.replace(/const genresList = \(movie\.genres \|\| \[\]\)\.slice\(0, 3\)\.map\(translateGenre\)\.join\([^)]+\);/g, 'const genresList = (movie.genres || []).slice(0, 3).map(translateGenre).join(" &bull; ");');
text = text.replace(/document\.getElementById\("detailsGenres"\)\.innerHTML = movie\.genres\.map\(translateGenre\)\.join\([^)]+\);/g, 'document.getElementById("detailsGenres").innerHTML = movie.genres.map(translateGenre).join(" &bull; ");');

fs.writeFileSync('movie.js', text, 'utf8');
console.log('Fixed joins');

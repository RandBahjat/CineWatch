const fs = require('fs');
let text = fs.readFileSync('movie.js', 'utf8');

// Fix .99 prices
text = text.replace(/price: "8"/g, 'price: "7.99"');
text = text.replace(/price: "18"/g, 'price: "17.99"');
text = text.replace(/price: "100"/g, 'price: "99.99"');
text = text.replace(/price: "15"/g, 'price: "14.99"');
text = text.replace(/price: "50"/g, 'price: "49.99"');
text = text.replace(/price: "150"/g, 'price: "149.99"');
text = text.replace(/price: "20"/g, 'price: "19.99"');
text = text.replace(/price: "200"/g, 'price: "199.99"');

// Fix genresList join (find the specific line)
// The corrupted character is sometimes read as ' â€¢ ' by Node or A,A by PowerShell.
// We just replace whatever is inside the .join() for these specific map(translateGenre) calls.
text = text.replace(/const genresList = \(movie\.genres \|\| \[\]\)\.slice\(0, 3\)\.map\(translateGenre\)\.join\([^)]+\);/g, 'const genresList = (movie.genres || []).slice(0, 3).map(translateGenre).join(" &bull; ");');
text = text.replace(/document\.getElementById\("detailsGenres"\)\.innerHTML = movie\.genres\.map\(translateGenre\)\.join\([^)]+\);/g, 'document.getElementById("detailsGenres").innerHTML = movie.genres.map(translateGenre).join(" &bull; ");');

// Fix "CineWatch - Pure Vanilla JavaScript"
text = text.replace(/CineWatch.*Pure Vanilla JavaScript/, 'CineWatch - Pure Vanilla JavaScript');

fs.writeFileSync('movie.js', text, 'utf8');
console.log('Fixed prices and joins');

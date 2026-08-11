const fs = require('fs');
const code = fs.readFileSync('movie.js', 'utf8');

// We need to parse MOVIES. It's a huge array. We can just use a regex to grab all titles, or extract the array and eval it.
// Eval is fine for a local check script.
const start = code.indexOf('const MOVIES = [');
const end = code.indexOf('];\n\n// Apply Featured');
if (start !== -1 && end !== -1) {
  const arrayCode = code.slice(start + 15, end + 1);
  const MOVIES = eval(arrayCode);
  const titles = MOVIES.map(m => m.title);
  const duplicates = titles.filter((item, index) => titles.indexOf(item) !== index);
  console.log("Total Movies:", titles.length);
  console.log("Duplicate Titles:", duplicates);
} else {
  console.log("Could not find MOVIES array.");
}

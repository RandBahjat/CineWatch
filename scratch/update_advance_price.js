const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'cinewatch-app', 'movie.js');
if (fs.existsSync(file)) {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(
    'quarterly: { price: "25", iqd: "", period: "/ 3 mo", btnText: "Upgrade to Advanced" }',
    'quarterly: { price: "18", iqd: "", period: "/ 3 mo", btnText: "Upgrade to Advanced" }'
  );
  fs.writeFileSync(file, c, 'utf8');
  console.log('Updated cinewatch-app/movie.js');
}

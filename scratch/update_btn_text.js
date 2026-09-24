const fs = require('fs');
const path = require('path');

function updateBtnText(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    'btnText: "Claim Advanced Annual"',
    'btnText: "Upgrade to Advanced"'
  );
  content = content.replace(
    'btnText: "Claim Pro Annual"',
    'btnText: "Upgrade to Pro"'
  );
  content = content.replace(
    'btnText: "Claim Ultimate Pass ($100)"',
    'btnText: "Upgrade to Ultimate"'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated yearly btnText in', filePath);
}

updateBtnText(path.join(__dirname, '..', 'movie.js'));
updateBtnText(path.join(__dirname, '..', 'cinewatch-app', 'movie.js'));

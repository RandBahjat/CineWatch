const fs = require('fs');
const path = require('path');

function updateBillingText(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace('<span>Monthly</span>', '<span>Month</span>');
  content = content.replace('<span>Yearly</span>', '<span>Year</span>');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated Month/Year text in', filePath);
}

updateBillingText(path.join(__dirname, '..', 'index.html'));
updateBillingText(path.join(__dirname, '..', 'cinewatch-app', 'index.html'));

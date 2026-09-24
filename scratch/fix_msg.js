const fs = require('fs');

['movie.js', 'cinewatch-app/movie.js'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  const oldStr = 'const msg = encodeURIComponent(`Hello CineWatch! I would like to activate ${tierData.name} ($${tierData.price} / ${tierData.iqd}).\\nMy CineWatch Username: ${username}`);';
  const newStr = 'const priceDisplay = tierData.iqd ? `$${tierData.price} (${tierData.iqd})` : `$${tierData.price}`;\n  const msg = encodeURIComponent(`Hello CineWatch! I would like to activate ${tierData.name} (${priceDisplay}).\\nMy CineWatch Username: ${username}`);';

  if (code.includes(oldStr)) {
    code = code.replace(oldStr, newStr);
    fs.writeFileSync(file, code, 'utf8');
    console.log('Fixed msg in:', file);
  } else {
    console.log('oldStr not found in:', file);
  }
});

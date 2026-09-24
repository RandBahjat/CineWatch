const fs = require('fs');

['movie.js', 'cinewatch-app/movie.js'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  code = code.replace(
    'const priceDisplay = tierData.iqd ? `${tierData.price} (${tierData.iqd})` : `${tierData.price}`;',
    () => 'const priceDisplay = tierData.iqd ? `$' + '{tierData.price} (${tierData.iqd})` : `$' + '{tierData.price}`;'
  );

  fs.writeFileSync(file, code, 'utf8');
  console.log('Fixed $ symbol in:', file);
});

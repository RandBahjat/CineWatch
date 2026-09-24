const fs = require('fs');

['movie.js', 'cinewatch-app/movie.js'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let lines = fs.readFileSync(file, 'utf8').split('\n');
  
  // Find the selectVipTier function
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('function selectVipTier(')) {
      // Lines inside selectVipTier:
      // Find the line setting username or price
      for (let j = i; j < i + 35; j++) {
        if (lines[j].includes('priceDisplay') || lines[j].includes('Hello CineWatch! I would like to activate')) {
          // Replace this block cleanly
          lines[j] = '  const priceDisplay = tierData.iqd ? `$${tierData.price} (${tierData.iqd})` : `$${tierData.price}`;';
          // Ensure next line is the msg line
          if (!lines[j+1] || !lines[j+1].includes('Hello CineWatch')) {
            lines.splice(j + 1, 0, '  const msg = encodeURIComponent(`Hello CineWatch! I would like to activate ${tierData.name} (${priceDisplay}).\\nMy CineWatch Username: ${username}`);');
          } else {
            lines[j+1] = '  const msg = encodeURIComponent(`Hello CineWatch! I would like to activate ${tierData.name} (${priceDisplay}).\\nMy CineWatch Username: ${username}`);';
          }
          break;
        }
      }
      break;
    }
  }
  
  fs.writeFileSync(file, lines.join('\n'), 'utf8');
  console.log('Cleanly restored selectVipTier in', file);
});

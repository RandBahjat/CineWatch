const fs = require('fs');

['movie.js', 'cinewatch-app/movie.js'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  // Fix msg line
  code = code.replace(
    /const msg = encodeURIComponent\(`Hello CineWatch! I would like to activate \$\{tierData\.name\} \(\$\{tierData\.price\} \/ \$\{tierData\.iqd\}\)\.\\r?\\nMy CineWatch Username: \$\{username\}`\);/,
    () => "const priceDisplay = tierData.iqd ? `$" + "{tierData.price} (${tierData.iqd})` : `$" + "{tierData.price}`;\n  const msg = encodeURIComponent(`Hello CineWatch! I would like to activate " + "${tierData.name} (${priceDisplay}).\\nMy CineWatch Username: ${username}`);"
  );

  // Fix amount due: replace `${selectedVipTierData.price}` with `$${selectedVipTierData.price}` in wallet box
  code = code.replace(
    /(<span class="wallet-row-label">Amount Due:<\/span>\r?\n\s*<span style="font-weight: 800; color: #fbbf24;">)\$\{selectedVipTierData\.price\}(<\/span>)/,
    (match, p1, p2) => p1 + "$$" + "{selectedVipTierData.price}" + p2
  );

  fs.writeFileSync(file, code, 'utf8');
  console.log('Processed:', file);
});

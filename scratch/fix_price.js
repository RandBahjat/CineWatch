const fs = require('fs');

['movie.js', 'cinewatch-app/movie.js'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  // Replace msg line using function
  code = code.replace(
    /const msg = encodeURIComponent\(`Hello CineWatch! I would like to activate[\s\S]*?\nMy CineWatch Username: \$\{username\}`\);/,
    () => `const priceDisplay = tierData.iqd ? \`$\${tierData.price} (\${tierData.iqd})\` : \`$\${tierData.price}\`;\n  const msg = encodeURIComponent(\`Hello CineWatch! I would like to activate \${tierData.name} (\${priceDisplay}).\\nMy CineWatch Username: \${username}\`);`
  );

  // Replace amount due using function
  code = code.replace(
    '<span style="font-weight: 800; color: #fbbf24;">${selectedVipTierData.price}</span>',
    () => '<span style="font-weight: 800; color: #fbbf24;">$' + '{selectedVipTierData.price}</span>'
  );

  fs.writeFileSync(file, code, 'utf8');
  console.log('Fixed:', file);
});

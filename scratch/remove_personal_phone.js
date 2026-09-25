const fs = require('fs');

// Remove personal phone number from movie.js and cinewatch-app/movie.js
['movie.js', 'cinewatch-app/movie.js'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let js = fs.readFileSync(file, 'utf8');

  // Replace FastPay & ZainCash numbers with a safe placeholder / contact prompt
  js = js.replace(/number:\s*"0774 820 1148"/g, 'number: "Contact Support on Telegram"');
  js = js.replace(/https:\/\/wa\.me\/9647748201148\?text=/g, 'https://wa.me/?text=');

  fs.writeFileSync(file, js, 'utf8');
  console.log('Removed personal phone number from:', file);
});

// Remove from HTML files
['index.html', 'cinewatch-app/index.html'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  html = html.replace(/href="https:\/\/wa\.me\/9647748201148"/g, 'href="https://wa.me/"');

  fs.writeFileSync(file, html, 'utf8');
  console.log('Removed personal phone number from HTML:', file);
});

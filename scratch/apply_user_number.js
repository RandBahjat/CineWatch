const fs = require('fs');

const phoneFormatted = "0774 820 1148";
const phoneInternational = "9647748201148";

// 1. Update movie.js & cinewatch-app/movie.js
['movie.js', 'cinewatch-app/movie.js'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let js = fs.readFileSync(file, 'utf8');

  // FastPay number
  js = js.replace(
    /(fastpay:\s*\{[\s\S]*?number:\s*)"0750 000 0000"/,
    `$1"${phoneFormatted}"`
  );

  // ZainCash number
  js = js.replace(
    /(zaincash:\s*\{[\s\S]*?number:\s*)"0780 000 0000"/,
    `$1"${phoneFormatted}"`
  );

  // WhatsApp link
  js = js.replace(
    /if \(waBtn\) waBtn\.href = `https:\/\/wa\.me\/\?text=\$\{msg\}`;/,
    `if (waBtn) waBtn.href = \`https://wa.me/${phoneInternational}?text=\${msg}\`;`
  );

  fs.writeFileSync(file, js, 'utf8');
  console.log('Updated JS with phone number:', file);
});

// 2. Update index.html & cinewatch-app/index.html
['index.html', 'cinewatch-app/index.html'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  html = html.replace(
    /href="https:\/\/wa\.me\/"/,
    `href="https://wa.me/${phoneInternational}"`
  );

  fs.writeFileSync(file, html, 'utf8');
  console.log('Updated HTML with WhatsApp phone number:', file);
});

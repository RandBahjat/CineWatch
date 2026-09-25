const fs = require('fs');
const path = require('path');

// 1. UPDATE HTML FILES
const htmlFiles = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'cinewatch-app', 'index.html')
];

htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Update Mastercard label to Qi Card / Mastercard
    content = content.replace(
      /(<label class="checkout-method-card" data-wallet="mastercard">[\s\S]*?<span class="method-name">)[^<]*(<\/span>\s*<span class="method-desc">)[^<]*(<\/span>)/,
      '$1Qi Card / Mastercard$2Qi Services Transfer$3'
    );

    // Remove Visa label completely
    content = content.replace(/\s*<label class="checkout-method-card" data-wallet="visa">[\s\S]*?<\/label>/g, '');

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated HTML file:', file);
  }
});

// 2. UPDATE JS FILES
const jsFiles = [
  path.join(__dirname, '..', 'movie.js'),
  path.join(__dirname, '..', 'cinewatch-app', 'movie.js')
];

jsFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Remove visa object from VIP_WALLETS
    content = content.replace(/\s*visa:\s*\{[\s\S]*?logoSvg:\s*'<svg viewBox="0 0 36 24"[\s\S]*?<\/svg>'\s*\},/g, '');

    // Replace walletKey === 'mastercard' || walletKey === 'visa' with walletKey === 'mastercard'
    content = content.replace(/walletKey === 'mastercard' \|\| walletKey === 'visa'/g, "walletKey === 'mastercard'");

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated JS file:', file);
  }
});

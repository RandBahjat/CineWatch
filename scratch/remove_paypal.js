const fs = require('fs');
const path = require('path');

// 1. REMOVE FROM HTML FILES
const htmlFiles = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'cinewatch-app', 'index.html')
];

htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Remove the paypal label
    content = content.replace(/\s*<label class="checkout-method-card" data-wallet="paypal">[\s\S]*?<\/label>/g, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Removed PayPal from HTML:', file);
  }
});

// 2. REMOVE FROM JS FILES
const jsFiles = [
  path.join(__dirname, '..', 'movie.js'),
  path.join(__dirname, '..', 'cinewatch-app', 'movie.js')
];

jsFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Remove paypal from VIP_WALLETS
    content = content.replace(/\s*paypal:\s*\{[\s\S]*?\},/g, '');
    // Remove paypal branch in renderVipWalletDetails
    content = content.replace(/\s*\} else if \(walletKey === 'paypal'\) \{[\s\S]*?if \(refPrefix\) \{[\s\S]*?refPrefix\.style\.display = 'flex';[\s\S]*?refPrefix\.textContent = '@';[\s\S]*?\}/g, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Removed PayPal from JS:', file);
  }
});

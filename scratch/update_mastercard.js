const fs = require('fs');

// 1. Update HTML files
['index.html', 'cinewatch-app/index.html'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  html = html.replace(
    /<button class="wallet-tab active" data-wallet="qicard">[\s\S]*?<\/button>/,
    `<button class="wallet-tab active" data-wallet="mastercard">
                        <span class="wallet-badge-dot" style="background:#f59e0b;"></span> Mastercard
                    </button>`
  );

  fs.writeFileSync(file, html, 'utf8');
  console.log('Updated HTML:', file);
});

// 2. Update JS files
['movie.js', 'cinewatch-app/movie.js'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let js = fs.readFileSync(file, 'utf8');

  js = js.replace(/qicard:\s*\{[\s\S]*?color:\s*"#f59e0b"\s*\}/, `mastercard: {
    name: "Mastercard",
    number: "5241 0000 0000 0000",
    holder: "CineWatch VIP Account",
    note: "Send card-to-card transfer via Paysend, Remitly, your banking app, or contact VIP Support.",
    color: "#f59e0b"
  }`);

  js = js.replace('let currentVipWalletKey = "qicard";', 'let currentVipWalletKey = "mastercard";');
  js = js.replace('VIP_WALLETS[walletKey] || VIP_WALLETS.qicard;', 'VIP_WALLETS[walletKey] || VIP_WALLETS.mastercard;');

  fs.writeFileSync(file, js, 'utf8');
  console.log('Updated JS:', file);
});

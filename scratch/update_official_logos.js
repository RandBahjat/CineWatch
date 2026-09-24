const fs = require('fs');

const svgMastercard = `<svg viewBox="0 0 36 24" width="26" height="17" fill="none" style="display:block;"><circle cx="12" cy="12" r="11" fill="#EB001B"/><circle cx="24" cy="12" r="11" fill="#F79E1B"/><path d="M18 4.254a10.965 10.965 0 0 0-4.57 7.746A10.965 10.965 0 0 0 18 19.746 10.965 10.965 0 0 0 22.57 12 10.965 10.965 0 0 0 18 4.254z" fill="#FF5F00"/></svg>`;

const svgFastpay = `<svg viewBox="0 0 32 32" width="22" height="22" fill="none" style="display:block;"><circle cx="16" cy="16" r="16" fill="#FFC700"/><circle cx="16" cy="16" r="12.5" fill="#E11D48"/><path d="M11 10h10a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1h-6v2.5h4.5a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1H15v3.5a.5.5 0 0 1-.5.5H11a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1z" fill="#FFFFFF"/></svg>`;

const svgZaincash = `<svg viewBox="0 0 32 32" width="22" height="22" fill="none" style="display:block;"><circle cx="16" cy="16" r="16" fill="#007A78"/><circle cx="12" cy="13" r="4.2" fill="#E3007F"/><circle cx="17.5" cy="11.5" r="4" fill="#00B5E2"/><circle cx="20.5" cy="16" r="4" fill="#78BE20"/><circle cx="16" cy="20.5" r="4.2" fill="#FFB81C"/><circle cx="12" cy="17.5" r="3.8" fill="#6C207E"/><circle cx="16" cy="16" r="2.8" fill="#007A78"/><circle cx="16" cy="16" r="1.4" fill="#FFFFFF"/></svg>`;

const svgFib = `<svg viewBox="0 0 32 32" width="22" height="22" fill="none" style="display:block;"><circle cx="16" cy="16" r="16" fill="#0F172A"/><g transform="translate(4, 3) scale(0.68)"><path d="M25.2993 18.1182L19.9895 14.0447L7.87014 4.80315H16.1996C19.1788 4.80315 21.5973 7.22837 21.5973 10.2008C21.5973 11.0182 21.4149 11.7883 21.0906 12.4841L24.948 15.443C25.8667 13.9096 26.4004 12.1193 26.4004 10.2008C26.4004 4.56671 21.8337 0 16.1996 0H0V4.74911L14.0446 15.5309L14.1392 15.5984L21.5027 21.246C21.6108 21.3136 21.7121 21.3811 21.8135 21.4554L21.9148 21.5297C23.2456 22.5633 24.0833 24.2184 24.0023 26.0559C23.8671 28.9473 21.4216 31.1968 18.5303 31.1968H4.8099V20.3948H16.2132H17.0373L10.7818 15.5984H0.0135036V36H18.6114C24.2454 36 28.8122 31.4333 28.8122 25.7992C28.8122 22.7322 27.4611 19.9827 25.3196 18.1115" fill="#4FB498"/></g></svg>`;

const newTabsHtml = `<div class="wallet-tabs" id="vipWalletTabs">
                    <button class="wallet-tab active" data-wallet="mastercard">
                        <span class="wallet-tab-icon">${svgMastercard}</span>
                        <span>Mastercard</span>
                    </button>
                    <button class="wallet-tab" data-wallet="fastpay">
                        <span class="wallet-tab-icon">${svgFastpay}</span>
                        <span>FastPay</span>
                    </button>
                    <button class="wallet-tab" data-wallet="zaincash">
                        <span class="wallet-tab-icon">${svgZaincash}</span>
                        <span>ZainCash</span>
                    </button>
                    <button class="wallet-tab" data-wallet="fib">
                        <span class="wallet-tab-icon">${svgFib}</span>
                        <span>FIB Bank</span>
                    </button>
                </div>`;

// 1. Update HTML files
['index.html', 'cinewatch-app/index.html'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  html = html.replace(/<div class="wallet-tabs" id="vipWalletTabs">[\s\S]*?<\/div>/, newTabsHtml);

  fs.writeFileSync(file, html, 'utf8');
  console.log('Updated HTML tabs:', file);
});

// 2. Update CSS for 4-tab clean grid
['movie.css', 'cinewatch-app/movie.css'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let css = fs.readFileSync(file, 'utf8');

  css = css.replace(
    /\.wallet-tab\s*\{\s*flex:\s*1\s*1\s*calc\(33\.333%\s*-\s*0\.65rem\);/,
    `.wallet-tab {
  flex: 1 1 calc(25% - 0.65rem);`
  );

  fs.writeFileSync(file, css, 'utf8');
  console.log('Updated CSS wallet-tab width:', file);
});

// 3. Update JS VIP_WALLETS (removed USDT, updated official logos)
['movie.js', 'cinewatch-app/movie.js'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let js = fs.readFileSync(file, 'utf8');

  const oldWalletsRegex = /const VIP_WALLETS = \{[\s\S]*?\n\};/;
  const newWallets = `const VIP_WALLETS = {
  mastercard: {
    name: "Mastercard",
    number: "5241 0000 0000 0000",
    holder: "CineWatch VIP Account",
    note: "Send card-to-card transfer via Paysend, Remitly, your banking app, or contact VIP Support.",
    color: "#f59e0b",
    logoSvg: '${svgMastercard.replace(/'/g, "\\'")}'
  },
  fastpay: {
    name: "FastPay",
    number: "0750 000 0000",
    holder: "CineWatch VIP",
    note: "Send payment via FastPay mobile app to this number.",
    color: "#e11d48",
    logoSvg: '${svgFastpay.replace(/'/g, "\\'")}'
  },
  zaincash: {
    name: "ZainCash",
    number: "0780 000 0000",
    holder: "CineWatch VIP",
    note: "Send cash transfer via ZainCash wallet to this phone number.",
    color: "#059669",
    logoSvg: '${svgZaincash.replace(/'/g, "\\'")}'
  },
  fib: {
    name: "First Iraqi Bank (FIB)",
    number: "IQ00 FIB0 0000 0000 0000",
    holder: "CineWatch Streaming",
    note: "Transfer using First Iraqi Bank (FIB) app to this IBAN / Account.",
    color: "#4fb498",
    logoSvg: '${svgFib.replace(/'/g, "\\'")}'
  }
};`;

  if (oldWalletsRegex.test(js)) {
    js = js.replace(oldWalletsRegex, newWallets);
    fs.writeFileSync(file, js, 'utf8');
    console.log('Updated JS VIP_WALLETS:', file);
  }
});

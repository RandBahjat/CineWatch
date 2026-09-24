const fs = require('fs');

// Ensure fastpay-logo.png is in both root and cinewatch-app
if (fs.existsSync('scratch/fastpay_clogo.png')) {
  fs.copyFileSync('scratch/fastpay_clogo.png', 'fastpay-logo.png');
  if (fs.existsSync('cinewatch-app')) {
    fs.copyFileSync('scratch/fastpay_clogo.png', 'cinewatch-app/fastpay-logo.png');
  }
}

const svgMastercard = `<svg viewBox="0 0 36 24" width="26" height="17" fill="none" style="display:block;"><circle cx="12" cy="12" r="11" fill="#EB001B"/><circle cx="24" cy="12" r="11" fill="#F79E1B"/><path d="M18 4.254a10.965 10.965 0 0 0-4.57 7.746A10.965 10.965 0 0 0 18 19.746 10.965 10.965 0 0 0 22.57 12 10.965 10.965 0 0 0 18 4.254z" fill="#FF5F00"/></svg>`;

const svgUsdt = `<svg viewBox="0 0 32 32" width="20" height="20" fill="none" style="display:block;"><circle cx="16" cy="16" r="16" fill="#26A17B"/><path d="M17.922 17.383c-.11.008-.68.04-1.637.04-.766 0-1.393-.031-1.57-.04v-2.316h3.207v2.316zm-3.207-3.15v-1.922h7.457v-3.084H9.828v3.084h7.457v1.922H8.383v3.424c1.826.69 4.887 1.15 8.527 1.15 3.652 0 6.703-.46 8.539-1.15v-3.424H14.715z" fill="#FFFFFF"/></svg>`;

const fastpayTabLogo = `<span class="wallet-tab-icon" style="background:#ffffff; padding:2px 6px; border-radius:5px; display:inline-flex; align-items:center; justify-content:center; height:20px;"><img src="fastpay-logo.png" alt="FastPay" style="height:13px; width:auto; max-width:48px; object-fit:contain; display:block;" /></span>`;

const fastpayBoxLogo = `<span class="wallet-tab-icon" style="background:#ffffff; padding:3px 8px; border-radius:6px; display:inline-flex; align-items:center; justify-content:center; height:24px;"><img src="fastpay-logo.png" alt="FastPay" style="height:16px; width:auto; max-width:65px; object-fit:contain; display:block;" /></span>`;

const svgZaincash = `<svg viewBox="0 0 52 52" width="22" height="22" fill="none" style="display:block;"><circle cx="26" cy="26" r="26" fill="#007A78"/><g transform="translate(4.5, 3) scale(0.8)"><path d="m 47.863425,22.3321 c 0,-4.995 -3.8425,-8.775 -9.32625,-8.3538 -11.635,0.8925 -13.1375,14.1288 -5.56375,14.975 7.92,0.885 10.755,-7.49 10.9075,-7.9612 0.001,-0.01 0.007,0 0.007,0 0.0175,0.5675 0.43875,12.0912 -11.31125,12.0912 -6.1075,0 -9.24875,-4.99 -9.24875,-9.315 0,-6.4112 6.235,-12.7862 15.03375,-13.1262 4.9275,-0.1913 8.17375,0.9737 10.7175,3.5162 5.18375,5.1838 3.69125,14.9025 -0.50375,19.7025 -6.66,7.6175 -16.02,9.5538 -24.74125,5.6425 -8.72125,-3.91 -11.8475,-15.2325 -6.56125,-24.7062 1.94375,-3.485 9.00375,-11.2488 21.13625,-11.2488 15.40375,0 23.215,10.9188 21.80375,23.745 -1.08,9.8288 -7.05,16.9463 -9.8175,19.9538 -12.15875,13.215 -30.02625,15.8488 -41.2862499,8.9763 -6.19625,-3.7813 -9.79875005,-10.5713 -8.99875005,-18.2525 0.68625,5.5487 3.45250005,10.3487 8.05500005,13.4875 9.2024999,6.2762 24.5924999,7.1387 35.7149999,-5.0925 -11.1775,8.3487 -24.24,8.2237 -33.15875,2.4125 C 2.5366751,43.4471 0.28667505,32.8034 4.2941751,22.2759 c -2.01125,9.385 1.22,18.0862 8.3187499,22.62 11.06375,7.0675 27.18375,3.0037 37.34125,-8.3775 3.46125,-3.8788 5.44625,-9.11 5.3825,-13.885 -0.1075,-7.96 -5.655,-15.1063 -16.855,-15.1063 -11.49625,0 -19.39375,8.8863 -19.39375,16.2838 0,8.2112 5.635,12.8962 12.98625,12.8962 7.2675,0 15.78875,-4.5862 15.78875,-14.3762" fill="#FFFFFF"/></g></svg>`;

const svgFib = `<svg viewBox="0 0 32 32" width="22" height="22" fill="none" style="display:block;"><circle cx="16" cy="16" r="16" fill="#0F172A"/><g transform="translate(4, 3) scale(0.68)"><path d="M25.2993 18.1182L19.9895 14.0447L7.87014 4.80315H16.1996C19.1788 4.80315 21.5973 7.22837 21.5973 10.2008C21.5973 11.0182 21.4149 11.7883 21.0906 12.4841L24.948 15.443C25.8667 13.9096 26.4004 12.1193 26.4004 10.2008C26.4004 4.56671 21.8337 0 16.1996 0H0V4.74911L14.0446 15.5309L14.1392 15.5984L21.5027 21.246C21.6108 21.3136 21.7121 21.3811 21.8135 21.4554L21.9148 21.5297C23.2456 22.5633 24.0833 24.2184 24.0023 26.0559C23.8671 28.9473 21.4216 31.1968 18.5303 31.1968H4.8099V20.3948H16.2132H17.0373L10.7818 15.5984H0.0135036V36H18.6114C24.2454 36 28.8122 31.4333 28.8122 25.7992C28.8122 22.7322 27.4611 19.9827 25.3196 18.1115" fill="#4FB498"/></g></svg>`;

const tabsWithCryptoHtml = `<div class="wallet-tabs" id="vipWalletTabs">
                    <button class="wallet-tab active" data-wallet="mastercard">
                        <span class="wallet-tab-icon">${svgMastercard}</span>
                        <span>Mastercard</span>
                    </button>
                    <button class="wallet-tab" data-wallet="usdt">
                        <span class="wallet-tab-icon">${svgUsdt}</span>
                        <span>USDT / Crypto</span>
                    </button>
                    <button class="wallet-tab" data-wallet="fastpay">
                        ${fastpayTabLogo}
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

// 1. Update HTML
['index.html', 'cinewatch-app/index.html'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/<div class="wallet-tabs" id="vipWalletTabs">[\s\S]*?<\/div>/, tabsWithCryptoHtml);
  fs.writeFileSync(file, html, 'utf8');
  console.log('Updated HTML tabs with Crypto & Official Logos:', file);
});

// 2. Update CSS for 5 tabs
['movie.css', 'cinewatch-app/movie.css'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let css = fs.readFileSync(file, 'utf8');
  css = css.replace(
    /\.wallet-tab\s*\{\s*flex:\s*1\s*1\s*calc\(25%\s*-\s*0\.65rem\);/,
    `.wallet-tab {
  flex: 1 1 calc(33.333% - 0.65rem);`
  );
  fs.writeFileSync(file, css, 'utf8');
  console.log('Updated CSS wallet-tab width:', file);
});

// 3. Update JS
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
  usdt: {
    name: "USDT / Crypto (TRC-20 & Binance)",
    number: "TYu8kExampleTRC20Address... (Click Copy)",
    holder: "Network: TRON (TRC-20) / Binance Pay ID",
    note: "Send USDT from Binance, Trust Wallet, Revolut, or any international crypto app. Instant worldwide.",
    color: "#10b981",
    logoSvg: '${svgUsdt.replace(/'/g, "\\'")}'
  },
  fastpay: {
    name: "FastPay",
    number: "0750 000 0000",
    holder: "CineWatch VIP",
    note: "Send payment via FastPay mobile app to this number.",
    color: "#e11d48",
    logoSvg: '${fastpayBoxLogo.replace(/'/g, "\\'")}'
  },
  zaincash: {
    name: "ZainCash",
    number: "0780 000 0000",
    holder: "CineWatch VIP",
    note: "Send cash transfer via ZainCash wallet to this phone number.",
    color: "#007a78",
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
    console.log('Updated JS VIP_WALLETS with Crypto and Official Logos:', file);
  }
});

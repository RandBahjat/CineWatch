const fs = require('fs');

const svgMastercard = `<svg viewBox="0 0 36 24" width="26" height="17" fill="none" style="display:block;"><circle cx="12" cy="12" r="11" fill="#EB001B"/><circle cx="24" cy="12" r="11" fill="#F79E1B"/><path d="M18 4.254a10.965 10.965 0 0 0-4.57 7.746A10.965 10.965 0 0 0 18 19.746 10.965 10.965 0 0 0 22.57 12 10.965 10.965 0 0 0 18 4.254z" fill="#FF5F00"/></svg>`;
const svgUsdt = `<svg viewBox="0 0 32 32" width="20" height="20" fill="none" style="display:block;"><circle cx="16" cy="16" r="16" fill="#26A17B"/><path d="M17.922 17.383c-.11.008-.68.04-1.637.04-.766 0-1.393-.031-1.57-.04v-2.316h3.207v2.316zm-3.207-3.15v-1.922h7.457v-3.084H9.828v3.084h7.457v1.922H8.383v3.424c1.826.69 4.887 1.15 8.527 1.15 3.652 0 6.703-.46 8.539-1.15v-3.424H14.715z" fill="#FFFFFF"/></svg>`;
const svgFastpay = `<svg viewBox="0 0 32 32" width="20" height="20" fill="none" style="display:block;"><rect width="32" height="32" rx="7" fill="#E11D48"/><path d="M9 8h14a1 1 0 0 1 1 1v2.6a1 1 0 0 1-1 1h-8.2v3.4h6.5a1 1 0 0 1 1 1v2.6a1 1 0 0 1-1 1h-6.5V25H9a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#FFFFFF"/></svg>`;
const svgZaincash = `<svg viewBox="0 0 32 32" width="20" height="20" fill="none" style="display:block;"><rect width="32" height="32" rx="7" fill="#059669"/><path d="M8.5 9h15v3.2L12.5 20.8H24V24H8.5v-3.2L19.5 12.2H8.5V9z" fill="#FFFFFF"/></svg>`;
const svgFib = `<svg viewBox="0 0 32 32" width="20" height="20" fill="none" style="display:block;"><rect width="32" height="32" rx="7" fill="#1E40AF"/><text x="16" y="21" font-family="'Inter', -apple-system, BlinkMacSystemFont, sans-serif" font-weight="900" font-size="11.5" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">FIB</text></svg>`;

const newTabsHtml = `<div class="wallet-tabs" id="vipWalletTabs">
                    <button class="wallet-tab active" data-wallet="mastercard">
                        <span class="wallet-tab-icon">${svgMastercard}</span>
                        <span>Mastercard</span>
                    </button>
                    <button class="wallet-tab" data-wallet="usdt">
                        <span class="wallet-tab-icon">${svgUsdt}</span>
                        <span>USDT / Crypto</span>
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

// 1. Update HTML
['index.html', 'cinewatch-app/index.html'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  html = html.replace(/<div class="wallet-tabs" id="vipWalletTabs">[\s\S]*?<\/div>/, newTabsHtml);

  fs.writeFileSync(file, html, 'utf8');
  console.log('Updated HTML tabs with logos:', file);
});

// 2. Update CSS
const cssAddition = `
.wallet-tab-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.wallet-tab:hover .wallet-tab-icon {
  transform: scale(1.08);
}
`;

['movie.css', 'cinewatch-app/movie.css'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let css = fs.readFileSync(file, 'utf8');

  if (!css.includes('.wallet-tab-icon {')) {
    css = css.replace('.wallet-badge-dot {', cssAddition + '\n.wallet-badge-dot {');
    fs.writeFileSync(file, css, 'utf8');
    console.log('Updated CSS with .wallet-tab-icon:', file);
  }
});

// 3. Update JS
['movie.js', 'cinewatch-app/movie.js'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let js = fs.readFileSync(file, 'utf8');

  // Add logos to VIP_WALLETS object
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
    color: "#2563eb",
    logoSvg: '${svgFib.replace(/'/g, "\\'")}'
  }
};`;

  if (oldWalletsRegex.test(js)) {
    js = js.replace(oldWalletsRegex, newWallets);
  }

  // Update renderVipWalletDetails payment method row to display logo
  js = js.replace(
    /<span class="wallet-row-label">Payment Method:<\/span>\r?\n\s*<span style="font-weight: 700; color: #fff;">\$\{w\.name\}<\/span>/,
    `<span class="wallet-row-label">Payment Method:</span>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="wallet-tab-icon">\${w.logoSvg || ''}</span>
        <span style="font-weight: 700; color: #fff;">\${w.name}</span>
      </div>`
  );

  fs.writeFileSync(file, js, 'utf8');
  console.log('Updated JS with logos in VIP_WALLETS and render function:', file);
});

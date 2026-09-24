const fs = require('fs');
const path = require('path');

// 1. Update movie.css for responsive wallet-tabs
function updateCss(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /\.wallet-tabs \{\s*display: flex;\s*gap: 0\.75rem;\s*margin-bottom: 1\.2rem;\s*\}/,
    `.wallet-tabs {
  display: flex;
  gap: 0.65rem;
  margin-bottom: 1.2rem;
  flex-wrap: wrap;
}`
  );

  content = content.replace(
    /\.wallet-tab \{\s*flex: 1;/,
    `.wallet-tab {
  flex: 1 1 calc(33.333% - 0.65rem);
  min-width: 140px;`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated CSS in', filePath);
}

// 2. Update movie.js for VIP_WALLETS and renderVipWalletDetails
function updateJs(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace VIP_WALLETS
  const oldWalletsRegex = /const VIP_WALLETS = \{[\s\S]*?\n\};/;

  const newWallets = `const VIP_WALLETS = {
  qicard: {
    name: "Qi Card (Mastercard)",
    number: "5241 0000 0000 0000",
    holder: "CineWatch VIP Account",
    note: "Transfer via Qi Services app (خدمات كي) to this card number or account IBAN.",
    color: "#f59e0b"
  },
  usdt: {
    name: "USDT / Crypto (TRC-20 & Binance)",
    number: "TYu8kExampleTRC20Address... (Click Copy)",
    holder: "Network: TRON (TRC-20) / Binance Pay ID",
    note: "Send USDT from Binance, Trust Wallet, Revolut, or any international crypto app. Instant worldwide.",
    color: "#10b981"
  },
  fastpay: {
    name: "FastPay",
    number: "0750 000 0000",
    holder: "CineWatch VIP",
    note: "Send payment via FastPay mobile app to this number.",
    color: "#e11d48"
  },
  zaincash: {
    name: "ZainCash",
    number: "0780 000 0000",
    holder: "CineWatch VIP",
    note: "Send cash transfer via ZainCash wallet to this phone number.",
    color: "#059669"
  },
  fib: {
    name: "First Iraqi Bank (FIB)",
    number: "IQ00 FIB0 0000 0000 0000",
    holder: "CineWatch Streaming",
    note: "Transfer using First Iraqi Bank (FIB) app to this IBAN / Account.",
    color: "#2563eb"
  }
};`;

  if (oldWalletsRegex.test(content)) {
    content = content.replace(oldWalletsRegex, newWallets);
  }

  content = content.replace('let currentVipWalletKey = "fastpay";', 'let currentVipWalletKey = "qicard";');

  // Update renderVipWalletDetails
  const oldRenderRegex = /function renderVipWalletDetails\(walletKey\) \{[\s\S]*?\n  const copyBtn = document\.getElementById\("vipCopyWalletBtn"\);/;

  const newRender = `function renderVipWalletDetails(walletKey) {
  currentVipWalletKey = walletKey;
  const container = document.getElementById("walletDetailsBox");
  if (!container) return;

  const w = VIP_WALLETS[walletKey] || VIP_WALLETS.qicard;
  if (!w) return;

  document.querySelectorAll("#vipWalletTabs .wallet-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.wallet === walletKey);
  });

  container.innerHTML = \`
    <div class="wallet-row">
      <span class="wallet-row-label">Payment Method:</span>
      <span style="font-weight: 700; color: #fff;">\${w.name}</span>
    </div>
    <div class="wallet-row">
      <span class="wallet-row-label">Account / Address:</span>
      <div class="wallet-number-wrap">
        <span class="wallet-num-val" id="vipWalletVal">\${w.number}</span>
        <button class="wallet-copy-btn" id="vipCopyWalletBtn" type="button">
          <ion-icon name="copy-outline"></ion-icon> Copy
        </button>
      </div>
    </div>
    <div class="wallet-row">
      <span class="wallet-row-label">Account Details:</span>
      <span style="font-weight: 600; color: rgba(255,255,255,0.85);">\${w.holder}</span>
    </div>
    <div class="wallet-row">
      <span class="wallet-row-label">Amount Due:</span>
      <span style="font-weight: 800; color: #fbbf24;">$\${selectedVipTierData.price}</span>
    </div>
    \${w.note ? \`
    <div class="wallet-note-box" style="margin-top: 12px; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; font-size: 0.82rem; color: rgba(255,255,255,0.8); display: flex; align-items: flex-start; gap: 8px;">
      <ion-icon name="information-circle-outline" style="font-size: 1.15rem; color: #38bdf8; flex-shrink: 0; margin-top: 1px;"></ion-icon>
      <span>\${w.note}</span>
    </div>
    \` : ''}
  \`;

  const copyBtn = document.getElementById("vipCopyWalletBtn");`;

  if (oldRenderRegex.test(content)) {
    content = content.replace(oldRenderRegex, newRender);
  }

  // Update selectVipTier to update checkoutDueAmount
  content = content.replace(
    'if (usdEl) usdEl.textContent = "$" + tierData.price;',
    'if (usdEl) usdEl.textContent = "$" + tierData.price;\n  const dueAmountEl = document.getElementById("checkoutDueAmount");\n  if (dueAmountEl) dueAmountEl.textContent = tierData.price;'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated JS in', filePath);
}

// 3. Update index.html in root and cinewatch-app
function updateHtml(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace checkout view
  const oldCheckoutRegex = /<div class="vip-step-checkout hidden" id="vipStepCheckout">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- Toast Notification Container -->/;

  const newCheckout = `<div class="vip-step-checkout hidden" id="vipStepCheckout">
                <button class="vip-back-btn" id="vipBackToPlansBtn">
                    <ion-icon name="arrow-back-outline"></ion-icon> Back to Plans
                </button>

                <div class="checkout-header">
                    <div class="checkout-title-wrap">
                        <span class="checkout-label">Selected VIP Plan</span>
                        <h3 class="checkout-plan-name notranslate" id="checkoutPlanName">Ultimate (Monthly)</h3>
                    </div>
                    <div class="checkout-price-wrap">
                        <span class="checkout-usd notranslate" id="checkoutPlanUsd">$20</span>
                    </div>
                </div>

                <div class="wallet-selector-title">Select Payment Method:</div>
                <div class="wallet-tabs" id="vipWalletTabs">
                    <button class="wallet-tab active" data-wallet="qicard">
                        <span class="wallet-badge-dot" style="background:#f59e0b;"></span> Qi Card (Mastercard)
                    </button>
                    <button class="wallet-tab" data-wallet="usdt">
                        <span class="wallet-badge-dot" style="background:#10b981;"></span> USDT / Crypto
                    </button>
                    <button class="wallet-tab" data-wallet="fastpay">
                        <span class="wallet-badge-dot" style="background:#e11d48;"></span> FastPay
                    </button>
                    <button class="wallet-tab" data-wallet="zaincash">
                        <span class="wallet-badge-dot" style="background:#059669;"></span> ZainCash
                    </button>
                    <button class="wallet-tab" data-wallet="fib">
                        <span class="wallet-badge-dot" style="background:#2563eb;"></span> FIB Bank
                    </button>
                </div>

                <div class="wallet-details-box" id="walletDetailsBox">
                    <!-- Populated dynamically via JS -->
                </div>

                <!-- International Help Banner -->
                <div class="checkout-intl-banner" style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 12px 16px; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 14px;">
                    <span style="font-size: 1.6rem;">🌍</span>
                    <div style="font-size: 0.84rem; color: rgba(255, 255, 255, 0.88); line-height: 1.45;">
                        <strong style="color: #38bdf8;">Paying from Sweden, UK, US, or International?</strong><br>
                        Need an international Visa/Mastercard direct link, PayPal, or custom transfer? Contact our VIP Admin directly below!
                    </div>
                </div>

                <div class="checkout-instructions">
                    <h4><ion-icon name="information-circle-outline"></ion-icon> How to Complete Your Payment:</h4>
                    <ol>
                        <li>Select your preferred payment method above.</li>
                        <li>Send the exact amount shown (<strong>$<span id="checkoutDueAmount">20</span></strong>) to the card or wallet address.</li>
                        <li>Tap <strong>Telegram</strong> or <strong>WhatsApp</strong> below to send your receipt for instant VIP activation, or submit your Transaction ID below.</li>
                    </ol>
                </div>

                <div class="checkout-actions">
                    <a href="https://t.me/randibajat" target="_blank" rel="noopener noreferrer" class="btn-vip-action btn-telegram-vip" id="vipTelegramBtn">
                        <ion-icon name="paper-plane"></ion-icon> Confirm Receipt via Telegram
                    </a>
                    <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" class="btn-vip-action btn-whatsapp-vip" id="vipWhatsappBtn">
                        <ion-icon name="logo-whatsapp"></ion-icon> Confirm Receipt via WhatsApp
                    </a>
                </div>

                <div class="checkout-manual-form">
                    <div class="manual-form-title">Or Submit Transaction Reference ID:</div>
                    <div class="manual-form-row">
                        <input type="text" id="vipTxIdInput" class="form-control" placeholder="Transaction ID, Receipt Code, or Sender Name">
                        <button class="btn btn-primary" id="vipSubmitTxBtn">Submit for Review</button>
                    </div>
                    <div class="manual-form-status hidden" id="vipSubmitStatus"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notification Container -->`;

  if (oldCheckoutRegex.test(html)) {
    html = html.replace(oldCheckoutRegex, newCheckout);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Updated HTML checkout in', filePath);
  } else {
    console.log('HTML checkout regex failed in', filePath);
  }
}

updateCss(path.join(__dirname, '..', 'movie.css'));
updateCss(path.join(__dirname, '..', 'cinewatch-app', 'movie.css'));

updateJs(path.join(__dirname, '..', 'movie.js'));
updateJs(path.join(__dirname, '..', 'cinewatch-app', 'movie.js'));

updateHtml(path.join(__dirname, '..', 'index.html'));
updateHtml(path.join(__dirname, '..', 'cinewatch-app', 'index.html'));

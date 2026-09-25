const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. New HTML for vipStepCheckout
const newCheckoutHtml = `            <div class="vip-step-checkout hidden" id="vipStepCheckout">
                <div class="checkout-top-bar">
                    <button class="vip-back-btn" id="vipBackToPlansBtn">
                        <ion-icon name="arrow-back-outline"></ion-icon> Back
                    </button>
                    <h2 class="checkout-page-title">Secure Checkout</h2>
                </div>

                <div class="checkout-grid-container">
                    <!-- LEFT COLUMN: Customer & Payment Methods -->
                    <div class="checkout-col-left">
                        <div class="checkout-section-block">
                            <h3 class="checkout-section-title">Customer Details</h3>
                            <div class="checkout-customer-form">
                                <div class="form-group">
                                    <label>CineWatch Username <span class="required">*</span></label>
                                    <input type="text" id="checkoutUsername" class="form-control" placeholder="Guest User" readonly>
                                </div>
                                <div class="form-group">
                                    <label>WhatsApp / Phone (Optional)</label>
                                    <div class="input-phone-wrap">
                                        <span class="phone-prefix">+964</span>
                                        <input type="text" class="form-control" placeholder="77X XXX XXXX">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="checkout-section-block">
                            <h3 class="checkout-section-title">Pay With</h3>
                            <div class="checkout-methods-vertical" id="vipWalletTabs">
                                <label class="checkout-method-card active" data-wallet="fastpay">
                                    <input type="radio" name="payment_method" checked>
                                    <span class="method-icon" style="background:#fff; padding:2px; border-radius:4px;"><img src="fastpay-logo.png" style="height:14px; display:block;"></span>
                                    <div class="method-info">
                                        <span class="method-name">FastPay</span>
                                        <span class="method-desc">No Fees</span>
                                    </div>
                                </label>
                                <label class="checkout-method-card" data-wallet="fib">
                                    <input type="radio" name="payment_method">
                                    <span class="method-icon"><svg viewBox="0 0 32 32" width="22" height="22" fill="none"><circle cx="16" cy="16" r="16" fill="#0F172A"/><path d="M22.203 14.32L18.592 11.55L10.352 5.266H16.017C18.043 5.266 19.688 6.916 19.688 8.938C19.688 9.494 19.564 10.018 19.343 10.491L21.967 12.503C22.591 11.46 22.954 10.243 22.954 8.938C22.954 5.105 19.849 2 16.017 2H5V5.229L14.55 12.563L14.615 12.609L19.622 16.451L19.7 16.502L19.768 16.552C20.673 17.255 21.243 18.38 21.188 19.629C21.096 21.597 19.432 23.126 17.465 23.126H8.13V15.778H15.885H16.445L12.191 12.609H4.869V26.4H17.521C21.353 26.4 24.458 23.295 24.458 19.462C24.458 17.377 23.539 15.507 22.083 14.234" fill="#4FB498"/></svg></span>
                                    <div class="method-info">
                                        <span class="method-name">FIB Bank</span>
                                        <span class="method-desc">Direct Transfer</span>
                                    </div>
                                </label>
                                <label class="checkout-method-card" data-wallet="zaincash">
                                    <input type="radio" name="payment_method">
                                    <span class="method-icon"><svg viewBox="0 0 52 52" width="22" height="22" fill="none"><circle cx="26" cy="26" r="26" fill="#007A78"/><path d="M42.79 20.866c0-3.996-3.074-7.02-7.46-6.683-9.309.714-10.51 11.303-4.451 11.98 6.336.708 8.604-5.992 8.726-6.369.014.454.35 9.673-9.049 9.673-4.886 0-7.399-3.992-7.399-7.452 0-5.129 4.988-10.229 12.027-10.5 3.942-.153 6.54 .779 8.574 2.813 4.147 4.147 2.953 11.922-.403 15.762-5.328 6.094-12.816 7.643-19.793 4.514-6.977-3.128-9.478-12.186-5.249-19.765 1.555-2.788 7.203-8.999 16.909-8.999 12.323 0 18.572 8.735 17.443 18.996-.864 7.863-5.64 13.557-7.854 15.963-9.727 10.572-24.021 12.679-33.029 7.181-4.957-3.025-7.839-8.457-7.199-14.602.549-4.439 2.762-8.279 6.444-10.79 7.362 5.021 19.674 5.711 28.572-4.074-8.942 6.679-19.392 6.579-26.527 1.93C4.529 37.758 2.73 29.243 5.935 20.82c-1.609 7.508.976 14.469 6.655 18.096 8.851 5.654 21.747 2.403 29.873-6.702 2.769-3.103 4.357-7.288 4.306-11.108-.086-6.368-4.524-12.085-13.484-12.085-9.197 0-15.515 7.109-15.515 13.027 0 6.569 4.508 10.317 10.389 10.317 5.814 0 12.631-3.669 12.631-11.501" fill="#fff"/></svg></span>
                                    <div class="method-info">
                                        <span class="method-name">ZainCash</span>
                                        <span class="method-desc">Wallet Pay</span>
                                    </div>
                                </label>
                                <label class="checkout-method-card" data-wallet="usdt">
                                    <input type="radio" name="payment_method">
                                    <span class="method-icon"><svg viewBox="0 0 32 32" width="20" height="20" fill="none"><circle cx="16" cy="16" r="16" fill="#26A17B"/><path d="M17.922 17.383c-.11.008-.68.04-1.637.04-.766 0-1.393-.031-1.57-.04v-2.316h3.207v2.316zm-3.207-3.15v-1.922h7.457v-3.084H9.828v3.084h7.457v1.922H8.383v3.424c1.826.69 4.887 1.15 8.527 1.15 3.652 0 6.703-.46 8.539-1.15v-3.424H14.715z" fill="#FFFFFF"/></svg></span>
                                    <div class="method-info">
                                        <span class="method-name">USDT / Crypto</span>
                                        <span class="method-desc">TRC-20 Network</span>
                                    </div>
                                </label>
                                <label class="checkout-method-card" data-wallet="mastercard">
                                    <input type="radio" name="payment_method">
                                    <span class="method-icon"><svg viewBox="0 0 36 24" width="26" height="17" fill="none"><circle cx="12" cy="12" r="11" fill="#EB001B"/><circle cx="24" cy="12" r="11" fill="#F79E1B"/><path d="M18 4.254a10.965 10.965 0 0 0-4.57 7.746A10.965 10.965 0 0 0 18 19.746 10.965 10.965 0 0 0 22.57 12 10.965 10.965 0 0 0 18 4.254z" fill="#FF5F00"/></svg></span>
                                    <div class="method-info">
                                        <span class="method-name">Mastercard</span>
                                        <span class="method-desc">Card Transfer</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: Order Summary & Actions -->
                    <div class="checkout-col-right">
                        <div class="checkout-section-block summary-block">
                            <h3 class="checkout-section-title">Order Summary</h3>
                            <div class="summary-row">
                                <span class="summary-label">VIP Plan</span>
                                <span class="summary-value" id="checkoutPlanName">Ultimate (Monthly)</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-label">Amount</span>
                                <span class="summary-value" id="checkoutPlanUsd">$20</span>
                            </div>
                            <hr class="summary-divider">
                            <div class="summary-row total-row">
                                <span class="summary-label">Total to Pay</span>
                                <span class="summary-value total-price">$<span id="checkoutDueAmount">20</span></span>
                            </div>

                            <div class="payment-instruction-box" id="walletDetailsBox">
                                <!-- Populated dynamically via JS -->
                            </div>

                            <div class="checkout-actions-vertical">
                                <button class="btn-checkout-confirm btn-telegram" id="vipTelegramBtn">
                                    <ion-icon name="paper-plane"></ion-icon> Confirm via Telegram
                                </button>
                                <button class="btn-checkout-confirm btn-whatsapp" id="vipWhatsappBtn">
                                    <ion-icon name="logo-whatsapp"></ion-icon> Confirm via WhatsApp
                                </button>
                                <p class="action-hint">Manual verification required after payment.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

// 2. New CSS
const newCss = `
/* --- New GameMasterz Style Checkout --- */
.checkout-top-bar {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding-bottom: 1rem;
}
.checkout-page-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
}
.checkout-grid-container {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}
.checkout-section-block {
  background: #111827;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
}
.checkout-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #94a3b8;
  margin-top: 0;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.checkout-customer-form .form-group {
  margin-bottom: 16px;
}
.checkout-customer-form label {
  display: block;
  font-size: 0.85rem;
  color: #cbd5e1;
  margin-bottom: 6px;
}
.checkout-customer-form .form-control {
  width: 100%;
  background: #1e293b;
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.95rem;
}
.input-phone-wrap {
  display: flex;
  align-items: center;
  background: #1e293b;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  overflow: hidden;
}
.phone-prefix {
  padding: 10px 14px;
  background: #0f172a;
  color: #94a3b8;
  font-size: 0.95rem;
  border-right: 1px solid rgba(255,255,255,0.1);
}
.input-phone-wrap .form-control {
  border: none;
  border-radius: 0;
  flex: 1;
}
.checkout-methods-vertical {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.checkout-method-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #1e293b;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.checkout-method-card:hover {
  background: #273549;
}
.checkout-method-card.active {
  background: rgba(56, 189, 248, 0.08);
  border-color: #38bdf8;
}
.checkout-method-card input[type="radio"] {
  accent-color: #38bdf8;
  width: 18px;
  height: 18px;
  margin: 0;
  cursor: pointer;
}
.method-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}
.method-info {
  display: flex;
  flex-direction: column;
}
.method-name {
  font-weight: 600;
  color: #fff;
  font-size: 0.95rem;
}
.method-desc {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 2px;
}
.summary-block {
  background: #0f172a;
  border: 1px solid rgba(255,255,255,0.08);
}
.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.95rem;
}
.summary-label {
  color: #94a3b8;
}
.summary-value {
  color: #fff;
  font-weight: 600;
}
.summary-divider {
  border: 0;
  height: 1px;
  background: rgba(255,255,255,0.08);
  margin: 16px 0;
}
.total-row {
  font-size: 1.1rem;
}
.total-price {
  color: #fbbf24;
  font-weight: 800;
}
.payment-instruction-box {
  margin-top: 20px;
  background: rgba(56, 189, 248, 0.05);
  border: 1px dashed rgba(56, 189, 248, 0.3);
  border-radius: 12px;
  padding: 16px;
}
.instruction-header {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.instruction-number-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #000;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 10px;
}
.instruction-val {
  font-family: monospace;
  font-size: 1.05rem;
  color: #fff;
  font-weight: 700;
  word-break: break-all;
}
.instruction-copy-btn {
  background: #38bdf8;
  color: #000;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: 0.2s;
  flex-shrink: 0;
}
.instruction-copy-btn:hover {
  background: #0ea5e9;
}
.instruction-holder {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.7);
}
.instruction-note {
  margin-top: 12px;
  font-size: 0.75rem;
  color: #38bdf8;
  display: flex;
  gap: 6px;
  line-height: 1.4;
  background: rgba(30, 41, 59, 0.8);
  padding: 8px;
  border-radius: 6px;
}
.checkout-actions-vertical {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.btn-checkout-confirm {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: 0.2s;
}
.btn-telegram {
  background: #2481cc;
  color: #fff;
}
.btn-telegram:hover {
  background: #1d69a6;
  color: #fff;
}
.btn-whatsapp {
  background: #25D366;
  color: #fff;
}
.btn-whatsapp:hover {
  background: #1da851;
  color: #fff;
}
.action-hint {
  text-align: center;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 4px;
}

@media(max-width: 800px) {
  .checkout-grid-container {
    grid-template-columns: 1fr;
  }
}
`;

function replaceCheckoutHtml(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const startIdx = content.indexOf('<div class="vip-step-checkout hidden" id="vipStepCheckout">');
    const endIdx = content.indexOf('<!-- Toast Notification Container -->');
    if (startIdx !== -1 && endIdx !== -1) {
        const endHtml = content.substring(content.lastIndexOf('</div>', endIdx), endIdx); // Keep the closing tags if needed, actually let's just use regex replacement carefully.
        
        const before = content.substring(0, startIdx);
        const after = content.substring(content.lastIndexOf('</div>', content.lastIndexOf('</div>', content.lastIndexOf('</div>', endIdx - 1) - 1) - 1)); // Back out of the 3 divs
        
        // Simpler way: replace everything from <div class="vip-step-checkout hidden" id="vipStepCheckout"> up to the end of that div.
        // It's easier to just regex match it.
        const regex = /<div class="vip-step-checkout hidden" id="vipStepCheckout">[\s\S]*?<!-- Toast Notification Container -->/;
        content = content.replace(regex, newCheckoutHtml + '\\n\\n    <!-- Toast Notification Container -->');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Updated HTML in " + filePath);
    }
}

function updateMovieCss(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('checkout-grid-container')) {
        content += '\\n' + newCss;
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Updated CSS in " + filePath);
    }
}

function updateMovieJs(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace renderVipWalletDetails
    const newRender = `function renderVipWalletDetails(walletKey) {
  currentVipWalletKey = walletKey;
  const container = document.getElementById("walletDetailsBox");
  if (!container) return;

  const w = VIP_WALLETS[walletKey] || VIP_WALLETS.fastpay;
  if (!w) return;

  // Update tabs active state
  document.querySelectorAll(".checkout-method-card").forEach(tab => {
    if(tab.dataset.wallet === walletKey) {
        tab.classList.add("active");
        const radio = tab.querySelector('input[type="radio"]');
        if(radio) radio.checked = true;
    } else {
        tab.classList.remove("active");
    }
  });

  container.innerHTML = \`
    <div class="instruction-header">Send Payment To (\${w.name}):</div>
    <div class="instruction-number-wrap">
      <span class="instruction-val" id="vipWalletVal">\${w.number}</span>
      <button class="instruction-copy-btn" id="vipCopyWalletBtn" type="button">Copy</button>
    </div>
    <div class="instruction-holder">Account Name: \${w.holder}</div>
    \${w.note ? \`<div class="instruction-note"><ion-icon name="information-circle-outline" style="font-size:1.2rem; flex-shrink:0;"></ion-icon> \${w.note}</div>\` : ''}
  \`;

  const copyBtn = document.getElementById("vipCopyWalletBtn");
  if (copyBtn) {
    copyBtn.onclick = () => {
      const copyVal = w.copyValue || w.number;
      navigator.clipboard.writeText(copyVal).then(() => {
        copyBtn.innerText = "Copied!";
        copyBtn.style.background = "#22c55e";
        setTimeout(() => {
          copyBtn.innerText = "Copy";
          copyBtn.style.background = "";
        }, 2000);
        showToast("Wallet number copied!");
      }).catch(() => {
        showToast("Copied: " + copyVal);
      });
    };
  }
}`;
    
    // Replace the old function using regex
    content = content.replace(/function renderVipWalletDetails\([\s\S]*?function setupVipEventListeners\(\) \{/, newRender + '\\n\\nfunction setupVipEventListeners() {');
    
    // Update event listeners for the new cards
    const cardClickCode = `
  const methodCards = document.querySelectorAll(".checkout-method-card");
  methodCards.forEach(card => {
    card.addEventListener("click", () => {
       renderVipWalletDetails(card.dataset.wallet);
    });
  });
`;
    // Add into setupVipEventListeners
    if(!content.includes('const methodCards = document.querySelectorAll(".checkout-method-card");')) {
        content = content.replace('function setupVipEventListeners() {', 'function setupVipEventListeners() {' + cardClickCode);
    }
    
    // Handle the WhatsApp and Telegram buttons logic inside selectVipTier
    // Ensure we trigger WA button using window.open in JS rather than anchor tags to prevent defaults if we change them to buttons
    content = content.replace(/const tgBtn = document\.getElementById\("vipTelegramBtn"\);\s*if\s*\(tgBtn\)\s*tgBtn\.href[\s\S]*?renderVipWalletDetails\(currentVipWalletKey\);/, `
  const tgBtn = document.getElementById("vipTelegramBtn");
  if (tgBtn) {
      tgBtn.onclick = () => window.open(\`https://t.me/randibajat?text=\${msg}\`, '_blank');
  }

  const waBtn = document.getElementById("vipWhatsappBtn");
  if (waBtn) {
      waBtn.onclick = () => window.open(\`https://wa.me/9647748201148?text=\${msg}\`, '_blank');
  }

  // Pre-fill username field in checkout
  const usernameField = document.getElementById("checkoutUsername");
  if (usernameField) {
      usernameField.value = username;
  }

  renderVipWalletDetails(currentVipWalletKey);
`);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Updated JS in " + filePath);
}

replaceCheckoutHtml(path.join(rootDir, 'index.html'));
replaceCheckoutHtml(path.join(rootDir, 'cinewatch-app', 'index.html'));
updateMovieCss(path.join(rootDir, 'movie.css'));
updateMovieJs(path.join(rootDir, 'movie.js'));
updateMovieJs(path.join(rootDir, 'cinewatch-app', 'movie.js'));

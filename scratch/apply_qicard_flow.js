const fs = require('fs');
const path = require('path');

// 1. UPDATE index.html and cinewatch-app/index.html
const htmlFiles = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'cinewatch-app', 'index.html')
];

htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Update Mastercard and Visa descriptions
    content = content.replace(
      /(<label class="checkout-method-card" data-wallet="mastercard">[\s\S]*?<span class="method-name">Mastercard<\/span>\s*<span class="method-desc">)[^<]*(<\/span>)/,
      '$1Qi / Card Transfer$2'
    );
    content = content.replace(
      /(<label class="checkout-method-card" data-wallet="visa">[\s\S]*?<span class="method-name">Visa<\/span>\s*<span class="method-desc">)[^<]*(<\/span>)/,
      '$1Qi / Card Transfer$2'
    );

    // Replace ccFormBox with sender phone / reference input
    const oldCcFormRegex = /<div class="cc-form-box" id="ccFormBox"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
    const newCcForm = `<div class="cc-form-box" id="ccFormBox" style="display: none;">
                                <div class="form-group">
                                    <label>Sender Phone / Qi Transfer Reference #</label>
                                    <input type="text" class="form-control" placeholder="e.g. 0770xxxxxxx or Transfer Ref #" id="qiRef">
                                </div>
                            </div>`;

    if (oldCcFormRegex.test(content)) {
      content = content.replace(oldCcFormRegex, newCcForm);
      console.log('Replaced ccFormBox in', file);
    } else {
      console.log('Regex did not match for ccFormBox in', file);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated HTML file:', file);
  }
});

// 2. UPDATE movie.js and cinewatch-app/movie.js
const jsFiles = [
  path.join(__dirname, '..', 'movie.js'),
  path.join(__dirname, '..', 'cinewatch-app', 'movie.js')
];

jsFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Update VIP_WALLETS.mastercard and visa
    content = content.replace(
      /mastercard:\s*\{[\s\S]*?color:\s*"#f59e0b",/,
      `mastercard: {
    name: "Mastercard / Qi Card",
    number: "9101 1792 5305",
    copyValue: "910117925305",
    holder: "CineWatch VIP",
    note: "Transfer the VIP amount via Qi Services app (خدمات كي) or any Qi / Mastercard agent to this Qi Account Number.",
    color: "#f59e0b",`
    );

    content = content.replace(
      /visa:\s*\{[\s\S]*?color:\s*"#1434CB",/,
      `visa: {
    name: "Visa / Qi Card",
    number: "9101 1792 5305",
    copyValue: "910117925305",
    holder: "CineWatch VIP",
    note: "Transfer the VIP amount via Qi Services app (خدمات كي) or any Qi / Mastercard agent to this Qi Account Number.",
    color: "#1434CB",`
    );

    // Update waBtn.onclick handling for mastercard and visa
    const oldCcClickBlock = /if \(currentVipWalletKey === 'mastercard' \|\| currentVipWalletKey === 'visa'\) \{[\s\S]*?showToast\("Purchase successful!"\);[\s\S]*?return;\s*\}/;
    
    // Replace with Qi Card verification + WhatsApp flow
    const newCcClickBlock = `if (currentVipWalletKey === 'mastercard' || currentVipWalletKey === 'visa') {
              const qiRef = document.getElementById('qiRef')?.value?.trim() || '';
              finalMsg += '\\nPayment Method: Qi Card / Mastercard (9101 1792 5305)';
              if (qiRef) {
                  finalMsg += \`\\nSender Phone / Qi Ref: \${qiRef}\`;
              }
              if (typeof showToast === 'function') {
                  showToast("Opening WhatsApp to confirm transfer...");
              }
          }`;

    if (oldCcClickBlock.test(content)) {
      content = content.replace(oldCcClickBlock, newCcClickBlock);
      console.log('Replaced cc click handling in', file);
    } else {
      console.log('Did not match oldCcClickBlock in', file);
    }

    // Update renderVipWalletDetails display for mastercard and visa
    content = content.replace(
      /if \(walletKey === 'mastercard' \|\| walletKey === 'visa'\) \{[\s\S]*?if \(actionHint\) \{[\s\S]*?actionHint\.style\.display = 'none';[\s\S]*?\}[\s\S]*?\}/,
      `if (walletKey === 'mastercard' || walletKey === 'visa') {
      if (container) container.style.display = 'block';
      if (ccForm) ccForm.style.display = 'block';
      if (cryptoForm) cryptoForm.style.display = 'none';
      if (waBtn) {
          waBtn.innerHTML = '<ion-icon name="logo-whatsapp"></ion-icon> Complete on WhatsApp';
          waBtn.classList.add('btn-whatsapp');
          waBtn.style.backgroundColor = '';
          waBtn.style.color = '';
      }
      if (actionHint) {
          actionHint.style.display = 'block';
          actionHint.textContent = 'Send transfer screenshot / Qi reference via WhatsApp for instant activation.';
      }
  }`
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated JS file:', file);
  }
});

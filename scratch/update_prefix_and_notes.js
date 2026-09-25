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

    // Replace vipRefBox with the new prefixed input layout
    const oldRefBoxPattern = /<div class="vip-ref-box" id="vipRefBox"[\s\S]*?<\/div>\s*<\/div>/;

    const newRefBox = `<div class="vip-ref-box" id="vipRefBox" style="margin-top: 16px; margin-bottom: 16px; text-align: left;">
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label id="vipRefLabel" style="display: block; font-size: 13px; font-weight: 500; color: #cbd5e1; margin-bottom: 8px;">Sender Phone Number / Transfer Reference #</label>
                                    <div class="input-with-prefix" id="vipRefInputGroup" style="display: flex; align-items: stretch; border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 8px; overflow: hidden; background: rgba(255, 255, 255, 0.06); transition: border-color 0.2s, box-shadow 0.2s;">
                                        <span class="phone-prefix" id="vipRefPrefix" style="display: flex; align-items: center; justify-content: center; padding: 0 14px; background: rgba(255, 255, 255, 0.08); color: #94a3b8; font-weight: 600; font-size: 13px; border-right: 1px solid rgba(255, 255, 255, 0.12); user-select: none; letter-spacing: 0.5px;">+964</span>
                                        <input type="text" class="form-control" placeholder="77X XXX XXXX or Transfer Ref #" id="vipRefInput" style="flex: 1; border: none; background: transparent; padding: 12px 14px; color: #fff; font-size: 14px; outline: none; box-shadow: none;">
                                    </div>
                                </div>
                            </div>`;

    if (oldRefBoxPattern.test(content)) {
      content = content.replace(oldRefBoxPattern, newRefBox);
      fs.writeFileSync(file, content, 'utf8');
      console.log('Successfully updated vipRefBox in:', file);
    } else {
      console.log('Could not match oldRefBoxPattern in:', file);
    }
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

    // Update VIP_WALLETS notes to be cleaner and more professional
    content = content.replace(
      /note:\s*"Transfer the VIP amount via Qi Services app[\s\S]*?",/g,
      'note: "Transfer the plan amount via Qi Services (خدمات كي) or any authorized agent to this account.",'
    );
    content = content.replace(
      /note:\s*"Send payment via FastPay mobile app[\s\S]*?",/g,
      'note: "Transfer the plan amount via the FastPay app to this phone number.",'
    );
    content = content.replace(
      /note:\s*"Send cash transfer via ZainCash wallet[\s\S]*?",/g,
      'note: "Transfer the plan amount via ZainCash wallet to this phone number.",'
    );
    content = content.replace(
      /note:\s*"Transfer using First Iraqi Bank \(FIB\) app[\s\S]*?",/g,
      'note: "Transfer the plan amount via First Iraqi Bank (FIB) app to this registered phone number.",'
    );
    content = content.replace(
      /note:\s*"Send USDT via TRON \(TRC-20\) network[\s\S]*?",/g,
      'note: "Send the exact amount in USDT via TRON (TRC-20) network to this address.",'
    );

    // Update renderVipWalletDetails function to handle vipRefPrefix and dynamic text
    const oldRenderDetailsPattern = /function renderVipWalletDetails\(walletKey\) \{[\s\S]*?const copyBtn = document\.getElementById\("vipCopyWalletBtn"\);/;

    const newRenderDetails = `function renderVipWalletDetails(walletKey) {
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

  // Dynamic reference label, placeholder, and +964 prefix badge
  const refLabel = document.getElementById("vipRefLabel");
  const refInput = document.getElementById("vipRefInput");
  const refPrefix = document.getElementById("vipRefPrefix");

  if (refLabel && refInput) {
    if (walletKey === 'usdt') {
      refLabel.textContent = "Transaction Hash (TXID) / Sender Address";
      refInput.placeholder = "e.g. 0x123...abc or TR7...";
      if (refPrefix) refPrefix.style.display = 'none';
    } else if (walletKey === 'mastercard' || walletKey === 'visa') {
      refLabel.textContent = "Sender Phone Number / Qi Transfer Reference #";
      refInput.placeholder = "77X XXX XXXX or Qi Ref #";
      if (refPrefix) {
        refPrefix.style.display = 'flex';
        refPrefix.textContent = '+964';
      }
    } else {
      refLabel.textContent = \`Sender Phone Number / \${w.name} Reference #\`;
      refInput.placeholder = "77X XXX XXXX or Transaction ID";
      if (refPrefix) {
        refPrefix.style.display = 'flex';
        refPrefix.textContent = '+964';
      }
    }
  }

  container.style.display = 'block';
  container.innerHTML = \`
    <div class="instruction-header">Send Payment To (\${w.name}):</div>
    <div class="instruction-number-wrap">
      <span class="instruction-val" id="vipWalletVal">\${w.number}</span>
      <button class="instruction-copy-btn" id="vipCopyWalletBtn" type="button">Copy</button>
    </div>
    <div class="instruction-holder">Account Name: \${w.holder}</div>
    \${w.note ? \`<div class="instruction-note"><ion-icon name="information-circle-outline" style="font-size:1.2rem; flex-shrink:0;"></ion-icon> \${w.note}</div>\` : ''}
  \`;

  const copyBtn = document.getElementById("vipCopyWalletBtn");`;

    if (oldRenderDetailsPattern.test(content)) {
      content = content.replace(oldRenderDetailsPattern, newRenderDetails);
      console.log('Successfully updated renderVipWalletDetails in:', file);
    } else {
      console.log('Could not match oldRenderDetailsPattern in:', file);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated JS file:', file);
  }
});

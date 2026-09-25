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

    // Replace cryptoFormBox and ccFormBox and checkout-actions-vertical with clean in-app payment section
    const targetPattern = /<div class="cc-form-box" id="cryptoFormBox"[\s\S]*?<div class="checkout-actions-vertical">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

    const newPaymentSection = `<div class="vip-ref-box" id="vipRefBox" style="margin-top: 16px; margin-bottom: 16px; text-align: left;">
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label id="vipRefLabel" style="display: block; font-size: 13px; font-weight: 500; color: #cbd5e1; margin-bottom: 8px;">Sender Phone Number / Transfer Reference #</label>
                                    <input type="text" class="form-control" placeholder="e.g. 0770xxxxxxx or Transfer Ref #" id="vipRefInput" style="width: 100%; box-sizing: border-box; padding: 12px 14px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; color: #fff; font-size: 14px; outline: none;">
                                </div>
                            </div>

                            <div class="checkout-actions-vertical">
                                <button class="btn-checkout-confirm" id="vipSubmitPaymentBtn" style="background: linear-gradient(135deg, #10b981, #059669); color: white; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; width: 100%; padding: 14px; border-radius: 8px; border: none; cursor: pointer; font-size: 15px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); transition: all 0.2s ease;">
                                    <ion-icon name="checkmark-circle-outline" style="font-size: 1.3rem;"></ion-icon> Confirm Payment
                                </button>
                                <p class="action-hint" id="vipActionHint" style="margin-top: 10px; font-size: 12px; color: #888; text-align: center;">Your payment will be verified and VIP activated automatically.</p>
                            </div>
                        </div>
                    </div>`;

    if (targetPattern.test(content)) {
      content = content.replace(targetPattern, newPaymentSection);
      fs.writeFileSync(file, content, 'utf8');
      console.log('Successfully updated HTML in:', file);
    } else {
      console.log('Could not match targetPattern in:', file);
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

    // Update VIP_WALLETS notes
    content = content.replace(
      /note:\s*"Transfer the VIP amount via Qi Services app[\s\S]*?",/g,
      'note: "Transfer the VIP amount via Qi Services app (خدمات كي) to this Qi Account Number. Enter your sender phone or reference below to activate.",'
    );
    content = content.replace(
      /note:\s*"Send payment via FastPay mobile app to this number\. Send receipt screenshot to Telegram or WhatsApp for instant activation\.",/g,
      'note: "Send payment via FastPay mobile app to this number. Enter your sender phone or transaction ID below to activate.",'
    );
    content = content.replace(
      /note:\s*"Send cash transfer via ZainCash wallet to this phone number\. Send receipt screenshot to Telegram or WhatsApp for instant activation\.",/g,
      'note: "Send cash transfer via ZainCash wallet to this phone number. Enter your sender phone or transaction ID below to activate.",'
    );
    content = content.replace(
      /note:\s*"Transfer using First Iraqi Bank \(FIB\) app to this registered phone number\. Instant activation upon receipt\.",/g,
      'note: "Transfer using First Iraqi Bank (FIB) app to this registered phone number. Enter your sender phone or reference below to activate.",'
    );
    content = content.replace(
      /note:\s*"Send USDT via TRON \(TRC-20\) network from Binance, Trust Wallet, Revolut, Cash App, or any exchange\. Instant worldwide activation\.",/g,
      'note: "Send USDT via TRON (TRC-20) network. Enter your Transaction Hash (TXID) below to activate.",'
    );

    // Update selectVipTier function to wire vipSubmitPaymentBtn
    const oldTierHandlerPattern = /function selectVipTier\(tierData\) \{[\s\S]*?renderVipWalletDetails\(currentVipWalletKey\);\s*\}/;

    const newTierHandler = `function selectVipTier(tierData) {
  selectedVipTierData = tierData;
  const stepPlans = document.getElementById("vipStepPlans");
  const stepCheckout = document.getElementById("vipStepCheckout");
  if (stepPlans) stepPlans.classList.add("hidden");
  if (stepCheckout) stepCheckout.classList.remove("hidden");

  const nameEl = document.getElementById("checkoutPlanName");
  const usdEl = document.getElementById("checkoutPlanUsd");
  const iqdEl = document.getElementById("checkoutPlanIqd");
  if (nameEl) nameEl.textContent = tierData.name;
  if (usdEl) usdEl.textContent = "$" + tierData.price;
  const dueAmountEl = document.getElementById("checkoutDueAmount");
  if (dueAmountEl) dueAmountEl.textContent = tierData.price;
  if (iqdEl) iqdEl.textContent = tierData.iqd;

  const username = state.user?.name || state.user?.email || "Guest User";

  // In-App Confirm Payment Button
  const submitBtn = document.getElementById("vipSubmitPaymentBtn") || document.getElementById("vipWhatsappBtn");
  if (submitBtn) {
    submitBtn.onclick = () => {
      const refInput = document.getElementById("vipRefInput");
      const refVal = refInput ? refInput.value.trim() : "";

      if (!refVal) {
        if (typeof showToast === 'function') {
          showToast("Please enter your sender phone number or reference ID");
        } else {
          alert("Please enter your sender phone number or reference ID");
        }
        if (refInput) refInput.focus();
        return;
      }

      // Show processing spinner
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<ion-spinner name="crescent"></ion-spinner> Verifying Payment...';

      // Save order record locally
      const orderData = {
        username: username,
        plan: tierData.name,
        price: tierData.price,
        wallet: VIP_WALLETS[currentVipWalletKey]?.name || currentVipWalletKey,
        reference: refVal,
        createdAt: new Date().toISOString()
      };
      try {
        let orders = JSON.parse(localStorage.getItem('cinewatch_vip_orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('cinewatch_vip_orders', JSON.stringify(orders));
      } catch(e) {}

      // Update VIP user state
      if (state.user) {
        state.user.isVip = true;
        state.user.vipTier = tierData.name;
        if (typeof saveUser === 'function') {
          saveUser(state.user);
        }
      }

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<ion-icon name="checkmark-circle-outline" style="font-size: 1.3rem;"></ion-icon> Confirm Payment';
        
        if (typeof showToast === 'function') {
          showToast("Payment submitted! Your VIP membership is now active.");
        } else {
          alert("Payment submitted! Your VIP membership is now active.");
        }

        if (typeof closeVipModal === 'function') {
          closeVipModal();
        }
        if (refInput) refInput.value = '';
      }, 1600);
    };
  }

  // Pre-fill username field in checkout
  const usernameField = document.getElementById("checkoutUsername");
  if (usernameField) {
    usernameField.value = username;
  }

  renderVipWalletDetails(currentVipWalletKey);
}`;

    if (oldTierHandlerPattern.test(content)) {
      content = content.replace(oldTierHandlerPattern, newTierHandler);
      console.log('Successfully updated selectVipTier in:', file);
    } else {
      console.log('Could not match oldTierHandlerPattern in:', file);
    }

    // Update renderVipWalletDetails function
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

  // Dynamic reference label and placeholder based on wallet
  const refLabel = document.getElementById("vipRefLabel");
  const refInput = document.getElementById("vipRefInput");
  if (refLabel && refInput) {
    if (walletKey === 'usdt') {
      refLabel.textContent = "Transaction Hash (TXID) / Sender Address";
      refInput.placeholder = "e.g. 0x123...abc or TR7...";
    } else if (walletKey === 'mastercard' || walletKey === 'visa') {
      refLabel.textContent = "Sender Phone Number / Qi Transfer Reference #";
      refInput.placeholder = "e.g. 0770xxxxxxx or Qi Ref #";
    } else {
      refLabel.textContent = \`Sender Phone Number / \${w.name} Reference #\`;
      refInput.placeholder = "e.g. 0770xxxxxxx or Transaction ID";
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

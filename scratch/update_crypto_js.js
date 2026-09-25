const fs = require('fs');

function updateCryptoLogic(filePath) {
    let js = fs.readFileSync(filePath, 'utf8');

    // 1. Replace renderVipWalletDetails toggle logic
    const renderRegex = /(const ccForm = document\.getElementById\("ccFormBox"\);\s*const waBtn = document\.getElementById\("vipWhatsappBtn"\);\s*const actionHint = document\.querySelector\("\.action-hint"\);)[\s\S]*?(if \(actionHint\) \{\s*actionHint\.style\.display = 'block';\s*\}\s*\})/;
    
    if (renderRegex.test(js)) {
        const renderReplacement = `const ccForm = document.getElementById("ccFormBox");
  const cryptoForm = document.getElementById("cryptoFormBox");
  const waBtn = document.getElementById("vipWhatsappBtn");
  const actionHint = document.querySelector(".action-hint");

  if (walletKey === 'mastercard' || walletKey === 'visa') {
      if (container) container.style.display = 'none';
      if (ccForm) ccForm.style.display = 'block';
      if (cryptoForm) cryptoForm.style.display = 'none';
      if (waBtn) {
          waBtn.innerHTML = 'Purchase';
          waBtn.classList.remove('btn-whatsapp');
          waBtn.style.backgroundColor = '#10b981';
          waBtn.style.color = '#fff';
      }
      if (actionHint) {
          actionHint.style.display = 'none';
      }
  } else if (walletKey === 'usdt') {
      if (container) container.style.display = 'block';
      if (ccForm) ccForm.style.display = 'none';
      if (cryptoForm) cryptoForm.style.display = 'block';
      if (waBtn) {
          waBtn.innerHTML = 'Confirm Payment';
          waBtn.classList.remove('btn-whatsapp');
          waBtn.style.backgroundColor = '#10b981';
          waBtn.style.color = '#fff';
      }
      if (actionHint) {
          actionHint.style.display = 'none';
      }
  } else {
      if (container) container.style.display = 'block';
      if (ccForm) ccForm.style.display = 'none';
      if (cryptoForm) cryptoForm.style.display = 'none';
      if (waBtn) {
          waBtn.innerHTML = '<ion-icon name="logo-whatsapp"></ion-icon> Complete Purchase';
          waBtn.classList.add('btn-whatsapp');
          waBtn.style.backgroundColor = '';
          waBtn.style.color = '';
      }
      if (actionHint) {
          actionHint.style.display = 'block';
      }
  }`;
        js = js.replace(renderRegex, renderReplacement);
    } else {
        console.log("Failed to match renderVipWalletDetails in " + filePath);
    }

    // 2. Replace waBtn.onclick logic
    const clickRegex = /(if \(currentVipWalletKey === 'mastercard' \|\| currentVipWalletKey === 'visa'\) \{[\s\S]*?return;\s*\})([\s\S]*?)(const walletName = VIP_WALLETS\[currentVipWalletKey\]\?\.name || 'FastPay';)/;
    
    if (clickRegex.test(js)) {
        const clickReplacement = `$1 else if (currentVipWalletKey === 'usdt') {
              const txid = document.getElementById('cryptoTxid')?.value || '';
              if (!txid) {
                  if (typeof showToast === 'function') {
                      showToast("Please enter the Transaction Hash");
                  } else {
                      alert("Please enter the Transaction Hash");
                  }
                  return;
              }
              if (typeof showToast === 'function') {
                  showToast("Verifying transaction on blockchain...");
                  const btn = document.getElementById("vipWhatsappBtn");
                  if (btn) btn.innerHTML = '<ion-spinner name="crescent"></ion-spinner> Verifying...';
                  setTimeout(() => {
                      showToast("Payment confirmed! Your premium is activated.");
                      if (btn) btn.innerHTML = 'Confirm Payment';
                      const modal = document.getElementById('vipModal');
                      if (modal) modal.classList.remove('show');
                  }, 2000);
              } else {
                  alert("Payment confirmed!");
              }
              return;
          } $2$3`;
        js = js.replace(clickRegex, clickReplacement);
        console.log("Updated JS in " + filePath);
    } else {
        console.log("Failed to match waBtn.onclick in " + filePath);
    }
    
    fs.writeFileSync(filePath, js);
}

updateCryptoLogic('movie.js');
updateCryptoLogic('cinewatch-app/movie.js');

const fs = require('fs');

function updateButtonLogic(filePath) {
    let js = fs.readFileSync(filePath, 'utf8');

    // 1. Update renderVipWalletDetails to toggle button appearance
    const toggleRegex = /(if \(walletKey === 'mastercard' \|\| walletKey === 'visa'\) \{\s*if \(container\) container\.style\.display = 'none';\s*if \(ccForm\) ccForm\.style\.display = 'block';\s*\})([\s\S]*?)(\} else \{\s*if \(container\) container\.style\.display = 'block';\s*if \(ccForm\) ccForm\.style\.display = 'none';\s*\})/;
    
    if (toggleRegex.test(js)) {
        const trueBlock = `if (walletKey === 'mastercard' || walletKey === 'visa') {
      if (container) container.style.display = 'none';
      if (ccForm) ccForm.style.display = 'block';
      const waBtn = document.getElementById("vipWhatsappBtn");
      const actionHint = document.querySelector(".action-hint");
      if (waBtn) {
          waBtn.innerHTML = 'Purchase';
          waBtn.classList.remove('btn-whatsapp');
          waBtn.style.backgroundColor = '#10b981';
      }
      if (actionHint) {
          actionHint.style.display = 'none';
      }
  }`;
        const falseBlock = `} else {
      if (container) container.style.display = 'block';
      if (ccForm) ccForm.style.display = 'none';
      const waBtn = document.getElementById("vipWhatsappBtn");
      const actionHint = document.querySelector(".action-hint");
      if (waBtn) {
          waBtn.innerHTML = '<ion-icon name="logo-whatsapp"></ion-icon> Complete Purchase';
          waBtn.classList.add('btn-whatsapp');
          waBtn.style.backgroundColor = '';
      }
      if (actionHint) {
          actionHint.style.display = 'block';
      }
  }`;
        js = js.replace(toggleRegex, trueBlock + falseBlock);
    }

    // 2. Update waBtn.onclick to NOT go to WhatsApp for cards
    const clickRegex = /(if \(!ccName \|\| !ccNum \|\| !ccExp \|\| !ccCvc\) \{\s*if \(typeof showToast === 'function'\) \{\s*showToast\("Please fill in all credit card details"\);\s*\} else \{\s*alert\("Please fill in all credit card details"\);\s*\}\s*return;\s*\})([\s\S]*?)(const pName = currentVipWalletKey === 'visa' \? 'Visa' : 'Mastercard';\s*finalMsg \+= `\\nPayment Method: \$\{pName\}\\nCardholder: \$\{ccName\}\\nCard Number: \$\{ccNum\}\\nExpiry: \$\{ccExp\}\\nCVV: \$\{ccCvc\}`;\s*\}([\s\S]*?)window\.open\(`https:\/\/wa\.me\/9647748201148\?text=\$\{encodeURIComponent\(finalMsg\)\}`, '_blank'\);)/;
    
    if (clickRegex.test(js)) {
        // We replace the block that builds finalMsg and opens WhatsApp with a success message instead.
        const newClickLogic = `$1
              if (typeof showToast === 'function') {
                  showToast("Processing payment...");
                  const btn = document.getElementById("vipWhatsappBtn");
                  if (btn) btn.innerHTML = '<ion-spinner name="crescent"></ion-spinner> Processing...';
                  setTimeout(() => {
                      showToast("Purchase successful!");
                      if (btn) btn.innerHTML = 'Purchase';
                      const modal = document.getElementById('vipModal');
                      if (modal) modal.classList.remove('show');
                  }, 1500);
              } else {
                  alert("Purchase successful!");
              }
              return;
          } else {
              const walletName = VIP_WALLETS[currentVipWalletKey]?.name || 'FastPay';
              finalMsg += \`\\nPayment Method: \${walletName}\`;
          }
          window.open(\`https://wa.me/9647748201148?text=\${encodeURIComponent(finalMsg)}\`, '_blank');`;
        js = js.replace(clickRegex, newClickLogic);
    }

    fs.writeFileSync(filePath, js);
    console.log('Updated button logic in ' + filePath);
}

updateButtonLogic('movie.js');
updateButtonLogic('cinewatch-app/movie.js');

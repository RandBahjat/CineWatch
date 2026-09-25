const fs = require('fs');

function updateRenderVipWalletDetails(filePath) {
    let js = fs.readFileSync(filePath, 'utf8');
    
    const regex = /(function renderVipWalletDetails\(walletKey\) \{[\s\S]*?)(container\.innerHTML = `[\s\S]*?`;\s*)(const copyBtn = document\.getElementById\("vipCopyWalletBtn"\);)/;
    
    if (regex.test(js)) {
        if (!js.includes('ccFormBox')) {
            const extraLogic = `
  const ccForm = document.getElementById("ccFormBox");
  if (walletKey === 'mastercard') {
      if (container) container.style.display = 'none';
      if (ccForm) ccForm.style.display = 'block';
  } else {
      if (container) container.style.display = 'block';
      if (ccForm) ccForm.style.display = 'none';
  }
`;
            js = js.replace(regex, "$1" + extraLogic + "$2$3");
            fs.writeFileSync(filePath, js);
            console.log('Updated renderVipWalletDetails in ' + filePath);
        } else {
            console.log('ccFormBox logic already exists in ' + filePath);
        }
    } else {
        console.log('Could not find renderVipWalletDetails regex match in ' + filePath);
    }
}

updateRenderVipWalletDetails('movie.js');
updateRenderVipWalletDetails('cinewatch-app/movie.js');

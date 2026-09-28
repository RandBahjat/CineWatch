const fs = require('fs');

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist: ' + filePath);
    return;
  }
  let text = fs.readFileSync(filePath, 'utf8');

  // 1. Regular submit phone handling
  const target1 = `      const refInput = document.getElementById("vipRefInput");\n      const smsInput = document.getElementById("vipSmsPhoneInput");\n      const smsVal = smsInput ? smsInput.value.trim() : "";\n      const refVal = refInput ? refInput.value.trim() : "";`;
  const replace1 = `      const refInput = document.getElementById("vipRefInput");\n      const smsInput = document.getElementById("vipSmsPhoneInput");\n      const smsPrefixEl = document.getElementById("vipSmsPrefix");\n      const smsPrefix = smsPrefixEl ? (smsPrefixEl.value || "+964") : "+964";\n      const rawSmsVal = smsInput ? smsInput.value.trim() : "";\n      let fullSmsPhone = "";\n      if (rawSmsVal) {\n        let cleaned = rawSmsVal.replace(/[^\\d+]/g, '');\n        if (cleaned.startsWith("+")) {\n          fullSmsPhone = cleaned;\n        } else {\n          if (cleaned.startsWith("0")) cleaned = cleaned.substring(1);\n          fullSmsPhone = smsPrefix + cleaned;\n        }\n      }\n      const smsVal = fullSmsPhone;\n      const refVal = refInput ? refInput.value.trim() : "";`;

  if (text.includes(target1)) {
    text = text.replace(target1, replace1);
    console.log('Updated regular payment SMS handler in ' + filePath);
  } else {
    console.log('Target 1 not found in ' + filePath);
  }

  // 2. renderVipWalletDetails refPrefix handling
  const target2 = `    } else if (walletKey === 'mastercard') {\n      refLabel.textContent = "Sender Phone Number / Qi Transfer Reference #";\n      refInput.placeholder = "77X XXX XXXX or Qi Ref #";\n      if (refPrefix) {\n        refPrefix.style.display = 'flex';\n        refPrefix.textContent = '+964';\n      }\n    } else {\n      refLabel.textContent = \`Sender Phone Number / \${w.name} Reference #\`;\n      refInput.placeholder = "77X XXX XXXX or Transaction ID";\n      if (refPrefix) {\n        refPrefix.style.display = 'flex';\n        refPrefix.textContent = '+964';\n      }\n    }`;
  const replace2 = `    } else if (walletKey === 'mastercard') {\n      refLabel.textContent = "Sender Phone Number / Qi Transfer Reference #";\n      refInput.placeholder = "77X XXX XXXX or Qi Ref #";\n      if (refPrefix) {\n        refPrefix.style.display = 'inline-flex';\n        if (refPrefix.tagName !== 'SELECT') refPrefix.textContent = '+964';\n      }\n    } else {\n      refLabel.textContent = \`Sender Phone Number / \${w.name} Reference #\`;\n      refInput.placeholder = "77X XXX XXXX or Transaction ID";\n      if (refPrefix) {\n        refPrefix.style.display = 'inline-flex';\n        if (refPrefix.tagName !== 'SELECT') refPrefix.textContent = '+964';\n      }\n    }`;

  if (text.includes(target2)) {
    text = text.replace(target2, replace2);
    console.log('Updated renderVipWalletDetails in ' + filePath);
  } else {
    console.log('Target 2 not found in ' + filePath);
  }

  // 3. Crypto submit phone handling
  const target3 = `      const txIdVal = txInput.value.trim();\n      const cryptoSmsInput = document.getElementById("vipSmsPhoneInput");\n      const cryptoSmsVal = cryptoSmsInput ? cryptoSmsInput.value.trim() : "";`;
  const replace3 = `      const txIdVal = txInput.value.trim();\n      const cryptoSmsInput = document.getElementById("vipSmsPhoneInput");\n      const cryptoSmsPrefixEl = document.getElementById("vipSmsPrefix");\n      const cryptoPrefix = cryptoSmsPrefixEl ? (cryptoSmsPrefixEl.value || "+964") : "+964";\n      const rawCryptoSmsVal = cryptoSmsInput ? cryptoSmsInput.value.trim() : "";\n      let fullCryptoPhone = "";\n      if (rawCryptoSmsVal) {\n        let cleaned = rawCryptoSmsVal.replace(/[^\\d+]/g, '');\n        if (cleaned.startsWith("+")) {\n          fullCryptoPhone = cleaned;\n        } else {\n          if (cleaned.startsWith("0")) cleaned = cleaned.substring(1);\n          fullCryptoPhone = cryptoPrefix + cleaned;\n        }\n      }\n      const cryptoSmsVal = fullCryptoPhone;`;

  if (text.includes(target3)) {
    text = text.replace(target3, replace3);
    console.log('Updated crypto payment SMS handler in ' + filePath);
  } else {
    console.log('Target 3 not found in ' + filePath);
  }

  fs.writeFileSync(filePath, text, 'utf8');
  console.log('Successfully saved ' + filePath);
}

updateFile('movie.js');
updateFile('cinewatch-app/movie.js');

const fs = require('fs');

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist: ' + filePath);
    return;
  }
  let text = fs.readFileSync(filePath, 'utf8');

  // Detect line ending
  const eol = text.includes('\r\n') ? '\r\n' : '\n';

  // 1. Regular submit phone handling
  const regex1 = /const\s+refInput\s*=\s*document\.getElementById\("vipRefInput"\);\s*const\s+smsInput\s*=\s*document\.getElementById\("vipSmsPhoneInput"\);\s*const\s+smsVal\s*=\s*smsInput\s*\?\s*smsInput\.value\.trim\(\)\s*:\s*"";\s*const\s+refVal\s*=\s*refInput\s*\?\s*refInput\.value\.trim\(\)\s*:\s*"";/;

  const rep1 = [
    'const refInput = document.getElementById("vipRefInput");',
    '      const smsInput = document.getElementById("vipSmsPhoneInput");',
    '      const smsPrefixEl = document.getElementById("vipSmsPrefix");',
    '      const smsPrefix = smsPrefixEl ? (smsPrefixEl.value || "+964") : "+964";',
    '      const rawSmsVal = smsInput ? smsInput.value.trim() : "";',
    '      let fullSmsPhone = "";',
    '      if (rawSmsVal) {',
    '        let cleaned = rawSmsVal.replace(/[^\\d+]/g, "");',
    '        if (cleaned.startsWith("+")) {',
    '          fullSmsPhone = cleaned;',
    '        } else {',
    '          if (cleaned.startsWith("0")) cleaned = cleaned.substring(1);',
    '          fullSmsPhone = smsPrefix + cleaned;',
    '        }',
    '      }',
    '      const smsVal = fullSmsPhone;',
    '      const refVal = refInput ? refInput.value.trim() : "";'
  ].join(eol);

  if (regex1.test(text)) {
    text = text.replace(regex1, rep1);
    console.log('Updated regular payment SMS handler in ' + filePath);
  } else {
    console.log('Regex 1 not matched in ' + filePath);
  }

  // 2. renderVipWalletDetails refPrefix handling
  const regex2 = /if\s*\(refPrefix\)\s*\{\s*refPrefix\.style\.display\s*=\s*['"]flex['"];\s*refPrefix\.textContent\s*=\s*['"]\+964['"];\s*\}/g;

  const rep2 = [
    'if (refPrefix) {',
    '        refPrefix.style.display = "inline-flex";',
    '        if (refPrefix.tagName !== "SELECT") refPrefix.textContent = "+964";',
    '      }'
  ].join(eol);

  if (regex2.test(text)) {
    text = text.replace(regex2, rep2);
    console.log('Updated refPrefix display logic in ' + filePath);
  } else {
    console.log('Regex 2 not matched in ' + filePath);
  }

  fs.writeFileSync(filePath, text, 'utf8');
  console.log('Successfully saved ' + filePath);
}

updateFile('movie.js');
updateFile('cinewatch-app/movie.js');

const fs = require('fs');

console.log('--- 1. Removing vipSmsPhoneBox from index.html & cinewatch-app/index.html ---');

function removeSmsBox(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist: ' + filePath);
    return;
  }
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Find start and end of vipSmsPhoneBox
  const startMarker = '<div class="vip-ref-box" id="vipSmsPhoneBox"';
  const startIndex = html.indexOf(startMarker);
  if (startIndex !== -1) {
    const endMarker = '</div>';
    // vipSmsPhoneBox has 3 closing </div>: </select> (or input), </div> for input-with-prefix, </div> for form-group, </div> for vipSmsPhoneBox
    // Let's find the position of id="vipRefBox"
    const refBoxIndex = html.indexOf('<div class="vip-ref-box" id="vipRefBox"');
    if (refBoxIndex !== -1 && refBoxIndex > startIndex) {
      html = html.substring(0, startIndex) + html.substring(refBoxIndex);
      fs.writeFileSync(filePath, html, 'utf8');
      console.log('Successfully removed vipSmsPhoneBox from ' + filePath);
    } else {
      console.log('Could not find refBoxIndex after startIndex in ' + filePath);
    }
  } else {
    console.log('vipSmsPhoneBox not found in ' + filePath);
  }
}

removeSmsBox('index.html');
removeSmsBox('cinewatch-app/index.html');

console.log('--- 2. Updating movie.js & cinewatch-app/movie.js ---');

function updateMovieJs(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist: ' + filePath);
    return;
  }
  let text = fs.readFileSync(filePath, 'utf8');
  const eol = text.includes('\r\n') ? '\r\n' : '\n';

  // 1. Update submit handler to read from vipRefInput and vipRefPrefix
  const targetRegex1 = /const\s+refInput\s*=\s*document\.getElementById\("vipRefInput"\);[\s\S]*?const\s+smsVal\s*=\s*fullSmsPhone;\s*const\s+refVal\s*=\s*refInput\s*\?\s*refInput\.value\.trim\(\)\s*:\s*"";/;

  const rep1 = [
    'const refInput = document.getElementById("vipRefInput");',
    '      const refPrefixEl = document.getElementById("vipRefPrefix");',
    '      const refPrefix = refPrefixEl ? (refPrefixEl.value || "+964") : "+964";',
    '      const refVal = refInput ? refInput.value.trim() : "";',
    '',
    '      // Determine full international phone from sender phone/ref',
    '      let senderPhone = "";',
    '      let cleanedPhone = refVal.replace(/[^\\d+]/g, "");',
    '      if (cleanedPhone.length >= 5) {',
    '        if (cleanedPhone.startsWith("+")) {',
    '          senderPhone = cleanedPhone;',
    '        } else {',
    '          if (cleanedPhone.startsWith("0")) cleanedPhone = cleanedPhone.substring(1);',
    '          senderPhone = refPrefix + cleanedPhone;',
    '        }',
    '      } else {',
    '        senderPhone = refVal;',
    '      }'
  ].join(eol);

  if (targetRegex1.test(text)) {
    text = text.replace(targetRegex1, rep1);
    console.log('Replaced submit handler inputs in ' + filePath);
  } else {
    console.log('targetRegex1 not matched in ' + filePath);
  }

  // 2. Update Telegram notification message & button URLs to pass senderPhone for both Approve and Deny
  const targetRegexTelegram = /const\s+msg\s*=\s*`🎬 \*New CineWatch VIP Order!\*[\s\S]*?`\*Approve via Supabase Dashboard[^`]*`;\s*fetch\(`https:\/\/api\.telegram\.org\/bot\${TELEGRAM_BOT_TOKEN}\/sendMessage`[\s\S]*?\}\)\.catch\(\(\)\s*=>\s*\{\}\);/;

  const repTelegram = [
    'const msg =',
    '          `🎬 *New CineWatch VIP Order!*\\n\\n` +',
    '          `🆔 Order: \\`` + `${orderData.id}\\`` + `\\n` +',
    '          `👤 User: ${orderData.username} (${orderData.userEmail})\\n` +',
    '          `📦 Plan: ${orderData.plan} — ${orderData.price}\\n` +',
    '          `💳 Payment: ${orderData.wallet}\\n` +',
    '          `📞 Sender Phone / Ref: ${refVal}\\n` +',
    '          (senderPhone && senderPhone !== refVal ? `📱 International Phone: ${senderPhone}\\n` : \'\') +',
    '          `📱 Device: ${orderData.device}\\n` +',
    '          `🕒 Time: ${orderData.createdAt}\\n\\n` +',
    '          `*Click below to Approve or Deny (automatic SMS notify will be sent):*`;',
    '        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {',
    '          method: \'POST\',',
    '          headers: { \'Content-Type\': \'application/json\' },',
    '          body: JSON.stringify({',
    '            chat_id: TELEGRAM_CHAT_ID,',
    '            text: msg,',
    '            parse_mode: \'Markdown\',',
    '            reply_markup: {',
    '              inline_keyboard: [[',
    '                { text: "✅ Approve", url: `${window.location.origin}/admin.html?order=${orderId}&action=approved&phone=${encodeURIComponent(senderPhone || refVal)}` },',
    '                { text: "❌ Deny", url: `${window.location.origin}/admin.html?order=${orderId}&action=denied&phone=${encodeURIComponent(senderPhone || refVal)}` }',
    '              ]]',
    '            }',
    '          })',
    '        }).catch(() => {});'
  ].join(eol);

  if (targetRegexTelegram.test(text)) {
    text = text.replace(targetRegexTelegram, repTelegram);
    console.log('Updated Telegram message and Approve/Deny buttons in ' + filePath);
  } else {
    console.log('targetRegexTelegram not matched in ' + filePath);
  }

  // 3. Update crypto Telegram approve and deny buttons too
  const targetRegexCryptoTelegram = /reply_markup:\s*\{\s*inline_keyboard:\s*\[\[\s*\{\s*text:\s*["']✅ Approve["'][\s\S]*?\}\s*\]\]\s*\}/;
  const repCryptoTelegram = [
    'reply_markup: {',
    '              inline_keyboard: [[',
    '                { text: "✅ Approve", url: `${window.location.origin}/admin.html?order=${orderId}&action=approved&phone=${encodeURIComponent(cryptoSmsVal || txIdVal)}` },',
    '                { text: "❌ Deny", url: `${window.location.origin}/admin.html?order=${orderId}&action=denied&phone=${encodeURIComponent(cryptoSmsVal || txIdVal)}` }',
    '              ]]',
    '            }'
  ].join(eol);

  if (targetRegexCryptoTelegram.test(text)) {
    text = text.replace(targetRegexCryptoTelegram, repCryptoTelegram);
    console.log('Updated Crypto Telegram Approve & Deny buttons in ' + filePath);
  }

  fs.writeFileSync(filePath, text, 'utf8');
  console.log('Saved ' + filePath);
}

updateMovieJs('movie.js');
updateMovieJs('cinewatch-app/movie.js');

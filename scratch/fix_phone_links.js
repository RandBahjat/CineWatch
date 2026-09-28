const fs = require('fs');

function fixFiles(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist: ' + filePath);
    return;
  }
  let text = fs.readFileSync(filePath, 'utf8');

  // Fix regular submit inline_keyboard (line ~4556)
  const wrongRegular = `{ text: "✅ Approve", url: \`\${window.location.origin}/admin.html?order=\${orderId}&action=approved&phone=\${encodeURIComponent(cryptoSmsVal || txIdVal)}\` },\n                { text: "❌ Deny", url: \`\${window.location.origin}/admin.html?order=\${orderId}&action=denied&phone=\${encodeURIComponent(cryptoSmsVal || txIdVal)}\` }`;
  const wrongRegularCRLF = `{ text: "✅ Approve", url: \`\${window.location.origin}/admin.html?order=\${orderId}&action=approved&phone=\${encodeURIComponent(cryptoSmsVal || txIdVal)}\` },\r\n                { text: "❌ Deny", url: \`\${window.location.origin}/admin.html?order=\${orderId}&action=denied&phone=\${encodeURIComponent(cryptoSmsVal || txIdVal)}\` }`;
  
  const correctRegular = `{ text: "✅ Approve", url: \`\${window.location.origin}/admin.html?order=\${orderId}&action=approved&phone=\${encodeURIComponent(senderPhone || refVal)}\` },\n                { text: "❌ Deny", url: \`\${window.location.origin}/admin.html?order=\${orderId}&action=denied&phone=\${encodeURIComponent(senderPhone || refVal)}\` }`;

  if (text.includes(wrongRegular)) {
    text = text.replace(wrongRegular, correctRegular);
    console.log('Fixed regular buttons (LF) in ' + filePath);
  } else if (text.includes(wrongRegularCRLF)) {
    text = text.replace(wrongRegularCRLF, correctRegular);
    console.log('Fixed regular buttons (CRLF) in ' + filePath);
  } else {
    console.log('wrongRegular not found directly in ' + filePath);
  }

  // Also fix crypto buttons (lines ~4870)
  const oldCryptoButtonsRegex = /\{\s*text:\s*["']✅ Approve["'],\s*url:\s*`\${window\.location\.origin}\/admin\.html\?order=\${orderId}&action=approved&phone=\${encodeURIComponent\(typeof cryptoSmsVal !== ['"]undefined['"] \? cryptoSmsVal : smsVal\)}`\s*\},[\s\r\n]*\{\s*text:\s*["']❌ Deny["'],\s*url:\s*`\${window\.location\.origin}\/admin\.html\?order=\${orderId}&action=denied`\s*\}/;
  
  const newCryptoButtons = `{ text: "✅ Approve", url: \`\${window.location.origin}/admin.html?order=\${orderId}&action=approved&phone=\${encodeURIComponent(cryptoSmsVal || txIdVal)}\` },\n                { text: "❌ Deny", url: \`\${window.location.origin}/admin.html?order=\${orderId}&action=denied&phone=\${encodeURIComponent(cryptoSmsVal || txIdVal)}\` }`;

  if (oldCryptoButtonsRegex.test(text)) {
    text = text.replace(oldCryptoButtonsRegex, newCryptoButtons);
    console.log('Fixed crypto buttons in ' + filePath);
  }

  // Ensure Supabase insert stores senderPhone || refVal into reference
  const sbInsertRegex = /sbClient\.from\(['"]vip_orders['"]\)\.insert\(\[\{\s*order_id:\s*orderId,\s*username:\s*username,\s*plan:\s*tierData\.name,\s*price:\s*"\$"\s*\+\s*tierData\.price,\s*wallet:\s*orderData\.wallet,\s*reference:\s*refVal,\s*status:\s*['"]pending['"]\s*\}\]\)/;
  const sbInsertNew = `sbClient.from('vip_orders').insert([{
          order_id: orderId,
          username: username,
          plan: tierData.name,
          price: "$" + tierData.price,
          wallet: orderData.wallet,
          reference: senderPhone || refVal,
          status: 'pending'
        }])`;

  if (sbInsertRegex.test(text)) {
    text = text.replace(sbInsertRegex, sbInsertNew);
    console.log('Updated Supabase insert reference in ' + filePath);
  }

  fs.writeFileSync(filePath, text, 'utf8');
  console.log('Saved ' + filePath);
}

fixFiles('movie.js');
fixFiles('cinewatch-app/movie.js');

const fs = require('fs');

function fixFile(file) {
    if (!fs.existsSync(file)) return;
    let text = fs.readFileSync(file, 'utf8');

    // 1. Read SMS Input in vipSubmitPaymentBtn
    if (!text.includes('const smsInput = document.getElementById("vipSmsPhoneInput");')) {
        text = text.replace(
            /const refInput = document\.getElementById\("vipRefInput"\);/,
            `const refInput = document.getElementById("vipRefInput");\n      const smsInput = document.getElementById("vipSmsPhoneInput");\n      const smsVal = smsInput ? smsInput.value.trim() : "";`
        );
    }
    
    // Add SMS phone to Telegram message (Main Modal)
    if (!text.includes('📱 SMS: ${smsVal}')) {
        text = text.replace(
            /📞 Reference: \${orderData\.reference}\\n\` \+/,
            `📞 Reference: \${orderData.reference}\\n\` +\n          \`📱 SMS: \${smsVal}\\n\` +`
        );
    }

    // Add phone to Telegram Webhook URL (Main Modal)
    if (text.includes('action=approved" }') && !text.includes('action=approved&phone=')) {
        text = text.replace(
            /url: \`\$\{window\.location\.origin\}\/admin\.html\?order=\$\{orderId\}&action=approved\`/g,
            `url: \`\${window.location.origin}/admin.html?order=\${orderId}&action=approved&phone=\${encodeURIComponent(smsVal)}\``
        );
    }

    // 2. Read SMS Input in vipSubmitTxBtn (Crypto modal handler)
    if (!text.includes('const cryptoSmsInput = document.getElementById("vipSmsPhoneInput");')) {
        text = text.replace(
            /const txIdVal = txInput\.value\.trim\(\);/,
            `const txIdVal = txInput.value.trim();\n      const cryptoSmsInput = document.getElementById("vipSmsPhoneInput");\n      const cryptoSmsVal = cryptoSmsInput ? cryptoSmsInput.value.trim() : "";`
        );
    }

    // Add SMS phone to Telegram message (Crypto Modal)
    if (text.includes('📞 Reference (TxID):') && !text.includes('📱 SMS: ${cryptoSmsVal}')) {
        text = text.replace(
            /📞 Reference \(TxID\): \$\{txIdVal\}\\n\` \+/,
            `📞 Reference (TxID): \${txIdVal}\\n\` +\n          \`📱 SMS: \${cryptoSmsVal}\\n\` +`
        );
    }

    // Add phone to Telegram Webhook URL (Crypto Modal)
    if (text.includes('action=approved`') && !text.includes('action=approved&phone=${encodeURIComponent(cryptoSmsVal)}')) {
        text = text.replace(
            /url: \`\$\{window\.location\.origin\}\/admin\.html\?order=\$\{orderId\}&action=approved\`/g,
            `url: \`\${window.location.origin}/admin.html?order=\${orderId}&action=approved&phone=\${encodeURIComponent(typeof cryptoSmsVal !== 'undefined' ? cryptoSmsVal : smsVal)}\``
        );
    }

    fs.writeFileSync(file, text, 'utf8');
    console.log('Fixed', file);
}

fixFile('movie.js');
fixFile('cinewatch-app/movie.js');

const fs = require('fs');

function updateVisaJs(filePath) {
    let js = fs.readFileSync(filePath, 'utf8');
    
    // Add visa to VIP_WALLETS
    const mcWalletRegex = /(mastercard:\s*\{[\s\S]*?\},)/;
    if (mcWalletRegex.test(js) && !js.includes('visa: {')) {
        const visaWallet = `
  visa: {
    name: "Visa",
    number: "4000 0000 0000 0000",
    holder: "CineWatch VIP Account",
    note: "Send card-to-card transfer.",
    color: "#1434CB",
    logoSvg: '<svg viewBox="0 0 36 24" width="26" height="17" fill="none"><path d="M15.4 17.5h2.6l1.7-10.7h-2.6l-1.7 10.7zM24 6.8c-.5-.2-1.2-.4-2-.4-2.2 0-3.7 1.2-3.8 2.8-.1 1.2 1 1.9 1.7 2.2.8.4 1 .6 1 .9 0 .5-.6.7-1.2.7-.9 0-1.5-.2-2.1-.5l-.3-.1-.4 1.7c.5.2 1.4.4 2.3.4 2.3 0 3.8-1.2 3.8-2.9 0-1-.7-1.8-1.6-2.2-.7-.3-1.1-.6-1.1-.9 0-.4.4-.7 1.1-.7.7 0 1.3.1 1.8.4l.2.1.4-1.5M29.9 17.5h2.4l-2.1-10.7h-2.1c-.4 0-.8.2-1 .6l-4 9.1h2.7l.5-1.4h3.3l.3 1.4zM27 13.9l.8-2.3c0-.1.2-.5.2-.6l.1.5 1 2.4h-2.1zM11.6 17.5L8.5 9.5c-.2-.5-.3-.7-.7-.8L3.2 7.5v-.1h4.4c.5 0 .9.3 1.1.9l2 7.7 2.8-8.6h2.7L11.6 17.5z" fill="#1434CB"/></svg>'
  },`;
        js = js.replace(mcWalletRegex, "$1" + visaWallet);
    }
    
    // Update renderVipWalletDetails
    js = js.replace(/if \(walletKey === 'mastercard'\)/g, "if (walletKey === 'mastercard' || walletKey === 'visa')");
    
    // Update WhatsApp logic
    js = js.replace(/if \(currentVipWalletKey === 'mastercard'\)/g, "if (currentVipWalletKey === 'mastercard' || currentVipWalletKey === 'visa')");
    js = js.replace(/finalMsg \+= `\\nPayment Method: Mastercard/g, "const pName = currentVipWalletKey === 'visa' ? 'Visa' : 'Mastercard';\n              finalMsg += `\\nPayment Method: ${pName}");
    
    fs.writeFileSync(filePath, js);
    console.log('Updated Visa logic in ' + filePath);
}

updateVisaJs('movie.js');
updateVisaJs('cinewatch-app/movie.js');

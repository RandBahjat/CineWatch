const fs = require('fs');

function addVisaOption(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    
    const mcRegex = /(<label class="checkout-method-card" data-wallet="mastercard">[\s\S]*?<\/label>)/;
    
    if (mcRegex.test(html) && !html.includes('data-wallet="visa"')) {
        const visaHtml = `
                                <label class="checkout-method-card" data-wallet="visa">
                                    <input type="radio" name="payment_method">
                                    <span class="method-icon"><svg viewBox="0 0 36 24" width="26" height="17" fill="none"><path d="M15.4 17.5h2.6l1.7-10.7h-2.6l-1.7 10.7zM24 6.8c-.5-.2-1.2-.4-2-.4-2.2 0-3.7 1.2-3.8 2.8-.1 1.2 1 1.9 1.7 2.2.8.4 1 .6 1 .9 0 .5-.6.7-1.2.7-.9 0-1.5-.2-2.1-.5l-.3-.1-.4 1.7c.5.2 1.4.4 2.3.4 2.3 0 3.8-1.2 3.8-2.9 0-1-.7-1.8-1.6-2.2-.7-.3-1.1-.6-1.1-.9 0-.4.4-.7 1.1-.7.7 0 1.3.1 1.8.4l.2.1.4-1.5M29.9 17.5h2.4l-2.1-10.7h-2.1c-.4 0-.8.2-1 .6l-4 9.1h2.7l.5-1.4h3.3l.3 1.4zM27 13.9l.8-2.3c0-.1.2-.5.2-.6l.1.5 1 2.4h-2.1zM11.6 17.5L8.5 9.5c-.2-.5-.3-.7-.7-.8L3.2 7.5v-.1h4.4c.5 0 .9.3 1.1.9l2 7.7 2.8-8.6h2.7L11.6 17.5z" fill="#1434CB"/></svg></span>
                                    <div class="method-info">
                                        <span class="method-name">Visa</span>
                                        <span class="method-desc">Card Transfer</span>
                                    </div>
                                </label>`;
        html = html.replace(mcRegex, "$1" + visaHtml);
        fs.writeFileSync(filePath, html);
        console.log('Added Visa option to ' + filePath);
    }
}

addVisaOption('index.html');
addVisaOption('cinewatch-app/index.html');

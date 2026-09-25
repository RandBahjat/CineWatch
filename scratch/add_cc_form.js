const fs = require('fs');

function injectCcForm(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Find walletDetailsBox
    const targetStr = '<div class="payment-instruction-box" id="walletDetailsBox">\n                                <!-- Populated dynamically via JS -->\n                            </div>';
    
    if (html.includes(targetStr)) {
        if (!html.includes('id="ccFormBox"')) {
            const ccFormHtml = `
                            <div class="cc-form-box" id="ccFormBox" style="display: none;">
                                <div class="form-group">
                                    <label>Cardholder Name</label>
                                    <input type="text" class="form-control" placeholder="John Doe" id="ccName">
                                </div>
                                <div class="form-group">
                                    <label>Card Number</label>
                                    <div class="input-with-icon">
                                        <ion-icon name="card-outline"></ion-icon>
                                        <input type="text" class="form-control" placeholder="0000 0000 0000 0000" id="ccNumber" maxlength="19">
                                    </div>
                                </div>
                                <div style="display: flex; gap: 1rem;">
                                    <div class="form-group" style="flex: 1;">
                                        <label>Expiry Date</label>
                                        <input type="text" class="form-control" placeholder="MM/YY" id="ccExpiry" maxlength="5">
                                    </div>
                                    <div class="form-group" style="flex: 1;">
                                        <label>CVC / CVV</label>
                                        <input type="password" class="form-control" placeholder="123" id="ccCvc" maxlength="4">
                                    </div>
                                </div>
                            </div>`;
                            
            html = html.replace(targetStr, targetStr + '\n' + ccFormHtml);
            fs.writeFileSync(filePath, html);
            console.log('Injected ccFormBox into ' + filePath);
        } else {
            console.log('ccFormBox already exists in ' + filePath);
        }
    } else {
        console.log('Could not find walletDetailsBox in ' + filePath);
        // Let's try alternative regex match
        const regex = /(<div class="payment-instruction-box" id="walletDetailsBox">[\s\S]*?<\/div>)/;
        if (regex.test(html) && !html.includes('id="ccFormBox"')) {
             const ccFormHtml = `
                            <div class="cc-form-box" id="ccFormBox" style="display: none;">
                                <div class="form-group">
                                    <label>Cardholder Name</label>
                                    <input type="text" class="form-control" placeholder="John Doe" id="ccName">
                                </div>
                                <div class="form-group">
                                    <label>Card Number</label>
                                    <div class="input-with-icon">
                                        <ion-icon name="card-outline"></ion-icon>
                                        <input type="text" class="form-control" placeholder="0000 0000 0000 0000" id="ccNumber" maxlength="19">
                                    </div>
                                </div>
                                <div style="display: flex; gap: 1rem;">
                                    <div class="form-group" style="flex: 1;">
                                        <label>Expiry Date</label>
                                        <input type="text" class="form-control" placeholder="MM/YY" id="ccExpiry" maxlength="5">
                                    </div>
                                    <div class="form-group" style="flex: 1;">
                                        <label>CVC / CVV</label>
                                        <input type="password" class="form-control" placeholder="123" id="ccCvc" maxlength="4">
                                    </div>
                                </div>
                            </div>`;
            html = html.replace(regex, "$1" + '\n' + ccFormHtml);
            fs.writeFileSync(filePath, html);
            console.log('Injected ccFormBox into ' + filePath + ' (via regex)');
        }
    }
}

injectCcForm('index.html');
injectCcForm('cinewatch-app/index.html');

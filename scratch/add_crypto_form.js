const fs = require('fs');

function injectCryptoForm(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    
    const targetStr = '<div class="cc-form-box" id="ccFormBox" style="display: none;">';
    
    if (html.includes(targetStr)) {
        if (!html.includes('id="cryptoFormBox"')) {
            const cryptoFormHtml = `
                            <div class="cc-form-box" id="cryptoFormBox" style="display: none;">
                                <div class="form-group">
                                    <label>Transaction Hash (TXID) / Sender Address</label>
                                    <input type="text" class="form-control" placeholder="e.g. 0x123...abc or TR7..." id="cryptoTxid">
                                </div>
                            </div>`;
                            
            html = html.replace(targetStr, cryptoFormHtml + '\n' + targetStr);
            fs.writeFileSync(filePath, html);
            console.log('Injected cryptoFormBox into ' + filePath);
        } else {
            console.log('cryptoFormBox already exists in ' + filePath);
        }
    } else {
        console.log('Could not find ccFormBox in ' + filePath);
    }
}

injectCryptoForm('index.html');
injectCryptoForm('cinewatch-app/index.html');

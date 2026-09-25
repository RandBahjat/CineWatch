const fs = require('fs');
const path = require('path');

// 1. UPDATE HTML FILES
const htmlFiles = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'cinewatch-app', 'index.html')
];

const paypalHtmlCard = `
                                <label class="checkout-method-card" data-wallet="paypal">
                                    <input type="radio" name="payment_method">
                                    <span class="method-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.794.794 0 0 1 .784-.666h6.545c3.273 0 5.483 1.636 5.109 4.966-.35 3.125-2.428 4.793-5.32 4.793H9.497l-1.397 7.74a.79.79 0 0 1-.778.683l-.246.1z" fill="#003087"/><path d="M9.135 12.813l1.107-6.136c.038-.21.218-.364.432-.364h3.693c1.782 0 3.09.435 3.328 2.052.27 1.83-1.077 3.356-2.923 3.771-1.317.297-2.73.344-4.148.36a1.1 1.1 0 0 0-.964.978l-.525 3.16-1.545 3.992a.64.64 0 0 1-.63.74h-4.606a.64.64 0 0 1-.633-.74l3.106-16.877a.794.794 0 0 1 .784-.666h6.545c3.273 0 5.483 1.636 5.109 4.966-.35 3.125-2.428 4.793-5.32 4.793H9.497l-.362 2.003z" fill="#0079C1"/></svg></span>
                                    <div class="method-info">
                                        <span class="method-name">PayPal</span>
                                        <span class="method-desc">Worldwide</span>
                                    </div>
                                </label>`;

htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    if (!content.includes('data-wallet="paypal"')) {
      // Insert paypal right after the visa card
      content = content.replace(
        /(<label class="checkout-method-card" data-wallet="visa">[\s\S]*?<\/label>)/,
        `$1${paypalHtmlCard}`
      );
      fs.writeFileSync(file, content, 'utf8');
      console.log('Added PayPal to HTML in:', file);
    }
  }
});

// 2. UPDATE JS FILES
const jsFiles = [
  path.join(__dirname, '..', 'movie.js'),
  path.join(__dirname, '..', 'cinewatch-app', 'movie.js')
];

const paypalWalletObj = `  paypal: {
    name: "PayPal",
    number: "payments@cinewatch.watch",
    copyValue: "payments@cinewatch.watch",
    holder: "CineWatch VIP",
    note: "Send the plan amount via PayPal to this email address.",
    color: "#0079C1",
    logoSvg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" style="display:block;"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.794.794 0 0 1 .784-.666h6.545c3.273 0 5.483 1.636 5.109 4.966-.35 3.125-2.428 4.793-5.32 4.793H9.497l-1.397 7.74a.79.79 0 0 1-.778.683l-.246.1z" fill="#003087"/><path d="M9.135 12.813l1.107-6.136c.038-.21.218-.364.432-.364h3.693c1.782 0 3.09.435 3.328 2.052.27 1.83-1.077 3.356-2.923 3.771-1.317.297-2.73.344-4.148.36a1.1 1.1 0 0 0-.964.978l-.525 3.16-1.545 3.992a.64.64 0 0 1-.63.74h-4.606a.64.64 0 0 1-.633-.74l3.106-16.877a.794.794 0 0 1 .784-.666h6.545c3.273 0 5.483 1.636 5.109 4.966-.35 3.125-2.428 4.793-5.32 4.793H9.497l-.362 2.003z" fill="#0079C1"/></svg>'
  },
`;

jsFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Add paypal to VIP_WALLETS if not present
    if (!content.includes('paypal: {')) {
      content = content.replace(
        /(const VIP_WALLETS = \{)/,
        `$1\n${paypalWalletObj}`
      );
    }

    // Update renderVipWalletDetails to support paypal
    content = content.replace(
      /if \(walletKey === 'usdt'\) \{[\s\S]*?\} else if \(walletKey === 'mastercard' \|\| walletKey === 'visa'\) \{/,
      `if (walletKey === 'usdt') {
      refLabel.textContent = "Transaction Hash (TXID) / Sender Address";
      refInput.placeholder = "e.g. 0x123...abc or TR7...";
      if (refPrefix) refPrefix.style.display = 'none';
    } else if (walletKey === 'paypal') {
      refLabel.textContent = "Sender PayPal Email / Transaction ID";
      refInput.placeholder = "yourname@example.com or Transaction ID";
      if (refPrefix) {
        refPrefix.style.display = 'flex';
        refPrefix.textContent = '@';
      }
    } else if (walletKey === 'mastercard' || walletKey === 'visa') {`
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated PayPal in JS for:', file);
  }
});

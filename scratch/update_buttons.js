const fs = require('fs');

const replacement = `<div class="checkout-actions-vertical">
                                <button class="btn-checkout-confirm btn-whatsapp" id="vipWhatsappBtn">
                                    <ion-icon name="logo-whatsapp"></ion-icon> Complete Purchase
                                </button>
                                <p class="action-hint">Send payment receipt via WhatsApp for instant activation.</p>
                            </div>`;

['index.html', 'cinewatch-app/index.html'].forEach(p => {
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    // We replace the entire <div class="checkout-actions-vertical"> block
    c = c.replace(/<div class="checkout-actions-vertical">[\s\S]*?<\/div>/, replacement);
    fs.writeFileSync(p, c);
  }
});
console.log('Done!');

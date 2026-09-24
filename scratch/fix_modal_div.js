const fs = require('fs');

function checkAndFix(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Check if vip-grid is closed but vip-step-plans is NOT closed before vip-step-checkout
  const pattern = /(<\/div>\s*<\/div>\s*)(<!-- STEP 2: Local Wallet Payment View -->\s*<div class="vip-step-checkout)/;
  
  // If only 1 </div> before STEP 2, that means vip-step-plans was not closed!
  const badPattern = /(\s*<\/div>\s*\n\s*<!-- STEP 2: Local Wallet Payment View -->)/;

  console.log(filePath, 'has badPattern?', badPattern.test(html));
  
  if (badPattern.test(html) && !html.includes('</div>\n            </div>\n            \n            <!-- STEP 2: Local Wallet Payment View -->')) {
    html = html.replace(
      /(\s*<\/div>\s*\n)(\s*<!-- STEP 2: Local Wallet Payment View -->)/,
      '$1            </div>\n$2'
    );
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Fixed missing </div> in', filePath);
  }
}

checkAndFix('index.html');
checkAndFix('cinewatch-app/index.html');

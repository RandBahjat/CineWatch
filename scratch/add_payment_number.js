const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function updateMovieJs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match fastpay through fib in VIP_WALLETS
  const oldWalletsRegex = /fastpay:\s*\{[\s\S]*?logoSvg:\s*'<span class="wallet-tab-icon"[\s\S]*?<\/span>'\s*\},[\s\S]*?zaincash:\s*\{[\s\S]*?logoSvg:\s*'<svg[\s\S]*?<\/svg>'\s*\},[\s\S]*?fib:\s*\{[\s\S]*?logoSvg:\s*'<svg[\s\S]*?<\/svg>'\s*\}/;

  const newWallets = `fastpay: {
    name: "FastPay",
    number: "0774 820 1148",
    copyValue: "07748201148",
    holder: "CineWatch VIP",
    note: "Send payment via FastPay mobile app to this number. Send receipt screenshot to Telegram or WhatsApp for instant activation.",
    color: "#e11d48",
    logoSvg: '<span class="wallet-tab-icon" style="background:#ffffff; padding:3px 8px; border-radius:6px; display:inline-flex; align-items:center; justify-content:center; height:24px;"><img src="fastpay-logo.png" alt="FastPay" style="height:16px; width:auto; max-width:65px; object-fit:contain; display:block;" /></span>'
  },
  zaincash: {
    name: "ZainCash",
    number: "0774 820 1148",
    copyValue: "07748201148",
    holder: "CineWatch VIP",
    note: "Send cash transfer via ZainCash wallet to this phone number. Send receipt screenshot to Telegram or WhatsApp for instant activation.",
    color: "#007a78",
    logoSvg: '<svg viewBox="0 0 52 52" width="22" height="22" fill="none" style="display:block;"><circle cx="26" cy="26" r="26" fill="#007A78"/><g transform="translate(4.5, 3) scale(0.8)"><path d="m 47.863425,22.3321 c 0,-4.995 -3.8425,-8.775 -9.32625,-8.3538 -11.635,0.8925 -13.1375,14.1288 -5.56375,14.975 7.92,0.885 10.755,-7.49 10.9075,-7.9612 0.001,-0.01 0.007,0 0.007,0 0.0175,0.5675 0.43875,12.0912 -11.31125,12.0912 -6.1075,0 -9.24875,-4.99 -9.24875,-9.315 0,-6.4112 6.235,-12.7862 15.03375,-13.1262 4.9275,-0.1913 8.17375,0.9737 10.7175,3.5162 5.18375,5.1838 3.69125,14.9025 -0.50375,19.7025 -6.66,7.6175 -16.02,9.5538 -24.74125,5.6425 -8.72125,-3.91 -11.8475,-15.2325 -6.56125,-24.7062 1.94375,-3.485 9.00375,-11.2488 21.13625,-11.2488 15.40375,0 23.215,10.9188 21.80375,23.745 -1.08,9.8288 -7.05,16.9463 -9.8175,19.9538 -12.15875,13.215 -30.02625,15.8488 -41.2862499,8.9763 -6.19625,-3.7813 -9.79875005,-10.5713 -8.99875005,-18.2525 0.68625,5.5487 3.45250005,10.3487 8.05500005,13.4875 9.2024999,6.2762 24.5924999,7.1387 35.7149999,-5.0925 -11.1775,8.3487 -24.24,8.2237 -33.15875,2.4125 C 2.5366751,43.4471 0.28667505,32.8034 4.2941751,22.2759 c -2.01125,9.385 1.22,18.0862 8.3187499,22.62 11.06375,7.0675 27.18375,3.0037 37.34125,-8.3775 3.46125,-3.8788 5.44625,-9.11 5.3825,-13.885 -0.1075,-7.96 -5.655,-15.1063 -16.855,-15.1063 -11.49625,0 -19.39375,8.8863 -19.39375,16.2838 0,8.2112 5.635,12.8962 12.98625,12.8962 7.2675,0 15.78875,-4.5862 15.78875,-14.3762" fill="#FFFFFF"/></g></svg>'
  },
  fib: {
    name: "First Iraqi Bank (FIB)",
    number: "0774 820 1148",
    copyValue: "07748201148",
    holder: "CineWatch VIP (FIB Direct Transfer)",
    note: "Transfer using First Iraqi Bank (FIB) app to this registered phone number. Instant activation upon receipt.",
    color: "#4fb498",
    logoSvg: '<svg viewBox="0 0 32 32" width="22" height="22" fill="none" style="display:block;"><circle cx="16" cy="16" r="16" fill="#0F172A"/><g transform="translate(4, 3) scale(0.68)"><path d="M25.2993 18.1182L19.9895 14.0447L7.87014 4.80315H16.1996C19.1788 4.80315 21.5973 7.22837 21.5973 10.2008C21.5973 11.0182 21.4149 11.7883 21.0906 12.4841L24.948 15.443C25.8667 13.9096 26.4004 12.1193 26.4004 10.2008C26.4004 4.56671 21.8337 0 16.1996 0H0V4.74911L14.0446 15.5309L14.1392 15.5984L21.5027 21.246C21.6108 21.3136 21.7121 21.3811 21.8135 21.4554L21.9148 21.5297C23.2456 22.5633 24.0833 24.2184 24.0023 26.0559C23.8671 28.9473 21.4216 31.1968 18.5303 31.1968H4.8099V20.3948H16.2132H17.0373L10.7818 15.5984H0.0135036V36H18.6114C24.2454 36 28.8122 31.4333 28.8122 25.7992C28.8122 22.7322 27.4611 19.9827 25.3196 18.1115" fill="#4FB498"/></g></svg>'
  }`;

  if (oldWalletsRegex.test(content)) {
    content = content.replace(oldWalletsRegex, newWallets);
    console.log('Replaced VIP_WALLETS in ' + filePath);
  } else {
    console.log('Regex did not match in ' + filePath);
  }

  // Update waBtn link
  const oldWaRegex = /const waBtn = document\.getElementById\("vipWhatsappBtn"\);\r?\n\s*if \(waBtn\) waBtn\.href = `https:\/\/wa\.me\/\?text=\$\{msg\}`;/;
  const newWa = 'const waBtn = document.getElementById("vipWhatsappBtn");\n  if (waBtn) waBtn.href = `https://wa.me/9647748201148?text=${msg}`;';
  content = content.replace(oldWaRegex, newWa);

  // Update copyBtn logic
  content = content.replace(
    /navigator\.clipboard\.writeText\(w\.number\)/g,
    'navigator.clipboard.writeText(w.copyValue || w.number)'
  );
  content = content.replace(
    /showToast\("Copied: " \+ w\.number\)/g,
    'showToast("Copied: " + (w.copyValue || w.number))'
  );

  fs.writeFileSync(filePath, content, 'utf8');
}

function updateIndexHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /href="https:\/\/wa\.me\/"/g,
    'href="https://wa.me/9647748201148"'
  );
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Replaced in ' + filePath);
}

updateMovieJs(path.join(rootDir, 'movie.js'));
updateMovieJs(path.join(rootDir, 'cinewatch-app', 'movie.js'));
updateIndexHtml(path.join(rootDir, 'index.html'));
updateIndexHtml(path.join(rootDir, 'cinewatch-app', 'index.html'));

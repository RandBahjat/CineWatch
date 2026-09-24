const fs = require('fs');
const path = require('path');

function updateMovieJs(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Update VIP_TIER_CONFIG
  const oldConfigRegex = /const VIP_TIER_CONFIG = \{[\s\S]*?\n\};/;

  const newConfig = `const VIP_TIER_CONFIG = {
  free: {
    name: "Basic",
    monthly: { price: "0", iqd: "", period: "/ forever", btnText: "Current Plan" },
    yearly: { price: "0", iqd: "", period: "/ forever", btnText: "Current Plan" }
  },
  bronze: {
    name: "Advanced",
    monthly: { price: "8", iqd: "", period: "/ mo", btnText: "Upgrade to Advanced" },
    yearly: { price: "25", iqd: "", period: "/ year", btnText: "Claim Advanced Annual" }
  },
  gold: {
    name: "Pro",
    monthly: { price: "15", iqd: "", period: "/ mo", btnText: "Upgrade to Pro" },
    yearly: { price: "50", iqd: "", period: "/ year", btnText: "Claim Pro Annual" }
  },
  diamond: {
    name: "Ultimate",
    yearlyName: "Ultimate 1-Year Pass",
    monthly: { price: "20", iqd: "", period: "/ mo", btnText: "Upgrade to Ultimate" },
    yearly: { price: "100", iqd: "", period: "/ year", btnText: "Claim Ultimate Pass ($100)" }
  }
};`;

  if (oldConfigRegex.test(content)) {
    content = content.replace(oldConfigRegex, newConfig);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated VIP_TIER_CONFIG in', filePath);
  } else {
    console.log('Regex failed in', filePath);
  }
}

updateMovieJs(path.join(__dirname, '..', 'movie.js'));
updateMovieJs(path.join(__dirname, '..', 'cinewatch-app', 'movie.js'));

// Update discount badge in index.html if desired
function updateIndexHtml(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace(/<span class="billing-discount-badge">[^<]*<\/span>/g, '<span class="billing-discount-badge">Save up to 70%</span>');
  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Updated discount badge in', filePath);
}

updateIndexHtml(path.join(__dirname, '..', 'index.html'));
updateIndexHtml(path.join(__dirname, '..', 'cinewatch-app', 'index.html'));

const fs = require('fs');
const path = require('path');

// 1. Update movie.css in root and cinewatch-app
function updateCss(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Update .billing-btn width
  content = content.replace(
    /\.billing-btn \{\s*justify-content: center;\s*flex: 1;\s*width: 140px;/,
    '.billing-btn {\n  justify-content: center;\n  flex: 1;\n  min-width: 105px;\n  width: auto;'
  );

  // Update .billing-slider-glider and data-active positions
  const gliderRegex = /\.billing-slider-glider \{[\s\S]*?\.vip-billing-switch\[data-active="yearly"\] \.billing-slider-glider \{\s*transform: translateX\(100%\);\s*\}/;

  const newGliderCss = `.billing-slider-glider {
  position: absolute;
  top: 4px;
  left: 4px;
  bottom: 4px;
  width: calc((100% - 8px) / 3);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.07));
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  z-index: 1;
}

.vip-billing-switch[data-active="monthly"] .billing-slider-glider {
  transform: translateX(0%);
}

.vip-billing-switch[data-active="quarterly"] .billing-slider-glider {
  transform: translateX(100%);
}

.vip-billing-switch[data-active="yearly"] .billing-slider-glider {
  transform: translateX(200%);
}`;

  if (gliderRegex.test(content)) {
    content = content.replace(gliderRegex, newGliderCss);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated CSS glider in', filePath);
  } else {
    console.log('Glider regex failed in', filePath);
  }
}

// 2. Update movie.js in root and cinewatch-app
function updateJs(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Update VIP_TIER_CONFIG and setVipBillingCycle
  const configAndFunctionRegex = /const VIP_TIER_CONFIG = \{[\s\S]*?window\.setVipBillingCycle = setVipBillingCycle;/;

  const newConfigAndFunction = `const VIP_TIER_CONFIG = {
  free: {
    name: "Basic",
    monthly: { price: "0", iqd: "", period: "/ forever", btnText: "Current Plan" },
    quarterly: { price: "0", iqd: "", period: "/ forever", btnText: "Current Plan" },
    yearly: { price: "0", iqd: "", period: "/ forever", btnText: "Current Plan" }
  },
  bronze: {
    name: "Advanced",
    monthly: { price: "8", iqd: "", period: "/ mo", btnText: "Upgrade to Advanced" },
    quarterly: { price: "25", iqd: "", period: "/ 3 mo", btnText: "Upgrade to Advanced" },
    yearly: { price: "100", iqd: "", period: "/ year", btnText: "Upgrade to Advanced" }
  },
  gold: {
    name: "Pro",
    monthly: { price: "15", iqd: "", period: "/ mo", btnText: "Upgrade to Pro" },
    quarterly: { price: "50", iqd: "", period: "/ 3 mo", btnText: "Upgrade to Pro" },
    yearly: { price: "150", iqd: "", period: "/ year", btnText: "Upgrade to Pro" }
  },
  diamond: {
    name: "Ultimate",
    yearlyName: "Ultimate 1-Year Pass",
    monthly: { price: "20", iqd: "", period: "/ mo", btnText: "Upgrade to Ultimate" },
    quarterly: { price: "100", iqd: "", period: "/ 3 mo", btnText: "Upgrade to Ultimate" },
    yearly: { price: "200", iqd: "", period: "/ year", btnText: "Upgrade to Ultimate" }
  }
};

let currentVipBillingCycle = "monthly";

let selectedVipTierData = {
  tier: "diamond",
  name: "Ultimate (Monthly)",
  price: "20",
  iqd: ""
};

let currentVipWalletKey = "fastpay";

function setVipBillingCycle(cycle) {
  currentVipBillingCycle = cycle;
  const switchEl = document.getElementById("vipBillingSwitch");
  const monthlyBtn = document.getElementById("billingBtnMonthly");
  const quarterlyBtn = document.getElementById("billingBtnQuarterly");
  const yearlyBtn = document.getElementById("billingBtnYearly");

  if (switchEl) switchEl.setAttribute("data-active", cycle);
  if (monthlyBtn) {
    monthlyBtn.classList.toggle("active", cycle === "monthly");
    monthlyBtn.setAttribute("aria-checked", cycle === "monthly");
  }
  if (quarterlyBtn) {
    quarterlyBtn.classList.toggle("active", cycle === "quarterly");
    quarterlyBtn.setAttribute("aria-checked", cycle === "quarterly");
  }
  if (yearlyBtn) {
    yearlyBtn.classList.toggle("active", cycle === "yearly");
    yearlyBtn.setAttribute("aria-checked", cycle === "yearly");
  }

  const cycleLabel = cycle === "yearly" ? "Annual" : cycle === "quarterly" ? "3 Months" : "Monthly";

  // Update Bronze / Advanced
  const bronzeData = VIP_TIER_CONFIG.bronze[cycle] || VIP_TIER_CONFIG.bronze.monthly;
  const amtBronze = document.getElementById("vipAmountBronze");
  const periodBronze = document.getElementById("vipPeriodBronze");
  const localBronze = document.getElementById("vipLocalBronze");
  const btnBronze = document.getElementById("vipBtnBronze");
  if (amtBronze) amtBronze.textContent = bronzeData.price;
  if (periodBronze) periodBronze.textContent = bronzeData.period;
  if (localBronze) localBronze.textContent = "";
  if (btnBronze) {
    btnBronze.textContent = bronzeData.btnText;
    btnBronze.dataset.price = bronzeData.price;
    btnBronze.dataset.iqd = "";
    btnBronze.dataset.name = \`Advanced (\${cycleLabel})\`;
  }

  // Update Gold / Pro
  const goldData = VIP_TIER_CONFIG.gold[cycle] || VIP_TIER_CONFIG.gold.monthly;
  const amtGold = document.getElementById("vipAmountGold");
  const periodGold = document.getElementById("vipPeriodGold");
  const localGold = document.getElementById("vipLocalGold");
  const btnGold = document.getElementById("vipBtnGold");
  if (amtGold) amtGold.textContent = goldData.price;
  if (periodGold) periodGold.textContent = goldData.period;
  if (localGold) localGold.textContent = "";
  if (btnGold) {
    btnGold.textContent = goldData.btnText;
    btnGold.dataset.price = goldData.price;
    btnGold.dataset.iqd = "";
    btnGold.dataset.name = \`Pro (\${cycleLabel})\`;
  }

  // Update Diamond / Ultimate
  const diamondData = VIP_TIER_CONFIG.diamond[cycle] || VIP_TIER_CONFIG.diamond.monthly;
  const amtDiamond = document.getElementById("vipAmountDiamond");
  const periodDiamond = document.getElementById("vipPeriodDiamond");
  const localDiamond = document.getElementById("vipLocalDiamond");
  const btnDiamond = document.getElementById("vipBtnDiamond");
  const diamondTitle = document.getElementById("diamondTitle");
  const diamondTag = document.getElementById("diamondTag");
  const diamondBadge = document.getElementById("diamondBadge");

  if (amtDiamond) amtDiamond.textContent = diamondData.price;
  if (periodDiamond) periodDiamond.textContent = diamondData.period;
  if (localDiamond) localDiamond.textContent = "";
  if (diamondTitle) {
    diamondTitle.textContent = cycle === "yearly" ? "Ultimate 1-Year Pass" : "Ultimate";
  }
  if (diamondTag) {
    diamondTag.textContent = cycle === "yearly" ? "BEST VALUE • 1-YEAR PASS" : cycle === "quarterly" ? "POPULAR • 3 MONTHS" : "ULTIMATE VIP";
  }
  if (diamondBadge) {
    diamondBadge.textContent = cycle === "yearly" ? "1-Year Pass" : cycle === "quarterly" ? "3-Month Pass" : "Ultimate";
  }
  if (btnDiamond) {
    btnDiamond.textContent = diamondData.btnText;
    btnDiamond.dataset.price = diamondData.price;
    btnDiamond.dataset.iqd = "";
    btnDiamond.dataset.name = cycle === "yearly" ? "Ultimate 1-Year Pass" : \`Ultimate (\${cycleLabel})\`;
  }
}
window.setVipBillingCycle = setVipBillingCycle;`;

  if (configAndFunctionRegex.test(content)) {
    content = content.replace(configAndFunctionRegex, newConfigAndFunction);
    
    // Add event listener for quarterlyBtn
    const btnListenersRegex = /const monthlyBtn = document\.getElementById\("billingBtnMonthly"\);\s*const yearlyBtn = document\.getElementById\("billingBtnYearly"\);\s*if \(monthlyBtn\) \{\s*monthlyBtn\.onclick = \(\) => setVipBillingCycle\("monthly"\);\s*\}\s*if \(yearlyBtn\) \{\s*yearlyBtn\.onclick = \(\) => setVipBillingCycle\("yearly"\);\s*\}/;

    const newBtnListeners = `const monthlyBtn = document.getElementById("billingBtnMonthly");
  const quarterlyBtn = document.getElementById("billingBtnQuarterly");
  const yearlyBtn = document.getElementById("billingBtnYearly");
  if (monthlyBtn) {
    monthlyBtn.onclick = () => setVipBillingCycle("monthly");
  }
  if (quarterlyBtn) {
    quarterlyBtn.onclick = () => setVipBillingCycle("quarterly");
  }
  if (yearlyBtn) {
    yearlyBtn.onclick = () => setVipBillingCycle("yearly");
  }`;

    if (btnListenersRegex.test(content)) {
      content = content.replace(btnListenersRegex, newBtnListeners);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated JS logic in', filePath);
  } else {
    console.log('JS regex failed in', filePath);
  }
}

// 3. Update index.html in root and cinewatch-app
function updateHtml(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  const oldSwitchRegex = /<div class="vip-billing-switch" id="vipBillingSwitch" role="radiogroup" aria-label="Billing cycle">[\s\S]*?<div class="billing-slider-glider" id="billingSliderGlider"><\/div>\s*<\/div>/;

  const newSwitch = `<div class="vip-billing-switch" id="vipBillingSwitch" role="radiogroup" aria-label="Billing cycle" data-active="monthly">
                            <button type="button" class="billing-btn active" id="billingBtnMonthly" data-period="monthly" aria-checked="true" role="radio">
                                <span>Month</span>
                            </button>
                            <button type="button" class="billing-btn" id="billingBtnQuarterly" data-period="quarterly" aria-checked="false" role="radio">
                                <span>3 Months</span>
                            </button>
                            <button type="button" class="billing-btn" id="billingBtnYearly" data-period="yearly" aria-checked="false" role="radio">
                                <span>Year</span>
                                <span class="billing-discount-badge">Save Best Value</span>
                            </button>
                            <div class="billing-slider-glider" id="billingSliderGlider"></div>
                        </div>`;

  if (oldSwitchRegex.test(content)) {
    content = content.replace(oldSwitchRegex, newSwitch);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated HTML switcher in', filePath);
  } else {
    console.log('HTML regex failed in', filePath);
  }
}

updateCss(path.join(__dirname, '..', 'movie.css'));
updateCss(path.join(__dirname, '..', 'cinewatch-app', 'movie.css'));

updateJs(path.join(__dirname, '..', 'movie.js'));
updateJs(path.join(__dirname, '..', 'cinewatch-app', 'movie.js'));

updateHtml(path.join(__dirname, '..', 'index.html'));
updateHtml(path.join(__dirname, '..', 'cinewatch-app', 'index.html'));

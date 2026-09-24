const fs = require('fs');
const path = require('path');

const appMovieJs = path.join(__dirname, '..', 'cinewatch-app', 'movie.js');
if (fs.existsSync(appMovieJs)) {
  let content = fs.readFileSync(appMovieJs, 'utf8');

  const oldConfigRegex = /const VIP_TIER_CONFIG = \{[\s\S]*?\n\};\s*let currentVipBillingCycle = "monthly";\s*let selectedVipTierData = \{[\s\S]*?\};/;

  const newConfig = `const VIP_TIER_CONFIG = {
  free: {
    name: "Basic",
    monthly: { price: "0", iqd: "", period: "/ forever", btnText: "Current Plan" },
    yearly: { price: "0", iqd: "", period: "/ forever", btnText: "Current Plan" }
  },
  bronze: {
    name: "Advanced",
    monthly: { price: "2.99", iqd: "", period: "/ mo", btnText: "Upgrade to Advanced" },
    yearly: { price: "24", iqd: "", period: "/ year", btnText: "Claim Advanced Annual" }
  },
  gold: {
    name: "Pro",
    monthly: { price: "5.99", iqd: "", period: "/ mo", btnText: "Upgrade to Pro" },
    yearly: { price: "49", iqd: "", period: "/ year", btnText: "Claim Pro Annual" }
  },
  diamond: {
    name: "Ultimate",
    yearlyName: "Ultimate 1-Year Pass",
    monthly: { price: "9.99", iqd: "", period: "/ mo", btnText: "Upgrade to Ultimate" },
    yearly: { price: "100", iqd: "", period: "/ year", btnText: "Claim Ultimate Pass ($100)" }
  }
};

let currentVipBillingCycle = "monthly";

let selectedVipTierData = {
  tier: "diamond",
  name: "Ultimate (Monthly)",
  price: "9.99",
  iqd: ""
};`;

  if (oldConfigRegex.test(content)) {
    content = content.replace(oldConfigRegex, newConfig);
    console.log("cinewatch-app VIP_TIER_CONFIG replaced successfully.");
  }

  const oldSetCycleRegex = /function setVipBillingCycle\(cycle\) \{[\s\S]*?\n\}\s*window\.setVipBillingCycle = setVipBillingCycle;/;

  const newSetCycle = `function setVipBillingCycle(cycle) {
  currentVipBillingCycle = cycle;
  const switchEl = document.getElementById("vipBillingSwitch");
  const monthlyBtn = document.getElementById("billingBtnMonthly");
  const yearlyBtn = document.getElementById("billingBtnYearly");

  if (switchEl) switchEl.setAttribute("data-active", cycle);
  if (monthlyBtn) {
    monthlyBtn.classList.toggle("active", cycle === "monthly");
    monthlyBtn.setAttribute("aria-checked", cycle === "monthly");
  }
  if (yearlyBtn) {
    yearlyBtn.classList.toggle("active", cycle === "yearly");
    yearlyBtn.setAttribute("aria-checked", cycle === "yearly");
  }

  // Update Bronze / Advanced
  const bronzeData = VIP_TIER_CONFIG.bronze[cycle];
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
    btnBronze.dataset.name = \`Advanced (\${cycle === 'yearly' ? 'Annual' : 'Monthly'})\`;
  }

  // Update Gold / Pro
  const goldData = VIP_TIER_CONFIG.gold[cycle];
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
    btnGold.dataset.name = \`Pro (\${cycle === 'yearly' ? 'Annual' : 'Monthly'})\`;
  }

  // Update Diamond / Ultimate
  const diamondData = VIP_TIER_CONFIG.diamond[cycle];
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
    diamondTag.textContent = cycle === "yearly" ? "BEST VALUE • 1-YEAR PASS" : "ULTIMATE VIP";
  }
  if (diamondBadge) {
    diamondBadge.textContent = cycle === "yearly" ? "1-Year Pass" : "Ultimate";
  }
  if (btnDiamond) {
    btnDiamond.textContent = diamondData.btnText;
    btnDiamond.dataset.price = diamondData.price;
    btnDiamond.dataset.iqd = "";
    btnDiamond.dataset.name = cycle === "yearly" ? "Ultimate 1-Year Pass" : "Ultimate (Monthly)";
  }
}
window.setVipBillingCycle = setVipBillingCycle;`;

  if (oldSetCycleRegex.test(content)) {
    content = content.replace(oldSetCycleRegex, newSetCycle);
    console.log("cinewatch-app setVipBillingCycle replaced successfully.");
  }

  fs.writeFileSync(appMovieJs, content, 'utf8');
}

const appIndexHtml = path.join(__dirname, '..', 'cinewatch-app', 'index.html');
if (fs.existsSync(appIndexHtml)) {
  let html = fs.readFileSync(appIndexHtml, 'utf8');
  // Remove local-price spans with IQD
  html = html.replace(/<span class="vip-local-price"[^>]*>[^<]*<\/span>/g, '');
  fs.writeFileSync(appIndexHtml, html, 'utf8');
  console.log("cinewatch-app index.html cleaned of IQD successfully.");
}

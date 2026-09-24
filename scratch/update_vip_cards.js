const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../movie.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const newCSS = `
/* ======================================================== */
/* NEW VIP CARD DESIGN (BASED ON USER REQUEST)              */
/* ======================================================== */
.card-tier {
  --white: hsl(0, 0%, 100%);
  --black: hsl(240, 15%, 9%);
  --paragraph: hsl(0, 0%, 83%);
  --line: hsl(240, 9%, 17%);

  /* Default (Diamond) */
  --primary: hsl(189, 92%, 58%);
  --grad1: hsl(189, 99%, 26%);
  --grad2: hsl(189, 97%, 36%);
  --grad3: hsl(188, 94%, 13%);
  --border-glow: hsl(189, 100%, 50%);

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  width: 100%; /* Will be controlled by grid */
  background-color: hsla(240, 15%, 9%, 1);
  background-image: radial-gradient(at 88% 40%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
    radial-gradient(at 49% 30%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
    radial-gradient(at 14% 26%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
    radial-gradient(at 0% 64%, var(--grad1) 0px, transparent 85%),
    radial-gradient(at 41% 94%, var(--grad2) 0px, transparent 85%),
    radial-gradient(at 100% 99%, var(--grad3) 0px, transparent 85%);
  border-radius: 1rem;
  box-shadow: 0px -16px 24px 0px rgba(255, 255, 255, 0.1) inset;
  transition: transform 0.3s ease;
  z-index: 1;
}

.card-tier:hover {
  transform: translateY(-5px);
}

.card-tier.card-free {
  --primary: hsl(0, 0%, 60%);
  --grad1: hsl(0, 0%, 26%);
  --grad2: hsl(0, 0%, 36%);
  --grad3: hsl(0, 0%, 13%);
  --border-glow: hsl(0, 0%, 50%);
}

.card-tier.card-bronze {
  --primary: hsl(30, 70%, 50%);
  --grad1: hsl(30, 80%, 26%);
  --grad2: hsl(30, 70%, 36%);
  --grad3: hsl(30, 90%, 13%);
  --border-glow: hsl(30, 100%, 50%);
}

.card-tier.card-gold {
  --primary: hsl(45, 90%, 50%);
  --grad1: hsl(45, 90%, 26%);
  --grad2: hsl(45, 90%, 36%);
  --grad3: hsl(45, 90%, 13%);
  --border-glow: hsl(45, 100%, 50%);
}

.card-tier.card-diamond {
  /* Default variables are Diamond */
}

.card-tier .card__border {
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  z-index: -10;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  background-image: linear-gradient(0deg, hsl(0, 0%, 100%) -50%, hsl(0, 0%, 40%) 100%);
  border-radius: 1rem;
}

.card-tier .card__border::before {
  content: "";
  pointer-events: none;
  position: absolute;
  z-index: 200;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%), rotate(0deg);
  transform-origin: left;
  width: 200%;
  height: 10rem;
  background-image: linear-gradient(
    0deg,
    hsla(0, 0%, 100%, 0) 0%,
    var(--border-glow) 40%,
    var(--border-glow) 60%,
    hsla(0, 0%, 40%, 0) 100%
  );
  animation: rotate-card-border 8s linear infinite;
}

@keyframes rotate-card-border {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.card-tier .card_title__container {
  text-align: left;
}

.card-tier .card_title__container .card_title {
  font-size: 1.25rem;
  color: var(--white);
  font-weight: bold;
}

.card-tier .card_title__container .card_paragraph {
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: var(--paragraph);
}

.card-tier .line {
  width: 100%;
  height: 0.1rem;
  background-color: var(--line);
  border: none;
  margin: 0.5rem 0;
}

.card-tier .card__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.card-tier .card__list .card__list_item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-tier .card__list .card__list_item.disabled {
  opacity: 0.5;
}

.card-tier .card__list .card__list_item.disabled .check {
  background-color: var(--line);
}
.card-tier .card__list .card__list_item.disabled .check_svg {
  fill: #ff4444; /* red cross indication, or just keep black */
}

.card-tier .card__list .card__list_item .check {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.25rem;
  height: 1.25rem;
  background-color: var(--primary);
  border-radius: 50%;
  flex-shrink: 0;
}

.card-tier .card__list .card__list_item .check .check_svg {
  width: 0.85rem;
  height: 0.85rem;
  fill: var(--black);
}

.card-tier .card__list .card__list_item .list_text {
  font-size: 0.85rem;
  color: var(--white);
  text-align: left;
}

.card-tier .button {
  cursor: pointer;
  padding: 0.75rem;
  width: 100%;
  background-image: linear-gradient(0deg, var(--primary), var(--grad1) 100%);
  font-size: 1rem;
  font-weight: 600;
  color: var(--white);
  border: 0;
  border-radius: 9999px;
  box-shadow: inset 0 -2px 10px -4px rgba(255,255,255,0.5);
  margin-top: auto;
  transition: opacity 0.2s;
}

.card-tier .button:hover {
  opacity: 0.9;
}
`;

if (!cssContent.includes('.card-tier {')) {
  cssContent += newCSS;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
}

// ----------------------------------------------------
// 2. Rewrite index.html VIP grid
// ----------------------------------------------------

const indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Find the start and end of <div class="vip-grid">
const gridStartIdx = indexHtml.indexOf('<div class="vip-grid">');
const gridEndIdx = indexHtml.indexOf('<!-- STEP 2: Local Wallet Payment View -->');

if (gridStartIdx !== -1 && gridEndIdx !== -1) {
  const newVipGrid = `<div class="vip-grid">
                    
                    <!-- Plan 1: Free Explorer -->
                    <div class="card-tier card-free" data-tier="free">
                      <div class="card__border"></div>
                      <div class="card_title__container">
                        <span class="card_title notranslate" translate="no">Free Explorer</span>
                        <p class="card_paragraph">
                          <span class="vip-amount">0</span> <span class="vip-period">/ forever</span>
                          <br><span style="font-size:0.75rem; color:#888;">0 IQD</span>
                        </p>
                      </div>
                      <hr class="line" />
                      <ul class="card__list">
                        <li class="card__list_item">
                          <span class="check"><svg class="check_svg" fill="currentColor" viewBox="0 0 16 16"><path clip-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fill-rule="evenodd"></path></svg></span>
                          <span class="list_text">Standard 720p/1080p stream</span>
                        </li>
                        <li class="card__list_item">
                          <span class="check"><svg class="check_svg" fill="currentColor" viewBox="0 0 16 16"><path clip-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fill-rule="evenodd"></path></svg></span>
                          <span class="list_text">Standard servers (2, 3, 4)</span>
                        </li>
                        <li class="card__list_item disabled">
                          <span class="check"><svg class="check_svg" style="fill:#fff;" viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg></span>
                          <span class="list_text">Ad-free video playback</span>
                        </li>
                        <li class="card__list_item disabled">
                          <span class="check"><svg class="check_svg" style="fill:#fff;" viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg></span>
                          <span class="list_text">Access to 4K Ultra HD Section</span>
                        </li>
                      </ul>
                      <button class="button vip-btn-action" data-tier="free">Current Plan</button>
                    </div>

                    <!-- Plan 2: Bronze -->
                    <div class="card-tier card-bronze" data-tier="bronze">
                      <div class="card__border"></div>
                      <div class="card_title__container">
                        <span class="card_title notranslate" translate="no">Bronze VIP</span>
                        <p class="card_paragraph">
                          $<span class="vip-amount">2.99</span> <span class="vip-period">/ mo</span>
                          <br><span style="font-size:0.75rem; color:#888;">4,500 IQD</span>
                        </p>
                      </div>
                      <hr class="line" />
                      <ul class="card__list">
                        <li class="card__list_item">
                          <span class="check"><svg class="check_svg" fill="currentColor" viewBox="0 0 16 16"><path clip-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fill-rule="evenodd"></path></svg></span>
                          <span class="list_text">Ad-free Site Experience</span>
                        </li>
                        <li class="card__list_item">
                          <span class="check"><svg class="check_svg" fill="currentColor" viewBox="0 0 16 16"><path clip-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fill-rule="evenodd"></path></svg></span>
                          <span class="list_text">VIP Badge on Profile</span>
                        </li>
                        <li class="card__list_item disabled">
                          <span class="check"><svg class="check_svg" style="fill:#fff;" viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg></span>
                          <span class="list_text">Access to 4K Ultra HD Section</span>
                        </li>
                      </ul>
                      <button class="button vip-btn-action" data-tier="bronze">Upgrade to Bronze</button>
                    </div>

                    <!-- Plan 3: Gold -->
                    <div class="card-tier card-gold" data-tier="gold">
                      <div class="card__border"></div>
                      <div class="card_title__container">
                        <span class="card_title notranslate" translate="no" style="display:flex; justify-content:space-between;">Gold VIP <span style="font-size:0.7rem; background:red; color:white; padding:2px 6px; border-radius:10px;">POPULAR</span></span>
                        <p class="card_paragraph">
                          $<span class="vip-amount">5.99</span> <span class="vip-period">/ mo</span>
                          <br><span style="font-size:0.75rem; color:#888;">9,000 IQD</span>
                        </p>
                      </div>
                      <hr class="line" />
                      <ul class="card__list">
                        <li class="card__list_item">
                          <span class="check"><svg class="check_svg" fill="currentColor" viewBox="0 0 16 16"><path clip-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fill-rule="evenodd"></path></svg></span>
                          <span class="list_text">All Bronze Features</span>
                        </li>
                        <li class="card__list_item">
                          <span class="check"><svg class="check_svg" fill="currentColor" viewBox="0 0 16 16"><path clip-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fill-rule="evenodd"></path></svg></span>
                          <span class="list_text">Access to 4K Ultra HD Section</span>
                        </li>
                        <li class="card__list_item">
                          <span class="check"><svg class="check_svg" fill="currentColor" viewBox="0 0 16 16"><path clip-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fill-rule="evenodd"></path></svg></span>
                          <span class="list_text">Download for offline</span>
                        </li>
                      </ul>
                      <button class="button vip-btn-action" data-tier="gold">Upgrade to Gold</button>
                    </div>

                    <!-- Plan 4: Diamond -->
                    <div class="card-tier card-diamond" data-tier="diamond">
                      <div class="card__border"></div>
                      <div class="card_title__container">
                        <span class="card_title notranslate" translate="no" style="display:flex; justify-content:space-between;">Diamond VIP <span style="font-size:0.7rem; background:#00ffff; color:black; padding:2px 6px; border-radius:10px;">BEST VALUE</span></span>
                        <p class="card_paragraph">
                          $<span class="vip-amount">9.99</span> <span class="vip-period">/ mo</span>
                          <br><span style="font-size:0.75rem; color:#888;">15,000 IQD</span>
                        </p>
                      </div>
                      <hr class="line" />
                      <ul class="card__list">
                        <li class="card__list_item">
                          <span class="check"><svg class="check_svg" fill="currentColor" viewBox="0 0 16 16"><path clip-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fill-rule="evenodd"></path></svg></span>
                          <span class="list_text">All Gold Features</span>
                        </li>
                        <li class="card__list_item">
                          <span class="check"><svg class="check_svg" fill="currentColor" viewBox="0 0 16 16"><path clip-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fill-rule="evenodd"></path></svg></span>
                          <span class="list_text">Request missing Movies/Series</span>
                        </li>
                        <li class="card__list_item">
                          <span class="check"><svg class="check_svg" fill="currentColor" viewBox="0 0 16 16"><path clip-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fill-rule="evenodd"></path></svg></span>
                          <span class="list_text">Early Access to Features</span>
                        </li>
                      </ul>
                      <button class="button vip-btn-action" data-tier="diamond">Upgrade to Diamond</button>
                    </div>

                </div>
                
                `;

  const before = indexHtml.substring(0, gridStartIdx);
  const after = indexHtml.substring(gridEndIdx);
  
  indexHtml = before + newVipGrid + after;
  fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
}

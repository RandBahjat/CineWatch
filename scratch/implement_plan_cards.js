const fs = require('fs');

const css = `
/* ======================================================== */
/* NEW VIP PRICING DESIGN                                   */
/* ======================================================== */
.plan-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.plan-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.plan-card {
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #111;
  padding: 0.25rem;
}

.plan-top {
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.25rem;
}

.plan-blob-a {
  position: absolute;
  top: -3rem;
  right: -3rem;
  width: 13rem;
  height: 13rem;
  border-radius: 50%;
  opacity: 0.55;
  filter: blur(48px);
  pointer-events: none;
}

.plan-blob-b {
  position: absolute;
  top: 33%;
  left: -2rem;
  width: 15rem;
  height: 15rem;
  border-radius: 50%;
  opacity: 0.25;
  filter: blur(48px);
  pointer-events: none;
}

.plan-grain {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  mix-blend-mode: overlay;
  pointer-events: none;
}

.plan-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.plan-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
}

.plan-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  margin: 0 0 0.125rem 0;
  color: #fff;
}

.plan-desc {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.plan-price-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.plan-price {
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #fff;
}

.plan-per {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.45);
}

.plan-cta {
  width: 100%;
  border-radius: 9999px;
  font-weight: 600;
  padding: 0.75rem;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 0.5rem;
}

.plan-cta-light {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  backdrop-filter: blur(4px);
}
.plan-cta-light:hover { background: rgba(255, 255, 255, 0.25); }

.plan-cta-dark {
  background: #fff;
  color: #000;
}
.plan-cta-dark:hover { background: rgba(255, 255, 255, 0.85); }

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem 0.25rem 0 0.25rem;
}

.plan-feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.plan-feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}
.plan-feature-item ion-icon {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.4);
}

/* Palette variations */
.palette-slate .plan-top { background: #0f172a; }
.palette-slate .plan-blob-a { background: #64748b; }
.palette-slate .plan-blob-b { background: #475569; }

.palette-blue .plan-top { background: #172554; }
.palette-blue .plan-blob-a { background: #3b82f6; }
.palette-blue .plan-blob-b { background: #0284c7; }

.palette-purple .plan-top { background: #2e1065; }
.palette-purple .plan-blob-a { background: #8b5cf6; }
.palette-purple .plan-blob-b { background: #9333ea; }

.palette-amber .plan-top { background: #451a03; }
.palette-amber .plan-blob-a { background: #f59e0b; }
.palette-amber .plan-blob-b { background: #d97706; }
`;

const html = `
          <div class="vip-step-plans" id="vipStepPlans">
            <div class="plan-container">
              <div style="margin-bottom: 2rem; text-align: center;">
                <h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem;">CineWatch VIP</h2>
                <p style="color: rgba(255,255,255,0.6);">Choose the plan that works for you. No ads, 4K quality, pure cinema.</p>
                <div class="vip-fp-toggle-row" style="margin-top: 1.5rem; justify-content: center;">
                  <div class="vip-billing-switch" id="vipBillingSwitch" role="radiogroup" aria-label="Billing cycle" data-active="monthly">
                    <button type="button" class="billing-btn active" id="billingBtnMonthly" data-period="monthly" aria-checked="true" role="radio">Month</button>
                    <button type="button" class="billing-btn" id="billingBtnQuarterly" data-period="quarterly" aria-checked="false" role="radio">3 Months</button>
                    <button type="button" class="billing-btn" id="billingBtnYearly" data-period="yearly" aria-checked="false" role="radio">Year</button>
                  </div>
                  <span class="vip-fp-save-note">Save Best Value</span>
                </div>
              </div>

              <div class="plan-grid">
                
                <!-- Basic Plan -->
                <div class="plan-card palette-slate">
                  <div class="plan-top">
                    <div class="plan-blob-a"></div>
                    <div class="plan-blob-b"></div>
                    <svg class="plan-grain" xmlns="http://www.w3.org/2000/svg"><filter id="grain-basic"><feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#grain-basic)"/></svg>
                    
                    <div class="plan-content">
                      <div class="plan-title">Basic</div>
                      <div class="plan-desc">Free browsing with ads</div>
                      
                      <div class="plan-price-row">
                        <span class="plan-price">$0</span>
                      </div>
                      
                      <button class="plan-cta plan-cta-light" style="opacity:0.5; cursor:not-allowed;">Current Plan</button>
                    </div>
                  </div>
                  
                  <div class="plan-features">
                    <ul class="plan-feature-list">
                      <li class="plan-feature-item"><ion-icon name="checkmark-outline"></ion-icon> 720p / 1080p streaming</li>
                      <li class="plan-feature-item"><ion-icon name="close-outline"></ion-icon> Ad-free site experience</li>
                      <li class="plan-feature-item"><ion-icon name="close-outline"></ion-icon> 4K Ultra HD section</li>
                      <li class="plan-feature-item"><ion-icon name="close-outline"></ion-icon> Download for offline</li>
                    </ul>
                  </div>
                </div>

                <!-- Advanced Plan -->
                <div class="plan-card palette-blue">
                  <div class="plan-top">
                    <div class="plan-blob-a"></div>
                    <div class="plan-blob-b"></div>
                    <svg class="plan-grain" xmlns="http://www.w3.org/2000/svg"><filter id="grain-advanced"><feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#grain-advanced)"/></svg>
                    
                    <div class="plan-content">
                      <div class="plan-title">Advanced</div>
                      <div class="plan-desc">Great for getting started</div>
                      
                      <div class="plan-price-row">
                        <span class="plan-price">$<span id="vipAmountBronze">8</span></span>
                        <span class="plan-per">/mo</span>
                      </div>
                      
                      <button class="plan-cta plan-cta-light select-plan-btn" id="vipBtnBronze" data-tier="bronze" data-price="8" data-name="Advanced (Monthly)">Upgrade</button>
                    </div>
                  </div>
                  
                  <div class="plan-features">
                    <ul class="plan-feature-list">
                      <li class="plan-feature-item"><ion-icon name="checkmark-outline"></ion-icon> 720p / 1080p streaming</li>
                      <li class="plan-feature-item"><ion-icon name="checkmark-outline"></ion-icon> Ad-free site experience</li>
                      <li class="plan-feature-item"><ion-icon name="checkmark-outline"></ion-icon> VIP badge on profile</li>
                      <li class="plan-feature-item"><ion-icon name="close-outline"></ion-icon> 4K Ultra HD section</li>
                      <li class="plan-feature-item"><ion-icon name="close-outline"></ion-icon> Download for offline</li>
                    </ul>
                  </div>
                </div>

                <!-- Pro Plan -->
                <div class="plan-card palette-purple">
                  <div class="plan-top">
                    <div class="plan-blob-a"></div>
                    <div class="plan-blob-b"></div>
                    <svg class="plan-grain" xmlns="http://www.w3.org/2000/svg"><filter id="grain-pro"><feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#grain-pro)"/></svg>
                    
                    <div class="plan-content">
                      <div>
                        <span class="plan-badge">POPULAR</span>
                      </div>
                      <div class="plan-title">Pro</div>
                      <div class="plan-desc">Everything you need</div>
                      
                      <div class="plan-price-row">
                        <span class="plan-price">$<span id="vipAmountGold">15</span></span>
                        <span class="plan-per">/mo</span>
                      </div>
                      
                      <button class="plan-cta plan-cta-light select-plan-btn" id="vipBtnGold" data-tier="gold" data-price="15" data-name="Pro (Monthly)">Upgrade</button>
                    </div>
                  </div>
                  
                  <div class="plan-features">
                    <ul class="plan-feature-list">
                      <li class="plan-feature-item"><ion-icon name="checkmark-outline"></ion-icon> 720p / 1080p streaming</li>
                      <li class="plan-feature-item"><ion-icon name="checkmark-outline"></ion-icon> Ad-free site experience</li>
                      <li class="plan-feature-item"><ion-icon name="checkmark-outline"></ion-icon> VIP badge on profile</li>
                      <li class="plan-feature-item"><ion-icon name="checkmark-outline"></ion-icon> 4K Ultra HD section</li>
                      <li class="plan-feature-item"><ion-icon name="checkmark-outline"></ion-icon> Download for offline</li>
                    </ul>
                  </div>
                </div>

                <!-- Ultimate Plan -->
                <div class="plan-card palette-amber">
                  <div class="plan-top">
                    <div class="plan-blob-a"></div>
                    <div class="plan-blob-b"></div>
                    <svg class="plan-grain" xmlns="http://www.w3.org/2000/svg"><filter id="grain-ultimate"><feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#grain-ultimate)"/></svg>
                    
                    <div class="plan-content">
                      <div>
                        <span class="plan-badge" style="background: rgba(0,0,0,0.4);">BEST VALUE</span>
                      </div>
                      <div class="plan-title">Ultimate</div>
                      <div class="plan-desc">The full experience</div>
                      
                      <div class="plan-price-row">
                        <span class="plan-price">$<span id="vipAmountDiamond">20</span></span>
                        <span class="plan-per">/mo</span>
                      </div>
                      
                      <button class="plan-cta plan-cta-dark select-plan-btn" id="vipBtnDiamond" data-tier="diamond" data-price="20" data-name="Ultimate (Monthly)">Upgrade</button>
                    </div>
                  </div>
                  
                  <div class="plan-features">
                    <ul class="plan-feature-list">
                      <li class="plan-feature-item"><ion-icon name="checkmark-outline"></ion-icon> 720p / 1080p streaming</li>
                      <li class="plan-feature-item"><ion-icon name="checkmark-outline"></ion-icon> Ad-free site experience</li>
                      <li class="plan-feature-item"><ion-icon name="checkmark-outline"></ion-icon> VIP badge on profile</li>
                      <li class="plan-feature-item"><ion-icon name="checkmark-outline"></ion-icon> 4K Ultra HD section</li>
                      <li class="plan-feature-item"><ion-icon name="checkmark-outline"></ion-icon> Download for offline</li>
                      <li class="plan-feature-item"><ion-icon name="checkmark-outline"></ion-icon> Request missing titles</li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
`;

let content = fs.readFileSync('index.html', 'utf8');
const startIndex = content.indexOf('<div class="vip-step-plans" id="vipStepPlans">');
const endIndex = content.indexOf('<div class="vip-step-checkout hidden" id="vipStepCheckout">');
if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + html + "          </div>\n          " + content.substring(endIndex);
    fs.writeFileSync('index.html', content);
    console.log("Updated HTML");
}

let cssContent = fs.readFileSync('movie.css', 'utf8');
cssContent += css;
fs.writeFileSync('movie.css', cssContent);
console.log("Updated CSS");


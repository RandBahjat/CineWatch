const fs = require('fs');
const path = require('path');

function updateJs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update loadState to grant Rand Bahjat / admin VIP access
  const oldLoadStateUser = `    const savedUser = sessionStorage.getItem(KEYS.USER);
    if (savedUser) state.user = JSON.parse(savedUser);
    if (typeof updateAdsVisibility === 'function') updateAdsVisibility();`;

  const newLoadStateUser = `    const savedUser = sessionStorage.getItem(KEYS.USER) || localStorage.getItem(KEYS.USER) || localStorage.getItem('cinewatch_user');
    if (savedUser) {
      state.user = typeof savedUser === 'string' ? JSON.parse(savedUser) : savedUser;
      const uName = (state.user?.name || state.user?.displayName || '').toLowerCase();
      const uEmail = (state.user?.email || '').toLowerCase();
      if (uName.includes('rand') || uEmail.includes('rand') || uName.includes('admin') || uEmail.includes('admin')) {
        state.user.isVip = true;
        state.user.vipTier = 'Ultimate';
        localStorage.setItem('cw_is_vip', 'true');
        localStorage.setItem('cw_vip_tier', 'Ultimate');
        sessionStorage.setItem('cw_is_vip', 'true');
      }
    }
    if (typeof updateAdsVisibility === 'function') updateAdsVisibility();`;

  if (content.includes(oldLoadStateUser)) {
    content = content.replace(oldLoadStateUser, newLoadStateUser);
  }

  // 2. Update saveUser to grant Rand Bahjat / admin VIP access
  const oldSaveUser = `function saveUser(userObj) {
  state.user = userObj;
  localStorage.removeItem(KEYS.USER);
  if (userObj) {
    sessionStorage.setItem(KEYS.USER, JSON.stringify(userObj));
  }`;

  const newSaveUser = `function saveUser(userObj) {
  if (userObj) {
    const uName = (userObj.name || userObj.displayName || '').toLowerCase();
    const uEmail = (userObj.email || '').toLowerCase();
    if (uName.includes('rand') || uEmail.includes('rand') || uName.includes('admin') || uEmail.includes('admin')) {
      userObj.isVip = true;
      userObj.vipTier = 'Ultimate';
      localStorage.setItem('cw_is_vip', 'true');
      localStorage.setItem('cw_vip_tier', 'Ultimate');
      sessionStorage.setItem('cw_is_vip', 'true');
    }
  }
  state.user = userObj;
  localStorage.removeItem(KEYS.USER);
  if (userObj) {
    sessionStorage.setItem(KEYS.USER, JSON.stringify(userObj));
  }`;

  if (content.includes(oldSaveUser)) {
    content = content.replace(oldSaveUser, newSaveUser);
  }

  // 3. Update isUserVip to recognize Rand Bahjat / admin
  const oldIsUserVip = `function isUserVip() {
  if (localStorage.getItem('cw_is_vip') === 'true') return true;
  if (sessionStorage.getItem('cw_is_vip') === 'true') return true;
  if (state && state.user && state.user.isVip) return true;
  try {
    const u = JSON.parse(sessionStorage.getItem('cinewatch_user') || localStorage.getItem('cinewatch_user') || '{}');
    if (u && u.isVip) return true;
  } catch(e) {}
  return false;
}`;

  const newIsUserVip = `function isUserVip() {
  if (localStorage.getItem('cw_is_vip') === 'true') return true;
  if (sessionStorage.getItem('cw_is_vip') === 'true') return true;
  if (state && state.user && state.user.isVip) return true;
  try {
    const u = JSON.parse(sessionStorage.getItem('cinewatch_user') || localStorage.getItem('cinewatch_user') || localStorage.getItem('cw_user') || '{}');
    if (u && u.isVip) return true;
    const uName = ((state && state.user && state.user.name) || u.name || u.displayName || '').toLowerCase();
    const uEmail = ((state && state.user && state.user.email) || u.email || '').toLowerCase();
    if (uName.includes('rand') || uEmail.includes('rand') || uName.includes('admin') || uEmail.includes('admin')) {
      return true;
    }
  } catch(e) {}
  if (state && state.user) {
    const uName = (state.user.name || '').toLowerCase();
    const uEmail = (state.user.email || '').toLowerCase();
    if (uName.includes('rand') || uEmail.includes('rand') || uName.includes('admin') || uEmail.includes('admin')) {
      return true;
    }
  }
  return false;
}`;

  if (content.includes(oldIsUserVip)) {
    content = content.replace(oldIsUserVip, newIsUserVip);
  }

  // 4. Update canCustomizeTheme to return true (unlocked for all in sidebar)
  const oldCanCustomize = `function canCustomizeTheme() {
  if (!isUserVip()) return false;
  const tier = (localStorage.getItem('cw_vip_tier') || state.user?.vipTier || '').toLowerCase();
  if (tier.includes('basic') || tier.includes('free')) return false;
  return true; // Advanced, Pro, Ultimate, VIP
}`;

  const newCanCustomize = `function canCustomizeTheme() {
  return true;
}`;

  if (content.includes(oldCanCustomize)) {
    content = content.replace(oldCanCustomize, newCanCustomize);
  }

  // 5. Update onThemeSwatchClick & onCustomColorChange to remove any lock alert
  const oldSwatchClick = `window.onThemeSwatchClick = function(themeId) {
  if (!canCustomizeTheme()) {
    if (typeof showToast === 'function') {
      showToast("🔒 Theme colors are unlocked on Advanced, Pro & Ultimate tiers!", "warning");
    }
    if (typeof closePanel === 'function') closePanel();
    if (typeof openVipModal === 'function') openVipModal();
    return;
  }

  const theme = CW_THEMES.find(t => t.id === themeId);
  if (theme) {
    applyThemeColor(theme);
    if (typeof showToast === 'function') {
      showToast(\`🎨 Theme changed to \${theme.name}!\`, "success");
    }
  }
};

window.onCustomColorChange = function(newHex) {
  if (!canCustomizeTheme()) {
    if (typeof showToast === 'function') {
      showToast("🔒 Theme colors are unlocked on Advanced, Pro & Ultimate tiers!", "warning");
    }
    if (typeof closePanel === 'function') closePanel();
    if (typeof openVipModal === 'function') openVipModal();
    return;
  }

  applyThemeColor(newHex, null, null, "Custom");
  if (typeof showToast === 'function') {
    showToast(\`🎨 Custom theme applied!\`, "success");
  }
};`;

  const newSwatchClick = `window.onThemeSwatchClick = function(themeId) {
  const theme = CW_THEMES.find(t => t.id === themeId);
  if (theme) {
    applyThemeColor(theme);
    if (typeof showToast === 'function') {
      showToast(\`🎨 Theme changed to \${theme.name}!\`, "success");
    }
  }
};

window.onCustomColorChange = function(newHex) {
  applyThemeColor(newHex, null, null, "Custom");
  if (typeof showToast === 'function') {
    showToast(\`🎨 Custom theme applied!\`, "success");
  }
};`;

  if (content.includes(oldSwatchClick)) {
    content = content.replace(oldSwatchClick, newSwatchClick);
  }

  // 6. In applyThemeColor, update badge element
  const oldApplyEnd = `  const customInput = document.getElementById('cwCustomColorInput');
  if (customInput) customInput.value = primaryHex;
}`;

  const newApplyEnd = `  const customInput = document.getElementById('cwCustomColorInput');
  if (customInput) customInput.value = primaryHex;

  const badgeEl = document.getElementById('cwThemeCurrentBadge');
  if (badgeEl) {
    badgeEl.innerHTML = \`
      <span class="theme-dot" style="background:\${primaryHex};"></span>
      <span class="theme-name-text">\${themeName}</span>
    \`;
  }
}`;

  if (content.includes(oldApplyEnd)) {
    content = content.replace(oldApplyEnd, newApplyEnd);
  }

  // 7. Update renderThemeSelectorHTML to remove lock and reorganize the button header
  const oldRenderThemeStart = `function renderThemeSelectorHTML() {
  const isEligible = canCustomizeTheme();
  const currentPrimary = localStorage.getItem('cw_theme_primary') || '#e50914';

  const swatchesHtml = CW_THEMES.map(t => {
    const isActive = currentPrimary.toLowerCase() === t.primary.toLowerCase();
    return \`<button type="button" class="cw-theme-swatch \${isActive ? 'active' : ''}" 
                   data-color="\${t.primary}" 
                   style="background: \${t.primary}; color: #fff;" 
                   title="\${t.name}" 
                   onclick="onThemeSwatchClick('\${t.id}')">
              \${isActive ? '<ion-icon name="checkmark-outline"></ion-icon>' : ''}
            </button>\`;
  }).join('');

  return \`
    <div class="account-panel-section-label" style="display:flex; justify-content:space-between; align-items:center; margin-top:1.2rem; padding: 0.8rem 1rem 0.45rem;">
      <span>🎨 ACCENT THEME COLOR</span>
      \${isEligible ? '<span class="theme-unlocked-badge">👑 UNLOCKED</span>' : '<span class="theme-locked-badge">🔒 ADVANCED+</span>'}
    </div>

    <div class="cw-theme-selector-box \${isEligible ? 'unlocked' : 'locked'}" style="margin: 0 0.6rem 0.8rem;">
      <div class="cw-theme-swatches">
        \${swatchesHtml}
        <label class="cw-theme-swatch custom-picker-btn" title="Choose Custom Hex Color" style="background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red); cursor:pointer;">
          <input type="color" id="cwCustomColorInput" value="\${currentPrimary}" onchange="onCustomColorChange(this.value)" style="position:absolute; opacity:0; width:0; height:0; pointer-events:none;">
          <ion-icon name="color-palette-outline" style="color:#fff; font-size:15px; text-shadow:0 1px 3px rgba(0,0,0,0.8);"></ion-icon>
        </label>
      </div>

      \${!isEligible ? \`
        <div class="cw-theme-lock-card" onclick="if(typeof closePanel==='function')closePanel(); if(typeof openVipModal==='function')openVipModal();">
          <div style="font-size:1.1rem; line-height:1;">🔒</div>
          <div style="flex:1; text-align:left;">
            <div style="font-size:0.8rem; font-weight:700; color:#fff;">Exclusive VIP Feature</div>
            <div style="font-size:0.72rem; color:#94a3b8;">Choose your cinema accent color with Advanced, Pro, or Ultimate</div>
          </div>
          <button class="cw-theme-upgrade-pill">Unlock</button>
        </div>
      \` : ''}
    </div>
  \`;
}
window.renderThemeSelectorHTML = renderThemeSelectorHTML;`;

  const newRenderTheme = `function renderThemeSelectorHTML() {
  const currentPrimary = localStorage.getItem('cw_theme_primary') || '#e50914';
  const currentThemeName = localStorage.getItem('cw_theme_name') || 'Crimson Red';

  const swatchesHtml = CW_THEMES.map(t => {
    const isActive = currentPrimary.toLowerCase() === t.primary.toLowerCase();
    return \`<button type="button" class="cw-theme-swatch \${isActive ? 'active' : ''}" 
                   data-color="\${t.primary}" 
                   style="background: \${t.primary}; color: #fff;" 
                   title="\${t.name}" 
                   onclick="onThemeSwatchClick('\${t.id}')">
              \${isActive ? '<ion-icon name="checkmark-outline"></ion-icon>' : ''}
            </button>\`;
  }).join('');

  return \`
    <div class="account-panel-section-label theme-section-header">
      <div class="theme-header-left">
        <span class="theme-header-icon">🎨</span>
        <span class="theme-header-title">ACCENT THEME</span>
      </div>
      <span class="theme-current-badge" id="cwThemeCurrentBadge">
        <span class="theme-dot" style="background:\${currentPrimary};"></span>
        <span class="theme-name-text">\${currentThemeName}</span>
      </span>
    </div>

    <div class="cw-theme-selector-box" style="margin: 0 0.6rem 0.8rem; padding: 12px;">
      <div class="cw-theme-swatches" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; align-items: center;">
        \${swatchesHtml}
        <label class="cw-theme-swatch custom-picker-btn" title="Choose Custom Hex Color" style="background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red); cursor:pointer;">
          <input type="color" id="cwCustomColorInput" value="\${currentPrimary}" onchange="onCustomColorChange(this.value)" style="position:absolute; opacity:0; width:0; height:0; pointer-events:none;">
          <ion-icon name="color-palette-outline" style="color:#fff; font-size:15px; text-shadow:0 1px 3px rgba(0,0,0,0.8);"></ion-icon>
        </label>
      </div>
    </div>
  \`;
}
window.renderThemeSelectorHTML = renderThemeSelectorHTML;`;

  // Normalize CRLF
  const normContent = content.replace(/\r\n/g, '\n');
  const normOld = oldRenderThemeStart.replace(/\r\n/g, '\n');

  if (normContent.includes(normOld)) {
    content = normContent.replace(normOld, newRenderTheme);
  } else {
    console.warn(`renderThemeSelectorHTML exact match not found, looking for function start...`);
    const fStart = normContent.indexOf('function renderThemeSelectorHTML()');
    if (fStart !== -1) {
      const fEnd = normContent.indexOf('window.renderThemeSelectorHTML = renderThemeSelectorHTML;', fStart) + 'window.renderThemeSelectorHTML = renderThemeSelectorHTML;'.length;
      content = normContent.slice(0, fStart) + newRenderTheme + normContent.slice(fEnd);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated JS in ${filePath}`);
}

function updateCss(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const cssToAdd = `
.theme-section-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 1.15rem 0.9rem 0.5rem !important;
  white-space: nowrap !important;
}

.theme-header-left {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.theme-header-icon {
  font-size: 0.95rem;
  line-height: 1;
}

.theme-header-title {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
}

.theme-current-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 3px 10px;
  border-radius: 999px;
  text-transform: capitalize;
  line-height: 1;
}

.theme-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 8px currentColor;
}
`;

  if (!content.includes('.theme-section-header')) {
    content += cssToAdd;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added theme header CSS to ${filePath}`);
  }
}

const rootCss = path.join(__dirname, 'movie.css');
const appCss = path.join(__dirname, 'cinewatch-app', 'movie.css');
const rootJs = path.join(__dirname, 'movie.js');
const appJs = path.join(__dirname, 'cinewatch-app', 'movie.js');

updateJs(rootJs);
updateJs(appJs);
updateCss(rootCss);
updateCss(appCss);

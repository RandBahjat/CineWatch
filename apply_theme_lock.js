const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const appDir = path.join(rootDir, 'cinewatch-app');

function updateMovieJs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. canCustomizeTheme
  const oldCanCustomize = `function canCustomizeTheme() {
  return true;
}
window.canCustomizeTheme = canCustomizeTheme;`;

  const newCanCustomize = `function canCustomizeTheme() {
  if (typeof isUserVip === 'function') {
    return isUserVip();
  }
  return false;
}
window.canCustomizeTheme = canCustomizeTheme;

function initThemeAccent() {
  if (canCustomizeTheme()) {
    const saved = localStorage.getItem('cw_theme_primary');
    if (saved) {
      const name = localStorage.getItem('cw_theme_name') || 'Custom';
      applyThemeColor(saved, null, null, name);
    }
  } else {
    // If not subscribed to VIP, enforce default Crimson Red
    applyThemeColor('red', null, null, 'Crimson Red');
  }
}
window.initThemeAccent = initThemeAccent;`;

  if (content.includes(oldCanCustomize)) {
    content = content.replace(oldCanCustomize, newCanCustomize);
  }

  // 2. onThemeSwatchClick & onCustomColorChange guard checks
  const oldSwatchClick = `window.onThemeSwatchClick = function(themeId) {
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

  const newSwatchClick = `window.onThemeSwatchClick = function(themeId) {
  if (!canCustomizeTheme()) {
    if (typeof showToast === 'function') {
      showToast("🔒 Subscribe to VIP to customize your site accent color!", "info");
    }
    if (typeof openVipModal === 'function') {
      openVipModal();
    }
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
      showToast("🔒 Subscribe to VIP to customize your site accent color!", "info");
    }
    if (typeof openVipModal === 'function') {
      openVipModal();
    }
    return;
  }
  applyThemeColor(newHex, null, null, "Custom");
  if (typeof showToast === 'function') {
    showToast(\`🎨 Custom theme applied!\`, "success");
  }
};`;

  if (content.includes(oldSwatchClick)) {
    content = content.replace(oldSwatchClick, newSwatchClick);
  }

  // 3. renderThemeSelectorHTML with lock when !isEligible
  const oldRenderTheme = `function renderThemeSelectorHTML() {
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

  const newRenderTheme = `function renderThemeSelectorHTML() {
  const isEligible = canCustomizeTheme();
  const currentPrimary = localStorage.getItem('cw_theme_primary') || '#e50914';
  const currentThemeName = localStorage.getItem('cw_theme_name') || 'Crimson Red';

  const swatchesHtml = CW_THEMES.map(t => {
    const isActive = currentPrimary.toLowerCase() === t.primary.toLowerCase();
    return \`<button type="button" class="cw-theme-swatch \${isActive ? 'active' : ''} \${!isEligible ? 'locked-swatch' : ''}" 
                   data-color="\${t.primary}" 
                   style="background: \${t.primary}; color: #fff; \${!isEligible ? 'filter: saturate(0.65) opacity(0.7); cursor: pointer;' : ''}" 
                   title="\${isEligible ? t.name : t.name + ' (VIP Only)'}" 
                   onclick="onThemeSwatchClick('\${t.id}')">
              \${isActive ? '<ion-icon name="checkmark-outline"></ion-icon>' : (!isEligible ? '<span class="swatch-mini-lock" style="font-size:10px; opacity:0.85; line-height:1;">🔒</span>' : '')}
            </button>\`;
  }).join('');

  return \`
    <div class="account-panel-section-label theme-section-header">
      <div class="theme-header-left">
        <span class="theme-header-icon">🎨</span>
        <span class="theme-header-title">ACCENT THEME</span>
      </div>
      \${isEligible ? \`
        <span class="theme-current-badge" id="cwThemeCurrentBadge">
          <span class="theme-dot" style="background:\${currentPrimary};"></span>
          <span class="theme-name-text">\${currentThemeName}</span>
        </span>
      \` : \`
        <span class="theme-locked-badge" style="display:inline-flex; align-items:center; gap:5px; cursor:pointer;" onclick="if(typeof closePanel==='function')closePanel(); if(typeof openVipModal==='function')openVipModal();" title="Click to view VIP plans">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> VIP ONLY
        </span>
      \`}
    </div>

    <div class="cw-theme-selector-box \${isEligible ? 'unlocked' : 'locked'}" style="margin: 0 0.6rem 0.8rem; padding: 12px; position:relative;">
      <div class="cw-theme-swatches" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; align-items: center;">
        \${swatchesHtml}
        <label class="cw-theme-swatch custom-picker-btn \${!isEligible ? 'locked-swatch' : ''}" title="\${isEligible ? 'Choose Custom Hex Color' : 'Custom Hex Color (VIP Only)'}" style="background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red); cursor:pointer; \${!isEligible ? 'filter: saturate(0.65) opacity(0.7);' : ''}" onclick="\${!isEligible ? 'onThemeSwatchClick(\\'custom\\'); return false;' : ''}">
          <input type="color" id="cwCustomColorInput" value="\${currentPrimary}" onchange="onCustomColorChange(this.value)" \${!isEligible ? 'disabled' : ''} style="position:absolute; opacity:0; width:0; height:0; pointer-events:none;">
          <ion-icon name="\${isEligible ? 'color-palette-outline' : 'lock-closed'}" style="color:#fff; font-size:14px; text-shadow:0 1px 3px rgba(0,0,0,0.8);"></ion-icon>
        </label>
      </div>

      \${!isEligible ? \`
        <div class="cw-theme-lock-card" onclick="if(typeof closePanel==='function')closePanel(); if(typeof openVipModal==='function')openVipModal();" style="margin-top: 12px; cursor: pointer;">
          <div style="font-size:1.15rem; line-height:1; color:#f59e0b;">🔒</div>
          <div style="flex:1; text-align:left;">
            <div style="font-size:0.82rem; font-weight:700; color:#fff;">Exclusive VIP Feature</div>
            <div style="font-size:0.72rem; color:rgba(255,255,255,0.65);">Subscribe to unlock custom site colors</div>
          </div>
          <button class="cw-theme-upgrade-pill" type="button">Unlock</button>
        </div>
      \` : ''}
    </div>
  \`;
}
window.renderThemeSelectorHTML = renderThemeSelectorHTML;`;

  if (content.includes(oldRenderTheme)) {
    content = content.replace(oldRenderTheme, newRenderTheme);
  }

  // 4. Update cancelVipSubscription to revert theme to Crimson Red
  const oldCancelSub = `  localStorage.setItem('userVipTier', 'free');
  window.userVipTier = 'free';

  if (state && state.user) {`;

  const newCancelSub = `  localStorage.setItem('userVipTier', 'free');
  window.userVipTier = 'free';

  // Revert theme to default Crimson Red since VIP is cancelled
  if (typeof applyThemeColor === 'function') {
    applyThemeColor('red', null, null, 'Crimson Red');
  }

  if (state && state.user) {`;

  if (content.includes(oldCancelSub)) {
    content = content.replace(oldCancelSub, newCancelSub);
  }

  // 5. In initApp(), ensure initThemeAccent is called
  const oldInitCall = `    renderUserBadge();
    updateWatchlistBadge();`;

  const newInitCall = `    renderUserBadge();
    updateWatchlistBadge();
    if (typeof initThemeAccent === 'function') initThemeAccent();`;

  if (content.includes(oldInitCall) && !content.includes('if (typeof initThemeAccent === \'function\') initThemeAccent();')) {
    content = content.replace(oldInitCall, newInitCall);
  }

  // 6. In activateVip(), re-init theme accent
  const oldActivateCall = `  updateAdsVisibility();
  renderVipBadges();
  renderUserBadge();`;

  const newActivateCall = `  if (typeof initThemeAccent === 'function') initThemeAccent();
  updateAdsVisibility();
  renderVipBadges();
  renderUserBadge();`;

  if (content.includes(oldActivateCall) && !content.includes('if (typeof initThemeAccent === \'function\') initThemeAccent();\n  updateAdsVisibility();')) {
    content = content.replace(oldActivateCall, newActivateCall);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated theme lock logic in: ${filePath}`);
}

function updateMovieCss(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const cssToAdd = `
.cw-theme-swatch.locked-swatch {
  filter: saturate(0.65) opacity(0.75);
  cursor: pointer;
  position: relative;
}

.cw-theme-swatch.locked-swatch:hover {
  filter: saturate(1) opacity(1);
  transform: scale(1.1);
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.45);
  border-color: #f59e0b;
}

.swatch-mini-lock {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  line-height: 1;
}
`;

  if (!content.includes('.cw-theme-swatch.locked-swatch')) {
    content += cssToAdd;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added locked swatch CSS to: ${filePath}`);
  }
}

function updateIndexHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/movie\.css\?v=[^"'\s>]+/g, 'movie.css?v=20260929_theme_lock');
  content = content.replace(/movie\.js\?v=[^"'\s>]+/g, 'movie.js?v=20260929_theme_lock');
  content = content.replace(/browse-fix\.css\?v=[^"'\s>]+/g, 'browse-fix.css?v=20260929_theme_lock');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated cache busters in: ${filePath}`);
}

updateMovieJs(path.join(rootDir, 'movie.js'));
updateMovieJs(path.join(appDir, 'movie.js'));

updateMovieCss(path.join(rootDir, 'movie.css'));
updateMovieCss(path.join(appDir, 'movie.css'));

updateIndexHtml(path.join(rootDir, 'index.html'));
updateIndexHtml(path.join(appDir, 'index.html'));

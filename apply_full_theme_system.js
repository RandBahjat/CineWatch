const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const appDir = path.join(rootDir, 'cinewatch-app');

// 1. Update movie.js & cinewatch-app/movie.js to compute and apply all theme variables
function updateMovieJs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace applyThemeColor to compute primary-subtle and primary-border and apply them
  const oldApplyThemeRegex = /function applyThemeColor\(themeOrHex, glow, hover, name\) \{[\s\S]*?window\.applyThemeColor = applyThemeColor;/;

  const newApplyTheme = `function applyThemeColor(themeOrHex, glow, hover, name) {
  let primaryHex = '#e50914';
  let glowRgba = 'rgba(229, 9, 20, 0.45)';
  let hoverHex = '#ff2e38';
  let themeName = 'Crimson Red';

  if (typeof themeOrHex === 'object' && themeOrHex !== null) {
    primaryHex = themeOrHex.primary;
    glowRgba = themeOrHex.glow;
    hoverHex = themeOrHex.hover;
    themeName = themeOrHex.name;
  } else if (typeof themeOrHex === 'string') {
    const found = CW_THEMES.find(t => t.id === themeOrHex || t.primary.toLowerCase() === themeOrHex.toLowerCase());
    if (found) {
      primaryHex = found.primary;
      glowRgba = found.glow;
      hoverHex = found.hover;
      themeName = found.name;
    } else {
      primaryHex = themeOrHex;
      const rgb = hexToRgb(primaryHex);
      glowRgba = \`rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, 0.45)\`;
      hoverHex = primaryHex;
      themeName = name || 'Custom';
    }
  }

  const rgb = hexToRgb(primaryHex);
  const primaryGlow = \`rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, 0.45)\`;
  const primarySubtle = \`rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, 0.16)\`;
  const primaryBorder = \`rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, 0.45)\`;
  const hoverHexVal = hoverHex || primaryHex;

  const root = document.documentElement;
  root.style.setProperty('--primary', primaryHex);
  root.style.setProperty('--primary-hover', hoverHexVal);
  root.style.setProperty('--primary-glow', primaryGlow);
  root.style.setProperty('--primary-subtle', primarySubtle);
  root.style.setProperty('--primary-border', primaryBorder);
  root.style.setProperty('--shadow-glow', \`0 0 20px \${primaryGlow}\`);

  localStorage.setItem('cw_theme_primary', primaryHex);
  localStorage.setItem('cw_theme_glow', primaryGlow);
  localStorage.setItem('cw_theme_hover', hoverHexVal);
  localStorage.setItem('cw_theme_subtle', primarySubtle);
  localStorage.setItem('cw_theme_border', primaryBorder);
  localStorage.setItem('cw_theme_name', themeName);

  // Update checkmarks in panel
  document.querySelectorAll('.cw-theme-swatch').forEach(btn => {
    const color = btn.dataset.color;
    if (color) {
      const isActive = color.toLowerCase() === primaryHex.toLowerCase();
      btn.classList.toggle('active', isActive);
      btn.innerHTML = isActive ? '<ion-icon name="checkmark-outline"></ion-icon>' : '';
    }
  });

  const customInput = document.getElementById('cwCustomColorInput');
  if (customInput) customInput.value = primaryHex;

  const badgeEl = document.getElementById('cwThemeCurrentBadge');
  if (badgeEl) {
    badgeEl.innerHTML = \`
      <span class="theme-dot" style="background:\${primaryHex};"></span>
      <span class="theme-name-text">\${themeName}</span>
    \`;
  }
}
window.applyThemeColor = applyThemeColor;`;

  if (oldApplyThemeRegex.test(content)) {
    content = content.replace(oldApplyThemeRegex, newApplyTheme);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated applyThemeColor in ${filePath}`);
  } else {
    console.warn(`Could not match applyThemeColor in ${filePath}`);
  }
}

// 2. Update movie.css & cinewatch-app/movie.css with the comprehensive Dynamic Theme System
function updateMovieCss(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Ensure root variables are declared
  if (!content.includes('--primary-subtle:')) {
    content = content.replace('--primary-glow: rgba(229, 9, 20, 0.4);', '--primary-glow: rgba(229, 9, 20, 0.4);\n  --primary-subtle: rgba(229, 9, 20, 0.16);\n  --primary-border: rgba(229, 9, 20, 0.45);');
  }

  const themeSystemCss = `
/* ==========================================================================
   DYNAMIC THEME ACCENT SYSTEM — ALL NAVBAR BUTTONS, ICONS & ACCENTS
   ========================================================================== */

/* Brand Logo Icon & Glow */
.brand-logo .brand-icon {
  background: linear-gradient(135deg, var(--primary-hover) 0%, var(--primary) 100%) !important;
  box-shadow: 0 4px 18px var(--primary-glow), inset 0 1px 1px rgba(255, 255, 255, 0.35) !important;
}
.brand-logo .brand-text span {
  color: var(--primary) !important;
  text-shadow: 0 0 16px var(--primary-glow) !important;
}

/* Navbar Home Link & Home Icon */
.nav-home-link.active {
  color: var(--primary) !important;
  background: var(--primary-subtle) !important;
  border: 1px solid var(--primary-border) !important;
  text-shadow: 0 0 12px var(--primary-glow) !important;
}
.nav-home-link.active ion-icon,
.nav-home-link.active svg {
  color: var(--primary) !important;
  stroke: var(--primary) !important;
}
.nav-home-link:hover {
  color: var(--primary) !important;
}
.nav-home-link:hover ion-icon {
  color: var(--primary) !important;
}

/* Navbar Browse Pill Button & 4-Square Icon */
.browse-btn-icon,
.nav-browse-pill-btn svg {
  color: var(--primary) !important;
}
.browse-btn-icon rect,
.browse-btn-icon circle {
  stroke: var(--primary) !important;
}
.browse-btn-icon circle {
  fill: var(--primary) !important;
}
.nav-browse-item.active .nav-browse-pill-btn,
.nav-browse-pill-btn.active,
.nav-browse-item.is-open .nav-browse-pill-btn {
  background: var(--primary-subtle) !important;
  border-color: var(--primary-border) !important;
  box-shadow: 0 0 16px var(--primary-glow) !important;
  color: #ffffff !important;
}

/* Navbar Browse Mega Dropdown Cards & Icons */
.nav-dropdown-icon {
  color: var(--primary) !important;
}
.nav-dropdown-icon ion-icon,
.nav-dropdown-icon svg {
  color: var(--primary) !important;
  fill: currentColor !important;
}
.nav-dropdown-card:hover {
  background: var(--primary-subtle) !important;
  border-color: var(--primary-border) !important;
  box-shadow: 0 6px 20px var(--primary-glow) !important;
  color: #ffffff !important;
}
.nav-dropdown-card.active {
  background: var(--primary-subtle) !important;
  border-color: var(--primary) !important;
  box-shadow: 0 0 14px var(--primary-glow) !important;
  color: #ffffff !important;
}

/* Search Lens Button & Modal Search Icon */
.nav-action-btn:hover {
  border-color: var(--primary-border) !important;
  color: var(--primary) !important;
  box-shadow: 0 0 16px var(--primary-glow) !important;
}
.modal-search-icon {
  color: var(--primary) !important;
}
.search-bg-glow {
  background: radial-gradient(ellipse at 50% 0%, var(--primary-glow), transparent 70%) !important;
}

/* Language Dropdown Active States & Checkmark */
.custom-lang-dropdown.open .lang-dropdown-selected,
.custom-lang-dropdown:hover .lang-dropdown-selected {
  background: var(--primary-subtle) !important;
  border-color: var(--primary-border) !important;
  box-shadow: 0 0 18px var(--primary-glow) !important;
}
.lang-option.active {
  background: var(--primary-subtle) !important;
  border-color: var(--primary-border) !important;
  box-shadow: 0 0 14px var(--primary-glow) !important;
}
.lang-check {
  color: var(--primary) !important;
}

/* Profile Icon Button Hover Ring */
.profile-icon-btn:hover {
  box-shadow: 0 0 0 3px var(--primary-border) !important;
}

/* Mobile Bottom Dock Active & Hover Icons */
.mobile-dock-btn.active {
  background: var(--primary) !important;
  box-shadow: 0 0 16px var(--primary-glow), inset 0 1px 1px rgba(255, 255, 255, 0.4) !important;
  color: #ffffff !important;
}
.mobile-dock-btn:hover {
  color: var(--primary) !important;
}
.mobile-dock-btn.active .dock-browse-icon rect {
  stroke: #ffffff !important;
}
.mobile-dock-btn.active .dock-browse-icon circle {
  fill: #ffffff !important;
}

/* Hero Play Buttons, Primary Action Buttons & Hover Glows */
.btn-primary,
.hero-play-btn,
.play-btn-circle {
  background: var(--primary) !important;
  border-color: var(--primary) !important;
  box-shadow: 0 4px 18px var(--primary-glow) !important;
  color: #ffffff !important;
}
.btn-primary:hover,
.hero-play-btn:hover,
.play-btn-circle:hover {
  background: var(--primary-hover) !important;
  border-color: var(--primary-hover) !important;
  box-shadow: 0 6px 24px var(--primary-glow) !important;
}
.card-play-btn,
.play-icon-overlay {
  background: var(--primary) !important;
  box-shadow: 0 0 16px var(--primary-glow) !important;
}

/* Active Filter Chips, Genre Pills, and Tabs */
.browse-filter-btn.active,
.filter-btn.active,
.genre-btn.active,
.genre-pill.active,
.browse-tab.active,
.tab-btn.active {
  background: var(--primary) !important;
  border-color: var(--primary) !important;
  box-shadow: 0 4px 18px var(--primary-glow) !important;
  color: #ffffff !important;
}

/* Movie Card Title Hover Accent */
.movie-card:hover .card-title,
.movie-card:hover .movie-title,
.movie-card:hover h3 {
  color: var(--primary) !important;
}

/* Watchlist & Favorites Active Accent */
.fav-btn.active,
.action-btn.active,
.btn-watchlist-custom.active {
  background: var(--primary) !important;
  border-color: var(--primary) !important;
  box-shadow: 0 0 14px var(--primary-glow) !important;
  color: #ffffff !important;
}

/* Top Progress Bar & Slider Indicator */
.top-loading-bar,
.top-progress-indicator {
  background: linear-gradient(90deg, var(--primary) 0%, var(--primary-hover) 70%, #ffffff 100%) !important;
  box-shadow: 0 0 16px var(--primary-glow) !important;
}

/* Sidebar Elements Theme Alignment */
.account-panel-avatar {
  background: var(--primary) !important;
  box-shadow: 0 0 0 3px var(--primary-border), 0 6px 20px rgba(0,0,0,0.5) !important;
}
.avatar-edit-badge {
  background: var(--primary) !important;
}
.avatar-edit-badge:hover {
  background: var(--primary-hover) !important;
}
.account-panel-action-btn:hover .panel-btn-icon {
  background: var(--primary) !important;
  color: #fff !important;
}
.account-panel-date svg {
  color: var(--primary) !important;
}
`;

  // Remove existing block if present to avoid duplication
  const marker = '/* ==========================================================================\n   DYNAMIC THEME ACCENT SYSTEM';
  if (content.includes(marker)) {
    const idx = content.indexOf(marker);
    content = content.slice(0, idx);
  }

  content += themeSystemCss;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated Dynamic Theme Accent System in ${filePath}`);
}

// 3. Update browse-fix.css & cinewatch-app/browse-fix.css
function updateBrowseFix(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/background: rgba\(229, 9, 20, 0\.12\) !important;/g, 'background: var(--primary-subtle) !important;');
  content = content.replace(/border: 1px solid rgba\(229, 9, 20, 0\.25\) !important;/g, 'border: 1px solid var(--primary-border) !important;');
  content = content.replace(/background: rgba\(229, 9, 20, 0\.95\) !important;/g, 'background: var(--primary) !important;');
  content = content.replace(/border-color: #e50914 !important;/g, 'border-color: var(--primary) !important;');
  content = content.replace(/box-shadow: 0 4px 18px rgba\(229, 9, 20, 0\.6\) !important;/g, 'box-shadow: 0 4px 18px var(--primary-glow) !important;');
  content = content.replace(/background: linear-gradient\(135deg, #e50914 0%, #b80710 100%\) !important;/g, 'background: var(--primary) !important;');
  content = content.replace(/box-shadow: 0 4px 18px rgba\(229, 9, 20, 0\.5\), inset 0 1px 0 rgba\(255, 255, 255, 0\.35\) !important;/g, 'box-shadow: 0 4px 18px var(--primary-glow), inset 0 1px 0 rgba(255, 255, 255, 0.35) !important;');
  content = content.replace(/color: #e50914 !important;/g, 'color: var(--primary) !important;');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated browse-fix.css in ${filePath}`);
}

// 4. Update welcome-disclaimer.css & cinewatch-app/welcome-disclaimer.css
function updateWelcomeDisclaimer(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/--cw-disc-red: #e50914;/g, '--cw-disc-red: var(--primary, #e50914);');
  content = content.replace(/--cw-disc-glow: rgba\(229, 9, 20, 0\.35\);/g, '--cw-disc-glow: var(--primary-glow, rgba(229, 9, 20, 0.35));');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated welcome-disclaimer.css in ${filePath}`);
}

// 5. Update index.html pre-render script
function updateIndexHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const oldPreRender = `        (function() {
          var p = localStorage.getItem('cw_theme_primary');
          if (p) {
            document.documentElement.style.setProperty('--primary', p);
            var h = localStorage.getItem('cw_theme_hover');
            if (h) document.documentElement.style.setProperty('--primary-hover', h);
            var g = localStorage.getItem('cw_theme_glow');
            if (g) {
              document.documentElement.style.setProperty('--primary-glow', g);
              document.documentElement.style.setProperty('--shadow-glow', '0 0 20px ' + g);
            }
          }
        })();`;

  const newPreRender = `        (function() {
          var p = localStorage.getItem('cw_theme_primary');
          if (p) {
            document.documentElement.style.setProperty('--primary', p);
            var h = localStorage.getItem('cw_theme_hover') || p;
            document.documentElement.style.setProperty('--primary-hover', h);
            try {
              var c = p.replace('#','');
              if (c.length === 3) c = c.split('').map(function(x){return x+x;}).join('');
              var num = parseInt(c, 16);
              var r = (num >> 16) & 255, g_val = (num >> 8) & 255, b = num & 255;
              var glow = 'rgba(' + r + ',' + g_val + ',' + b + ',0.45)';
              document.documentElement.style.setProperty('--primary-glow', glow);
              document.documentElement.style.setProperty('--primary-subtle', 'rgba(' + r + ',' + g_val + ',' + b + ',0.16)');
              document.documentElement.style.setProperty('--primary-border', 'rgba(' + r + ',' + g_val + ',' + b + ',0.45)');
              document.documentElement.style.setProperty('--shadow-glow', '0 0 20px ' + glow);
            } catch(e) {}
          }
        })();`;

  if (content.includes(oldPreRender)) {
    content = content.replace(oldPreRender, newPreRender);
  }

  // Bump cache busters to ?v=20260929_theme_all
  content = content.replace(/movie\.css\?v=[^"'\s>]+/g, 'movie.css?v=20260929_theme_all');
  content = content.replace(/movie\.js\?v=[^"'\s>]+/g, 'movie.js?v=20260929_theme_all');
  content = content.replace(/browse-fix\.css\?v=[^"'\s>]+/g, 'browse-fix.css?v=20260929_theme_all');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated pre-render & cache busters in ${filePath}`);
}

updateMovieJs(path.join(rootDir, 'movie.js'));
updateMovieJs(path.join(appDir, 'movie.js'));

updateMovieCss(path.join(rootDir, 'movie.css'));
updateMovieCss(path.join(appDir, 'movie.css'));

updateBrowseFix(path.join(rootDir, 'browse-fix.css'));
updateBrowseFix(path.join(appDir, 'browse-fix.css'));

updateWelcomeDisclaimer(path.join(rootDir, 'welcome-disclaimer.css'));
updateWelcomeDisclaimer(path.join(appDir, 'welcome-disclaimer.css'));

updateIndexHtml(path.join(rootDir, 'index.html'));
updateIndexHtml(path.join(appDir, 'index.html'));

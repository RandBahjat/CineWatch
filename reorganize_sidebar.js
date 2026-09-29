const fs = require('fs');
const path = require('path');

function updateCss(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the account-side-panel block up to .edit-username-wrap
  const startMarker = '/* The sliding panel */';
  const endMarker = '/* Inline username editor */';

  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    console.error(`Markers not found in ${filePath}`);
    return false;
  }

  const newCss = `/* The sliding panel */
.account-side-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  max-width: 90vw;
  height: 100vh;
  background: #141416;
  border-left: 1px solid rgba(255,255,255,0.08);
  z-index: 2510;
  transform: translateX(100%);
  transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 32px rgba(0,0,0,0.6);
}

.account-side-panel.open {
  transform: translateX(0);
}

.account-panel-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
  overflow: hidden;
}

/* Header */
.account-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.3rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  flex-shrink: 0;
  background: #141416;
}

.account-panel-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.02em;
}

.account-panel-close {
  background: none;
  border: none;
  color: rgba(255,255,255,0.55);
  font-size: 1.4rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  line-height: 1;
  transition: color 0.2s, background 0.2s;
}

.account-panel-close:hover {
  color: #fff;
  background: rgba(255,255,255,0.1);
}

/* Scrollable Body */
.account-panel-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.4rem 0.4rem 1rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}

.account-panel-body::-webkit-scrollbar {
  width: 4px;
}

.account-panel-body::-webkit-scrollbar-track {
  background: transparent;
}

.account-panel-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

/* Profile section */
.account-panel-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.4rem 1.2rem 1.2rem;
  margin: 0.6rem 0.6rem 0.2rem;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  text-align: center;
}

.account-panel-avatar-wrap {
  position: relative;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.account-panel-avatar {
  width: 86px;
  height: 86px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--primary, #e50914);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: 0 0 0 3px rgba(229,9,20,0.35), 0 6px 20px rgba(0,0,0,0.5);
  transition: box-shadow 0.3s ease;
}

.account-panel-avatar .panel-avatar-img,
.account-panel-avatar .avatar-custom-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-edit-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--primary, #e50914);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.6);
  border: 2px solid #141416;
  transition: transform 0.2s ease, background 0.2s ease;
}

.avatar-edit-badge:hover {
  transform: scale(1.12);
  background: var(--primary-hover, #ff2e38);
}

.account-panel-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.cw-vip-pill {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 999px;
  vertical-align: middle;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
  display: inline-block;
}

.account-panel-email {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 0.4rem;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-panel-date {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.25rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 0.32rem 0.8rem;
  font-size: 0.74rem;
  color: rgba(255,255,255,0.6);
}

.account-panel-date svg {
  color: var(--primary, #e50914);
  flex-shrink: 0;
}

/* Settings label */
.account-panel-section-label {
  padding: 1.15rem 1rem 0.45rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
}

/* Action buttons */
.account-panel-actions {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0 0.6rem;
}

.account-panel-action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.65rem 0.85rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  color: rgba(255,255,255,0.85);
  font-size: 0.88rem;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.account-panel-action-btn:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.12);
  color: #fff;
  transform: translateX(2px);
}

.panel-btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.75);
  transition: background 0.2s ease, color 0.2s ease;
}

.account-panel-action-btn:hover .panel-btn-icon {
  background: var(--primary, #e50914);
  color: #fff;
}

.panel-btn-text {
  flex: 1;
}

.panel-btn-arrow {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.3);
  transition: transform 0.2s ease, color 0.2s ease;
}

.account-panel-action-btn:hover .panel-btn-arrow {
  color: rgba(255, 255, 255, 0.75);
  transform: translateX(2px);
}

/* Footer & Logout pinned to bottom */
.account-panel-footer {
  padding: 0.85rem 1rem 1.1rem;
  border-top: 1px solid rgba(255,255,255,0.08);
  background: #141416;
  flex-shrink: 0;
}

.account-panel-logout {
  width: 100%;
  margin: 0;
  padding: 0.78rem;
  background: rgba(229, 9, 20, 0.14);
  border: 1px solid rgba(229, 9, 20, 0.35);
  border-radius: 10px;
  color: #ff4d58;
  font-size: 0.92rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.account-panel-logout:hover {
  background: var(--primary, #e50914);
  border-color: var(--primary, #e50914);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(229, 9, 20, 0.35);
}

.account-panel-logout:active {
  transform: scale(0.98);
}

`;

  const updated = content.slice(0, startIndex) + newCss + content.slice(endIndex);
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`Updated CSS in ${filePath}`);
  return true;
}

function updateJs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace panel.innerHTML construction in renderUserBadge
  const oldPanelSearch = `    // Create or reuse the side panel
    let panel = document.getElementById("accountSidePanel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "accountSidePanel";
      panel.className = "account-side-panel";
      document.body.appendChild(panel);
    }

    panel.innerHTML = \`
      <div class="account-panel-inner">
        <div class="account-panel-header">
          <span class="account-panel-title">My Account</span>
          <button class="account-panel-close" id="accountPanelClose">&times;</button>
        </div>

        <div class="account-panel-profile">
          <div class="account-panel-avatar">\${renderAvatarHTML(userAvatar, "panel-avatar-img")}</div>
          <div class="account-panel-name" id="panelUserName">\${userName}</div>
          <div class="account-panel-date"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Member since \${createdAt || "Unknown"}</div>
        </div>

        \${renderThemeSelectorHTML()}
        <div class="account-panel-section-label">⚙ SETTINGS</div>

        <div class="account-panel-actions">
          <button class="account-panel-action-btn panel-vip-btn" id="panelVipUpgradeBtn" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(239, 68, 68, 0.22)); border: 1px solid rgba(245, 158, 11, 0.55); color: #fbbf24; font-weight: 700; margin-bottom: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span class="notranslate" translate="no">4K Ultra HD</span>
          </button>

          <label for="panelAvatarInput" class="account-panel-action-btn" id="uploadAvatarBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
            <span class="notranslate" translate="no">\${uploadAvatarText}</span>
          </label>
          <input type="file" id="panelAvatarInput" accept="image/*" style="display:none;">

          <button class="account-panel-action-btn" id="editUsernameBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit username
          </button>
          
          <button class="account-panel-action-btn" id="changePasswordPanelBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Change password
          </button>

        </div>

        <button class="account-panel-logout" id="panelLogoutBtn">
          <ion-icon name="log-out-outline"></ion-icon> Logout
        </button>
      </div>
    \`;`;

  const newPanelCode = `    // Create or reuse the side panel
    let panel = document.getElementById("accountSidePanel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "accountSidePanel";
      panel.className = "account-side-panel";
      document.body.appendChild(panel);
    }

    const isVip = typeof isUserVip === 'function' ? isUserVip() : false;

    panel.innerHTML = \`
      <div class="account-panel-inner">
        <div class="account-panel-header">
          <span class="account-panel-title">My Account</span>
          <button class="account-panel-close" id="accountPanelClose" aria-label="Close">&times;</button>
        </div>

        <div class="account-panel-body">
          <div class="account-panel-profile">
            <div class="account-panel-avatar-wrap">
              <div class="account-panel-avatar">\${renderAvatarHTML(userAvatar, "panel-avatar-img")}</div>
              <label for="panelAvatarInput" class="avatar-edit-badge" title="\${uploadAvatarText}">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </label>
            </div>
            <div class="account-panel-name" id="panelUserName">
              <span>\${userName}</span>
              \${isVip ? '<span class="cw-vip-pill">👑 VIP</span>' : ''}
            </div>
            \${userEmail ? \`<div class="account-panel-email">\${userEmail}</div>\` : ''}
            <div class="account-panel-date">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>Member since \${createdAt || "Unknown"}</span>
            </div>
          </div>

          <div class="account-panel-section-label">⚙️ ACCOUNT SETTINGS</div>

          <div class="account-panel-actions">
            <label for="panelAvatarInput" class="account-panel-action-btn" id="uploadAvatarBtn">
              <div class="panel-btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
              </div>
              <span class="panel-btn-text notranslate" translate="no">\${uploadAvatarText}</span>
              <ion-icon name="chevron-forward-outline" class="panel-btn-arrow"></ion-icon>
            </label>
            <input type="file" id="panelAvatarInput" accept="image/*" style="display:none;">

            <button class="account-panel-action-btn" id="editUsernameBtn">
              <div class="panel-btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
              <span class="panel-btn-text">Edit username</span>
              <ion-icon name="chevron-forward-outline" class="panel-btn-arrow"></ion-icon>
            </button>
            
            <button class="account-panel-action-btn" id="changePasswordPanelBtn">
              <div class="panel-btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <span class="panel-btn-text">Change password</span>
              <ion-icon name="chevron-forward-outline" class="panel-btn-arrow"></ion-icon>
            </button>
          </div>

          \${renderThemeSelectorHTML()}
        </div>

        <div class="account-panel-footer">
          <button class="account-panel-logout" id="panelLogoutBtn">
            <ion-icon name="log-out-outline"></ion-icon> Logout
          </button>
        </div>
      </div>
    \`;`;

  // Standardize CRLF to LF for matching
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedOld = oldPanelSearch.replace(/\r\n/g, '\n');

  if (!normalizedContent.includes(normalizedOld)) {
    console.error(`Panel HTML block not matched in ${filePath}`);
    return false;
  }

  content = normalizedContent.replace(normalizedOld, newPanelCode);

  // Also clean up editUsernameBtn currentName extraction so it doesn't accidentally grab the VIP pill
  const oldEditName = `    // Edit username
    document.getElementById("editUsernameBtn").onclick = () => {
      const nameEl = document.getElementById("panelUserName");
      const currentName = nameEl ? nameEl.textContent.trim() : (state.user.name || "");`;

  const newEditName = `    // Edit username
    document.getElementById("editUsernameBtn").onclick = () => {
      const nameEl = document.getElementById("panelUserName");
      const currentName = state.user?.name || (nameEl ? (nameEl.querySelector('span') ? nameEl.querySelector('span').textContent.trim() : nameEl.textContent.trim()) : "");`;

  if (content.includes(oldEditName)) {
    content = content.replace(oldEditName, newEditName);
  }

  // Also update renderThemeSelectorHTML styling so margin aligns cleanly
  const oldThemeHeader = `<div class="account-panel-section-label" style="display:flex; justify-content:space-between; align-items:center; margin-top:1.2rem;">`;
  const newThemeHeader = `<div class="account-panel-section-label" style="display:flex; justify-content:space-between; align-items:center; margin-top:1.2rem; padding: 0.8rem 1rem 0.45rem;">`;
  if (content.includes(oldThemeHeader)) {
    content = content.replace(oldThemeHeader, newThemeHeader);
  }

  const oldThemeBox = `<div class="cw-theme-selector-box \${isEligible ? 'unlocked' : 'locked'}">`;
  const newThemeBox = `<div class="cw-theme-selector-box \${isEligible ? 'unlocked' : 'locked'}" style="margin: 0 0.6rem 0.8rem;">`;
  if (content.includes(oldThemeBox)) {
    content = content.replace(oldThemeBox, newThemeBox);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated JS in ${filePath}`);
  return true;
}

const rootCss = path.join(__dirname, 'movie.css');
const appCss = path.join(__dirname, 'cinewatch-app', 'movie.css');
const rootJs = path.join(__dirname, 'movie.js');
const appJs = path.join(__dirname, 'cinewatch-app', 'movie.js');

updateCss(rootCss);
updateCss(appCss);
updateJs(rootJs);
updateJs(appJs);

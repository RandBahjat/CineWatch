const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const appDir = path.join(rootDir, 'cinewatch-app');

function updateMovieJs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update isUserVip to respect cw_user_cancelled_vip flag
  const oldIsUserVip = `function isUserVip() {
  if (localStorage.getItem('cw_is_vip') === 'true') return true;
  if (sessionStorage.getItem('cw_is_vip') === 'true') return true;
  if (state && state.user && state.user.isVip) return true;`;

  const newIsUserVip = `function isUserVip() {
  if (localStorage.getItem('cw_user_cancelled_vip') === 'true') return false;
  if (localStorage.getItem('cw_is_vip') === 'true') return true;
  if (sessionStorage.getItem('cw_is_vip') === 'true') return true;
  if (state && state.user && state.user.isVip) return true;`;

  if (content.includes(oldIsUserVip)) {
    content = content.replace(oldIsUserVip, newIsUserVip);
  }

  // 2. Clear cw_user_cancelled_vip in activateVip
  const oldActivateVip = `function activateVip(planName) {
  const plan = planName || "VIP";
  localStorage.setItem('cw_is_vip', 'true');`;

  const newActivateVip = `function activateVip(planName) {
  const plan = planName || "VIP";
  localStorage.removeItem('cw_user_cancelled_vip');
  localStorage.setItem('cw_is_vip', 'true');`;

  if (content.includes(oldActivateVip)) {
    content = content.replace(oldActivateVip, newActivateVip);
  }

  // 3. Add cancelVipSubscription & modal helpers after activateVip
  const cancelFunctions = `
function cancelVipSubscription() {
  localStorage.setItem('cw_user_cancelled_vip', 'true');
  localStorage.setItem('cw_is_vip', 'false');
  localStorage.removeItem('cw_is_vip');
  sessionStorage.removeItem('cw_is_vip');
  localStorage.setItem('cw_vip_tier', 'free');
  localStorage.setItem('userVipTier', 'free');
  window.userVipTier = 'free';

  if (state && state.user) {
    state.user.isVip = false;
    state.user.vipTier = 'free';
    try {
      sessionStorage.setItem('cinewatch_user', JSON.stringify(state.user));
      localStorage.setItem('cinewatch_user', JSON.stringify(state.user));
    } catch(e) {}
    if (typeof saveUser === 'function') saveUser(state.user);
  }

  // Update cloud profile if Supabase/API is connected
  if (window.CW_API && typeof window.CW_API.updateProfile === 'function') {
    window.CW_API.updateProfile({ isVip: false, vipTier: 'free' }).catch(() => {});
  }

  // Update UI components
  if (typeof updateAdsVisibility === 'function') updateAdsVisibility();
  if (typeof renderVipBadges === 'function') renderVipBadges();
  if (typeof renderUserBadge === 'function') renderUserBadge();

  if (typeof showToast === 'function') {
    showToast("Subscription cancelled. You are now on the Free tier.", "info");
  }
}
window.cancelVipSubscription = cancelVipSubscription;

window.openCancelSubModal = function() {
  let modal = document.getElementById('cwCancelSubModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cwCancelSubModal';
    modal.className = 'cw-confirm-modal-wrap';
    modal.innerHTML = \`
      <div class="cw-confirm-modal-backdrop" onclick="closeCancelSubModal()"></div>
      <div class="cw-confirm-modal-card">
        <div class="cw-confirm-icon-wrap" style="color: #ef4444; background: rgba(239, 68, 68, 0.12);">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h3 class="cw-confirm-title">Cancel VIP Subscription?</h3>
        <p class="cw-confirm-desc">Are you sure you want to cancel your VIP subscription? You will lose access to crystal-clear 4K Ultra HD streaming, ad-free playback, and VIP perks.</p>
        <div class="cw-confirm-actions">
          <button class="cw-confirm-btn keep-btn" onclick="closeCancelSubModal()">Keep VIP</button>
          <button class="cw-confirm-btn cancel-btn" onclick="confirmCancelSub()">Yes, Cancel</button>
        </div>
      </div>
    \`;
    document.body.appendChild(modal);
  }
  modal.classList.add('open');
};

window.closeCancelSubModal = function() {
  const modal = document.getElementById('cwCancelSubModal');
  if (modal) modal.classList.remove('open');
};

window.confirmCancelSub = function() {
  closeCancelSubModal();
  cancelVipSubscription();
};
`;

  if (!content.includes('function cancelVipSubscription()')) {
    content = content.replace('window.activateVip = activateVip;', 'window.activateVip = activateVip;\n' + cancelFunctions);
  }

  // 4. Update account-panel-actions to include Cancel Subscription button (when VIP) or Upgrade Plan (when Free)
  const oldActionsBlock = `            <button class="account-panel-action-btn" id="changePasswordPanelBtn">
              <div class="panel-btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <span class="panel-btn-text">Change password</span>
              <ion-icon name="chevron-forward-outline" class="panel-btn-arrow"></ion-icon>
            </button>
          </div>`;

  const newActionsBlock = `            <button class="account-panel-action-btn" id="changePasswordPanelBtn">
              <div class="panel-btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <span class="panel-btn-text">Change password</span>
              <ion-icon name="chevron-forward-outline" class="panel-btn-arrow"></ion-icon>
            </button>

            \${isVip ? \`
              <button class="account-panel-action-btn panel-cancel-sub-btn" id="cancelSubPanelBtn" style="color: #f87171;">
                <div class="panel-btn-icon" style="background: rgba(239, 68, 68, 0.12); color: #ef4444;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                </div>
                <span class="panel-btn-text">Cancel subscription</span>
                <ion-icon name="chevron-forward-outline" class="panel-btn-arrow"></ion-icon>
              </button>
            \` : \`
              <button class="account-panel-action-btn" id="panelUpgradePlanBtn" style="color: #fbbf24;" onclick="if(typeof closePanel==='function')closePanel(); if(typeof openVipModal==='function')openVipModal();">
                <div class="panel-btn-icon" style="background: rgba(245, 158, 11, 0.12); color: #fbbf24;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
                </div>
                <span class="panel-btn-text">Upgrade plan</span>
                <ion-icon name="chevron-forward-outline" class="panel-btn-arrow"></ion-icon>
              </button>
            \`}
          </div>`;

  if (content.includes(oldActionsBlock)) {
    content = content.replace(oldActionsBlock, newActionsBlock);
  }

  // 5. Add event listener for #cancelSubPanelBtn in renderUserBadge
  const oldListenerAnchor = `    const changePasswordPanelBtn = document.getElementById("changePasswordPanelBtn");`;
  const newListenerCode = `    const cancelSubBtn = document.getElementById("cancelSubPanelBtn");
    if (cancelSubBtn) {
      cancelSubBtn.onclick = () => {
        openCancelSubModal();
      };
    }

    const changePasswordPanelBtn = document.getElementById("changePasswordPanelBtn");`;

  if (content.includes(oldListenerAnchor) && !content.includes('const cancelSubBtn = document.getElementById("cancelSubPanelBtn");')) {
    content = content.replace(oldListenerAnchor, newListenerCode);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated Cancel Subscription in JS: ${filePath}`);
}

function updateMovieCss(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const modalCss = `
/* ==========================================
   CANCEL SUBSCRIPTION CONFIRMATION MODAL
   ========================================== */
.cw-confirm-modal-wrap {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.25s ease, visibility 0.25s ease;
}

.cw-confirm-modal-wrap.open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.cw-confirm-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.cw-confirm-modal-card {
  position: relative;
  z-index: 2;
  background: #181920;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 1.8rem 1.6rem 1.6rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(239, 68, 68, 0.15);
  transform: scale(0.94);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.cw-confirm-modal-wrap.open .cw-confirm-modal-card {
  transform: scale(1);
}

.cw-confirm-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin: 0 auto 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cw-confirm-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.6rem;
}

.cw-confirm-desc {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.5;
  margin-bottom: 1.4rem;
}

.cw-confirm-actions {
  display: flex;
  gap: 0.8rem;
}

.cw-confirm-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: inherit;
}

.cw-confirm-btn.keep-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.cw-confirm-btn.keep-btn:hover {
  background: rgba(255, 255, 255, 0.18);
}

.cw-confirm-btn.cancel-btn {
  background: #ef4444;
  color: #fff;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
}

.cw-confirm-btn.cancel-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
}
`;

  if (!content.includes('.cw-confirm-modal-wrap')) {
    content += modalCss;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated Cancel Subscription CSS in: ${filePath}`);
  }
}

function updateIndexHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/movie\.css\?v=[^"'\s>]+/g, 'movie.css?v=20260929_cancel_sub');
  content = content.replace(/movie\.js\?v=[^"'\s>]+/g, 'movie.js?v=20260929_cancel_sub');
  content = content.replace(/browse-fix\.css\?v=[^"'\s>]+/g, 'browse-fix.css?v=20260929_cancel_sub');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated cache busters in: ${filePath}`);
}

updateMovieJs(path.join(rootDir, 'movie.js'));
updateMovieJs(path.join(appDir, 'movie.js'));

updateMovieCss(path.join(rootDir, 'movie.css'));
updateMovieCss(path.join(appDir, 'movie.css'));

updateIndexHtml(path.join(rootDir, 'index.html'));
updateIndexHtml(path.join(appDir, 'index.html'));

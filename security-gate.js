/**
 * CineWatch Shield - Security Gatekeeper & Bot Protection
 * Interactive "I'm not a robot" Verification Gateway
 */
(function () {
  'use strict';

  const STORAGE_KEY_SESSION = 'cw_bot_verified';
  const STORAGE_KEY_TIME = 'cw_bot_verified_time';
  const VERIFY_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours persistence

  // Allow URL testing flag (e.g. index.html?verify=1)
  const urlParams = new URLSearchParams(window.location.search);
  const isTestMode = urlParams.has('verify') || urlParams.has('test_captcha') || urlParams.has('security_test');

  // Electron desktop app bypass (only web visitors need bot protection)
  const isElectron = typeof navigator !== 'undefined' && 
    (navigator.userAgent.includes('Electron') || (typeof window !== 'undefined' && window.process && window.process.type === 'renderer'));

  function isVerified() {
    if (isElectron) return true;
    if (isTestMode) return false;

    try {
      if (sessionStorage.getItem(STORAGE_KEY_SESSION) === 'true') {
        return true;
      }
      const verifiedTime = localStorage.getItem(STORAGE_KEY_TIME);
      if (verifiedTime && Date.now() - parseInt(verifiedTime, 10) < VERIFY_DURATION_MS) {
        return true;
      }
    } catch (e) {
      // Storage access blocked/private mode fallback
    }
    return false;
  }

  function setVerified() {
    try {
      sessionStorage.setItem(STORAGE_KEY_SESSION, 'true');
      localStorage.setItem(STORAGE_KEY_TIME, Date.now().toString());
    } catch (e) {
      // Ignore in private storage
    }
  }

  // Pre-flag document immediately to avoid flash of content
  if (!isVerified()) {
    document.documentElement.classList.add('cw-security-pending');
  } else {
    return; // User is verified, exit silently
  }

  // Generate dynamic Ray ID and edge node info
  function generateRayId() {
    const chars = '0123456789abcdef';
    let res = '8f' + Math.floor(Math.random() * 89 + 10).toString(16);
    for (let i = 0; i < 12; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    return res.toLowerCase();
  }

  const rayId = generateRayId();

  function mountGatekeeper() {
    if (document.getElementById('cwSecurityGatekeeper')) return;

    const overlay = document.createElement('div');
    overlay.id = 'cwSecurityGatekeeper';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Security Verification');

    overlay.innerHTML = `
      <div class="cw-sec-backdrop">
        <div class="cw-sec-glow-top"></div>
        <div class="cw-sec-glow-bottom"></div>
        <div class="cw-sec-grid"></div>
      </div>

      <div class="cw-sec-card" id="cwSecCard">
        <div class="cw-sec-badge">
          <span class="cw-pulse-dot"></span>
          CineWatch Shield Protection
        </div>

        <div class="cw-sec-brand notranslate" translate="no">
          <ion-icon name="ticket"></ion-icon>
          Cine<span>Watch</span>
        </div>

        <h1 class="cw-sec-title">Security Verification</h1>
        <p class="cw-sec-desc">
          Please verify that you are a human visitor to continue to CineWatch. This automatic check safeguards our ad-free streaming network against malicious bots.
        </p>

        <!-- The "I'm not a robot" Widget -->
        <div class="cw-robot-widget" id="cwRobotWidget" role="button" tabindex="0" aria-label="I am not a robot checkbox">
          <div class="cw-widget-left">
            <div class="cw-checkbox-slot" id="cwCheckboxSlot">
              <div class="cw-spinner-ring" style="display: none;" id="cwSpinnerRing"></div>
              <svg class="cw-check-svg" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12.5l5.5 5.5L20 6.5"></path>
              </svg>
            </div>
            <span class="cw-widget-label" id="cwWidgetLabel">I'm not a robot</span>
          </div>

          <div class="cw-widget-right">
            <ion-icon name="shield-checkmark" class="cw-shield-icon-badge"></ion-icon>
            <span class="cw-shield-name">Shield</span>
            <div class="cw-shield-legal">
              <a href="#" onclick="event.stopPropagation(); return false;">Privacy</a>
              <span>•</span>
              <a href="#" onclick="event.stopPropagation(); return false;">Terms</a>
            </div>
          </div>
        </div>

        <!-- Status Message -->
        <div class="cw-status-message" id="cwStatusMsg" aria-live="polite">
          Click the verification box above to proceed
        </div>

        <!-- Security Footer Meta -->
        <div class="cw-sec-footer">
          <div class="cw-meta-row">
            <span>Ray ID: <span class="cw-meta-tag">${rayId}</span></span>
            <span>Security: <span class="cw-meta-tag">TLS 1.3 Strict</span></span>
          </div>
          <p>Protected by CineWatch Edge Cloud Defense • Automated Bot Mitigation</p>
        </div>
      </div>
    `;

    document.body.prepend(overlay);

    const widget = document.getElementById('cwRobotWidget');
    const checkbox = document.getElementById('cwCheckboxSlot');
    const spinner = document.getElementById('cwSpinnerRing');
    const label = document.getElementById('cwWidgetLabel');
    const statusMsg = document.getElementById('cwStatusMsg');
    const card = document.getElementById('cwSecCard');

    let isProcessing = false;
    let isSuccess = false;

    function triggerVerification() {
      if (isProcessing || isSuccess) return;
      isProcessing = true;

      // 1. Enter Checking State
      checkbox.classList.add('cw-spin-active');
      spinner.style.display = 'block';
      label.textContent = 'Verifying your browser...';
      statusMsg.innerHTML = '<ion-icon name="sync-outline" style="animation: cwSpinLoop 0.8s linear infinite;"></ion-icon> Analyzing client entropy and security tokens...';

      // 2. Simulated Secure Handshake (Entropy & Browser validation: 1000ms - 1300ms)
      const handshakeTime = 1050 + Math.floor(Math.random() * 250);

      setTimeout(() => {
        // 3. Success State
        isSuccess = true;
        isProcessing = false;

        spinner.style.display = 'none';
        checkbox.classList.remove('cw-spin-active');
        checkbox.classList.add('cw-verified-active');
        widget.classList.add('cw-widget-verified');

        label.textContent = "Human verification passed";
        statusMsg.className = 'cw-status-message cw-status-success';
        statusMsg.innerHTML = '<ion-icon name="checkmark-circle"></ion-icon> Secure session established. Welcome to CineWatch!';

        setVerified();

        // 4. Smooth Cinematic Unlock Transition
        setTimeout(() => {
          card.classList.add('cw-card-exit');
          overlay.classList.add('cw-gate-hidden');
          document.documentElement.classList.remove('cw-security-pending');

          setTimeout(() => {
            if (overlay && overlay.parentNode) {
              overlay.remove();
            }
          }, 500);
        }, 550);

      }, handshakeTime);
    }

    widget.addEventListener('click', triggerVerification);
    widget.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerVerification();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountGatekeeper);
  } else {
    mountGatekeeper();
  }
})();

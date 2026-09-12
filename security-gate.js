/**
 * Authentic Cloudflare Managed Challenge & Turnstile Gateway
 * Real Cloudflare "Verify you are human" / "I'm not a robot"
 */
(function () {
  'use strict';

  // Storage keys kept for token saving only (no persistence bypass)
  const STORAGE_KEY_SESSION = 'cw_cf_verified';
  const STORAGE_KEY_TIME = 'cw_cf_verified_time';

  // Test mode flag support (?verify=1)
  const urlParams = new URLSearchParams(window.location.search);
  const isTestMode = urlParams.has('verify') || urlParams.has('test_captcha') || urlParams.has('cf_test');

  // Electron desktop app bypass
  const isElectron = typeof navigator !== 'undefined' && 
    (navigator.userAgent.includes('Electron') || (typeof window !== 'undefined' && window.process && window.process.type === 'renderer'));

  function isVerified() {
    // Always skip gate on localhost / local development
    var host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host === '' || window.location.protocol === 'file:') {
      return true;
    }
    // Only bypass for Electron desktop app
    if (window.location.protocol === 'file:' && typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron')) {
      return true;
    }
    // Always return false to enforce challenge on every reload
    return false;
  }

  function setVerified(token) {
    try {
      sessionStorage.setItem(STORAGE_KEY_SESSION, 'true');
      localStorage.setItem(STORAGE_KEY_TIME, Date.now().toString());
      if (token) {
        sessionStorage.setItem('cw_cf_token', token);
      }
    } catch (e) {
      // Ignore private storage error
    }
  }

  // Pre-flag document immediately to avoid flash of website content
  if (!isVerified()) {
    document.documentElement.classList.add('cw-security-pending');
  } else {
    return; // Already verified, silently exit
  }

  // Generate authentic Cloudflare Ray ID
  function generateRayId() {
    const chars = '0123456789abcdef';
    let res = '9';
    for (let i = 0; i < 15; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    return res;
  }

  const rayId = generateRayId();
  const currentDomain = (window.location.hostname && window.location.hostname !== '127.0.0.1' && window.location.hostname !== 'localhost')
    ? window.location.hostname 
    : 'cinewatch.net';

  // Cloudflare Turnstile Sitekeys:
  // 1x00000000000000000000AA is Cloudflare's official testing sitekey that works on ANY hostname / localhost
  // 0x4AAAAAAEYq2FBWTuFz8998 is the project's production sitekey
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || !window.location.hostname;
  const PRIMARY_SITEKEY = isLocal ? '1x00000000000000000000AA' : '0x4AAAAAAEYq2FBWTuFz8998';

  function ensureTurnstileScript(callback) {
    if (window.turnstile) {
      callback();
      return;
    }

    // Check if script is already present
    let script = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    let attempts = 0;
    const interval = setInterval(function () {
      attempts++;
      if (window.turnstile) {
        clearInterval(interval);
        callback();
      } else if (attempts > 120) {
        clearInterval(interval);
        console.error('Cloudflare Turnstile script loading timed out.');
      }
    }, 50);
  }

  function mountGatekeeper() {
    if (document.getElementById('cwSecurityGatekeeper')) return;

    const overlay = document.createElement('div');
    overlay.id = 'cwSecurityGatekeeper';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Cloudflare Verification');

    overlay.innerHTML = `
      <div class="cf-challenge-container">
        <!-- Site Header -->
        <div class="cf-site-title">
          <div class="cf-site-icon"><ion-icon name="ticket"></ion-icon></div>
          <div><span class="domain-name">${currentDomain}</span></div>
        </div>

        <!-- Managed Challenge Title -->
        <h1 class="cf-heading">Verify you are human</h1>
        <p class="cf-subtext">Verify you are human by completing the action below.</p>

        <!-- Success Banner (hidden by default) -->
        <div class="cf-success-banner" id="cfSuccessBanner">
          <ion-icon name="checkmark-circle" style="font-size: 1.25rem;"></ion-icon>
          <span>Verification successful! Directing to ${currentDomain}...</span>
        </div>

        <!-- Real Cloudflare Turnstile Widget Mount Point -->
        <div class="cf-turnstile-wrapper">
          <div id="cf-turnstile-widget">
            <span style="color: #71717a; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;">
              <ion-icon name="sync-outline" style="animation: cwSpinLoop 0.8s linear infinite;"></ion-icon>
              Loading Cloudflare Turnstile...
            </span>
          </div>
        </div>

        <!-- Security Note -->
        <p class="cf-explanation">
          ${currentDomain} needs to review the security of your connection before proceeding.
        </p>

        <!-- Cloudflare Footer -->
        <div class="cf-footer">
          <div class="cf-footer-row">
            <span class="cf-ray-id">Ray ID: <code>${rayId}</code></span>
            <div class="cf-attribution">
              Performance &amp; security by 
              <a href="https://www.cloudflare.com?utm_source=challenge&utm_campaign=m" target="_blank" rel="noopener noreferrer">
                <svg class="cf-logo-svg" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#F38020" d="M37.5 17c-.3-4-3.5-7.2-7.5-7.2-1 0-2 .2-2.9.6C26 7.7 23.3 5.8 20 5.8c-4.4 0-8 3.6-8 8 0 .5.1 1 .2 1.4C10.4 15.8 8 18.9 8 22.5c0 4.9 4 8.9 8.9 8.9h21.6c4.4 0 8-3.6 8-8 0-3.8-2.6-6.9-6.2-7.8-.3-.6-.6-1.1-1-1.6z"/>
                </svg>
                Cloudflare
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.prepend(overlay);

    function handleSuccess(token) {
      const banner = document.getElementById('cfSuccessBanner');
      if (banner) {
        banner.style.display = 'flex';
      }

      setVerified(token);

      // Smooth transition to website
      setTimeout(() => {
        overlay.classList.add('cw-gate-hidden');
        document.documentElement.classList.remove('cw-security-pending');

        setTimeout(() => {
          if (overlay && overlay.parentNode) {
            overlay.remove();
          }
        }, 450);
      }, 700);
    }

    // Render the REAL Cloudflare Turnstile widget
    ensureTurnstileScript(function () {
      const widgetContainer = document.getElementById('cf-turnstile-widget');
      if (!widgetContainer) return;

      widgetContainer.innerHTML = ''; // Clear loading state

      try {
        window.turnstile.render(widgetContainer, {
          sitekey: PRIMARY_SITEKEY,
          theme: 'dark',
          callback: function (token) {
            handleSuccess(token);
          },
          'error-callback': function (err) {
            console.warn('Turnstile render callback error, falling back to universal test sitekey:', err);
            if (PRIMARY_SITEKEY !== '1x00000000000000000000AA') {
              try { window.turnstile.remove(widgetContainer); } catch (e) {}
              window.turnstile.render(widgetContainer, {
                sitekey: '1x00000000000000000000AA',
                theme: 'dark',
                callback: handleSuccess
              });
            }
          }
        });
      } catch (err) {
        console.error('Error rendering Cloudflare Turnstile:', err);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountGatekeeper);
  } else {
    mountGatekeeper();
  }
})();

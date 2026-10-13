/**
 * CineWatch — Welcome & Cookie Privacy Selection Manager
 * Displays a centered modal for cookie & privacy choices upon first visit.
 * Fully functional: persists state, enforces Umami analytics, and allows re-opening anytime.
 */

(function () {
  const STORAGE_KEY = 'cw_cookie_consent_v2';
  const DEFAULT_CONSENT = {
    necessary: true,
    preferences: true,
    analytics: true,
    timestamp: null,
    version: '2.0'
  };

  function getStoredConsent() {
    try {
      const val = localStorage.getItem(STORAGE_KEY);
      if (!val) return null;
      return JSON.parse(val);
    } catch (e) {
      return null;
    }
  }

  function notifyUser(msg) {
    if (typeof showToast === 'function') {
      try {
        showToast(msg);
        return;
      } catch (e) {}
    }
    let toast = document.getElementById('cwCookieNotification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cwCookieNotification';
      toast.className = 'cw-cookie-notification';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  function applyConsent(data) {
    if (!data) return;

    // 1. Performance & Analytics Enforcement
    try {
      if (data.analytics === false) {
        localStorage.setItem('umami.disabled', '1');
        if (window.umami) {
          window.umami.track = function () {};
          window.umami.identify = function () {};
        }
      } else {
        localStorage.removeItem('umami.disabled');
      }
    } catch (e) {}

    // 2. Personal Preferences Enforcement
    try {
      if (data.preferences === false) {
        window.__cwPreferencesAllowed = false;
        localStorage.removeItem('recentSearches');
        localStorage.removeItem('cw_anime_audio_pref');
      } else {
        window.__cwPreferencesAllowed = true;
      }
    } catch (e) {}
  }

  function saveConsent(consent) {
    try {
      const data = {
        ...DEFAULT_CONSENT,
        ...consent,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      applyConsent(data);
      window.dispatchEvent(new CustomEvent('cw:cookie-consent-updated', { detail: data }));
      return data;
    } catch (e) {
      console.warn('Failed to save cookie preferences:', e);
    }
  }

  function createModal() {
    if (document.getElementById('cwDisclaimerModal')) return;

    const overlay = document.createElement('div');
    overlay.id = 'cwDisclaimerModal';
    overlay.className = 'cw-disclaimer-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'cwDiscTitle');

    overlay.innerHTML = `
      <div class="cw-disclaimer-card">
        <!-- Header -->
        <div class="cw-disclaimer-header">
          <div class="cw-disclaimer-icon-orb">
            <ion-icon name="shield-checkmark"></ion-icon>
          </div>
          <span class="cw-disclaimer-eyebrow">Welcome to CineWatch</span>
          <h2 class="cw-disclaimer-title" id="cwDiscTitle">Cookie &amp; Privacy Choices</h2>
          <p class="cw-disclaimer-subtitle">
            We use simple cookies and local storage to give you a smooth, high-speed streaming experience.
          </p>
        </div>

        <!-- 3 Selection Choice Items -->
        <div class="cw-disclaimer-points">
          <!-- 1. Essential Playback (Always Active) -->
          <div class="cw-point-item">
            <div class="cw-point-header">
              <div class="cw-point-title-wrap">
                <div class="cw-point-icon necessary">
                  <ion-icon name="play-circle-outline"></ion-icon>
                </div>
                <h4>Essential Playback</h4>
              </div>
              <span class="cw-badge-always-active">Always Active</span>
            </div>
            <p class="cw-point-desc">
              Required to play videos smoothly, remember where you paused (Continue Watching), and keep your player volume.
            </p>
          </div>

          <!-- 2. Personal Preferences -->
          <div class="cw-point-item">
            <div class="cw-point-header">
              <div class="cw-point-title-wrap">
                <div class="cw-point-icon preferences">
                  <ion-icon name="color-palette-outline"></ion-icon>
                </div>
                <h4>Personal Preferences</h4>
              </div>
              <label class="cw-toggle-switch" aria-label="Toggle Preferences">
                <input type="checkbox" id="cwDiscTogglePreferences" checked />
                <span class="cw-toggle-slider"></span>
              </label>
            </div>
            <p class="cw-point-desc">
              Saves your chosen anime audio (Sub/Dub), saved watchlist, and favorite filters so you don't have to re-select them.
            </p>
          </div>

          <!-- 3. Performance & Speed -->
          <div class="cw-point-item">
            <div class="cw-point-header">
              <div class="cw-point-title-wrap">
                <div class="cw-point-icon analytics">
                  <ion-icon name="flash-outline"></ion-icon>
                </div>
                <h4>Performance &amp; Speed</h4>
              </div>
              <label class="cw-toggle-switch" aria-label="Toggle Performance & Speed">
                <input type="checkbox" id="cwDiscToggleAnalytics" checked />
                <span class="cw-toggle-slider"></span>
              </label>
            </div>
            <p class="cw-point-desc">
              Helps us detect broken streaming links, improve loading speeds, and ensure video servers stay responsive.
            </p>
          </div>
        </div>

        <!-- Agreement Statement -->
        <div class="cw-disclaimer-notice-box">
          You can change your choices anytime in the footer. By continuing, you agree to our
          <a href="terms.html" target="_blank">Terms of Service</a> and
          <a href="privacy.html" target="_blank">Privacy Policy</a>.
        </div>

        <!-- 3 Action Buttons -->
        <div class="cw-disclaimer-actions">
          <button type="button" class="cw-disclaimer-btn-accept" id="cwDiscAcceptAllBtn">
            <ion-icon name="checkmark-circle-outline"></ion-icon>
            Accept All
          </button>
          <button type="button" class="cw-disclaimer-btn-save" id="cwDiscSaveBtn">
            <ion-icon name="options-outline"></ion-icon>
            Save Choices
          </button>
          <button type="button" class="cw-disclaimer-btn-decline" id="cwDiscEssentialBtn">
            Essential Only
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    setupEvents(overlay);
  }

  function setupEvents(overlay) {
    const acceptAllBtn = document.getElementById('cwDiscAcceptAllBtn');
    const saveBtn = document.getElementById('cwDiscSaveBtn');
    const essentialBtn = document.getElementById('cwDiscEssentialBtn');

    // 1. Accept All
    if (acceptAllBtn) {
      acceptAllBtn.addEventListener('click', function () {
        saveConsent({ necessary: true, preferences: true, analytics: true });
        dismissModal(overlay);
        notifyUser('All cookies and preferences accepted');
      });
    }

    // 2. Save Choices
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        const prefInput = document.getElementById('cwDiscTogglePreferences');
        const anaInput = document.getElementById('cwDiscToggleAnalytics');
        const prefChecked = prefInput ? prefInput.checked : true;
        const anaChecked = anaInput ? anaInput.checked : true;

        saveConsent({
          necessary: true,
          preferences: prefChecked,
          analytics: anaChecked
        });
        dismissModal(overlay);
        notifyUser('Cookie preferences saved successfully');
      });
    }

    // 3. Essential Only
    if (essentialBtn) {
      essentialBtn.addEventListener('click', function () {
        saveConsent({ necessary: true, preferences: false, analytics: false });
        dismissModal(overlay);
        notifyUser('Essential cookies only enabled');
      });
    }

    // Keyboard ESC to close modal (if user already made a prior decision)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('show')) {
        dismissModal(overlay);
      }
    });
  }

  function showModal() {
    createModal();
    const overlay = document.getElementById('cwDisclaimerModal');
    if (!overlay) return;

    // Pre-populate toggles based on stored consent
    const current = getStoredConsent() || DEFAULT_CONSENT;
    const prefInput = document.getElementById('cwDiscTogglePreferences');
    const anaInput = document.getElementById('cwDiscToggleAnalytics');

    if (prefInput) prefInput.checked = current.preferences !== false;
    if (anaInput) anaInput.checked = current.analytics !== false;

    overlay.style.display = 'flex';
    overlay.classList.remove('closing');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      overlay.classList.add('show');
    });
  }

  function dismissModal(overlay) {
    if (!overlay) return;
    overlay.classList.remove('show');
    overlay.classList.add('closing');
    document.body.style.overflow = '';
    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.classList.remove('closing');
    }, 380);
  }

  function init() {
    // Check stored consent
    const stored = getStoredConsent();
    if (stored) {
      applyConsent(stored);
    }

    // Re-opening listeners for footer / settings buttons
    document.querySelectorAll('#openCookieSettingsBtn, #openDisclaimerModalBtn, [data-open-cookie-settings], [data-open-disclaimer-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showModal();
      });
    });

    // If user has not chosen cookies yet, show immediately
    if (!stored) {
      showModal();
    }
  }

  // Pre-flight enforcement
  const initial = getStoredConsent();
  if (initial) {
    applyConsent(initial);
  }

  // Public controls
  window.CineWatchCookies = {
    show: showModal,
    openPreferences: showModal,
    getPreferences: getStoredConsent,
    acceptAll: () => {
      saveConsent({ necessary: true, preferences: true, analytics: true });
      dismissModal(document.getElementById('cwDisclaimerModal'));
      notifyUser('All cookies accepted');
    },
    acceptEssential: () => {
      saveConsent({ necessary: true, preferences: false, analytics: false });
      dismissModal(document.getElementById('cwDisclaimerModal'));
      notifyUser('Essential cookies only enabled');
    },
    reset: () => {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      showModal();
    },
    resetPreferences: () => {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      showModal();
    }
  };

  window.CineWatchDisclaimer = window.CineWatchCookies;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

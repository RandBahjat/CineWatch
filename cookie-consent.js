/**
 * CineWatch — Modern Floating Cookie Consent & Preference Manager
 * Full-featured, GDPR/CCPA compliant, persistent LocalStorage state.
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

    // 1. Umami Analytics Control
    try {
      if (data.analytics === false) {
        localStorage.setItem('umami.disabled', '1');
      } else {
        localStorage.removeItem('umami.disabled');
      }
    } catch (e) {}

    // 2. Preferences Control
    if (data.preferences === false) {
      try {
        localStorage.removeItem('recentSearches');
      } catch (e) {}
    }
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
      console.warn('Failed to save cookie preferences to localStorage:', e);
    }
  }

  function createElements() {
    if (document.getElementById('cwCookieBanner')) return;

    // 1. Floating Banner HTML
    const banner = document.createElement('aside');
    banner.id = 'cwCookieBanner';
    banner.className = 'cw-cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie and privacy preferences');
    banner.innerHTML = `
      <div class="cw-cookie-header">
        <div class="cw-cookie-title-wrap">
          <div class="cw-cookie-icon-orb">
            <ion-icon name="shield-checkmark-outline"></ion-icon>
          </div>
          <h3 class="cw-cookie-title">Cookie &amp; Privacy Choices</h3>
        </div>
        <button type="button" class="cw-cookie-close-btn" id="cwCookieDismissBtn" title="Close" aria-label="Dismiss">
          <ion-icon name="close-outline"></ion-icon>
        </button>
      </div>
      <p class="cw-cookie-desc">
        We use essential cookies and local storage to save your continue-watching progress, remember your audio preferences, and ensure seamless streaming. You can review our <a href="privacy.html#cookies" target="_blank">Privacy Policy</a> or customize choices.
      </p>
      <div class="cw-cookie-actions">
        <button type="button" class="cw-btn-cookie-accept" id="cwCookieAcceptAllBtn">
          <ion-icon name="checkmark-circle-outline"></ion-icon> Accept All
        </button>
        <button type="button" class="cw-btn-cookie-essential" id="cwCookieEssentialBtn">
          Essential Only
        </button>
        <button type="button" class="cw-btn-cookie-pref" id="cwCookieCustomizeBtn" title="Customize Preferences" aria-label="Customize Preferences">
          <ion-icon name="options-outline"></ion-icon>
        </button>
      </div>
    `;

    // 2. Preferences Modal HTML
    const modal = document.createElement('div');
    modal.id = 'cwCookieModal';
    modal.className = 'cw-cookie-modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'cwModalTitle');
    modal.innerHTML = `
      <div class="cw-cookie-modal-card">
        <div class="cw-modal-header">
          <h3 class="cw-modal-title" id="cwModalTitle">
            <ion-icon name="shield-checkmark" style="color: var(--cw-cookie-red);"></ion-icon>
            Cookie Preferences
          </h3>
          <button type="button" class="cw-modal-close-btn" id="cwModalCloseBtn" aria-label="Close preferences">
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        <p class="cw-modal-intro">
          Choose which types of storage and metrics CineWatch may use. Essential playback storage is always required for video streaming.
        </p>

        <div class="cw-cookie-categories">
          <!-- 1. Strictly Necessary -->
          <div class="cw-cookie-category-item">
            <div class="cw-category-header">
              <span class="cw-category-name">
                <ion-icon name="lock-closed-outline" style="color: #34d399;"></ion-icon>
                Strictly Necessary &amp; Playback
              </span>
              <span class="cw-badge-always-active">Always Active</span>
            </div>
            <p class="cw-category-desc">
              Required for core player routing, keeping you authenticated, storing video timestamps (Continue Watching), and remembering player volume settings.
            </p>
          </div>

          <!-- 2. Preferences -->
          <div class="cw-cookie-category-item">
            <div class="cw-category-header">
              <span class="cw-category-name">
                <ion-icon name="color-palette-outline" style="color: #60a5fa;"></ion-icon>
                Preferences &amp; Customization
              </span>
              <label class="cw-toggle-switch" aria-label="Toggle Preferences Storage">
                <input type="checkbox" id="cwTogglePreferences" checked />
                <span class="cw-toggle-slider"></span>
              </label>
            </div>
            <p class="cw-category-desc">
              Saves your Sub/Dub anime audio choices, watchlist filters, and language preferences.
            </p>
          </div>

          <!-- 3. Anonymous Metrics -->
          <div class="cw-cookie-category-item">
            <div class="cw-category-header">
              <span class="cw-category-name">
                <ion-icon name="analytics-outline" style="color: #f59e0b;"></ion-icon>
                Anonymous Performance Analytics
              </span>
              <label class="cw-toggle-switch" aria-label="Toggle Anonymous Analytics">
                <input type="checkbox" id="cwToggleAnalytics" checked />
                <span class="cw-toggle-slider"></span>
              </label>
            </div>
            <p class="cw-category-desc">
              Cookieless, privacy-friendly visitor analytics via Umami to monitor server responsiveness and prevent broken streams.
            </p>
          </div>
        </div>

        <div class="cw-modal-footer">
          <button type="button" class="cw-btn-modal-accept-all" id="cwModalAcceptAllBtn">
            Accept All
          </button>
          <button type="button" class="cw-btn-modal-save" id="cwModalSaveBtn">
            Save Preferences
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);
    document.body.appendChild(modal);

    setupEventListeners(banner, modal);
  }

  function hideBanner(banner) {
    if (!banner) return;
    banner.classList.remove('show');
    banner.classList.add('closing');
    setTimeout(() => {
      banner.style.display = 'none';
    }, 460);
  }

  function openModal(modal) {
    if (!modal) return;
    const current = getStoredConsent() || DEFAULT_CONSENT;
    const prefToggle = document.getElementById('cwTogglePreferences');
    const anaToggle = document.getElementById('cwToggleAnalytics');

    if (prefToggle) prefToggle.checked = current.preferences !== false;
    if (anaToggle) anaToggle.checked = current.analytics !== false;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('show');
    // Only restore body overflow if video modal isn't open
    const videoModal = document.getElementById('videoModal');
    if (!videoModal || videoModal.classList.contains('hidden')) {
      document.body.style.overflow = '';
    }
  }

  function setupEventListeners(banner, modal) {
    // 1. Accept All
    const acceptAllBtn = document.getElementById('cwCookieAcceptAllBtn');
    if (acceptAllBtn) {
      acceptAllBtn.onclick = () => {
        saveConsent({ necessary: true, preferences: true, analytics: true });
        hideBanner(banner);
        notifyUser('All cookies and preferences accepted');
      };
    }

    // 2. Essential Only
    const essentialBtn = document.getElementById('cwCookieEssentialBtn');
    if (essentialBtn) {
      essentialBtn.onclick = () => {
        saveConsent({ necessary: true, preferences: false, analytics: false });
        hideBanner(banner);
        notifyUser('Essential cookies only enabled');
      };
    }

    // 3. Dismiss X button (acts as essential only)
    const dismissBtn = document.getElementById('cwCookieDismissBtn');
    if (dismissBtn) {
      dismissBtn.onclick = () => {
        saveConsent({ necessary: true, preferences: false, analytics: false });
        hideBanner(banner);
      };
    }

    // 4. Customize button -> Open Modal
    const customizeBtn = document.getElementById('cwCookieCustomizeBtn');
    if (customizeBtn) {
      customizeBtn.onclick = () => {
        openModal(modal);
      };
    }

    // 5. Modal Close
    const modalCloseBtn = document.getElementById('cwModalCloseBtn');
    if (modalCloseBtn) {
      modalCloseBtn.onclick = () => {
        closeModal(modal);
      };
    }

    // Modal backdrop click
    modal.onclick = (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    };

    // Keyboard ESC to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal(modal);
      }
    });

    // 6. Modal Save Preferences
    const modalSaveBtn = document.getElementById('cwModalSaveBtn');
    if (modalSaveBtn) {
      modalSaveBtn.onclick = () => {
        const prefChecked = document.getElementById('cwTogglePreferences')?.checked ?? true;
        const anaChecked = document.getElementById('cwToggleAnalytics')?.checked ?? true;
        saveConsent({
          necessary: true,
          preferences: prefChecked,
          analytics: anaChecked
        });
        closeModal(modal);
        hideBanner(banner);
        notifyUser('Preferences updated successfully');
      };
    }

    // 7. Modal Accept All
    const modalAcceptAllBtn = document.getElementById('cwModalAcceptAllBtn');
    if (modalAcceptAllBtn) {
      modalAcceptAllBtn.onclick = () => {
        saveConsent({ necessary: true, preferences: true, analytics: true });
        closeModal(modal);
        hideBanner(banner);
        notifyUser('All cookies and preferences accepted');
      };
    }
  }

  function init() {
    createElements();

    const stored = getStoredConsent();
    if (stored) {
      applyConsent(stored);
    }

    const banner = document.getElementById('cwCookieBanner');
    const modal = document.getElementById('cwCookieModal');

    // Attach listeners to any trigger button with #openCookieSettingsBtn or data-open-cookie-settings
    document.querySelectorAll('#openCookieSettingsBtn, [data-open-cookie-settings]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(modal);
      });
    });

    // If user hasn't made a choice yet, display banner after a short graceful delay
    if (!stored && banner) {
      setTimeout(() => {
        banner.classList.add('show');
      }, 1200);
    }
  }

  // Immediate check before load
  const initial = getStoredConsent();
  if (initial) {
    applyConsent(initial);
  }

  // Public API
  window.CineWatchCookies = {
    getPreferences: getStoredConsent,
    openPreferences: () => {
      const modal = document.getElementById('cwCookieModal');
      if (modal) openModal(modal);
    },
    acceptAll: () => {
      saveConsent({ necessary: true, preferences: true, analytics: true });
      const banner = document.getElementById('cwCookieBanner');
      if (banner) hideBanner(banner);
      notifyUser('All cookies accepted');
    },
    acceptEssential: () => {
      saveConsent({ necessary: true, preferences: false, analytics: false });
      const banner = document.getElementById('cwCookieBanner');
      if (banner) hideBanner(banner);
      notifyUser('Essential cookies only enabled');
    },
    resetPreferences: () => {
      localStorage.removeItem(STORAGE_KEY);
      applyConsent(DEFAULT_CONSENT);
      const banner = document.getElementById('cwCookieBanner');
      if (banner) {
        banner.style.display = '';
        banner.classList.remove('closing');
        banner.classList.add('show');
      }
      notifyUser('Cookie preferences reset');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/**
 * CineWatch — First-Time Welcome Disclaimer & DMCA Compliance Modal
 * Displays upon opening the site: Non-hosting notice, DMCA compliance, and user agreement.
 */

(function () {
  const STORAGE_KEY = 'cw_welcome_disclaimer_v1';

  function isAccepted() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  }

  function setAccepted() {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {}
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
          <h2 class="cw-disclaimer-title" id="cwDiscTitle">Streaming Notice &amp; Disclaimer</h2>
          <p class="cw-disclaimer-subtitle">
            Please read and agree to our streaming terms and copyright disclaimers before proceeding.
          </p>
        </div>

        <!-- 3 Feature Points -->
        <div class="cw-disclaimer-points">
          <!-- 1. Non-Hosting -->
          <div class="cw-point-item">
            <div class="cw-point-icon non-hosting">
              <ion-icon name="cloud-offline-outline"></ion-icon>
            </div>
            <div class="cw-point-content">
              <h4>Zero Media Hosting</h4>
              <p>CineWatch does not host, upload, or store any video files, media streams, or copyrighted content on its servers. All streams are embedded from non-affiliated, publicly available third-party services.</p>
            </div>
          </div>

          <!-- 2. DMCA & Copyright -->
          <div class="cw-point-item">
            <div class="cw-point-icon dmca">
              <ion-icon name="shield-outline"></ion-icon>
            </div>
            <div class="cw-point-content">
              <h4>DMCA &amp; Rapid Content Removal</h4>
              <p>We strictly comply with DMCA guidelines and copyright protection laws. Copyright holders can submit prompt takedown notices via our Contact page for immediate response.</p>
            </div>
          </div>

          <!-- 3. Safe & Free -->
          <div class="cw-point-item">
            <div class="cw-point-icon safety">
              <ion-icon name="lock-closed-outline"></ion-icon>
            </div>
            <div class="cw-point-content">
              <h4>Safe &amp; Secure Experience</h4>
              <p>Enjoy a clean, fast streaming hub without harmful downloads. You have complete control over your preferences and private data at all times.</p>
            </div>
          </div>
        </div>

        <!-- Agreement Statement -->
        <div class="cw-disclaimer-notice-box">
          By clicking <strong>"I Agree &amp; Enter"</strong>, you confirm you are of legal age and agree to our
          <a href="terms.html" target="_blank">Terms of Service</a> and
          <a href="privacy.html" target="_blank">Privacy Policy</a>.
        </div>

        <!-- Action Buttons -->
        <div class="cw-disclaimer-actions">
          <button type="button" class="cw-disclaimer-btn-accept" id="cwDiscAcceptBtn">
            <ion-icon name="checkmark-circle-outline" style="font-size: 1.25rem;"></ion-icon>
            I Agree &amp; Enter
          </button>
          <button type="button" class="cw-disclaimer-btn-decline" id="cwDiscDeclineBtn">
            <ion-icon name="exit-outline"></ion-icon>
            Decline &amp; Exit
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    setupEvents(overlay);
  }

  function setupEvents(overlay) {
    const acceptBtn = document.getElementById('cwDiscAcceptBtn');
    const declineBtn = document.getElementById('cwDiscDeclineBtn');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        setAccepted();
        dismissModal(overlay);
        window.dispatchEvent(new CustomEvent('cw:disclaimer-accepted'));
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        // Standard streaming action: redirect away if user declines legal terms
        window.location.href = 'https://www.google.com';
      });
    }
  }

  function showModal() {
    createModal();
    const overlay = document.getElementById('cwDisclaimerModal');
    if (!overlay) return;

    overlay.style.display = 'flex';
    overlay.classList.remove('closing');
    // Lock body scrolling while disclaimer is active
    document.body.style.overflow = 'hidden';

    // Force repaint then add visible class
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
    // Attach listener to any trigger links (#openDisclaimerModalBtn or [data-open-disclaimer-modal])
    document.querySelectorAll('#openDisclaimerModalBtn, [data-open-disclaimer-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showModal();
      });
    });

    // Check if user has already accepted
    if (!isAccepted()) {
      showModal();
    }
  }

  // Public controls
  window.CineWatchDisclaimer = {
    show: showModal,
    accept: () => {
      setAccepted();
      dismissModal(document.getElementById('cwDisclaimerModal'));
    },
    reset: () => {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      showModal();
    }
  };

  // Launch as soon as body is available
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

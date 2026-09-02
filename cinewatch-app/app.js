/**
 * CineWatch Standalone App Engine
 * High-Performance, Instant-Loading Streaming Platform Logic
 */

const FEATURED_TITLES = [
  "Just Play Dead",
  "The Whisper Man",
  "Grand Theft Auto VI: An Extended Look",
  "Mousetrap",
  "Batman: Knightfall Part 1: Knightfall",
  "Mutiny",
  "Reacher",
  "Lanterns",
  "Lioness",
  "Spider-Man: Brand New Day",
  "The Odyssey"
];

const TOP_10_TITLES = [
  "Just Play Dead",
  "Grand Theft Auto VI: An Extended Look",
  "Motor City",
  "Mutiny",
  "Batman: Knightfall Part 1: Knightfall",
  "Reacher",
  "The Last Sunrise",
  "Spider-Man: Brand New Day",
  "Lanterns",
  "The Odyssey",
  "Toy Story 5"
];

let MOVIES = [];
// FIX 4: N+1 â†’ O(1) Map lookup instead of repeated .find() scans
let _movieMap = new Map();

// FIX 3: Pagination constants & offsets per view
const PAGE_SIZE = 40;
let _pageOffset = { explore: 0, movies: 0, series: 0, anime: 0 };
let _filteredCache = { explore: [] };

let state = {
  currentTab: 'home',
  favorites: new Set(),
  activeType: 'all',
  activeGenre: 'all',
  heroIndex: 0,
  heroTimer: null,
  currentDetail: null
};

// Global Toast Notification
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast show';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// Storage helpers
async function loadFavorites() {
  try {
    const raw = localStorage.getItem('cinewatch_app_favs') || localStorage.getItem('cinewatch_favorites');
    if (raw) {
      const arr = JSON.parse(raw);
      state.favorites = new Set(arr);
    }
  } catch (e) {}

  if (window.CW_API && typeof window.CW_API.getUserFavorites === 'function') {
    try {
      const cloudFavs = await window.CW_API.getUserFavorites();
      if (Array.isArray(cloudFavs) && cloudFavs.length > 0) {
        cloudFavs.forEach(id => state.favorites.add(String(id)));
        saveFavorites();
      }
    } catch (err) {}
  }
}

function saveFavorites() {
  try {
    const arr = [...state.favorites];
    localStorage.setItem('cinewatch_app_favs', JSON.stringify(arr));
    localStorage.setItem('cinewatch_favorites', JSON.stringify(arr));
  } catch (e) {}
}

async function toggleFavorite(id, e) {
  if (e) e.stopPropagation();
  const strId = String(id);
  const wasFav = state.favorites.has(strId);

  // FIX 2: OPTIMISTIC RENDERING â€” update UI instantly, sync cloud in background
  if (wasFav) {
    state.favorites.delete(strId);
    showToast('Removed from Watchlist');
  } else {
    state.favorites.add(strId);
    showToast('Saved to Watchlist â¤ï¸');
  }

  // Immediately update every fav button for this card (no full re-render needed)
  _updateAllFavButtons(strId, !wasFav);

  // FIX 5: ASYNC â€” save & cloud sync fully non-blocking
  Promise.resolve().then(() => {
    saveFavorites();
    renderWatchlist();
  });

  if (window.CW_API && typeof window.CW_API.toggleFavorite === 'function') {
    // Fire-and-forget â€” never blocks the UI thread
    window.CW_API.toggleFavorite(strId).catch(() => {});
  }
}

// FIX 2: Surgically update only the affected heart buttons without re-rendering the whole grid
function _updateAllFavButtons(id, isFav) {
  document.querySelectorAll(`[data-media-id="${id}"] .card-fav-btn, .card-fav-btn[data-id="${id}"]`).forEach(btn => {
    btn.classList.toggle('active', isFav);
    const icon = btn.querySelector('ion-icon');
    if (icon) icon.setAttribute('name', isFav ? 'heart' : 'heart-outline');
  });
}

function toggleFav(e, id) {
  if (e) e.stopPropagation();
  toggleFavorite(id, e);
}

const fallbackImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect width='300' height='450' fill='%2311141e'/%3E%3Ctext x='50%25' y='50%25' fill='%23555' font-family='sans-serif' font-size='16' text-anchor='middle'%3ENo Poster%3C/text%3E%3C/svg%3E";

// Catalog Initialization
let catalogInitialized = false;

function initCatalog() {
  if (catalogInitialized && MOVIES.length > 0) return;

  const movies = window._MOVIES_DATA || [];
  const series = window._SERIES_DATA || [];
  const anime = window._ANIME_DATA || [];

  if (movies.length === 0 && series.length === 0 && anime.length === 0) {
    setTimeout(initCatalog, 50);
    return;
  }

  catalogInitialized = true;

  try {
    MOVIES = [...movies, ...series, ...anime];
    MOVIES.forEach(m => {
      if (!m.id) {
        m.id = (m.title || 'title').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + (m.year ? '-' + m.year : '');
      }
      if ((m.type === 'TV Show' || m.type === 'Series') && m.seasons && m.seasons.length) {
        m.duration = `${m.seasons.length} Season${m.seasons.length > 1 ? 's' : ''}`;
      }
    });

    // FIX 4: Build O(1) Map â€” eliminates all N+1 .find() scans across the app
    _movieMap.clear();
    MOVIES.forEach(m => _movieMap.set(String(m.id), m));

    // FIX 5: ASYNC â€” render home on next frame, don't block catalog init
    requestAnimationFrame(() => renderHome());
  } catch (err) {
    console.error('Error initializing catalog:', err);
  }
}

// Navigation & Tab Switching
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      const tab = btn.dataset.tab;
      
      // If clicking the profile tab button itself, let its dedicated event listener handle it
      if (btn.id === 'mobileProfileBtn') return;
      
      if (tab) switchTab(tab);
      document.getElementById('sidebar')?.classList.remove('mobile-open');
      document.getElementById('settingsOverlay')?.classList.add('hidden');
    };
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.onclick = (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('mobile-open');
    };

    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }

  // Keyboard shortcut '/' for search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      switchTab('explore');
      document.getElementById('searchInput')?.focus();
    }
  });

  // Topbar search triggers
  document.getElementById('topSearchBtn')?.addEventListener('click', () => {
    switchTab('explore');
  });

  setupHeroDragEvents();
}

// PWA Install Logic
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  showToast('CineWatch successfully installed!');
});

function triggerAppInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      deferredPrompt = null;
    });
  } else {
    // If already installed or browser doesn't support it
    showToast('App is already installed or your browser requires manual installation (e.g., Safari Share > Add to Home Screen).');
  }
}

function switchTab(tabId) {
  state.currentTab = tabId;

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `panel-${tabId}`);
  });

  const appView = document.getElementById('appView');
  if (appView) appView.scrollTop = 0;

  if (tabId === 'home') renderHome();
  else if (tabId === 'explore') renderExplore();
  else if (tabId === 'movies') renderMoviesTab();
  else if (tabId === 'series') renderSeriesTab();
  else if (tabId === 'anime') renderAnimeTab();
  else if (tabId === 'ai') renderAITab();
  else if (tabId === 'watchlist') renderWatchlist();

  if (tabId === 'explore') {
    document.getElementById('searchInput')?.focus();
  } else if (tabId === 'ai') {
    document.getElementById('aiChatInput')?.focus();
  }
}

// FIX 5: Async chunked renderer â€” renders PAGE_SIZE cards per animation frame
function renderCardsAsync(items, container, offset = 0, appendMode = false) {
  if (!container) return;
  const chunk = items.slice(offset, offset + PAGE_SIZE);
  if (chunk.length === 0) return;

  // Use DocumentFragment for a single DOM write per chunk (no layout thrashing)
  requestAnimationFrame(() => {
    const frag = document.createDocumentFragment();
    chunk.forEach((m, i) => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = createCardHTML(m, null);
      const card = wrapper.firstElementChild;
      if (card) frag.appendChild(card);
    });
    if (!appendMode) container.innerHTML = '';
    container.appendChild(frag);
  });
}

// FIX 1: Tooltip helper â€” sets title attribute for browser-native tooltips
function _tip(el, text) {
  if (el) el.setAttribute('title', text);
}

// Media Card HTML Generator
function createCardHTML(movie, rankNum = null) {
  if (!movie) return '';
  const isFav = state.favorites.has(String(movie.id));
  const rankBadge = rankNum ? `<div class="card-rank"><ion-icon name="flame"></ion-icon> TOP ${rankNum}</div>` : '';
  const metaYear = movie.year ? `<span>${movie.year}</span>` : '';
  const metaDur = movie.duration ? `<span>${movie.duration}</span>` : '';
  const posterSrc = movie.poster || movie.backdrop || fallbackImg;

  // FIX 1: Text labels are always visible; tooltip on fav-btn for icon-only clarity
  // FIX 4: data-media-id on wrapper enables O(1) surgical fav button updates
  return `
    <div class="media-card" data-media-id="${movie.id}" onclick="openDetail('${movie.id}')">
      <div class="card-poster">
        <img src="${posterSrc}" alt="${movie.title}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImg}';">
        ${rankBadge}
        <button class="card-fav-btn ${isFav ? 'active' : ''}" data-id="${movie.id}" onclick="toggleFav(event, '${movie.id}')" aria-label="${isFav ? 'Remove from Watchlist' : 'Add to Watchlist'}" title="${isFav ? 'Remove from Watchlist' : 'Save to Watchlist'}">
          <ion-icon name="${isFav ? 'heart' : 'heart-outline'}"></ion-icon>
        </button>
      </div>
      <div class="card-info">
        <h3 class="card-title">${movie.title}</h3>
        <div class="card-meta">
          <span class="card-rating" title="Rating"><ion-icon name="star"></ion-icon> ${movie.rating || '8.0'}</span>
          ${metaYear}
          ${metaDur}
        </div>
      </div>
    </div>
  `;
}
window.createCardHTML = createCardHTML;

// 1. Home Tab Rendering
function renderHome() {
  if (!MOVIES || MOVIES.length === 0) return;

  let heroFeatured = MOVIES.filter(m => FEATURED_TITLES.includes(m.title)).slice(0, 6);
  if (heroFeatured.length === 0) {
    heroFeatured = MOVIES.slice(0, 6);
  }

  const heroTrack = document.getElementById('heroTrack');
  if (heroTrack && heroFeatured.length > 0) {
    heroTrack.innerHTML = heroFeatured.map((m, idx) => {
      const genreText = Array.isArray(m.genres) ? m.genres.slice(0, 3).join(' &bull; ') : (m.genres ? String(m.genres).replace(/â€¢/g, '&bull;') : 'Action &bull; Adventure &bull; Sci-Fi');
      return `
        <div class="hero-slide" style="background-image: url('${m.backdrop || m.poster || ''}')" onclick="openDetail('${m.id}')">
          <div class="hero-content" onclick="event.stopPropagation()">
            <h1 class="hero-title">${m.title}</h1>
            <div class="hero-meta-row">
              <span class="hero-rating-badge"><ion-icon name="star"></ion-icon> ${m.rating || '8.1'}</span>
              <span class="hero-meta-divider">&bull;</span>
              <span>${m.year || '2026'}</span>
              <span class="hero-meta-divider">&bull;</span>
              <span>${genreText}</span>
            </div>
            <p class="hero-overview">${m.description || 'Experience this blockbuster release in full HD quality with crystal-clear audio and lightning-fast multi-server streaming.'}</p>
            <div class="hero-actions-row">
              <button class="btn-hero-play" onclick="playMovieDirect('${m.id}')"><ion-icon name="play"></ion-icon> Play</button>
              <button class="btn-hero-more" onclick="openDetail('${m.id}')"><ion-icon name="information-circle-outline"></ion-icon> See More</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Render indicator dots
    renderHeroDots(heroFeatured.length);
    startHeroAutoplay(heroFeatured.length);
  }

  // Shelves
  const shelvesContainer = document.getElementById('homeShelves');
  if (!shelvesContainer) return;

  const top10 = TOP_10_TITLES.map(title => MOVIES.find(m => m.title === title)).filter(Boolean);
  const trendingMovies = MOVIES.filter(m => (!m.type || m.type === 'Movie') && !m.isAnime).slice(0, 15);
  const trendingSeries = MOVIES.filter(m => (m.type === 'TV Show' || m.type === 'Series') && !m.isAnime).slice(0, 15);
  const animeHits = MOVIES.filter(m => m.isAnime || m.genres?.includes('Anime')).slice(0, 15);

  shelvesContainer.innerHTML = `
    <div class="shelf">
      <div class="shelf-header">
        <h2 class="shelf-title"><span class="title-bar"></span> Top 10 in World Today</h2>
        <div class="shelf-nav-btns">
          <button class="shelf-nav-btn prev" onclick="slideShelf(this, -1)" aria-label="Slide Left" title="Previous"><ion-icon name="chevron-back-outline"></ion-icon></button>
          <button class="shelf-nav-btn next" onclick="slideShelf(this, 1)" aria-label="Slide Right" title="Next"><ion-icon name="chevron-forward-outline"></ion-icon></button>
        </div>
      </div>
      <div class="shelf-track-wrap">
        <button class="shelf-edge-arrow prev" onclick="slideShelf(this, -1)" aria-label="Slide Left" title="Slide Left"><ion-icon name="chevron-back-outline"></ion-icon></button>
        <div class="shelf-track">
          ${(top10.length ? top10 : MOVIES.slice(0, 10)).map((m, i) => createCardHTML(m, i + 1)).join('')}
        </div>
        <button class="shelf-edge-arrow next" onclick="slideShelf(this, 1)" aria-label="Slide Right" title="Slide Right"><ion-icon name="chevron-forward-outline"></ion-icon></button>
      </div>
    </div>

    <div class="shelf">
      <div class="shelf-header">
        <h2 class="shelf-title"><span class="title-bar"></span> Trending Movies</h2>
        <div class="shelf-nav-btns">
          <button class="shelf-nav-btn prev" onclick="slideShelf(this, -1)" aria-label="Slide Left" title="Previous"><ion-icon name="chevron-back-outline"></ion-icon></button>
          <button class="shelf-nav-btn next" onclick="slideShelf(this, 1)" aria-label="Slide Right" title="Next"><ion-icon name="chevron-forward-outline"></ion-icon></button>
        </div>
      </div>
      <div class="shelf-track-wrap">
        <button class="shelf-edge-arrow prev" onclick="slideShelf(this, -1)" aria-label="Slide Left" title="Slide Left"><ion-icon name="chevron-back-outline"></ion-icon></button>
        <div class="shelf-track">
          ${trendingMovies.map(m => createCardHTML(m)).join('')}
        </div>
        <button class="shelf-edge-arrow next" onclick="slideShelf(this, 1)" aria-label="Slide Right" title="Slide Right"><ion-icon name="chevron-forward-outline"></ion-icon></button>
      </div>
    </div>

    <div class="shelf">
      <div class="shelf-header">
        <h2 class="shelf-title"><span class="title-bar"></span> Popular Series</h2>
        <div class="shelf-nav-btns">
          <button class="shelf-nav-btn prev" onclick="slideShelf(this, -1)" aria-label="Slide Left" title="Previous"><ion-icon name="chevron-back-outline"></ion-icon></button>
          <button class="shelf-nav-btn next" onclick="slideShelf(this, 1)" aria-label="Slide Right" title="Next"><ion-icon name="chevron-forward-outline"></ion-icon></button>
        </div>
      </div>
      <div class="shelf-track-wrap">
        <button class="shelf-edge-arrow prev" onclick="slideShelf(this, -1)" aria-label="Slide Left" title="Slide Left"><ion-icon name="chevron-back-outline"></ion-icon></button>
        <div class="shelf-track">
          ${trendingSeries.map(m => createCardHTML(m)).join('')}
        </div>
        <button class="shelf-edge-arrow next" onclick="slideShelf(this, 1)" aria-label="Slide Right" title="Slide Right"><ion-icon name="chevron-forward-outline"></ion-icon></button>
      </div>
    </div>

    <div class="shelf">
      <div class="shelf-header">
        <h2 class="shelf-title"><span class="title-bar"></span> Anime Hits</h2>
        <div class="shelf-nav-btns">
          <button class="shelf-nav-btn prev" onclick="slideShelf(this, -1)" aria-label="Slide Left" title="Previous"><ion-icon name="chevron-back-outline"></ion-icon></button>
          <button class="shelf-nav-btn next" onclick="slideShelf(this, 1)" aria-label="Slide Right" title="Next"><ion-icon name="chevron-forward-outline"></ion-icon></button>
        </div>
      </div>
      <div class="shelf-track-wrap">
        <button class="shelf-edge-arrow prev" onclick="slideShelf(this, -1)" aria-label="Slide Left" title="Slide Left"><ion-icon name="chevron-back-outline"></ion-icon></button>
        <div class="shelf-track">
          ${animeHits.map(m => createCardHTML(m)).join('')}
        </div>
        <button class="shelf-edge-arrow next" onclick="slideShelf(this, 1)" aria-label="Slide Right" title="Slide Right"><ion-icon name="chevron-forward-outline"></ion-icon></button>
      </div>
    </div>
  `;

  setupShelfDragScroll();
}

window.slideShelf = function(btn, direction) {
  const shelf = btn.closest('.shelf');
  if (!shelf) return;
  const track = shelf.querySelector('.shelf-track');
  if (!track) return;
  const scrollAmount = Math.max(340, track.clientWidth * 0.75);
  track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
};

function setupShelfDragScroll() {
  document.querySelectorAll('.shelf-track').forEach(track => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let dragDistance = 0;

    // Prevent default browser ghost dragging on all poster images
    track.querySelectorAll('img').forEach(img => {
      img.setAttribute('draggable', 'false');
      img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    track.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDown = true;
      dragDistance = 0;
      startX = e.pageX;
      scrollLeft = track.scrollLeft;
      track.style.scrollBehavior = 'auto';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const walk = e.pageX - startX;
      dragDistance = Math.abs(walk);
      if (dragDistance > 5) {
        track.classList.add('is-dragging');
        track.scrollLeft = scrollLeft - walk;
      }
    });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      track.style.scrollBehavior = 'smooth';
      setTimeout(() => {
        track.classList.remove('is-dragging');
        dragDistance = 0;
      }, 60);
    });

    // Intercept card click if user was dragging
    track.addEventListener('click', (e) => {
      if (dragDistance > 6) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }, true);
  });
}

// Hero Drag / Swipe & Autoplay
let heroDragState = { startX: 0, currentTranslate: 0, isDragging: false, hasMoved: false };

function setupHeroDragEvents() {
  const heroContainer = document.getElementById('hero');
  const heroTrack = document.getElementById('heroTrack');
  if (!heroContainer || !heroTrack) return;

  const onDragStart = (e) => {
    if (e.type.includes('mouse') && e.button !== 0) return;
    heroDragState.isDragging = true;
    heroDragState.hasMoved = false;
    heroDragState.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    const bannerWidth = heroContainer.offsetWidth || window.innerWidth;
    heroDragState.currentTranslate = -state.heroIndex * bannerWidth;
    clearInterval(state.heroTimer);
  };

  const onDragMove = (e) => {
    if (!heroDragState.isDragging) return;
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    const diffX = currentX - heroDragState.startX;

    if (Math.abs(diffX) > 12) {
      heroDragState.hasMoved = true;
      heroContainer.classList.add('is-dragging');
      heroTrack.style.transition = 'none';
      if (e.cancelable) e.preventDefault();
      heroTrack.style.transform = `translateX(${heroDragState.currentTranslate + diffX}px)`;
    }
  };

  const onDragEnd = (e) => {
    if (!heroDragState.isDragging) return;
    heroDragState.isDragging = false;
    heroContainer.classList.remove('is-dragging');

    const endX = e.type.includes('mouse')
      ? e.pageX
      : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : heroDragState.startX);
    const diffX = endX - heroDragState.startX;
    const bannerWidth = heroContainer.offsetWidth || window.innerWidth;
    const threshold = Math.min(80, bannerWidth * 0.1);
    const slidesCount = document.querySelectorAll('.hero-slide').length || 6;

    if (heroDragState.hasMoved && Math.abs(diffX) > threshold) {
      if (diffX < 0) {
        state.heroIndex = (state.heroIndex + 1) % slidesCount;
      } else {
        state.heroIndex = (state.heroIndex - 1 + slidesCount) % slidesCount;
      }
    }

    updateHeroBannerPosition();
    startHeroAutoplay(slidesCount);

    // After any drag movement, swallow the next click so openDetail doesn't fire
    if (heroDragState.hasMoved) {
      heroContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
      }, { capture: true, once: true });
    }
  };

  heroContainer.addEventListener('mousedown', onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);

  heroContainer.addEventListener('touchstart', onDragStart, { passive: true });
  heroContainer.addEventListener('touchmove', onDragMove, { passive: false });
  heroContainer.addEventListener('touchend', onDragEnd);
}

// Render hero slide indicator dock with numbers & navigation
function renderHeroDots(count) {
  const dotsEl = document.getElementById('heroDots');
  if (!dotsEl) return;
  
  const pad = (n) => String(n).padStart(2, '0');
  
  dotsEl.innerHTML = `
    <div class="hero-dots-track">
      ${Array.from({ length: count }, (_, i) =>
        `<button class="hero-dot ${i === state.heroIndex ? 'active' : ''}" onclick="jumpHeroSlide(${i})" aria-label="Go to slide ${i + 1}"></button>`
      ).join('')}
    </div>
    <div class="hero-dots-divider"></div>
    <div class="hero-page-counter" onclick="jumpHeroSlide(state.heroIndex + 1)" title="Next Slide">
      <span class="hero-cur-num" id="heroCurNum">${pad(state.heroIndex + 1)}</span>
      <span class="hero-sep">/</span>
      <span class="hero-total-num" id="heroTotalNum">${pad(count)}</span>
    </div>
  `;
}

function updateHeroDots() {
  const count = document.querySelectorAll('.hero-slide').length || 6;
  const pad = (n) => String(n).padStart(2, '0');
  
  const curNum = document.getElementById('heroCurNum');
  if (curNum) curNum.textContent = pad(state.heroIndex + 1);

  document.querySelectorAll('#heroDots .hero-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === state.heroIndex);
  });
}

function jumpHeroSlide(index) {
  const count = document.querySelectorAll('.hero-slide').length || 6;
  if (index < 0) index = count - 1;
  else if (index >= count) index = 0;
  
  state.heroIndex = index;
  updateHeroBannerPosition();
}

function updateHeroBannerPosition() {
  const heroTrack = document.getElementById('heroTrack');
  const slides = document.querySelectorAll('.hero-slide');
  if (!heroTrack || slides.length === 0) return;

  heroTrack.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
  heroTrack.style.transform = `translateX(-${state.heroIndex * 100}%)`;
  updateHeroDots();
}

function startHeroAutoplay(totalSlides) {
  clearInterval(state.heroTimer);
  state.heroTimer = setInterval(() => {
    const count = totalSlides || document.querySelectorAll('.hero-slide').length || 6;
    if (count <= 1) return;
    state.heroIndex = (state.heroIndex + 1) % count;
    updateHeroBannerPosition();
  }, 7500);
}

// 2. Explore Tab
function renderExplore() {
  const searchInput = document.getElementById('searchInput');
  const filterChips = document.getElementById('filterChips');
  const genreChips = document.getElementById('genreChips');
  const clearBtn = document.getElementById('exploreClearBtn');

  // Type filter pills
  filterChips?.querySelectorAll('.pill-btn').forEach(btn => {
    btn.onclick = () => {
      filterChips.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeType = btn.dataset.type || 'all';
      filterResults();
    };
  });

  // Extract unique genres
  const genresSet = new Set();
  MOVIES.forEach(m => {
    if (Array.isArray(m.genres)) m.genres.forEach(g => genresSet.add(g));
    else if (m.genres) genresSet.add(m.genres);
  });

  if (genreChips) {
    genreChips.innerHTML = `
      <button class="pill-btn active" data-genre="all">All Genres</button>
      ${[...genresSet].slice(0, 12).map(g => `<button class="pill-btn" data-genre="${g}">${g}</button>`).join('')}
    `;

    genreChips.querySelectorAll('.pill-btn').forEach(btn => {
      btn.onclick = () => {
        genreChips.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeGenre = btn.dataset.genre || 'all';
        filterResults();
      };
    });
  }

  searchInput?.addEventListener('input', () => {
    clearBtn?.classList.toggle('hidden', !searchInput.value);
    filterResults();
  });

  clearBtn?.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = '';
      clearBtn.classList.add('hidden');
      filterResults();
    }
  });

  filterResults();
}

function filterResults() {
  const q = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';
  const grid = document.getElementById('resultsGrid');
  const empty = document.getElementById('exploreEmpty');
  const countEl = document.getElementById('exploreCount');

  // FIX 5: filtering is synchronous but rendering is async (no UI freeze)
  let filtered = MOVIES.filter(m => {
    if (state.activeType !== 'all') {
      if (state.activeType === 'Anime' && !m.isAnime && !m.genres?.includes('Anime')) return false;
      if (state.activeType === 'Movie' && (m.type === 'TV Show' || m.type === 'Series' || m.seasons)) return false;
      if (state.activeType === 'TV Show' && m.type !== 'TV Show' && m.type !== 'Series' && !m.seasons) return false;
    }
    if (state.activeGenre !== 'all') {
      const gStr = Array.isArray(m.genres) ? m.genres.join(' ') : String(m.genres || '');
      if (!gStr.toLowerCase().includes(state.activeGenre.toLowerCase())) return false;
    }
    if (q) {
      const hay = `${m.title} ${m.director || ''} ${Array.isArray(m.cast) ? m.cast.join(' ') : (m.cast || '')} ${m.year || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (countEl) countEl.textContent = `${filtered.length} Titles`;

  // FIX 3: Paginated â€” only render PAGE_SIZE items, add Load More if needed
  _filteredCache.explore = filtered;
  _pageOffset.explore = 0;

  if (!grid) return;
  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty?.classList.remove('hidden');
    return;
  }
  empty?.classList.add('hidden');

  // FIX 5: async render â€” no main-thread blocking
  renderCardsAsync(filtered, grid, 0, false);
  _renderLoadMoreBtn('resultsGrid', 'explore', filtered);
}

// Shared "Load More" button renderer
function _renderLoadMoreBtn(gridId, cacheKey, items) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  // Remove any existing Load More button
  const old = document.getElementById(`load-more-${gridId}`);
  if (old) old.remove();

  const nextOffset = (_pageOffset[cacheKey] || 0) + PAGE_SIZE;
  if (nextOffset >= items.length) return; // no more pages

  const btn = document.createElement('button');
  btn.id = `load-more-${gridId}`;
  btn.className = 'load-more-btn';
  btn.textContent = `Load More (${items.length - nextOffset} remaining)`;
  btn.title = `Load next ${PAGE_SIZE} results`;
  btn.onclick = () => {
    _pageOffset[cacheKey] = nextOffset;
    renderCardsAsync(items, grid, nextOffset, true);
    btn.remove();
    _renderLoadMoreBtn(gridId, cacheKey, items);
  };

  // Insert after the grid
  grid.insertAdjacentElement('afterend', btn);
}

// 3. Movies Tab â€” FIX 3+5: Async paginated render
function renderMoviesTab() {
  const grid = document.getElementById('moviesGrid');
  const countEl = document.getElementById('moviesCount');
  const movies = MOVIES.filter(m => (!m.type || m.type === 'Movie') && !m.isAnime);
  if (countEl) countEl.textContent = `${movies.length} Movies`;
  _pageOffset.movies = 0;
  renderCardsAsync(movies, grid, 0, false);
  _renderLoadMoreBtn('moviesGrid', 'movies', movies);
  // Cache for load-more
  _filteredCache.movies = movies;
}

// 4. Series Tab â€” FIX 3+5: Async paginated render
function renderSeriesTab() {
  const grid = document.getElementById('seriesGrid');
  const countEl = document.getElementById('seriesCount');
  const series = MOVIES.filter(m => m.type === 'TV Show' || m.type === 'Series' || m.seasons);
  if (countEl) countEl.textContent = `${series.length} Series`;
  _pageOffset.series = 0;
  renderCardsAsync(series, grid, 0, false);
  _renderLoadMoreBtn('seriesGrid', 'series', series);
  _filteredCache.series = series;
}

// 5. Anime Tab â€” FIX 3+5: Async paginated render
function renderAnimeTab() {
  const grid = document.getElementById('animeGrid');
  const countEl = document.getElementById('animeCount');
  const anime = MOVIES.filter(m => m.isAnime || m.genres?.includes('Anime'));
  if (countEl) countEl.textContent = `${anime.length} Anime`;
  _pageOffset.anime = 0;
  renderCardsAsync(anime, grid, 0, false);
  _renderLoadMoreBtn('animeGrid', 'anime', anime);
  _filteredCache.anime = anime;
}

// 6. Live TV Tab
let _liveChannelsAll = [];
let _liveActiveCat = 'all';
let _liveQuery = '';
let _liveLoaded = false;

function renderLiveTVGrid() {
  const grid = document.getElementById('liveGrid');
  const empty = document.getElementById('liveEmpty');
  const countEl = document.getElementById('liveCount');
  if (!grid) return;

  const filtered = _liveChannelsAll.filter(ch => {
    const matchCat = _liveActiveCat === 'all' || (ch.category || '').toLowerCase() === _liveActiveCat.toLowerCase();
    const matchQ = !_liveQuery || ch.name.toLowerCase().includes(_liveQuery);
    return matchCat && matchQ;
  });

  if (countEl) countEl.textContent = filtered.length + ' Channels';

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty?.classList.remove('hidden');
    return;
  }
  empty?.classList.add('hidden');

  grid.innerHTML = filtered.map(ch => {
    const safeStream = encodeURIComponent(ch.streamUrl);
    const safeName = (ch.name || '').replace(/"/g, '');
    const logoHtml = ch.logo
      ? '<img src="' + ch.logo + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'" alt="' + safeName + '">'
      : '';
    return '<div class="live-card" data-stream="' + safeStream + '" data-name="' + safeName + '" onclick="playLiveChannel(this)">'
      + '<div class="live-card-thumb">'
      + logoHtml
      + '<div class="live-card-fallback-icon" style="display:' + (ch.logo ? 'none' : 'flex') + '"><ion-icon name="tv-outline"></ion-icon></div>'
      + '<div class="live-badge"><span class="live-dot"></span> LIVE</div>'
      + '</div>'
      + '<div class="live-card-info">'
      + '<h3>' + safeName + '</h3>'
      + '<p>' + (ch.category || 'General') + (ch.country ? ' Â· ' + ch.country : '') + '</p>'
      + '</div></div>';
  }).join('');
}

async function renderLiveTV() {
  const loading = document.getElementById('liveLoading');
  const grid = document.getElementById('liveGrid');

  if (!_liveLoaded) {
    loading?.classList.remove('hidden');
    if (grid) grid.innerHTML = '';
    if (typeof window._loadLiveChannels === 'function') {
      _liveChannelsAll = await window._loadLiveChannels();
    } else {
      _liveChannelsAll = window._LIVE_CHANNELS || [];
    }
    _liveLoaded = true;
    loading?.classList.add('hidden');
  }

  const searchInput = document.getElementById('liveSearch');
  if (searchInput && !searchInput._wired) {
    searchInput._wired = true;
    searchInput.addEventListener('input', () => {
      _liveQuery = searchInput.value.toLowerCase().trim();
      renderLiveTVGrid();
    });
  }

  const filterRow = document.getElementById('liveCategoryFilter');
  if (filterRow && !filterRow._wired) {
    filterRow._wired = true;
    filterRow.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterRow.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _liveActiveCat = btn.dataset.cat;
        renderLiveTVGrid();
      });
    });
  }

  renderLiveTVGrid();
}

window.playLiveChannel = function(el) {
  const streamUrl = decodeURIComponent(el.dataset.stream);
  const name = el.dataset.name;
  const playerModal = document.getElementById('playerModal');
  const titleEl = document.getElementById('playerTitle');
  const videoEl = document.getElementById('videoEl');
  const iframeEl = document.getElementById('iframeEl');

  if (!playerModal || !videoEl) { showToast('Player not ready'); return; }

  if (titleEl) titleEl.textContent = '\uD83D\uDD34 LIVE \u2014 ' + name;
  iframeEl?.classList.add('hidden');
  videoEl.classList.remove('hidden');
  videoEl.src = '';
  playerModal.classList.remove('hidden');

  if (videoEl._hls) { videoEl._hls.destroy(); videoEl._hls = null; }

  if (window.Hls && window.Hls.isSupported()) {
    const hls = new window.Hls({ enableWorker: false, maxBufferLength: 15 });
    hls.loadSource(streamUrl);
    hls.attachMedia(videoEl);
    hls.on(window.Hls.Events.MANIFEST_PARSED, () => videoEl.play().catch(() => {}));
    hls.on(window.Hls.Events.ERROR, (ev, data) => {
      if (data.fatal) showToast('Stream unavailable. Try another channel.');
    });
    videoEl._hls = hls;
  } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
    videoEl.src = streamUrl;
    videoEl.play().catch(() => {});
  } else {
    showToast('HLS not supported in this player.');
  }
};

// 7. AI Assistant Tab
function renderAITab() {
  const input = document.getElementById('aiChatInput');
  const sendBtn = document.getElementById('aiSendBtn');
  if (!input || !sendBtn) return;

  sendBtn.onclick = () => window.sendAIChatMessage?.();
  input.onkeydown = (e) => {
    if (e.key === 'Enter') window.sendAIChatMessage?.();
  };
}

// 8. Watchlist Tab
function renderWatchlist() {
  const grid = document.getElementById('watchlistGrid');
  const empty = document.getElementById('watchlistEmpty');
  const countEl = document.getElementById('watchlistCount');

  const favList = MOVIES.filter(m => state.favorites.has(String(m.id)));
  if (countEl) countEl.textContent = `${favList.length} Saved`;

  if (grid) {
    if (favList.length === 0) {
      grid.innerHTML = '';
      empty?.classList.remove('hidden');
    } else {
      empty?.classList.add('hidden');
      grid.innerHTML = favList.map(m => createCardHTML(m)).join('');
    }
  }
}

// Detail Modal — with Netflix-style auto-playing trailer
// Detail Modal — Immersive Full-Screen View
let _trailerTimer = null;
let _trailerMuted = true;

function openDetail(movieId) {
  const movie = _movieMap.get(String(movieId));
  if (!movie) return;

  // Cancel any previous trailer timer
  clearTimeout(_trailerTimer);

  state.currentDetail = movie;
  const modal = document.getElementById('detailModal');
  const hero  = document.getElementById('detailHero');
  const body  = document.getElementById('detailBody');

  const isFav        = state.favorites.has(String(movie.id));
  const genreText    = Array.isArray(movie.genres) ? movie.genres.join(', ') : (movie.genres || 'Action, Drama');
  let castText     = movie.cast ? (Array.isArray(movie.cast) ? movie.cast.join(', ') : movie.cast) : 'TOM HOLLAND, ZENDAYA, BENEDICT CUMBERBATCH';
  const directorText = movie.director || '';
  const overview     = movie.description || movie.overview || 'A cinematic masterpiece streaming now on CineWatch in full high-definition quality with crystal clear audio.';
  const trailerId    = movie.trailerYouTubeId || null;

  /* ── Hero: Full-screen background ── */
  if (hero) {
    hero.style.backgroundImage = `url('${movie.backdrop || movie.poster || ''}')`;
    hero.style.backgroundSize  = 'cover';
    hero.style.backgroundPosition = 'center center';
    hero.innerHTML = `
      <div class="immersive-gradient"></div>
      ${trailerId ? `<button class="trailer-sound-btn hidden" id="trailerSoundBtn" title="Toggle sound">
        <ion-icon name="volume-mute"></ion-icon>
      </button>` : ''}
    `;

    /* Auto-play trailer after 4 seconds if available */
    if (trailerId) {
      _trailerTimer = setTimeout(() => {
        _startTrailer(hero, trailerId);
      }, 4000);
    }
  }

  /* ── Body: Top Nav + Bottom Content ── */
  if (body) {
    // Generate a random match percentage for the UI
    const imdbRating = movie.rating || '8.5';
    
    // Calculate super accurate "Plays until" time based on movie.duration in the code
    function parseDurationMinutes(dur, isTv) {
      if (!dur) return isTv ? 45 : 120;
      if (typeof dur === 'number') return dur;
      const s = String(dur).trim().toLowerCase();
      let h = 0, m = 0;
      const hMatch = s.match(/(\d+)\s*(?:h|hr|hours?)/);
      if (hMatch) h = parseInt(hMatch[1], 10) || 0;
      const mMatch = s.match(/(\d+)\s*(?:m|min|mins|minutes?)/);
      if (mMatch) m = parseInt(mMatch[1], 10) || 0;
      if (!hMatch && !mMatch) {
        const rawNum = parseInt(s.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(rawNum) && rawNum > 0) m = rawNum;
      }
      const total = (h * 60) + m;
      return total > 0 ? total : (isTv ? 45 : 120);
    }

    const durationMins = parseDurationMinutes(movie.duration, movie.type === 'TV Show' || movie.type === 'Series');
    const now = new Date();
    const finishTime = new Date(now.getTime() + durationMins * 60 * 1000);
    
    let endHours = finishTime.getHours();
    const endMinutes = String(finishTime.getMinutes()).padStart(2, '0');
    const ampm = endHours >= 12 ? 'PM' : 'AM';
    endHours = endHours % 12;
    endHours = endHours ? endHours : 12;
    const timeString = `${String(endHours).padStart(2, '0')}:${endMinutes} ${ampm}`;

    body.innerHTML = `
      <div class="immersive-topbar">
        <div class="immersive-topbar-left">
          <button class="immersive-back-btn" onclick="closeDetail()" aria-label="Go Back">
            <ion-icon name="arrow-back-outline"></ion-icon>
            <span>Back</span>
          </button>
          <div class="immersive-logo">Cine<span>Watch</span></div>
        </div>
        <div class="immersive-top-actions"></div>
      </div>

      <div class="immersive-bottom-container">
        <div class="immersive-left">
          <h1 class="immersive-title">${movie.title}</h1>
          
          <div class="immersive-meta-pills">
            <span class="meta-badge-pill gold"><ion-icon name="star"></ion-icon> IMDb ${imdbRating}</span>
            <span class="meta-badge-pill">${movie.year || '2026'}</span>
            <span class="meta-badge-pill"><ion-icon name="time-outline"></ion-icon> ${movie.duration || '2h 15m'}</span>
            <span class="meta-badge-pill age">${movie.age || 'R'}</span>
          </div>

          <div class="immersive-cast">${castText.toUpperCase()}</div>
          <p class="immersive-overview">${overview}</p>

          <div class="immersive-btn-row">
            <button class="btn-watch-now" onclick="playMovieDirect('${movie.id}')">
              <ion-icon name="play"></ion-icon>
              <span>Watch Now</span>
            </button>
            <button class="btn-more-info ${isFav ? 'active-fav' : ''}" onclick="toggleFavorite('${movie.id}'); openDetail('${movie.id}');">
              <ion-icon name="${isFav ? 'checkmark-circle' : 'add-circle-outline'}"></ion-icon>
              <span>${isFav ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>
          </div>
        </div>

        <div class="immersive-right">
          <div class="immersive-runtime-card">
            <div class="runtime-play-head">
              <ion-icon name="play-circle-outline"></ion-icon>
              <span>ESTIMATED RUNTIME</span>
            </div>
            <div class="runtime-play-time">Plays until ${timeString}</div>
          </div>
        </div>
      </div>
    `;
  }

  const sheet = document.getElementById('detailSheet');
  if (sheet) sheet.scrollTop = 0;
  modal?.classList.remove('hidden');
}

function _startTrailer(heroEl, ytId) {
  if (!heroEl || !document.getElementById('detailModal') || document.getElementById('detailModal').classList.contains('hidden')) return;

  _trailerMuted = true;

  // Build muted autoplay iframe
  const iframe = document.createElement('iframe');
  iframe.className = 'trailer-iframe';
  iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${ytId}&iv_load_policy=3`;
  iframe.allow = 'autoplay; encrypted-media';
  iframe.allowFullscreen = false;

  // Fade-out the background image, fade-in the iframe
  iframe.style.opacity = '0';
  iframe.style.transition = 'opacity 1.2s ease';
  heroEl.appendChild(iframe);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      iframe.style.opacity = '1';
      heroEl.style.backgroundImage = 'none';
    });
  });

  // Wire up the sound toggle button
  const soundBtn = document.getElementById('trailerSoundBtn');
  if (soundBtn) {
    soundBtn.classList.remove('hidden');
    soundBtn.onclick = () => {
      _trailerMuted = !_trailerMuted;
      const newSrc = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=${_trailerMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&loop=1&playlist=${ytId}&iv_load_policy=3`;
      iframe.src = newSrc;
      soundBtn.innerHTML = `<ion-icon name="${_trailerMuted ? 'volume-mute' : 'volume-high'}"></ion-icon>`;
    };
  }
}

function closeDetail() {
  clearTimeout(_trailerTimer);
  const modal = document.getElementById('detailModal');
  if (modal) modal.classList.add('hidden');
  // Clean up iframe so video stops
  const iframe = document.querySelector('.trailer-iframe');
  if (iframe) iframe.remove();
}

// ==========================================================================
// CINEWATCH NEXT-GEN NATIVE VIDEO PLAYER CONTROLLER
// ==========================================================================

let _cwPlayerState = {
  activeMovie: null,
  hlsInstance: null,
  isDirect: false,
  idleTimer: null,
  isScrubbing: false,
  savedVolume: parseFloat(localStorage.getItem('cw_player_volume') || '1'),
  activeSub: 'off',
  activeSpeed: 1.0
};

function formatPlayerTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function playMovieDirect(movieId) {
  closeDetail();
  const movie = _movieMap.get(String(movieId));
  if (!movie) return;

  _cwPlayerState.activeMovie = movie;

  const playerModal = document.getElementById('playerModal');
  const playerTitle = document.getElementById('playerTitle');
  const videoEl = document.getElementById('videoEl');
  const iframeEl = document.getElementById('iframeEl');
  const serverSelect = document.getElementById('serverSelect');
  const streamTypeBadge = document.getElementById('streamTypeBadge');
  const nextEpBtn = document.getElementById('nextEpBtn');

  if (playerTitle) playerTitle.textContent = `${movie.title} (${movie.year || '2026'})`;

  const tmdb = movie.tmdbId || movie.videoUrl || '550';
  const isTv = movie.type === 'TV Show' || movie.type === 'Series' || (movie.seasons && movie.seasons.length);

  if (nextEpBtn) {
    nextEpBtn.classList.toggle('hidden', !isTv);
  }

  // Dedicated VidLink Pro Streaming Engine (Only Server)
  const sNum = movie.season || 1;
  const epNum = movie.episode || 1;

  const vidLinkUrl = isTv
    ? `https://vidlink.pro/tv/${tmdb}/${sNum}/${epNum}?primaryColor=e50914`
    : `https://vidlink.pro/movie/${tmdb}?primaryColor=e50914`;

  const servers = [
    {
      id: 'vidlink',
      name: '⚡ VidLink Pro HD',
      url: vidLinkUrl
    }
  ];

  function switchSource(srv) {
    const vidstackPlayer = document.getElementById('vidstackPlayer');
    const iframeEl = document.getElementById('iframeEl');
    const streamTypeBadge = document.getElementById('streamTypeBadge');
    const playerLoading = document.getElementById('playerLoading');

    // Never show duplicate custom spinner
    if (playerLoading) playerLoading.classList.add('hidden');

    const playerControls = document.getElementById('playerControls');
    const centerPlayBadge = document.getElementById('centerPlayBadge');
    const seekLeftZone = document.getElementById('seekLeftZone');
    const seekRightZone = document.getElementById('seekRightZone');

    if (playerControls) playerControls.classList.add('hidden');
    if (centerPlayBadge) centerPlayBadge.classList.add('hidden');
    if (seekLeftZone) seekLeftZone.classList.add('hidden');
    if (seekRightZone) seekRightZone.classList.add('hidden');

    if (vidstackPlayer) {
      vidstackPlayer.pause();
      vidstackPlayer.src = '';
      vidstackPlayer.classList.add('hidden');
    }

    if (iframeEl) {
      iframeEl.classList.remove('hidden');
      iframeEl.src = srv ? srv.url : vidLinkUrl;
    }

    if (streamTypeBadge) streamTypeBadge.textContent = 'VIDLINK PRO';
  }

  // Populate server label
  const serverActiveLabel = document.getElementById('serverActiveLabel');
  if (serverActiveLabel) {
    serverActiveLabel.textContent = 'VidLink Pro';
  }

  // Setup Player Controls & Listeners
  initPlayerControllers();

  switchSource(servers[0]);
  playerModal?.classList.remove('hidden');
  resetPlayerIdleTimer();
}

function initPlayerControllers() {
  const videoEl = document.getElementById('videoEl');
  const playPause = document.getElementById('playPause');
  const playIcon = document.getElementById('playIcon');
  const rewind10 = document.getElementById('rewind10');
  const forward10 = document.getElementById('forward10');
  const seekBar = document.getElementById('seekBar');
  const progressFill = document.getElementById('progressFill');
  const progressBuffer = document.getElementById('progressBuffer');
  const progressThumb = document.getElementById('progressThumb');
  const progressTooltip = document.getElementById('progressTooltip');
  const progressContainer = document.getElementById('progressContainer');
  const curTime = document.getElementById('curTime');
  const durTime = document.getElementById('durTime');
  const volumeBtn = document.getElementById('volumeBtn');
  const volumeIcon = document.getElementById('volumeIcon');
  const volumeBar = document.getElementById('volumeBar');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const pipBtn = document.getElementById('pipBtn');
  const skipIntroBtn = document.getElementById('skipIntroBtn');
  const centerPlayBadge = document.getElementById('centerPlayBadge');
  const centerPlayIcon = document.getElementById('centerPlayIcon');
  const seekLeftZone = document.getElementById('seekLeftZone');
  const seekRightZone = document.getElementById('seekRightZone');
  const seekLeftRipple = document.getElementById('seekLeftRipple');
  const seekRightRipple = document.getElementById('seekRightRipple');
  const speedBtn = document.getElementById('speedBtn');
  const speedMenu = document.getElementById('speedMenu');
  const speedLabel = document.getElementById('speedLabel');
  const subtitlesBtn = document.getElementById('subtitlesBtn');
  const subtitlesMenu = document.getElementById('subtitlesMenu');

  // Center Play / Pause Pop helper
  function triggerCenterPop(isPlay) {
    if (!centerPlayBadge || !centerPlayIcon) return;
    centerPlayIcon.setAttribute('name', isPlay ? 'play' : 'pause');
    centerPlayBadge.classList.remove('pop');
    void centerPlayBadge.offsetWidth;
    centerPlayBadge.classList.add('pop');
    setTimeout(() => centerPlayBadge.classList.remove('pop'), 600);
  }

  // Play / Pause Toggle
  function togglePlay() {
    if (!videoEl || videoEl.classList.contains('hidden')) return;
    if (videoEl.paused) {
      videoEl.play();
      playIcon?.setAttribute('name', 'pause');
      triggerCenterPop(true);
    } else {
      videoEl.pause();
      playIcon?.setAttribute('name', 'play');
      triggerCenterPop(false);
    }
  }

  if (playPause) playPause.onclick = togglePlay;

  // 10s Seek Helpers
  function seekRelative(delta) {
    if (!videoEl || videoEl.classList.contains('hidden')) return;
    videoEl.currentTime = Math.max(0, Math.min(videoEl.duration || 0, videoEl.currentTime + delta));
  }

  if (rewind10) rewind10.onclick = () => seekRelative(-10);
  if (forward10) forward10.onclick = () => seekRelative(10);

  // Double Click / Tap Seek Zones
  if (seekLeftZone) {
    seekLeftZone.ondblclick = (e) => {
      e.stopPropagation();
      seekRelative(-10);
      seekLeftRipple?.classList.add('active');
      setTimeout(() => seekLeftRipple?.classList.remove('active'), 500);
    };
  }
  if (seekRightZone) {
    seekRightZone.ondblclick = (e) => {
      e.stopPropagation();
      seekRelative(10);
      seekRightRipple?.classList.add('active');
      setTimeout(() => seekRightRipple?.classList.remove('active'), 500);
    };
  }

  // Video Time Updates
  if (videoEl) {
    videoEl.ontimeupdate = () => {
      if (_cwPlayerState.isScrubbing) return;
      const current = videoEl.currentTime || 0;
      const duration = videoEl.duration || 0;
      const percent = duration > 0 ? (current / duration) * 100 : 0;

      if (curTime) curTime.textContent = formatPlayerTime(current);
      if (durTime) durTime.textContent = formatPlayerTime(duration);
      if (progressFill) progressFill.style.width = `${percent}%`;
      if (progressThumb) progressThumb.style.left = `${percent}%`;
      if (seekBar) seekBar.value = percent;

      // Show Skip Intro button between 10s and 95s
      if (skipIntroBtn) {
        skipIntroBtn.classList.toggle('hidden', !(current >= 10 && current <= 95));
      }
    };

    videoEl.onprogress = () => {
      if (videoEl.buffered.length > 0 && videoEl.duration) {
        const bufferedEnd = videoEl.buffered.end(videoEl.buffered.length - 1);
        const bufPercent = (bufferedEnd / videoEl.duration) * 100;
        if (progressBuffer) progressBuffer.style.width = `${bufPercent}%`;
      }
    };

    videoEl.onplay = () => playIcon?.setAttribute('name', 'pause');
    videoEl.onpause = () => playIcon?.setAttribute('name', 'play');
  }

  // Skip Intro (+85s)
  if (skipIntroBtn) {
    skipIntroBtn.onclick = () => {
      seekRelative(85);
      skipIntroBtn.classList.add('hidden');
      showToast('⏩ Skipped Intro (+85s)');
    };
  }

  // Seekbar scrubbing
  if (seekBar) {
    seekBar.oninput = () => {
      _cwPlayerState.isScrubbing = true;
      const percent = parseFloat(seekBar.value);
      if (progressFill) progressFill.style.width = `${percent}%`;
      if (progressThumb) progressThumb.style.left = `${percent}%`;
      if (videoEl && videoEl.duration) {
        const targetTime = (percent / 100) * videoEl.duration;
        if (curTime) curTime.textContent = formatPlayerTime(targetTime);
      }
    };

    seekBar.onchange = () => {
      _cwPlayerState.isScrubbing = false;
      const percent = parseFloat(seekBar.value);
      if (videoEl && videoEl.duration) {
        videoEl.currentTime = (percent / 100) * videoEl.duration;
      }
    };
  }

  // Progress bar hover tooltip
  if (progressContainer) {
    progressContainer.onmousemove = (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      if (progressTooltip) {
        progressTooltip.style.left = `${pos * 100}%`;
        const dur = videoEl?.duration || 0;
        progressTooltip.textContent = formatPlayerTime(pos * dur);
      }
    };
  }

  // Volume Controller
  function updateVolume(val) {
    _cwPlayerState.savedVolume = val;
    localStorage.setItem('cw_player_volume', String(val));
    if (videoEl) {
      videoEl.volume = val;
      videoEl.muted = val === 0;
    }
    if (volumeBar) volumeBar.value = val;
    if (volumeIcon) {
      if (val === 0) volumeIcon.setAttribute('name', 'volume-mute-outline');
      else if (val < 0.5) volumeIcon.setAttribute('name', 'volume-low-outline');
      else volumeIcon.setAttribute('name', 'volume-high-outline');
    }
  }

  if (volumeBar) {
    volumeBar.value = _cwPlayerState.savedVolume;
    volumeBar.oninput = () => updateVolume(parseFloat(volumeBar.value));
  }

  if (volumeBtn) {
    volumeBtn.onclick = () => {
      if (!videoEl) return;
      if (videoEl.muted || videoEl.volume === 0) {
        updateVolume(_cwPlayerState.savedVolume || 1);
      } else {
        updateVolume(0);
      }
    };
  }

  // Speed Selector Menu
  if (speedBtn && speedMenu) {
    speedBtn.onclick = (e) => {
      e.stopPropagation();
      speedMenu.classList.toggle('hidden');
      subtitlesMenu?.classList.add('hidden');
    };

    speedMenu.querySelectorAll('.cw-menu-item').forEach(item => {
      item.onclick = () => {
        const spd = parseFloat(item.dataset.speed || '1');
        _cwPlayerState.activeSpeed = spd;
        if (videoEl) videoEl.playbackRate = spd;
        if (speedLabel) speedLabel.textContent = `${spd}x`;
        speedMenu.querySelectorAll('.cw-menu-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        speedMenu.classList.add('hidden');
      };
    });
  }

  // Subtitles Selector Menu
  if (subtitlesBtn && subtitlesMenu) {
    subtitlesBtn.onclick = (e) => {
      e.stopPropagation();
      subtitlesMenu.classList.toggle('hidden');
      speedMenu?.classList.add('hidden');
    };

    subtitlesMenu.querySelectorAll('.cw-menu-item').forEach(item => {
      item.onclick = () => {
        const sub = item.dataset.sub || 'off';
        _cwPlayerState.activeSub = sub;
        subtitlesMenu.querySelectorAll('.cw-menu-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        subtitlesMenu.classList.add('hidden');
        showToast(`Subtitles: ${item.textContent}`);
      };
    });
  }

  // PiP (Picture in Picture)
  if (pipBtn) {
    pipBtn.onclick = async () => {
      if (!videoEl || videoEl.classList.contains('hidden')) return;
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoEl.requestPictureInPicture();
        }
      } catch (err) {}
    };
  }

  // Fullscreen
  if (fullscreenBtn) {
    fullscreenBtn.onclick = () => {
      const shell = document.getElementById('cwPlayerShell');
      if (!document.fullscreenElement) {
        shell?.requestFullscreen().catch(() => {});
        document.getElementById('fullscreenIcon')?.setAttribute('name', 'contract-outline');
      } else {
        document.exitFullscreen().catch(() => {});
        document.getElementById('fullscreenIcon')?.setAttribute('name', 'expand-outline');
      }
    };
  }

  // Auto-hide controls on mouse idle
  const playerShell = document.getElementById('cwPlayerShell');
  if (playerShell) {
    playerShell.onmousemove = resetPlayerIdleTimer;
    playerShell.onclick = (e) => {
      // Close popups on click outside
      if (!e.target.closest('.cw-dropdown-wrap')) {
        speedMenu?.classList.add('hidden');
        subtitlesMenu?.classList.add('hidden');
      }
      resetPlayerIdleTimer();
    };
  }
}

function resetPlayerIdleTimer() {
  const topbar = document.getElementById('playerTopBar');
  const controls = document.getElementById('playerControls');
  if (!topbar || !controls) return;

  topbar.classList.remove('autohide');
  controls.classList.remove('autohide');

  clearTimeout(_cwPlayerState.idleTimer);
  _cwPlayerState.idleTimer = setTimeout(() => {
    // Only hide if video is playing and user is not scrubbing
    const videoEl = document.getElementById('videoEl');
    if (videoEl && !videoEl.paused && !_cwPlayerState.isScrubbing) {
      topbar.classList.add('autohide');
      controls.classList.add('autohide');
    }
  }, 3500);
}

// Global Keyboard Hotkeys for Player
window.addEventListener('keydown', (e) => {
  const playerModal = document.getElementById('playerModal');
  if (!playerModal || playerModal.classList.contains('hidden')) return;

  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

  switch (e.key.toLowerCase()) {
    case ' ':
    case 'k':
      e.preventDefault();
      document.getElementById('playPause')?.click();
      break;
    case 'arrowleft':
    case 'j':
      e.preventDefault();
      document.getElementById('rewind10')?.click();
      break;
    case 'arrowright':
    case 'l':
      e.preventDefault();
      document.getElementById('forward10')?.click();
      break;
    case 'f':
      e.preventDefault();
      document.getElementById('fullscreenBtn')?.click();
      break;
    case 'm':
      e.preventDefault();
      document.getElementById('volumeBtn')?.click();
      break;
    case 'p':
      e.preventDefault();
      document.getElementById('pipBtn')?.click();
      break;
    case 'escape':
      closePlayer();
      break;
  }
});

function closePlayer() {
  const playerModal = document.getElementById('playerModal');
  const iframeEl = document.getElementById('iframeEl');
  const videoEl = document.getElementById('videoEl');
  const vidstackPlayer = document.getElementById('vidstackPlayer');

  if (vidstackPlayer) {
    vidstackPlayer.pause();
    vidstackPlayer.src = '';
    vidstackPlayer.classList.add('hidden');
  }
  if (_cwPlayerState.hlsInstance) {
    _cwPlayerState.hlsInstance.destroy();
    _cwPlayerState.hlsInstance = null;
  }
  if (videoEl) {
    videoEl.pause();
    videoEl.src = '';
  }
  if (iframeEl) {
    iframeEl.src = '';
    iframeEl.classList.add('hidden');
  }

  playerModal?.classList.add('hidden');
}

// App Initialization
function startApp() {
  loadFavorites();
  initCatalog();
  setupNavigation();

  document.getElementById('detailClose')?.addEventListener('click', closeDetail);
  document.getElementById('detailModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'detailModal') closeDetail();
  });

  document.getElementById('playerClose')?.addEventListener('click', closePlayer);
  document.getElementById('playerModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'playerModal') closePlayer();
  });

  // Window Controls (Minimize, Maximize/Restore, Close)
  const winMinBtn = document.getElementById('winMinBtn');
  const winMaxBtn = document.getElementById('winMaxBtn');
  const winCloseBtn = document.getElementById('winCloseBtn');

  if (winMinBtn) {
    winMinBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.electronAPI && typeof window.electronAPI.windowMinimize === 'function') {
        window.electronAPI.windowMinimize();
      }
    });
  }

  if (winMaxBtn) {
    winMaxBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.electronAPI && typeof window.electronAPI.windowMaximize === 'function') {
        window.electronAPI.windowMaximize();
      } else if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    });
  }

  if (winCloseBtn) {
    winCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.electronAPI && typeof window.electronAPI.windowClose === 'function') {
        window.electronAPI.windowClose();
      } else {
        window.close();
      }
    });
  }

  // Settings overlay handlers
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const settingsOverlay = document.getElementById('settingsOverlay');
  const mobileProfileBtn = document.getElementById('mobileProfileBtn');

  if (openSettingsBtn) {
    openSettingsBtn.addEventListener('click', () => {
      settingsOverlay?.classList.remove('hidden');
      document.activeElement?.blur();
    });
  }
  
  if (mobileProfileBtn) {
    mobileProfileBtn.addEventListener('click', async () => {
      // Show auth screen if not logged in, otherwise show settings
      let activeUser = null;
      if (window.CW_API) {
        activeUser = await window.CW_API.getCurrentUser();
      }
      
      // Mark profile tab as active
      document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.id === 'mobileProfileBtn');
      });

      if (activeUser) {
        settingsOverlay?.classList.remove('hidden');
      } else {
        showAuth();
      }
    });
  }

  if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', () => {
      settingsOverlay?.classList.add('hidden');
    });
  }

  // ── Auth overlay fade helpers ─────────────────────────────────────────
  const authOverlay = document.getElementById('authOverlay');

  function showAuth() {
    if (!authOverlay) return;
    authOverlay.style.display = 'flex';       // 1. make visible in layout
    authOverlay.style.opacity = '0';          // 2. start transparent
    authOverlay.classList.remove('hidden');
    // 3. next frame: fade in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        authOverlay.style.opacity = '1';
      });
    });
  }

  function hideAuth() {
    if (!authOverlay) return;
    authOverlay.style.opacity = '0';          // 1. fade out
    // 2. after transition ends: remove from layout
    const onEnd = () => {
      authOverlay.classList.add('hidden');
      authOverlay.style.display = '';
      authOverlay.style.opacity = '';
      authOverlay.removeEventListener('transitionend', onEnd);
    };
    authOverlay.addEventListener('transitionend', onEnd);
  }
  // ────────────────────────────────────────────────────────────────────────

  document.getElementById('openAuthBtn')?.addEventListener('click', () => {
    showAuth();
    document.activeElement?.blur();
  });

  document.getElementById('closeAuthBtn')?.addEventListener('click', () => {
    hideAuth();
    // Force-deactivate profile btn (it has no data-tab so switchTab can't catch it)
    document.getElementById('mobileProfileBtn')?.classList.remove('active');
    switchTab('home');
  });

  document.getElementById('desktopCloseAuthBtn')?.addEventListener('click', () => {
    hideAuth();
  });

  // Tab switching — staggered CSS transitions
  let _authCurrentTab = 'signin';

  function switchAuthTab(tab) {
    if (tab === _authCurrentTab) return;

    // Update mobile pill tabs
    document.querySelectorAll('.auth-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === tab)
    );

    // Right panel forms — stagger: fade out → wait → fade in
    const outFormId = _authCurrentTab === 'signin' ? 'formSignIn' : 'formSignUp';
    const inFormId  = tab === 'signin' ? 'formSignIn' : 'formSignUp';
    document.getElementById(outFormId)?.classList.remove('active');
    // Wait for out-fade to progress before bringing in the new one
    setTimeout(() => document.getElementById(inFormId)?.classList.add('active'), 180);

    // Left panel content — same stagger
    const outLeftId = _authCurrentTab === 'signin' ? 'leftContentSignIn' : 'leftContentSignUp';
    const inLeftId  = tab === 'signin' ? 'leftContentSignIn' : 'leftContentSignUp';
    document.getElementById(outLeftId)?.classList.remove('active');
    setTimeout(() => document.getElementById(inLeftId)?.classList.add('active'), 180);

    _authCurrentTab = tab;
  }

  document.getElementById('tabSignIn')?.addEventListener('click', () => switchAuthTab('signin'));
  document.getElementById('tabSignUp')?.addEventListener('click', () => switchAuthTab('signup'));
  document.getElementById('switchToSignUp')?.addEventListener('click', (e) => { e.preventDefault(); switchAuthTab('signup'); });
  document.getElementById('switchToSignIn')?.addEventListener('click', (e) => { e.preventDefault(); switchAuthTab('signin'); });

    // Password toggle
  document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', () => {
      const input = icon.previousElementSibling;
      if (input.type === 'password') {
        input.type = 'text';
        icon.name = 'eye-off-outline';
      } else {
        input.type = 'password';
        icon.name = 'eye-outline';
      }
    });
  });

  // Desktop left-panel toggle buttons
  document.getElementById('panelSwitchToSignUp')?.addEventListener('click', () => switchAuthTab('signup'));
  document.getElementById('panelSwitchToSignIn')?.addEventListener('click', () => switchAuthTab('signin'));

  // Supabase Auth System
  async function updateProfileUI() {
    let activeUser = null;
    if (window.CW_API) {
      activeUser = await window.CW_API.getCurrentUser();
    }
    const profileName = document.querySelector('.profile-name h2');
    if (activeUser && profileName) {
      profileName.textContent = activeUser.user_metadata?.name || activeUser.email.split('@')[0];
      
      const savedAvatar = localStorage.getItem('cw_avatar');
      const savedBanner = localStorage.getItem('cw_banner');
      if (savedAvatar) {
        const avatar = document.getElementById('profileAvatar');
        if (avatar) {
          avatar.style.backgroundImage = `url(${savedAvatar})`;
          avatar.style.backgroundSize = 'cover';
          avatar.style.backgroundPosition = 'center';
          const icon = avatar.querySelector('ion-icon');
          if (icon) icon.style.display = 'none';
        }
        updateMobileNavAvatar(savedAvatar);
      }
      if (savedBanner) {
        const banner = document.getElementById('profileBanner');
        if (banner) banner.style.backgroundImage = `url(${savedBanner})`;
      }
    } else {
      if (profileName) profileName.textContent = 'Guest';
      
      const avatar = document.getElementById('profileAvatar');
      if (avatar) {
        avatar.style.backgroundImage = 'none';
        const icon = avatar.querySelector('ion-icon');
        if (icon) icon.style.display = 'block';
      }
      updateMobileNavAvatar(null);
      
      const banner = document.getElementById('profileBanner');
      if (banner) {
        banner.style.backgroundImage = `url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop')`;
      }
    }
  }
  
  // Call on load
  setTimeout(updateProfileUI, 1000); // give API time to load

  // Listen for auth changes from API
  window.addEventListener('cw:authChanged', (e) => {
    updateProfileUI();
  });

  // Log Out Action
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    if (window.CW_API) {
      await window.CW_API.signOut();
    }
    showToast('Logged out successfully');
    updateProfileUI();
    
    // Redirect to home/sign in if needed, or open auth overlay
    document.getElementById('settingsOverlay')?.classList.add('hidden');
    showAuth();
  });

  // Form submissions
  document.getElementById('formSignIn')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signinEmail')?.value.trim();
    const pass = document.getElementById('signinPass')?.value;
    
    if (!email || !pass) return showToast('Please enter both email and password');
    
    if (window.CW_API) {
      const { user, error } = await window.CW_API.signIn(email, pass);
      if (user) {
        showToast(`Welcome back!`);
        updateProfileUI();
        hideAuth();
        e.target.reset();
      } else {
        showToast(error || 'Invalid email or password');
      }
    } else {
      showToast('Backend API not loaded.');
    }
  });

  document.getElementById('formSignUp')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName')?.value.trim();
    const email = document.getElementById('signupEmail')?.value.trim();
    const pass = document.getElementById('signupPass')?.value;
    
    if (!name || !email || !pass) return showToast('Please fill all fields');
    if (pass.length < 6) return showToast('Password must be at least 6 characters');
    
    if (window.CW_API) {
      const { user, error } = await window.CW_API.signUp(name, email, pass);
      if (user) {
        showToast(`Account created! Welcome, ${name}.`);
        updateProfileUI();
        hideAuth();
        e.target.reset();
      } else {
        showToast(error || 'Failed to create account');
      }
    } else {
      showToast('Backend API not loaded.');
    }
  });

  // â”€â”€ Restore saved profile data on load â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const savedTheme  = localStorage.getItem('cw_theme') || 'dark';

  function updateMobileNavAvatar(dataUrl) {
    const mobileIcon = document.getElementById('mobileProfileIcon');
    const mobileImg = document.getElementById('mobileProfileImg');
    if (mobileIcon && mobileImg) {
      if (dataUrl) {
        mobileImg.src = dataUrl;
        mobileImg.style.display = 'block';
        mobileIcon.style.display = 'none';
      } else {
        mobileImg.style.display = 'none';
        mobileIcon.style.display = 'block';
      }
    }
  }

  // Apply saved theme
  function applyTheme(mode) {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    if (mode === 'light') {
      document.documentElement.classList.add('light-mode');
    } else if (mode === 'dark') {
      document.documentElement.classList.remove('light-mode');
    } else {
      prefersLight ? document.documentElement.classList.add('light-mode')
                   : document.documentElement.classList.remove('light-mode');
    }
    // Update active pill
    document.querySelectorAll('.theme-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.theme === mode);
    });
  }
  applyTheme(savedTheme);

  // Theme pills
  document.querySelectorAll('.theme-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const mode = pill.dataset.theme;
      localStorage.setItem('cw_theme', mode);
      applyTheme(mode);
      const labels = { system: 'Using System Default', dark: 'Switched to Dark Mode', light: 'Switched to Light Mode' };
      showToast(labels[mode]);
    });
  });

  // Listen for system theme changes when mode = system
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if ((localStorage.getItem('cw_theme') || 'dark') === 'system') {
      e.matches ? document.documentElement.classList.add('light-mode')
                : document.documentElement.classList.remove('light-mode');
    }
  });

  // â”€â”€ Avatar file picker â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const avatarInput = document.getElementById('avatarFileInput');
  if (avatarInput) {
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        localStorage.setItem('cw_avatar', dataUrl);
        const avatar = document.getElementById('profileAvatar');
        if (avatar) {
          avatar.style.backgroundImage = `url(${dataUrl})`;
          avatar.style.backgroundSize = 'cover';
          avatar.style.backgroundPosition = 'center';
          const icon = avatar.querySelector('ion-icon');
          if (icon) icon.style.display = 'none';
        }
        updateMobileNavAvatar(dataUrl);
        showToast('Profile picture saved!');
      };
      reader.readAsDataURL(file);
    });
  }

  // â”€â”€ Banner file picker â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const bannerInput = document.getElementById('bannerFileInput');
  if (bannerInput) {
    bannerInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        localStorage.setItem('cw_banner', dataUrl);
        const banner = document.getElementById('profileBanner');
        if (banner) banner.style.backgroundImage = `url(${dataUrl})`;
        showToast('Cover photo saved!');
      };
      reader.readAsDataURL(file);
    });
  }

  // Save button â€” show success animation, stay on settings page
  document.getElementById('saveSettingsBtn')?.addEventListener('click', () => {
    const btn = document.getElementById('saveSettingsBtn');
    if (!btn || btn.classList.contains('saving')) return;

    btn.classList.add('saving');
    btn.innerHTML = '<ion-icon name="checkmark-circle"></ion-icon> Saved!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    btn.style.boxShadow = '0 4px 20px rgba(34, 197, 94, 0.45)';

    setTimeout(() => {
      btn.classList.remove('saving');
      btn.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon> Save Changes';
      btn.style.background = '';
      btn.style.boxShadow = '';
    }, 2500);
  });

  // Settings page buttons
  const updateBtn = document.getElementById('pageCheckUpdateBtn');
  if (updateBtn) {
    updateBtn.addEventListener('click', () => {
      showToast('You are on the latest version â€” CineWatch v1.0.0');
    });
  }

  // Watch Together features
  const partyMainScreen = document.getElementById('partyMainScreen');
  const partyCreateScreen = document.getElementById('partyCreateScreen');
  const partyActiveScreen = document.getElementById('partyActiveScreen');
  
  const roomCodeGroup = document.getElementById('roomCodeGroup');
  const roomCodeInput = document.getElementById('roomCodeInput');
  const activeRoomName = document.getElementById('activeRoomName');
  const activeRoomCode = document.getElementById('activeRoomCode');
  const activeRoomCodeRow = document.getElementById('activeRoomCodeRow');

  function generateRoomCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  // Formatting for room code input (uppercase, max 8 chars)
  if (roomCodeInput) {
    roomCodeInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 8);
    });
  }

  document.querySelector('.create-room-btn')?.addEventListener('click', () => {
    partyMainScreen?.classList.add('hidden');
    partyCreateScreen?.classList.remove('hidden');
  });

  document.getElementById('cancelCreateRoomBtn')?.addEventListener('click', () => {
    partyCreateScreen?.classList.add('hidden');
    partyMainScreen?.classList.remove('hidden');
  });

  // Privacy Pills
  document.querySelectorAll('#roomPrivacyPills .theme-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#roomPrivacyPills .theme-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      if (pill.dataset.privacy === 'private') {
        roomCodeGroup?.classList.remove('hidden');
        if (roomCodeInput && !roomCodeInput.value) roomCodeInput.value = generateRoomCode();
      } else {
        roomCodeGroup?.classList.add('hidden');
      }
    });
  });

  // Create Room Confirm Action
  document.querySelector('.create-room-confirm-btn')?.addEventListener('click', () => {
    const roomName = document.getElementById('roomNameInput')?.value.trim() || 'My Room';
    const isPrivate = document.querySelector('#roomPrivacyPills .theme-pill.active')?.dataset.privacy === 'private';
    
    let finalCode = '';
    if (isPrivate) {
      finalCode = roomCodeInput?.value.trim() || generateRoomCode();
      if (finalCode.length < 4) {
        showToast('Room code must be at least 4 characters');
        return;
      }
    }
    
    // Set active room details
    if (activeRoomName) activeRoomName.textContent = roomName;
    if (activeRoomCodeRow) {
      if (isPrivate) {
        activeRoomCodeRow.style.display = 'flex';
        if (activeRoomCode) activeRoomCode.textContent = finalCode;
      } else {
        activeRoomCodeRow.style.display = 'none';
      }
    }
    
    showToast(`Created ${isPrivate ? 'private' : 'public'} room: ${roomName}`);
    
    // Transition to Active Room
    partyCreateScreen?.classList.add('hidden');
    partyActiveScreen?.classList.remove('hidden');
  });

  // Leave Room Action
  document.getElementById('leaveRoomBtn')?.addEventListener('click', () => {
    partyActiveScreen?.classList.add('hidden');
    partyMainScreen?.classList.remove('hidden');
    showToast('Left the room');
  });

  // Back Button Action
  document.getElementById('goBackFromActiveRoom')?.addEventListener('click', () => {
    partyActiveScreen?.classList.add('hidden');
    partyMainScreen?.classList.remove('hidden');
  });

  // Join Room Action (from main screen)
  document.querySelector('.join-room-btn')?.addEventListener('click', () => {
    const input = document.querySelector('.party-join-box input');
    if (input && input.value.trim() !== '') {
      const code = input.value.toUpperCase();
      showToast('Joined room ' + code);
      input.value = '';
      
      // Set active room details
      if (activeRoomName) activeRoomName.textContent = 'Joined Room';
      if (activeRoomCodeRow) activeRoomCodeRow.style.display = 'flex';
      if (activeRoomCode) activeRoomCode.textContent = code;
      
      // Transition to Active Room
      partyMainScreen?.classList.add('hidden');
      partyActiveScreen?.classList.remove('hidden');
    } else {
      showToast('Please enter a room code');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}

// Custom Window Controls (Added at the end)
if (window.electronAPI) {
  document.getElementById('winMinBtn')?.addEventListener('click', () => window.electronAPI.windowMinimize());
  document.getElementById('winMaxBtn')?.addEventListener('click', () => window.electronAPI.windowMaximize());
  document.getElementById('winCloseBtn')?.addEventListener('click', () => window.electronAPI.windowClose());
}

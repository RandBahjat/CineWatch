(function() {
  'use strict';

/**
 * CineWatch Standalone App Engine
 * High-Performance, Instant-Loading Streaming Platform Logic
 */

var APP_FEATURED = (typeof window.FEATURED_TITLES !== 'undefined' && window.FEATURED_TITLES.length > 0)
  ? window.FEATURED_TITLES
  : [
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

var APP_TOP_10 = (typeof window.TOP_10_TRENDING_TODAY !== 'undefined' && window.TOP_10_TRENDING_TODAY.length > 0)
  ? window.TOP_10_TRENDING_TODAY
  : [
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

var MOVIES = window.MOVIES && window.MOVIES.length ? window.MOVIES : [];
// FIX 4: N+1 → O(1) Map lookup instead of repeated .find() scans
var _movieMap = new Map();

// FIX 3: Pagination constants & offsets per view
var PAGE_SIZE = 40;
var _pageOffset = { explore: 0, movies: 0, series: 0, anime: 0 };
var _filteredCache = { explore: [] };

var state = {
  currentTab: 'home',
  favorites: new Set(),
  activeType: 'all',
  activeGenre: 'all',
  heroIndex: 0,
  heroTimer: null,
  currentDetail: null
};

// Global Toast Notification (Top-Right Sleek Glassmorphism)
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const isAuth = msg.toLowerCase().includes('log in') || msg.toLowerCase().includes('account');
  const isHeart = msg.includes('❤️') || msg.toLowerCase().includes('watchlist') || msg.toLowerCase().includes('saved');
  
  let iconName = 'notifications-outline';
  let titleText = 'CineWatch';
  if (isAuth) {
    iconName = 'lock-closed';
    titleText = 'Account Required';
  } else if (isHeart) {
    iconName = 'heart';
    titleText = 'My Watchlist';
  }

  toast.innerHTML = `
    <div class="toast-icon-wrap ${isAuth ? 'toast-auth' : ''}">
      <ion-icon name="${iconName}"></ion-icon>
    </div>
    <div class="toast-body">
      <div class="toast-heading">${titleText}</div>
      <div class="toast-text">${msg}</div>
    </div>
  `;

  toast.className = 'toast show';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// Auth Helper
function getActiveUser() {
  if (window.state && window.state.user) return window.state.user;
  try {
    const raw = localStorage.getItem('cw_user') || localStorage.getItem('cinewatch_user') || sessionStorage.getItem('cw_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.id || parsed.email || parsed.username || parsed.name)) return parsed;
    }
  } catch (e) {}
  return null;
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
  const user = getActiveUser();
  if (!user) {
    showToast('Please log into your account to add to Watchlist!');
    if (typeof openAuthOverlay === 'function') {
      openAuthOverlay('signin');
    }
    return false;
  }

  const strId = String(id);
  const wasFav = state.favorites.has(strId);

  // FIX 2: OPTIMISTIC RENDERING — update UI instantly, sync cloud in background
  if (wasFav) {
    state.favorites.delete(strId);
    showToast('Removed from Watchlist');
  } else {
    state.favorites.add(strId);
    showToast('Added to Watchlist ❤️');
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

    // FIX 4: Build O(1) Map â€” includes MOVIES, SERIES, and ANIME
    _movieMap.clear();
    if (typeof MOVIES !== 'undefined' && Array.isArray(MOVIES)) {
      MOVIES.forEach(m => _movieMap.set(String(m.id), m));
    }
    if (typeof SERIES !== 'undefined' && Array.isArray(SERIES)) {
      SERIES.forEach(s => _movieMap.set(String(s.id), s));
    }
    if (typeof ANIME !== 'undefined' && Array.isArray(ANIME)) {
      ANIME.forEach(a => _movieMap.set(String(a.id), a));
    }

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

  const featuredList = (typeof window.FEATURED_TITLES !== 'undefined' && window.FEATURED_TITLES.length > 0)
    ? window.FEATURED_TITLES
    : APP_FEATURED;
  let heroFeatured = featuredList
    .map(title => MOVIES.find(m => m.title === title))
    .filter(Boolean)
    .slice(0, 8);
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

  const top10List = (typeof window.TOP_10_TRENDING_TODAY !== 'undefined' && window.TOP_10_TRENDING_TODAY.length > 0)
    ? window.TOP_10_TRENDING_TODAY
    : APP_TOP_10;
  const top10 = top10List.map(title => MOVIES.find(m => m.title === title)).filter(Boolean);

  let trendingMovies;
  if (window.TRENDING_THIS_WEEK_MOVIES && window.TRENDING_THIS_WEEK_MOVIES.length > 0) {
    trendingMovies = window.TRENDING_THIS_WEEK_MOVIES
      .map(title => MOVIES.find(m => m.title === title && (!m.type || m.type === 'Movie')))
      .filter(Boolean);
  } else {
    trendingMovies = MOVIES.filter(m => (!m.type || m.type === 'Movie') && !m.isAnime).slice(0, 15);
  }

  let trendingSeries;
  if (window.TRENDING_THIS_WEEK_SERIES && window.TRENDING_THIS_WEEK_SERIES.length > 0) {
    trendingSeries = window.TRENDING_THIS_WEEK_SERIES
      .map(title => MOVIES.find(m => m.title === title && (m.type === 'TV Show' || m.type === 'Series')))
      .filter(Boolean);
  } else {
    trendingSeries = MOVIES.filter(m => (m.type === 'TV Show' || m.type === 'Series') && !m.isAnime).slice(0, 15);
  }

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

function isAnimeItem(m) {
  return Boolean(m.isAnime || m.type === 'Anime' || (Array.isArray(m.genres) && m.genres.includes('Anime')));
}

function isSeriesItem(m) {
  if (isAnimeItem(m)) return false;
  return Boolean(m.type === 'TV Show' || m.type === 'Series' || (Array.isArray(m.seasons) && m.seasons.length > 0));
}

function isMovieItem(m) {
  if (isAnimeItem(m)) return false;
  if (isSeriesItem(m)) return false;
  return Boolean(!m.type || m.type === 'Movie');
}

function filterResults() {
  const q = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';
  const grid = document.getElementById('resultsGrid');
  const empty = document.getElementById('exploreEmpty');
  const countEl = document.getElementById('exploreCount');

  // FIX: Accurate, clean classification of Movies, Series, and Anime
  let filtered = MOVIES.filter(m => {
    if (state.activeType !== 'all') {
      if (state.activeType === 'Anime' && !isAnimeItem(m)) return false;
      if (state.activeType === 'Movie' && !isMovieItem(m)) return false;
      if (state.activeType === 'TV Show' && !isSeriesItem(m)) return false;
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

  // FIX 3: Paginated — only render PAGE_SIZE items, add Load More if needed
  _filteredCache.explore = filtered;
  _pageOffset.explore = 0;

  if (!grid) return;
  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty?.classList.remove('hidden');
    return;
  }
  empty?.classList.add('hidden');

  // FIX 5: async render — no main-thread blocking
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

// 3. Movies Tab — FIX 3+5: Async paginated render
function renderMoviesTab() {
  const grid = document.getElementById('moviesGrid');
  const countEl = document.getElementById('moviesCount');
  const movies = MOVIES.filter(isMovieItem);
  if (countEl) countEl.textContent = `${movies.length} Movies`;
  _pageOffset.movies = 0;
  renderCardsAsync(movies, grid, 0, false);
  _renderLoadMoreBtn('moviesGrid', 'movies', movies);
  // Cache for load-more
  _filteredCache.movies = movies;
}

// 4. Series Tab — FIX 3+5: Async paginated render
function renderSeriesTab() {
  const grid = document.getElementById('seriesGrid');
  const countEl = document.getElementById('seriesCount');
  const series = MOVIES.filter(isSeriesItem);
  if (countEl) countEl.textContent = `${series.length} Series`;
  _pageOffset.series = 0;
  renderCardsAsync(series, grid, 0, false);
  _renderLoadMoreBtn('seriesGrid', 'series', series);
  _filteredCache.series = series;
}

// 5. Anime Tab — FIX 3+5: Async paginated render
function renderAnimeTab() {
  const grid = document.getElementById('animeGrid');
  const countEl = document.getElementById('animeCount');
  const anime = MOVIES.filter(isAnimeItem);
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
// Detail Modal — Immersive Full-Screen View with 10s Auto-playing Trailer
let _trailerTimer = null;
let _trailerMuted = true;

function openDetail(movieId) {
  let movie = _movieMap.get(String(movieId));
  if (!movie && typeof movieId === 'object' && movieId) movie = movieId;
  if (!movie && movieId) {
    movie = (typeof MOVIES !== 'undefined' ? MOVIES.find(m => String(m.id) === String(movieId) || m.title === movieId) : null)
      || (typeof SERIES !== 'undefined' ? SERIES.find(s => String(s.id) === String(movieId) || s.title === movieId) : null)
      || (typeof ANIME !== 'undefined' ? ANIME.find(a => String(a.id) === String(movieId) || a.title === movieId) : null);
  }
  if (!movie) return;

  // Cancel any previous trailer timer and remove existing trailer iframe
  clearTimeout(_trailerTimer);
  const existingTrailer = document.querySelector('.trailer-iframe');
  if (existingTrailer) existingTrailer.remove();

  state.currentDetail = movie;
  const modal = document.getElementById('detailModal');
  const hero  = document.getElementById('detailHero');
  const body  = document.getElementById('detailBody');

  const isFav        = state.favorites.has(String(movie.id));
  const genreText    = Array.isArray(movie.genres) ? movie.genres.join(', ') : (movie.genres || 'Action, Drama');
  let castText       = movie.cast ? (Array.isArray(movie.cast) ? movie.cast.join(', ') : movie.cast) : 'Cast details available soon';
  const directorText = movie.director || '';
  const overview     = movie.description || movie.overview || 'A cinematic masterpiece streaming now on CineWatch in full high-definition quality with crystal clear audio.';

  /* ── Hero: Full-screen background ── */
  if (hero) {
    hero.style.backgroundImage = 'none';
    hero.innerHTML = `
      <div class="detail-hero-backdrop" id="detailHeroBackdrop" style="background-image: url('${movie.backdrop || movie.poster || ''}');"></div>
      <div class="trailer-iframe-wrap hidden" id="trailerIframeWrap"></div>
      <div class="immersive-gradient"></div>
      <button class="trailer-sound-btn hidden" id="trailerSoundBtn" title="Toggle sound">
        <ion-icon name="volume-mute"></ion-icon>
      </button>
    `;

    /* Auto-play trailer after 800ms of staying in detail */
    _trailerTimer = setTimeout(() => {
      _startTrailer(hero, movie);
    }, 800);
  }

  /* ── Body: Top Nav + Bottom Content ── */
  if (body) {
    const imdbRating = movie.rating || '8.5';
    
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

          const isAnime = !!(movie.isAnime || movie.type === 'Anime');
          const curPref = localStorage.getItem('cw_anime_audio_pref') || 'sub';

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
            <span class="meta-badge-pill age">${movie.age || 'PG-13'}</span>
          </div>

          <div class="immersive-cast">${castText.toUpperCase()}</div>
          <p class="immersive-overview">${overview}</p>

          <div class="immersive-btn-row">
            <button class="btn-watch-now" id="detailWatchNowBtn">
              <ion-icon name="play"></ion-icon>
              <span>Watch Now</span>
            </button>
            <button class="btn-more-info ${isFav ? 'active-fav' : ''}" id="detailWatchlistBtn">
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

    // Wire Watch Now Button safely
    const watchBtn = body.querySelector('#detailWatchNowBtn');
    if (watchBtn) {
      watchBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        playMovieDirect(movie.id);
      };
    }

    // Wire Watchlist Button safely with user login check
    const favBtn = body.querySelector('#detailWatchlistBtn');
    if (favBtn) {
      favBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const user = getActiveUser();
        if (!user) {
          showToast('Please log into your account to add to Watchlist!');
          if (typeof openAuthOverlay === 'function') openAuthOverlay('signin');
          return;
        }
        toggleFavorite(movie.id, e);
        const isNowFav = state.favorites.has(String(movie.id));
        favBtn.classList.toggle('active-fav', isNowFav);
        const icon = favBtn.querySelector('ion-icon');
        if (icon) icon.setAttribute('name', isNowFav ? 'checkmark-circle' : 'add-circle-outline');
        const span = favBtn.querySelector('span');
        if (span) span.textContent = isNowFav ? 'In Watchlist' : 'Add to Watchlist';
      };
    }
  }

  const sheet = document.getElementById('detailSheet');
  if (sheet) sheet.scrollTop = 0;
  modal?.classList.remove('hidden');
}

function extractYouTubeId(urlOrId) {
  if (!urlOrId) return null;
  const str = String(urlOrId).trim();
  if (!str) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
  const match = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  return match && match[1] ? match[1] : null;
}

function _startTrailer(heroEl, movie) {
  if (!heroEl || !document.getElementById('detailModal') || document.getElementById('detailModal').classList.contains('hidden')) return;

  _trailerMuted = true;

  let wrap = heroEl.querySelector('#trailerIframeWrap') || heroEl.querySelector('.trailer-iframe-wrap');
  const backdrop = heroEl.querySelector('#detailHeroBackdrop') || heroEl.querySelector('.detail-hero-backdrop');

  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'trailer-iframe-wrap hidden';
    wrap.id = 'trailerIframeWrap';
    const gradient = heroEl.querySelector('.immersive-gradient');
    if (gradient) heroEl.insertBefore(wrap, gradient);
    else heroEl.appendChild(wrap);
  } else {
    wrap.innerHTML = '';
  }

  // Build muted autoplay iframe
  const iframe = document.createElement('iframe');
  iframe.className = 'trailer-iframe';

  const customYtId = extractYouTubeId(movie.trailerUrl || movie.trailer || movie.trailerYouTubeId);
  const hostOrigin = (window.location.protocol === 'http:' || window.location.protocol === 'https:') 
    ? window.location.origin 
    : '';

  const originParam = hostOrigin ? `&origin=${encodeURIComponent(hostOrigin)}` : '';
  const cleanParams = `autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&iv_load_policy=3&cc_load_policy=0&cc_lang_pref=off&hl=en&enablejsapi=1&playsinline=1&fs=0&disablekb=1&autohide=1${originParam}`;

  let trailerSrc = '';
  if (customYtId) {
    trailerSrc = `https://www.youtube.com/embed/${customYtId}?${cleanParams}&playlist=${customYtId}`;
  } else {
    const query = encodeURIComponent(`${movie.title} ${movie.year || ''} official trailer`);
    trailerSrc = `https://www.youtube.com/embed?listType=search&list=${query}&${cleanParams}`;
  }

  iframe.src = trailerSrc;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = false;
  iframe.setAttribute('playsinline', '1');
  iframe.setAttribute('webkit-playsinline', '1');

  function disableSubtitles() {
    try {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: 'unloadModule',
          args: ['captions']
        }), '*');
        iframe.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: 'setOption',
          args: ['captions', 'track', {}]
        }), '*');
        iframe.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: 'setOption',
          args: ['cc', 'track', {}]
        }), '*');
      }
    } catch(e) {}
  }

  iframe.onload = () => {
    disableSubtitles();
    setTimeout(disableSubtitles, 500);
    setTimeout(disableSubtitles, 1200);
    setTimeout(disableSubtitles, 2500);
    wrap.classList.add('active');
    if (backdrop) backdrop.classList.add('hidden-bg');
  };

  wrap.appendChild(iframe);
  wrap.classList.remove('hidden');

  requestAnimationFrame(() => {
    setTimeout(() => {
      wrap.classList.add('active');
    }, 150);
  });

  // Wire up the sound toggle button
  const soundBtn = document.getElementById('trailerSoundBtn');
  if (soundBtn) {
    soundBtn.classList.remove('hidden');
    soundBtn.innerHTML = '<ion-icon name="volume-mute"></ion-icon>';
    soundBtn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      _trailerMuted = !_trailerMuted;
      
      // Control audio via YouTube postMessage API (seamless, no reload)
      try {
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: _trailerMuted ? 'mute' : 'unMute',
            args: []
          }), '*');
          if (!_trailerMuted) {
            iframe.contentWindow.postMessage(JSON.stringify({
              event: 'command',
              func: 'setVolume',
              args: [100]
            }), '*');
          }
        }
      } catch (err) {}

      soundBtn.innerHTML = `<ion-icon name="${_trailerMuted ? 'volume-mute' : 'volume-high'}"></ion-icon>`;
    };
  }
}

function closeDetail() {
  clearTimeout(_trailerTimer);
  const modal = document.getElementById('detailModal');
  if (modal) modal.classList.add('hidden');
  const wrap = document.getElementById('trailerIframeWrap') || document.querySelector('.trailer-iframe-wrap');
  if (wrap) {
    wrap.innerHTML = '';
    wrap.classList.remove('active');
    wrap.classList.add('hidden');
  }
  const backdrop = document.getElementById('detailHeroBackdrop') || document.querySelector('.detail-hero-backdrop');
  if (backdrop) {
    backdrop.classList.remove('hidden-bg');
  }
  const iframe = document.querySelector('.trailer-iframe');
  if (iframe) iframe.remove();
  const soundBtn = document.getElementById('trailerSoundBtn');
  if (soundBtn) {
    soundBtn.classList.add('hidden');
    soundBtn.innerHTML = '<ion-icon name="volume-mute"></ion-icon>';
  }
  _trailerMuted = true;
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

const ANIME_MAL_MAP = {
  '37854': 21,       // One Piece
  '12971': 813,      // Dragon Ball Z
  '236994': 56880,   // Dragon Ball DAIMA
  '62715': 30694,    // Dragon Ball Super
  '12697': 225,      // Dragon Ball GT
  '61709': 6033,     // Dragon Ball Z Kai
  '46260': 20,       // Naruto
  '31910': 1735,     // Naruto Shippuden
  '70881': 34566,    // Boruto: Naruto Next Generations
  '30984': 269,      // Bleach
  '65930': 31964,    // My Hero Academia
  '1429': 16498,     // Attack on Titan
  '85937': 38000,    // Demon Slayer
  '63926': 30276,    // One Punch Man
  '127532': 52299,   // Solo Leveling
  '95479': 40748,    // JUJUTSU KAISEN
  '114410': 44511,   // Chainsaw Man
  '13916': 1535,     // Death Note
  '46298': 11061,    // Hunter x Hunter
  '88803': 37521,    // Vinland Saga
  '131041': 49596,   // BLUE LOCK
  '60863': 20583,    // Haikyu!!
  '61374': 22319,    // Tokyo Ghoul
  '902': 481,        // Yu-Gi-Oh! Duel Monsters
};

function getAnimeMalId(refMovie, dataId) {
  if (refMovie?.malId) return refMovie.malId;
  const key = String(dataId || refMovie?.videoUrl || refMovie?.id || '');
  if (ANIME_MAL_MAP[key]) return ANIME_MAL_MAP[key];
  if (refMovie?.title) {
    const t = refMovie.title.toLowerCase();
    if (t.includes('one piece')) return 21;
    if (t.includes('bleach')) return 269;
    if (t.includes('shippuden')) return 1735;
    if (t.includes('naruto')) return 20;
    if (t.includes('death note')) return 1535;
    if (t.includes('hunter')) return 11061;
    if (t.includes('attack on titan')) return 16498;
    if (t.includes('demon slayer')) return 38000;
    if (t.includes('black clover')) return 34572;
  }
  return refMovie?.anilistId || 21;
}

async function initArtPlayerForAnimeApp(movie, sNum, epNum, audioPref) {
  const playerModal = document.getElementById('playerModal');
  const artContainer = document.getElementById('artplayerApp');
  const wmLogo = document.getElementById("playerWatermarkLogo");
  if (wmLogo) wmLogo.style.display = "none";
  const vidstackPlayer = document.getElementById('vidstackPlayer');
  const iframeEl = document.getElementById('iframeEl');
  const videoEl = document.getElementById('videoEl');
  const playerControls = document.getElementById('playerControls');
  const centerPlayBadge = document.getElementById('centerPlayBadge');
  const seekLeftZone = document.getElementById('seekLeftZone');
  const seekRightZone = document.getElementById('seekRightZone');
  const playerTitle = document.getElementById('playerTitle');
  const playerLoading = document.getElementById('playerLoading');

  const isAnime = !!(movie.isAnime || movie.type === 'Anime');
  const isTv = !!(movie.type === 'TV Show' || movie.type === 'Series' || (movie.seasons && movie.seasons.length));

  if (playerTitle) {
    if (isAnime) playerTitle.textContent = `${movie.title} - S${sNum} E${epNum}`;
    else if (isTv) playerTitle.textContent = `${movie.title} - S${sNum} E${epNum}`;
    else playerTitle.textContent = movie.title;
  }
  if (playerLoading) playerLoading.classList.add('hidden');
  if (playerControls) playerControls.classList.add('hidden');
  if (centerPlayBadge) centerPlayBadge.classList.add('hidden');
  if (seekLeftZone) seekLeftZone.classList.add('hidden');
  if (seekRightZone) seekRightZone.classList.add('hidden');

  const serverSelectWrap = document.getElementById('serverSelectWrap');
  if (serverSelectWrap) {
    serverSelectWrap.classList.add('hidden');
    serverSelectWrap.style.display = 'none';
  }

  if (vidstackPlayer) {
    vidstackPlayer.pause();
    vidstackPlayer.src = '';
    vidstackPlayer.classList.add('hidden');
  }
  if (videoEl) {
    videoEl.pause();
    videoEl.src = '';
    videoEl.classList.add('hidden');
  }
  if (iframeEl) {
    iframeEl.src = '';
    iframeEl.classList.add('hidden');
  }

  if (window.artPlayerInstance) {
    try { window.artPlayerInstance.destroy(); } catch (e) {}
    window.artPlayerInstance = null;
  }

  const malId = isAnime ? getAnimeMalId(movie, movie.videoUrl || movie.id) : null;
  const poster = movie.backdrop || movie.poster || '';
  let cleanUrl = '';
  let subtitleUrl = '';

  const rawVideoStr = String(movie.videoUrl || '');
  if (rawVideoStr.startsWith('http') && (rawVideoStr.includes('.mp4') || rawVideoStr.includes('.m3u8') || rawVideoStr.includes('.webm'))) {
    cleanUrl = rawVideoStr;
  }

  const curPref = audioPref || localStorage.getItem('cw_anime_audio_pref') || 'sub';
  const curOrigin = (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('null') && !window.location.origin.startsWith('file')) ? window.location.origin : 'http://localhost:3000';
  const curHost = (typeof window !== 'undefined' && window.location.hostname && !window.location.hostname.includes('null')) ? window.location.hostname : 'localhost';

  let subParam = '';
  const cleanName = movie.title || '';
  if (cleanName) {
    let subApi = `${curOrigin}/api/movie-sub?title=${encodeURIComponent(cleanName)}&type=${isTv ? 'series' : 'movie'}`;
    if (isTv) subApi += `&season=${sNum}&ep=${epNum}`;
    subParam = `&subtitles=${encodeURIComponent(subApi)}&subtitleLabel=Kurdish`;
    if (!isAnime) {
      subtitleUrl = subApi;
    }
  }

  if (isAnime && !cleanUrl && malId) {
    const endpoints = [
      `${curOrigin}/api/anime-source?malId=${malId}&ep=${epNum}&mode=${curPref}`,
      `https://cinewatch-maaa.onrender.com/api/anime-source?malId=${malId}&ep=${epNum}&mode=${curPref}`,
      `http://${curHost}:3000/api/anime-source?malId=${malId}&ep=${epNum}&mode=${curPref}`,
      `http://localhost:3000/api/anime-source?malId=${malId}&ep=${epNum}&mode=${curPref}`,
      `http://127.0.0.1:3000/api/anime-source?malId=${malId}&ep=${epNum}&mode=${curPref}`,
      `http://${curHost}:3500/api/anime-source?malId=${malId}&ep=${epNum}&mode=${curPref}`,
      `http://localhost:3500/api/anime-source?malId=${malId}&ep=${epNum}&mode=${curPref}`,
      `http://127.0.0.1:3500/api/anime-source?malId=${malId}&ep=${epNum}&mode=${curPref}`,
      `/api/anime-source?malId=${malId}&ep=${epNum}&mode=${curPref}`
    ];

    for (const epUrl of endpoints) {
      try {
        const res = await fetch(epUrl);
        if (!res.ok) continue;
        const srcData = await res.json();
        if (srcData && srcData.source) {
          cleanUrl = srcData.source;
          if (srcData.tracks && srcData.tracks.length > 0) {
            const enTrack = srcData.tracks.find(t => t.srclang === 'en' || (t.label || '').toLowerCase().includes('eng')) || srcData.tracks[0];
            if (enTrack && enTrack.file) {
              subtitleUrl = enTrack.file;
            }
          }
          break;
        }
      } catch (e) {}
    }
  }

  // 2b. If Movies or TV Series: fetch direct stream from custom server endpoints
  const tmdb = movie.videoUrl || movie.tmdbId || movie.cinesrcId || movie.id;
  if (!isAnime && !cleanUrl && tmdb) {
    const tvQuery = isTv ? `&season=${sNum}&episode=${epNum}` : '';
    const endpoints = [
      `${curOrigin}/api/stream?tmdbId=${tmdb}&type=${isTv ? 'tv' : 'movie'}${tvQuery}&title=${encodeURIComponent(cleanName)}`,
      `http://${curHost}:3000/api/stream?tmdbId=${tmdb}&type=${isTv ? 'tv' : 'movie'}${tvQuery}&title=${encodeURIComponent(cleanName)}`,
      `http://localhost:3000/api/stream?tmdbId=${tmdb}&type=${isTv ? 'tv' : 'movie'}${tvQuery}&title=${encodeURIComponent(cleanName)}`,
      `http://127.0.0.1:3000/api/stream?tmdbId=${tmdb}&type=${isTv ? 'tv' : 'movie'}${tvQuery}&title=${encodeURIComponent(cleanName)}`,
      `/api/stream?tmdbId=${tmdb}&type=${isTv ? 'tv' : 'movie'}${tvQuery}&title=${encodeURIComponent(cleanName)}`
    ];

    for (const epUrl of endpoints) {
      try {
        const res = await fetch(epUrl, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) continue;
        const sData = await res.json();
        if (sData && sData.success && sData.streamUrl) {
          cleanUrl = sData.streamUrl;
          if (sData.qualities && sData.qualities.length > 0) {
            window._cwQualities = sData.qualities;
          }
          if (sData.tracks && sData.tracks.length > 0) {
            window._cwSubtitleTracks = sData.tracks;
            const kuTrack = sData.tracks.find(t => t.srclang === 'ku') || sData.tracks[0];
            if (kuTrack && kuTrack.file) {
              subtitleUrl = kuTrack.file;
            }
          }
          break;
        }
      } catch (e) {}
    }
  }

  // Fallback: If no direct stream was extracted, fall back gracefully to clean embed
  if (!cleanUrl) {
    let fallbackSrc = '';
    const tmdb = movie.videoUrl || movie.tmdbId || movie.cinesrcId || movie.id;
    if (isAnime && malId) {
      fallbackSrc = `https://megavid.buzz/mal/${malId}/${epNum}/${curPref}`;
    } else if (isTv) {
      fallbackSrc = `https://vidlink.pro/tv/${tmdb}/${sNum}/${epNum}?primaryColor=db0a0a&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&player=default&title=true&poster=true&autoplay=false&nextbutton=true${subParam}`;
    } else {
      fallbackSrc = `https://vidlink.pro/movie/${tmdb}?primaryColor=db0a0a&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&player=default&title=true&poster=true&autoplay=false${subParam}`;
    }

    if (artContainer) artContainer.classList.add('hidden');
    if (iframeEl) {
      iframeEl.classList.remove('hidden');
      iframeEl.setAttribute('frameborder', '0');
      iframeEl.setAttribute('scrolling', 'no');
      iframeEl.setAttribute('allowfullscreen', 'true');
      iframeEl.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
      iframeEl.src = fallbackSrc;
      iframeEl.onload = () => {
        const pl = document.getElementById('playerLoading');
        if (pl) pl.classList.add('hidden');
      };
    }
    playerModal?.classList.remove('hidden');
    resetPlayerIdleTimer();
    return;
  }

  if (artContainer) {
    artContainer.classList.remove('hidden');
  }

  const streamUrl = cleanUrl;

  if (typeof Artplayer === 'undefined') {
    console.warn('Artplayer library not yet available');
    return;
  }

  try {
    const artSettings = [
      {
        width: 200,
        html: 'Subtitle',
        tooltip: 'Subtitles',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width:20px;height:20px;fill:currentColor;"><path d="M416 96H96a64 64 0 00-64 64v192a64 64 0 0064 64h320a64 64 0 0064-64V160a64 64 0 00-64-64zm-192 96h64v32h-64zm-96 0h64v32h-64zm288 128H96v-32h320zm0-64h-96v-32h96z"/></svg>',
        selector: (() => {
          const items = [
            {
              html: 'Display',
              tooltip: subtitleUrl ? 'Hide' : 'Show',
              switch: !!subtitleUrl,
              onSwitch(item) {
                const next = !item.switch;
                item.tooltip = next ? 'Hide' : 'Show';
                if (window.artPlayerInstance && window.artPlayerInstance.subtitle) {
                  window.artPlayerInstance.subtitle.show = next;
                }
                return next;
              },
            },
            { html: 'Off', url: '', default: !subtitleUrl }
          ];
          const tracks = window._cwSubtitleTracks || [];
          tracks.forEach((t, i) => {
            items.push({
              html: t.label || `Track ${i + 1}`,
              url: t.file || '',
              default: i === 0 && !!subtitleUrl
            });
          });
          if (tracks.length > 0 && isAnime) {
            const baseTrack = tracks.find(t => (t.label||'').toLowerCase().includes('eng')) || tracks[0];
            if (baseTrack && baseTrack.file) {
              let kuUrl = baseTrack.file;
              kuUrl += kuUrl.includes('?') ? '&lang=ckb' : '?lang=ckb';
              items.push({
                html: 'Kurdish (Sorani)',
                url: kuUrl,
                default: false
              });
            }
          }
          return items;
        })(),
        onSelect(item) {
          if (!window.artPlayerInstance || !window.artPlayerInstance.subtitle) return item.html;
          if (!item.url) {
            window.artPlayerInstance.subtitle.show = false;
          } else {
            const isSrt = item.url.includes('.srt');
            window.artPlayerInstance.subtitle.switch(item.url, {
              name: item.html,
              type: isSrt ? 'srt' : 'vtt'
            });
            window.artPlayerInstance.subtitle.show = true;
          }
          return item.html;
        },
      }
    ];

    if (isAnime) {
      artSettings.push({
        html: 'Audio / Dub',
        icon: '<ion-icon name="volume-high-outline" style="font-size:1.2rem;"></ion-icon>',
        tooltip: curPref === 'dub' ? 'English Dub' : 'Japanese (Sub)',
        selector: [
          { default: curPref !== 'dub', html: 'Japanese (Sub)' },
          { default: curPref === 'dub', html: 'English Dub' },
        ],
        onSelect(item) {
          const isDub = item.html === 'English Dub';
          const route = isDub ? 'dub' : 'sub';
          localStorage.setItem('cw_anime_audio_pref', route);
          const epEndpoints = [
            `${curOrigin}/api/anime-source?malId=${malId}&ep=${epNum}&mode=${route}`,
            `https://cinewatch-maaa.onrender.com/api/anime-source?malId=${malId}&ep=${epNum}&mode=${route}`,
            `http://${curHost}:3000/api/anime-source?malId=${malId}&ep=${epNum}&mode=${route}`,
            `http://localhost:3000/api/anime-source?malId=${malId}&ep=${epNum}&mode=${route}`,
            `http://127.0.0.1:3000/api/anime-source?malId=${malId}&ep=${epNum}&mode=${route}`,
            `http://${curHost}:3500/api/anime-source?malId=${malId}&ep=${epNum}&mode=${route}`,
            `http://localhost:3500/api/anime-source?malId=${malId}&ep=${epNum}&mode=${route}`,
            `http://127.0.0.1:3500/api/anime-source?malId=${malId}&ep=${epNum}&mode=${route}`,
            `/api/anime-source?malId=${malId}&ep=${epNum}&mode=${route}`
          ];
          (async () => {
            for (const epUrl of epEndpoints) {
              try {
                const r = await fetch(epUrl);
                if (!r.ok) continue;
                const d = await r.json();
                if (d && d.source && window.artPlayerInstance) {
                  window.artPlayerInstance.type = 'm3u8';
                  window.artPlayerInstance.switchUrl(d.source);
                  if (d.tracks && d.tracks.length > 0 && window.artPlayerInstance.subtitle) {
                    const enTrack = d.tracks.find(t => t.srclang === 'en' || (t.label || '').toLowerCase().includes('eng')) || d.tracks[0];
                    if (enTrack && enTrack.file) {
                      window.artPlayerInstance.subtitle.switch(enTrack.file, { name: enTrack.label });
                    }
                  }
                  break;
                }
              } catch (err) {}
            }
          })();
          return item.html;
        },
      });
    }

    artSettings.push({
      html: 'Playback Speed',
      icon: '<ion-icon name="speedometer-outline" style="font-size:1.2rem;"></ion-icon>',
      tooltip: '1x',
      range: [1, 0.5, 3, 0.25],
      onRange(item) {
        if (window.artPlayerInstance) window.artPlayerInstance.playbackRate = item.range[0];
        return `${item.range[0]}x`;
      },
    });

    const centerTitleHtml = isAnime
      ? `<div class="art-center-title" style="position:absolute;left:50%;transform:translateX(-50%);pointer-events:none;text-align:center;white-space:nowrap;font-size:0.85rem;text-shadow:0 1px 4px rgba(0,0,0,0.9);"><span class="art-title-ep" style="font-weight:700;color:#fff;">EP ${epNum}</span><span class="art-title-sep" style="color:rgba(255,255,255,0.4);margin:0 5px;">·</span><span class="art-title-name" style="color:rgba(255,255,255,0.72);font-weight:400;">${(movie?.title || 'Anime').replace(/"/g, '&quot;')}</span></div>`
      : (isTv
          ? `<div class="art-center-title" style="position:absolute;left:50%;transform:translateX(-50%);pointer-events:none;text-align:center;white-space:nowrap;font-size:0.85rem;text-shadow:0 1px 4px rgba(0,0,0,0.9);"><span class="art-title-ep" style="font-weight:700;color:#fff;">S${sNum} E${epNum}</span><span class="art-title-sep" style="color:rgba(255,255,255,0.4);margin:0 5px;">·</span><span class="art-title-name" style="color:rgba(255,255,255,0.72);font-weight:400;">${(movie?.title || 'Series').replace(/"/g, '&quot;')}</span></div>`
          : `<div class="art-center-title" style="position:absolute;left:50%;transform:translateX(-50%);pointer-events:none;text-align:center;white-space:nowrap;font-size:0.85rem;text-shadow:0 1px 4px rgba(0,0,0,0.9);"><span class="art-title-name" style="font-weight:700;color:#fff;">${(movie?.title || 'Movie').replace(/"/g, '&quot;')}</span></div>`
        );

    const artOptions = {
      container: '#artplayerApp',
      url: streamUrl,
      type: streamUrl.includes('.m3u8') ? 'm3u8' : 'auto',
      poster: poster,
      volume: 0.8,
      isLive: false,
      muted: false,
      autoplay: true,
      pip: true,
      autoSize: false,
      autoMini: true,
      screenshot: true,
      setting: true,
      loop: false,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      subtitleOffset: true,
      miniProgressBar: false,
      mutex: true,
      backdrop: false,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      theme: '#e50914',
      lang: navigator.language ? navigator.language.toLowerCase() : 'en',
      layers: [
        {
          name: 'brandWatermark',
          html: `<div class="art-brand-watermark notranslate" translate="no"><div class="art-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M490.18 181.4l-44.13-44.13a20 20 0 00-27-1 30.81 30.81 0 01-41.68-1.6 30.81 30.81 0 01-1.6-41.67 20 20 0 00-1-27L330.6 21.82a19.91 19.91 0 00-28.13 0l-70.35 70.34a39.87 39.87 0 00-9.57 15.5 7.71 7.71 0 01-4.83 4.83 39.78 39.78 0 00-15.5 9.58l-180.4 180.4a19.91 19.91 0 000 28.13L66 374.73a20 20 0 0027 1 30.69 30.69 0 0143.28 43.28 20 20 0 001 27l44.13 44.13a19.91 19.91 0 0028.13 0l180.4-180.4a39.82 39.82 0 009.58-15.49 7.69 7.69 0 014.84-4.84 39.84 39.84 0 0015.49-9.57l70.34-70.35a19.91 19.91 0 00-.01-28.09zm-228.37-29.65a16 16 0 01-22.63 0l-11.51-11.51a16 16 0 0122.63-22.62l11.51 11.5a16 16 0 010 22.63zm44 44a16 16 0 01-22.62 0l-11-11a16 16 0 1122.63-22.63l11 11a16 16 0 01.01 22.66zm44 44a16 16 0 01-22.63 0l-11-11a16 16 0 0122.63-22.62l11 11a16 16 0 01.05 22.67zm44.43 44.54a16 16 0 01-22.63 0l-11.44-11.5a16 16 0 1122.68-22.57l11.45 11.49a16 16 0 01-.01 22.63z"/></svg></div><span class="art-brand-text">Cine<span>Watch</span></span></div>`,
          style: {
            position: 'absolute',
            top: '20px',
            right: '25px',
            zIndex: 20,
            pointerEvents: 'none',
            userSelect: 'none',
          },
        }
      ],
      moreVideoAttr: {
        crossOrigin: 'anonymous',
      },
      customType: {
        m3u8: function (video, url, art) {
          if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            if (art.hls) {
              try { art.hls.destroy(); } catch (e) {}
            }
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90
            });
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
              if (art.setting) {
                const qualities = [
                  { html: 'Auto', height: 'auto', default: true },
                  { html: '1080p', height: 1080, default: false },
                  { html: '720p', height: 720, default: false },
                  { html: '480p', height: 480, default: false },
                  { html: '360p', height: 360, default: false }
                ];
                art.setting.add({
                  html: 'Quality',
                  icon: '<ion-icon name="options-outline" style="font-size:1.2rem;"></ion-icon>',
                  tooltip: 'Auto',
                  selector: qualities,
                  onSelect: function (item) {
                    if (item.height === 'auto') {
                      hls.currentLevel = -1;
                      return item.html;
                    }
                    let bestLevel = -1;
                    let minDiff = Infinity;
                    data.levels.forEach((lvl, idx) => {
                      const h = lvl.height || 0;
                      if (h > 0) {
                        const diff = Math.abs(h - item.height);
                        if (diff < minDiff) {
                          minDiff = diff;
                          bestLevel = idx;
                        }
                      }
                    });
                    if (bestLevel === -1) bestLevel = 0;
                    hls.currentLevel = bestLevel;
                    return item.html;
                  }
                });
              }
              video.play().catch(function() {
                video.muted = true;
                video.play().catch(function() {});
              });
            });
            hls.on(Hls.Events.ERROR, function (event, data) {
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    hls.startLoad();
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    hls.recoverMediaError();
                    break;
                  default:
                    hls.destroy();
                    break;
                }
              }
            });
            art.hls = hls;
            art.on('destroy', () => {
              try { hls.destroy(); } catch (e) {}
            });
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.play().catch(function() {});
          }
        },
      },
      settings: artSettings,
      contextmenu: [
        {
          html: 'CineWatch Custom Player',
          click(contextmenu) {
            contextmenu.show = false;
          },
        },
      ],
      controls: [
        {
          position: 'left',
          index: 50,
          style: { position: 'static' },
          html: centerTitleHtml,
          tooltip: isAnime ? `${movie?.title || 'Anime'} - Episode ${epNum}` : (isTv ? `${movie?.title || 'Series'} - S${sNum} E${epNum}` : `${movie?.title || 'Movie'}`),
        }
      ],
    };

    artOptions.subtitle = {
      url: (subtitleUrl && subtitleUrl.trim().length > 0) ? subtitleUrl : 'data:text/vtt;base64,V0VCVlRUCgo=',
      type: 'vtt',
      style: {
        color: '#ffffff',
        fontSize: '22px',
        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
        fontWeight: '600'
      },
      encoding: 'utf-8',
    };

    window.artPlayerInstance = new Artplayer(artOptions);

    if (subtitleUrl) {
      window.artPlayerInstance.on('ready', () => {
        if (window.artPlayerInstance && window.artPlayerInstance.subtitle) {
          window.artPlayerInstance.subtitle.show = true;
        }
      });
      window.artPlayerInstance.on('subtitleLoad', () => {
        if (window.artPlayerInstance && window.artPlayerInstance.subtitle) {
          window.artPlayerInstance.subtitle.show = true;
        }
      });
      if (window.artPlayerInstance.subtitle) {
        window.artPlayerInstance.subtitle.show = true;
      }
    }
  } catch (err) {
    console.error('Failed to init ArtPlayer in app:', err);
  }

  playerModal?.classList.remove('hidden');
  resetPlayerIdleTimer();
}

function playMovieDirect(movieId) {
  let movie = _movieMap.get(String(movieId)) || state.currentDetail;
  if (!movie && movieId) {
    movie = (typeof MOVIES !== 'undefined' ? MOVIES.find(m => String(m.id) === String(movieId) || m.title === movieId) : null)
      || (typeof SERIES !== 'undefined' ? SERIES.find(s => String(s.id) === String(movieId) || s.title === movieId) : null)
      || (typeof ANIME !== 'undefined' ? ANIME.find(a => String(a.id) === String(movieId) || a.title === movieId) : null);
  }
  if (!movie) return;

  closeDetail();
  _cwPlayerState.activeMovie = movie;

  const playerModal = document.getElementById('playerModal');
  const playerTitle = document.getElementById('playerTitle');
  const nextEpBtn = document.getElementById('nextEpBtn');
  const serverSelectWrap = document.getElementById('serverSelectWrap');
  const playerTitlePill = document.getElementById('playerTitlePill') || document.querySelector('.cw-player-title-pill');

  const movieVideoUrlStr = String(movie.videoUrl || '');
  const ytVideoId = extractYouTubeId(movieVideoUrlStr);
  const isTv = movie.type === 'TV Show' || movie.type === 'Series' || (movie.seasons && movie.seasons.length);

  if (nextEpBtn) {
    nextEpBtn.classList.toggle('hidden', !isTv || !!ytVideoId);
  }

  let sNum = 1;
  let epNum = 1;
  if (movie.seasons && movie.seasons.length > 0 && movie.seasons[0].episodes && movie.seasons[0].episodes.length > 0) {
    sNum = movie.seasons[0].season || 1;
    epNum = movie.seasons[0].episodes[0].episode || 1;
  } else {
    sNum = movie.season || 1;
    epNum = movie.episode || 1;
  }

  if (serverSelectWrap) {
    serverSelectWrap.classList.add('hidden');
    serverSelectWrap.style.display = 'none';
  }
  if (playerTitlePill) {
    playerTitlePill.classList.remove('hidden');
    playerTitlePill.style.display = '';
  }

  const curPref = localStorage.getItem('cw_anime_audio_pref') || 'sub';
  initArtPlayerForAnimeApp(movie, sNum, epNum, curPref);

  if (playerTitle) {
    if (movie.isAnime || movie.type === 'Anime') playerTitle.textContent = `${movie.title} - S${sNum} E${epNum}`;
    else if (isTv) playerTitle.textContent = `${movie.title} - S${sNum} E${epNum}`;
    else playerTitle.textContent = `${movie.title} (${movie.year || '2026'})`;
  }

  playerModal?.classList.remove('hidden');
  resetPlayerIdleTimer();
}

window.playMovieDirect = playMovieDirect;
  window.openDetail = openDetail;
  window.closeDetail = closeDetail;
  window.slideShelf = slideShelf;
  window.toggleFav = toggleFav;
  window.toggleFavorite = toggleFavorite;
  window.jumpHeroSlide = jumpHeroSlide;
  window.switchTab = switchTab;
  window.triggerAppInstall = triggerAppInstall;
  window.createCardHTML = createCardHTML;
})();

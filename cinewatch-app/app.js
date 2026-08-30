/**
 * CineWatch Standalone App Engine
 * High-Performance, Instant-Loading Streaming Platform Logic
 */

const FEATURED_TITLES = [
  "Grand Theft Auto VI: An Extended Look",
  "The Whisper Man",
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
// FIX 4: N+1 → O(1) Map lookup instead of repeated .find() scans
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

  // FIX 2: OPTIMISTIC RENDERING — update UI instantly, sync cloud in background
  if (wasFav) {
    state.favorites.delete(strId);
    showToast('Removed from Watchlist');
  } else {
    state.favorites.add(strId);
    showToast('Saved to Watchlist ❤️');
  }

  // Immediately update every fav button for this card (no full re-render needed)
  _updateAllFavButtons(strId, !wasFav);

  // FIX 5: ASYNC — save & cloud sync fully non-blocking
  Promise.resolve().then(() => {
    saveFavorites();
    renderWatchlist();
  });

  if (window.CW_API && typeof window.CW_API.toggleFavorite === 'function') {
    // Fire-and-forget — never blocks the UI thread
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

    // FIX 4: Build O(1) Map — eliminates all N+1 .find() scans across the app
    _movieMap.clear();
    MOVIES.forEach(m => _movieMap.set(String(m.id), m));

    // FIX 5: ASYNC — render home on next frame, don't block catalog init
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
      if (tab) switchTab(tab);
      document.getElementById('sidebar')?.classList.remove('mobile-open');
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
  else if (tabId === 'live') renderLiveTV();
  else if (tabId === 'ai') renderAITab();
  else if (tabId === 'watchlist') renderWatchlist();

  if (tabId === 'explore') {
    document.getElementById('searchInput')?.focus();
  } else if (tabId === 'ai') {
    document.getElementById('aiChatInput')?.focus();
  }
}

// FIX 5: Async chunked renderer — renders PAGE_SIZE cards per animation frame
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

// FIX 1: Tooltip helper — sets title attribute for browser-native tooltips
function _tip(el, text) {
  if (el) el.setAttribute('title', text);
}

// Media Card HTML Generator
function createCardHTML(movie, rankNum = null) {
  if (!movie) return '';
  const isFav = state.favorites.has(String(movie.id));
  const rankBadge = rankNum ? `<div class="card-rank">🔥 TOP ${rankNum}</div>` : '';
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
      const genreText = Array.isArray(m.genres) ? m.genres.slice(0, 3).join(' • ') : (m.genres || 'Action • Adventure • Sci-Fi');
      return `
        <div class="hero-slide" style="background-image: url('${m.backdrop || m.poster || ''}')" onclick="openDetail('${m.id}')">
          <div class="hero-content" onclick="event.stopPropagation()">
            <h1 class="hero-title">${m.title}</h1>
            <div class="hero-meta-row">
              <span class="hero-rating-badge"><ion-icon name="star"></ion-icon> ${m.rating || '8.1'}</span>
              <span class="hero-meta-divider">•</span>
              <span>${m.year || '2026'}</span>
              <span class="hero-meta-divider">•</span>
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
  const trendingSeries = MOVIES.filter(m => m.type === 'TV Show' || m.type === 'Series' || m.seasons).slice(0, 15);
  const animeHits = MOVIES.filter(m => m.isAnime || m.genres?.includes('Anime')).slice(0, 15);

  shelvesContainer.innerHTML = `
    <div class="shelf">
      <div class="shelf-header">
        <h2 class="shelf-title"><span class="title-bar"></span> Top 10 in World Today</h2>
      </div>
      <div class="shelf-track">
        ${(top10.length ? top10 : MOVIES.slice(0, 10)).map((m, i) => createCardHTML(m, i + 1)).join('')}
      </div>
    </div>

    <div class="shelf">
      <div class="shelf-header">
        <h2 class="shelf-title"><span class="title-bar"></span> Trending Movies</h2>
      </div>
      <div class="shelf-track">
        ${trendingMovies.map(m => createCardHTML(m)).join('')}
      </div>
    </div>

    <div class="shelf">
      <div class="shelf-header">
        <h2 class="shelf-title"><span class="title-bar"></span> Popular Series</h2>
      </div>
      <div class="shelf-track">
        ${trendingSeries.map(m => createCardHTML(m)).join('')}
      </div>
    </div>

    <div class="shelf">
      <div class="shelf-header">
        <h2 class="shelf-title"><span class="title-bar"></span> Anime Hits</h2>
      </div>
      <div class="shelf-track">
        ${animeHits.map(m => createCardHTML(m)).join('')}
      </div>
    </div>
  `;

  setupShelfDragScroll();
}

function setupShelfDragScroll() {
  document.querySelectorAll('.shelf-track').forEach(track => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasMoved = false;

    track.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDown = true;
      hasMoved = false;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        track.classList.remove('is-dragging');
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - track.offsetLeft;
      const diff = Math.abs(x - startX);
      if (diff > 10) {
        hasMoved = true;
        track.classList.add('is-dragging');
        track.scrollLeft = scrollLeft - (x - startX) * 1.5;
      }
    });

    track.addEventListener('click', (e) => {
      if (hasMoved) {
        if (e.target.closest('.card-fav-btn, button, a')) return;
        e.preventDefault();
        e.stopPropagation();
        hasMoved = false;
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

// Render hero slide indicator dots
function renderHeroDots(count) {
  const dotsEl = document.getElementById('heroDots');
  if (!dotsEl) return;
  dotsEl.innerHTML = Array.from({ length: count }, (_, i) =>
    `<button class="hero-dot ${i === state.heroIndex ? 'active' : ''}" onclick="jumpHeroSlide(${i})" aria-label="Go to slide ${i + 1}"></button>`
  ).join('');
}

function updateHeroDots() {
  document.querySelectorAll('#heroDots .hero-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === state.heroIndex);
  });
}

function jumpHeroSlide(index) {
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
  const movies = MOVIES.filter(m => (!m.type || m.type === 'Movie') && !m.isAnime);
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
  const series = MOVIES.filter(m => m.type === 'TV Show' || m.type === 'Series' || m.seasons);
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
  const anime = MOVIES.filter(m => m.isAnime || m.genres?.includes('Anime'));
  if (countEl) countEl.textContent = `${anime.length} Anime`;
  _pageOffset.anime = 0;
  renderCardsAsync(anime, grid, 0, false);
  _renderLoadMoreBtn('animeGrid', 'anime', anime);
  _filteredCache.anime = anime;
}

// 6. Live TV Tab
function renderLiveTV() {
  const grid = document.getElementById('liveGrid');
  const channels = window._LIVE_CHANNELS || [];
  if (!grid || channels.length === 0) return;

  grid.innerHTML = channels.map(ch => `
    <div class="live-card" onclick="showToast('Connecting to ${ch.name} stream...')">
      <div class="live-icon">${ch.logo || '📺'}</div>
      <div>
        <h3 style="font-size: 1.05rem; font-weight: 700; color: #fff;">${ch.name}</h3>
        <p style="font-size: 0.8rem; color: var(--text-dim);">${ch.category} • Full HD</p>
      </div>
    </div>
  `).join('');
}

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

// Detail Modal — FIX 4: O(1) Map lookup instead of .find()
function openDetail(movieId) {
  // FIX 4: instant O(1) lookup — no N+1 scan through the whole MOVIES array
  const movie = _movieMap.get(String(movieId));
  if (!movie) return;

  state.currentDetail = movie;
  const modal = document.getElementById('detailModal');
  const hero = document.getElementById('detailHero');
  const body = document.getElementById('detailBody');

  if (hero) {
    hero.style.backgroundImage = `url('${movie.backdrop || movie.poster || ''}')`;
    hero.innerHTML = `
      <div class="detail-hero-content">
        <h2 style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 800;">${movie.title}</h2>
        <div style="display: flex; gap: 0.75rem; color: var(--text-sub); font-size: 0.9rem;">
          <span style="color: var(--accent-gold); font-weight: 700;"><ion-icon name="star"></ion-icon> ${movie.rating || '8.5'}</span>
          <span>•</span>
          <span>${movie.year || '2026'}</span>
          <span>•</span>
          <span>${movie.duration || '2h 10m'}</span>
        </div>
      </div>
    `;
  }

  const isFav = state.favorites.has(String(movie.id));

  if (body) {
    body.innerHTML = `
      <div style="display: flex; gap: 0.85rem; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="playMovieDirect('${movie.id}')"><ion-icon name="play"></ion-icon> Play Movie</button>
        <button class="btn btn-secondary" onclick="toggleFavorite('${movie.id}'); openDetail('${movie.id}');">
          <ion-icon name="${isFav ? 'heart' : 'heart-outline'}" style="color: ${isFav ? 'var(--primary)' : 'inherit'};"></ion-icon>
          ${isFav ? 'In Watchlist' : 'Add to Watchlist'}
        </button>
      </div>

      <p style="color: rgba(255,255,255,0.85); line-height: 1.6; font-size: 0.95rem;">
        ${movie.description || 'A cinematic masterpiece streaming now on CineWatch in full high-definition quality with crystal clear audio.'}
      </p>

      <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.88rem; color: var(--text-sub); margin-top: 0.5rem;">
        <div><strong style="color: #fff;">Genres:</strong> ${Array.isArray(movie.genres) ? movie.genres.join(', ') : (movie.genres || 'Action, Drama')}</div>
        ${movie.director ? `<div><strong style="color: #fff;">Director:</strong> ${movie.director}</div>` : ''}
        ${movie.cast ? `<div><strong style="color: #fff;">Cast:</strong> ${Array.isArray(movie.cast) ? movie.cast.join(', ') : movie.cast}</div>` : ''}
      </div>
    `;
  }

  modal?.classList.remove('hidden');
}

function closeDetail() {
  document.getElementById('detailModal')?.classList.add('hidden');
}

// Multi-Server Video Streaming Player — FIX 4: O(1) Map lookup
function playMovieDirect(movieId) {
  closeDetail();
  // FIX 4: instant O(1) lookup
  const movie = _movieMap.get(String(movieId));
  if (!movie) return;

  const playerModal = document.getElementById('playerModal');
  const playerTitle = document.getElementById('playerTitle');
  const iframeEl = document.getElementById('iframeEl');
  const serverSelect = document.getElementById('serverSelect');

  if (playerTitle) playerTitle.textContent = `${movie.title} (${movie.year || '2026'})`;

  const tmdb = movie.tmdbId || movie.videoUrl || '550';
  const isTv = movie.type === 'TV Show' || movie.type === 'Series' || (movie.seasons && movie.seasons.length);

  const servers = [
    { id: 'autoembed', name: '⚡ AutoEmbed Fast Server', url: isTv ? `https://player.autoembed.cc/embed/tv/${tmdb}/1/1` : `https://player.autoembed.cc/embed/movie/${tmdb}` },
    { id: 'vidlink', name: '🎬 VidLink Pro (Multi-Audio)', url: isTv ? `https://vidlink.pro/tv/${tmdb}/1/1` : `https://vidlink.pro/movie/${tmdb}` },
    { id: 'vidsrc', name: '🌟 VidSrc VIP Stream', url: isTv ? `https://vidsrc.to/embed/tv/${tmdb}/1/1` : `https://vidsrc.to/embed/movie/${tmdb}` }
  ];

  function switchSource(srv) {
    if (iframeEl) {
      iframeEl.classList.remove('hidden');
      iframeEl.src = srv.url;
    }
  }

  if (serverSelect) {
    serverSelect.innerHTML = servers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    serverSelect.onchange = () => {
      const selected = servers.find(s => s.id === serverSelect.value);
      if (selected) switchSource(selected);
    };
  }

  switchSource(servers[0]);
  playerModal?.classList.remove('hidden');
}

function closePlayer() {
  const playerModal = document.getElementById('playerModal');
  const iframeEl = document.getElementById('iframeEl');
  if (iframeEl) iframeEl.src = '';
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}

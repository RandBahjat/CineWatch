/**
 * CineWatch Standalone App Engine
 * Supports Fullscreen Layout, Left Sidebar, Filtering, Live TV & Quick Player
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
let state = {
  currentTab: 'home',
  favorites: new Set(),
  activeType: 'all',
  activeGenre: 'all',
  heroIndex: 0,
  heroTimer: null,
  currentDetail: null,
  currentStreamData: null
};

// Storage helpers
function loadFavorites() {
  try {
    const saved = localStorage.getItem('cinewatch_app_favs');
    if (saved) state.favorites = new Set(JSON.parse(saved));
  } catch(e) {}
}

function saveFavorites() {
  try {
    localStorage.setItem('cinewatch_app_favs', JSON.stringify([...state.favorites]));
  } catch(e) {}
}

function toggleFavorite(id, e) {
  if (e) e.stopPropagation();
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
    showToast('Removed from Watchlist');
  } else {
    state.favorites.add(id);
    showToast('Saved to Watchlist');
  }
  saveFavorites();
  renderWatchlist();
  if (state.currentTab === 'home') renderHome();
}

function hideSplash() {
  const splash = document.getElementById('splash');
  if (splash) {
    splash.classList.add('hidden');
    setTimeout(() => {
      if (splash && splash.parentNode) splash.remove();
    }, 450);
  }
}

// Fallback auto-dismiss splash screen
setTimeout(hideSplash, 1200);

const fallbackImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect width='300' height='450' fill='%2311141e'/%3E%3Ctext x='50%25' y='50%25' fill='%23555' font-family='sans-serif' font-size='16' text-anchor='middle'%3ENo Poster%3C/text%3E%3C/svg%3E";

// Catalog Initialization with async-safe data waiting
let catalogInitialized = false;

function initCatalog() {
  const movies = window._MOVIES_DATA || [];
  const series = window._SERIES_DATA || [];
  const anime = window._ANIME_DATA || [];

  if (movies.length === 0 && series.length === 0 && anime.length === 0) {
    // Data files still loading in background, retry in 50ms
    setTimeout(initCatalog, 50);
    return;
  }

  if (catalogInitialized && MOVIES.length > 0) return;
  catalogInitialized = true;

  try {
    MOVIES = [...movies, ...series, ...anime];
    MOVIES.forEach(m => {
      if (!m.id) {
        m.id = m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + (m.year ? '-' + m.year : '');
      }
      if ((m.type === 'TV Show' || m.type === 'Series') && m.seasons && m.seasons.length) {
        m.duration = `${m.seasons.length} Season${m.seasons.length > 1 ? 's' : ''}`;
      }
    });

    renderHome();
  } catch (err) {
    console.error('Error initializing catalog:', err);
  } finally {
    hideSplash();
  }
}

// Navigation & Tab Switching with Lazy Tab Rendering
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.onclick = () => {
      const tab = btn.dataset.tab;
      if (tab) switchTab(tab);
    };
  });

  // Keyboard shortcut '/' for search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      switchTab('explore');
      document.getElementById('searchInput')?.focus();
    }
  });

  // Topbar Search Click
  document.getElementById('topSearchBtn')?.addEventListener('click', () => {
    switchTab('explore');
  });
  document.getElementById('topSearchInput')?.addEventListener('click', () => {
    switchTab('explore');
    document.getElementById('searchInput')?.focus();
  });

  // Hero controls
  document.getElementById('heroPrevBtn')?.addEventListener('click', () => changeHeroSlide(-1));
  document.getElementById('heroNextBtn')?.addEventListener('click', () => changeHeroSlide(1));
  setupHeroDragEvents();
}

const renderedTabs = new Set(['home']);

function switchTab(tabId) {
  state.currentTab = tabId;

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `panel-${tabId}`);
  });

  // Scroll to top of app view on tab switch
  const appView = document.getElementById('appView');
  if (appView) appView.scrollTop = 0;

  // Lazy render tab contents on first visit
  if (!renderedTabs.has(tabId)) {
    renderedTabs.add(tabId);
    if (tabId === 'explore') renderExplore();
    else if (tabId === 'movies') renderMoviesTab();
    else if (tabId === 'series') renderSeriesTab();
    else if (tabId === 'anime') renderAnimeTab();
    else if (tabId === 'live') renderLiveTV();
  }

  if (tabId === 'explore') {
    document.getElementById('searchInput')?.focus();
  } else if (tabId === 'watchlist') {
    renderWatchlist();
  }
}

// Card HTML Generator with non-blocking fallback image and zero recursion
function createCardHTML(movie, rankNum = null) {
  if (!movie) return '';
  const isFav = state.favorites.has(movie.id);
  const rankBadge = rankNum ? `<div class="card-rank">🔥 TOP ${11 - rankNum}</div>` : '';
  const metaYear = movie.year ? `<span>${movie.year}</span>` : '';
  const metaDur = movie.duration ? `<span>${movie.duration}</span>` : '';
  const posterSrc = movie.poster || movie.backdrop || fallbackImg;

  return `
    <div class="media-card" onclick="openDetail('${movie.id}')">
      <div class="card-poster">
        <img src="${posterSrc}" alt="${movie.title}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImg}';">
        ${rankBadge}
        <button class="card-fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav(event, '${movie.id}')" aria-label="Favorite">
          <ion-icon name="${isFav ? 'heart' : 'heart-outline'}"></ion-icon>
        </button>
      </div>
      <div class="card-info">
        <h3 class="card-title">${movie.title}</h3>
        <div class="card-meta">
          <span class="card-rating"><ion-icon name="star"></ion-icon> ${movie.rating || '8.0'}</span>
          ${metaYear}
          ${metaDur}
        </div>
      </div>
    </div>
  `;
}

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
        <div class="hero-slide ${idx === 0 ? 'active' : ''}" style="background-image: url('${m.backdrop || m.poster}')" onclick="openDetail('${m.id}')">
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

    startHeroAutoplay(heroFeatured.length);
  }

  // Shelves
  const shelvesContainer = document.getElementById('homeShelves');
  if (!shelvesContainer) return;

  const top10 = TOP_10_TITLES.map(title => MOVIES.find(m => m.title === title)).filter(Boolean);
  const trendingMovies = MOVIES.filter(m => (m.type === 'Movie' || !m.type) && !m.isAnime).slice(0, 15);
  const trendingSeries = MOVIES.filter(m => m.type === 'TV Show' || m.type === 'Series' || m.seasons).slice(0, 15);
  const animeHits = MOVIES.filter(m => m.isAnime || m.genres?.includes('Anime')).slice(0, 15);

  shelvesContainer.innerHTML = `
    <!-- Top 10 Today -->
    <div class="shelf">
      <div class="shelf-header">
        <h2 class="shelf-title"><span class="title-bar"></span> Top 10 in World Today</h2>
      </div>
      <div class="shelf-track">
        ${top10.map((m, i) => createCardHTML(m, i + 1)).join('')}
      </div>
    </div>

    <!-- Trending Movies -->
    <div class="shelf">
      <div class="shelf-header">
        <h2 class="shelf-title"><span class="title-bar"></span> Trending Movies</h2>
      </div>
      <div class="shelf-track">
        ${trendingMovies.map(m => createCardHTML(m)).join('')}
      </div>
    </div>

    <!-- Popular TV Series -->
    <div class="shelf">
      <div class="shelf-header">
        <h2 class="shelf-title"><span class="title-bar"></span> Popular Series</h2>
      </div>
      <div class="shelf-track">
        ${trendingSeries.map(m => createCardHTML(m)).join('')}
      </div>
    </div>

    <!-- Top Anime -->
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
      if (diff > 18) {
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

// Real-time Smooth Drag / Swipe to change hero slides with cursor
let heroDragState = {
  startX: 0,
  currentTranslate: 0,
  isDragging: false,
  hasMoved: false
};

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

    if (Math.abs(diffX) > 18) {
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
    const threshold = Math.min(100, bannerWidth * 0.12);

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
  };

  heroContainer.addEventListener('click', (e) => {
    if (heroDragState.hasMoved) {
      // Never block clicks on interactive buttons
      if (e.target.closest('.btn-hero-play, .btn-hero-more, button, a')) return;
      e.preventDefault();
      e.stopPropagation();
      heroDragState.hasMoved = false;
    }
  }, true);

  heroContainer.addEventListener('dragstart', (e) => e.preventDefault());
  heroContainer.addEventListener('mousedown', onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);

  heroContainer.addEventListener('touchstart', onDragStart, { passive: true });
  heroContainer.addEventListener('touchmove', onDragMove, { passive: false });
  heroContainer.addEventListener('touchend', onDragEnd);
  heroContainer.addEventListener('touchcancel', onDragEnd);
}

function updateHeroBannerPosition() {
  const heroTrack = document.getElementById('heroTrack');
  const dots = document.querySelectorAll('.hero-dot');
  const slides = document.querySelectorAll('.hero-slide');
  if (!heroTrack || slides.length === 0) return;

  heroTrack.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
  heroTrack.style.transform = `translateX(-${state.heroIndex * 100}%)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === state.heroIndex);
  });

  updateHeroCounter(state.heroIndex, slides.length);
}

function updateHeroCounter(currentIdx, totalCount) {
  const counterEl = document.getElementById('heroCounter');
  if (counterEl) {
    const cur = String(currentIdx + 1).padStart(2, '0');
    const tot = String(totalCount || 6).padStart(2, '0');
    counterEl.innerHTML = `${cur} <span>/ ${tot}</span>`;
  }
}

function startHeroAutoplay(totalSlides) {
  clearInterval(state.heroTimer);
  state.heroTimer = setInterval(() => {
    changeHeroSlide(1, totalSlides);
  }, 7500);
}

function changeHeroSlide(direction, totalSlides = null) {
  const slides = document.querySelectorAll('.hero-slide');
  const count = totalSlides || slides.length;
  if (count <= 1) return;

  state.heroIndex = (state.heroIndex + direction + count) % count;
  updateHeroBannerPosition();
}

function goToHeroSlide(idx) {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides[idx]) return;

  state.heroIndex = idx;
  updateHeroBannerPosition();
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
      ${[...genresSet].slice(0, 10).map(g => `<button class="pill-btn" data-genre="${g}">${g}</button>`).join('')}
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

  let filtered = MOVIES.filter(m => {
    // Type filter
    if (state.activeType !== 'all') {
      if (state.activeType === 'Anime' && !m.isAnime && !m.genres?.includes('Anime')) return false;
      if (state.activeType === 'Movie' && (m.type === 'TV Show' || m.type === 'Series' || m.seasons)) return false;
      if (state.activeType === 'TV Show' && m.type !== 'TV Show' && m.type !== 'Series' && !m.seasons) return false;
    }

    // Genre filter
    if (state.activeGenre !== 'all') {
      const gStr = Array.isArray(m.genres) ? m.genres.join(' ') : String(m.genres || '');
      if (!gStr.toLowerCase().includes(state.activeGenre.toLowerCase())) return false;
    }

    // Search query
    if (q) {
      const hay = `${m.title} ${m.director || ''} ${Array.isArray(m.cast) ? m.cast.join(' ') : (m.cast || '')} ${m.year || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });

  if (countEl) countEl.textContent = `${filtered.length} Titles`;

  if (grid) {
    if (filtered.length === 0) {
      grid.innerHTML = '';
      empty?.classList.remove('hidden');
    } else {
      empty?.classList.add('hidden');
      grid.innerHTML = filtered.map(m => createCardHTML(m)).join('');
    }
  }
}

// 3. Movies Tab
function renderMoviesTab() {
  const grid = document.getElementById('moviesGrid');
  const countEl = document.getElementById('moviesCount');
  const movies = MOVIES.filter(m => (!m.type || m.type === 'Movie') && !m.isAnime);
  if (countEl) countEl.textContent = `${movies.length} Movies`;
  if (grid) grid.innerHTML = movies.map(m => createCardHTML(m)).join('');
}

// 4. Series Tab
function renderSeriesTab() {
  const grid = document.getElementById('seriesGrid');
  const countEl = document.getElementById('seriesCount');
  const series = MOVIES.filter(m => m.type === 'TV Show' || m.type === 'Series' || m.seasons);
  if (countEl) countEl.textContent = `${series.length} Series`;
  if (grid) grid.innerHTML = series.map(m => createCardHTML(m)).join('');
}

// 5. Anime Tab
function renderAnimeTab() {
  const grid = document.getElementById('animeGrid');
  const countEl = document.getElementById('animeCount');
  const anime = MOVIES.filter(m => m.isAnime || m.genres?.includes('Anime'));
  if (countEl) countEl.textContent = `${anime.length} Anime`;
  if (grid) grid.innerHTML = anime.map(m => createCardHTML(m)).join('');
}

// 6. Live TV Tab
function renderLiveTV() {
  const grid = document.getElementById('liveGrid');
  const channels = window._LIVE_CHANNELS || [];
  if (!grid || channels.length === 0) return;

  grid.innerHTML = channels.map(ch => `
    <div class="live-card" onclick="showToast('Channel stream loading...')">
      <div class="live-icon"><ion-icon name="tv-outline"></ion-icon></div>
      <div>
        <h3 style="font-size: 1.05rem; font-weight: 700; color: #fff;">${ch.name}</h3>
        <p style="font-size: 0.8rem; color: var(--text-dim);">${ch.category} • HD Quality</p>
      </div>
    </div>
  `).join('');
}

// 7. Watchlist Tab
function renderWatchlist() {
  const grid = document.getElementById('watchlistGrid');
  const empty = document.getElementById('watchlistEmpty');
  const countEl = document.getElementById('watchlistCount');

  const favList = MOVIES.filter(m => state.favorites.has(m.id));
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

// Detail Modal
function openDetail(movieId) {
  const movie = MOVIES.find(m => m.id === movieId);
  if (!movie) return;

  state.currentDetail = movie;
  const modal = document.getElementById('detailModal');
  const hero = document.getElementById('detailHero');
  const body = document.getElementById('detailBody');

  if (hero) {
    hero.style.backgroundImage = `url('${movie.backdrop || movie.poster}')`;
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

  const isFav = state.favorites.has(movie.id);

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

// Video.js Instance Handler
let vjsPlayerInstance = null;

function getOrCreateVjsPlayer() {
  if (!vjsPlayerInstance && typeof videojs !== 'undefined') {
    const el = document.getElementById('vjsPlayer');
    if (el) {
      vjsPlayerInstance = videojs('vjsPlayer', {
        controls: true,
        autoplay: true,
        preload: 'auto',
        responsive: true,
        fluid: true,
        playbackRates: [0.5, 1, 1.25, 1.5, 2]
      });
    }
  }
  return vjsPlayerInstance;
}

// Direct Play Video Modal with Multi-Server Streaming
function playMovieDirect(movieId) {
  closeDetail();
  const movie = MOVIES.find(m => m.id === movieId);
  if (!movie) return;

  const playerModal = document.getElementById('playerModal');
  const playerTitle = document.getElementById('playerTitle');
  const iframeEl = document.getElementById('iframeEl');
  const vjs10Player = document.getElementById('vjs10Player');
  const vjs10Media = document.getElementById('vjs10Media');
  const serverSelect = document.getElementById('serverSelect');

  if (playerTitle) playerTitle.textContent = `${movie.title} (${movie.year || '2026'})`;

  const tmdb = movie.tmdbId || movie.videoUrl || '550';
  const isTv = movie.type === 'TV Show' || movie.type === 'Series' || (movie.seasons && movie.seasons.length);

  const hasDirectStream = movie.videoUrl && (movie.videoUrl.endsWith('.m3u8') || movie.videoUrl.endsWith('.mp4'));

  const servers = [];

  if (hasDirectStream) {
    servers.push({
      id: 'vjs10',
      name: '✨ Direct HD Player',
      type: 'vjs10',
      url: movie.videoUrl,
      poster: movie.backdrop || movie.poster || ''
    });
  }

  servers.push(
    { id: 'autoembed', name: '⚡ AutoEmbed Fast Server', type: 'iframe', url: isTv ? `https://player.autoembed.cc/embed/tv/${tmdb}/1/1` : `https://player.autoembed.cc/embed/movie/${tmdb}` },
    { id: 'vidlink', name: '🎬 VidLink Pro (Multi-Audio)', type: 'iframe', url: isTv ? `https://vidlink.pro/tv/${tmdb}/1/1` : `https://vidlink.pro/movie/${tmdb}` },
    { id: 'vidsrc', name: '🌟 VidSrc VIP Stream', type: 'iframe', url: isTv ? `https://vidsrc.to/embed/tv/${tmdb}/1/1` : `https://vidsrc.to/embed/movie/${tmdb}` }
  );

  function switchPlayerSource(srv) {
    if (srv.type === 'vjs10') {
      if (iframeEl) {
        iframeEl.classList.add('hidden');
        iframeEl.src = '';
      }
      if (vjs10Player) {
        vjs10Player.classList.remove('hidden');
        if (srv.poster) vjs10Player.setAttribute('poster', srv.poster);
        if (vjs10Media) {
          vjs10Media.src = srv.url;
          vjs10Media.play().catch(() => {});
        }
      }
    } else {
      if (vjs10Media) {
        vjs10Media.pause();
        vjs10Media.removeAttribute('src');
        vjs10Media.load();
      }
      if (vjs10Player) vjs10Player.classList.add('hidden');
      if (iframeEl) {
        iframeEl.classList.remove('hidden');
        iframeEl.src = srv.url;
      }
    }
  }

  if (serverSelect) {
    serverSelect.innerHTML = servers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    serverSelect.onchange = () => {
      const selected = servers.find(s => s.id === serverSelect.value);
      if (selected) switchPlayerSource(selected);
    };
  }

  // Automatically start with Server 1 (AutoEmbed / Direct stream)
  switchPlayerSource(servers[0]);

  playerModal?.classList.remove('hidden');
}

function closePlayer() {
  const playerModal = document.getElementById('playerModal');
  const iframeEl = document.getElementById('iframeEl');
  const vjs10Media = document.getElementById('vjs10Media');
  if (iframeEl) iframeEl.src = '';
  if (vjs10Media) vjs10Media.pause();
  playerModal?.classList.add('hidden');
}

// Global Event Listeners & Immediate Start
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

startApp();
window.addEventListener('load', startApp);

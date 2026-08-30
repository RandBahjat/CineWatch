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

// Catalog Initialization
function initCatalog() {
  const movies = window._MOVIES_DATA || [];
  const series = window._SERIES_DATA || [];
  const anime = window._ANIME_DATA || [];

  MOVIES = [...movies, ...series, ...anime];
  MOVIES.forEach(m => {
    if (!m.id) {
      m.id = m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + (m.year ? '-' + m.year : '');
    }
    if ((m.type === 'TV Show' || m.type === 'Series') && m.seasons && m.seasons.length) {
      m.duration = `${m.seasons.length} Season${m.seasons.length > 1 ? 's' : ''}`;
    }
  });

  // Hide splash
  setTimeout(() => {
    document.getElementById('splash')?.classList.add('hidden');
  }, 400);

  renderHome();
  renderExplore();
  renderMoviesTab();
  renderSeriesTab();
  renderAnimeTab();
  renderLiveTV();
  renderWatchlist();
}

// Navigation & Tab Switching
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

  // Hero controls
  document.getElementById('heroPrevBtn')?.addEventListener('click', () => changeHeroSlide(-1));
  document.getElementById('heroNextBtn')?.addEventListener('click', () => changeHeroSlide(1));
}

function switchTab(tabId) {
  state.currentTab = tabId;
  
  // Update sidebar & bottom nav buttons
  document.querySelectorAll('.nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });

  // Switch tab panels
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('active', p.id === `panel-${tabId}`);
  });

  // Scroll to top
  const main = document.getElementById('appView');
  if (main) main.scrollTop = 0;
}

// Toast Notification
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2400);
}

// Render Card HTML with 3D Hover & Shimmer
function createCardHTML(m, rankNum = null) {
  const isFav = state.favorites.has(m.id);
  return `
    <div class="card" onclick="openDetail('${m.id}')">
      <div class="card-poster">
        <img src="${m.poster || m.backdrop}" alt="${m.title}" loading="lazy" />
        <div class="card-badge"><ion-icon name="star"></ion-icon> ${m.rating || 'N/A'}</div>
        ${rankNum ? `<div class="card-top10-num">${rankNum}</div>` : ''}
        <div class="card-overlay">
          <div class="card-play-icon"><ion-icon name="play"></ion-icon></div>
        </div>
      </div>
      <div class="card-info">
        <div class="card-title">${m.title}</div>
        <div class="card-sub">${m.year || ''} • ${m.type || (m.seasons ? 'Series' : 'Movie')}</div>
      </div>
    </div>
  `;
}

// 1. Home Tab Rendering
function renderHome() {
  const heroFeatured = MOVIES.filter(m => FEATURED_TITLES.includes(m.title)).slice(0, 6);
  const heroTrack = document.getElementById('heroTrack');
  const heroDots = document.getElementById('heroDots');

  if (heroTrack && heroFeatured.length > 0) {
    heroTrack.innerHTML = heroFeatured.map((m, idx) => {
      const isFav = state.favorites.has(m.id);
      const genreText = Array.isArray(m.genres) ? m.genres.slice(0, 3).join(' • ') : (m.genres || 'Action • Sci-Fi');
      return `
        <div class="hero-slide ${idx === 0 ? 'active' : ''}" style="background-image: url('${m.backdrop || m.poster}')" onclick="openDetail('${m.id}')">
          <div class="hero-content" onclick="event.stopPropagation()">
            <div class="hero-badge-row">
              <span class="hero-badge-trending"><ion-icon name="flame"></ion-icon> #1 Trending</span>
              <span class="hero-quality-pill">4K ULTRA HD</span>
              <span class="hero-quality-pill">DOLBY ATMOS</span>
            </div>
            
            <h1 class="hero-title">${m.title}</h1>
            
            <div class="hero-meta-row">
              <span class="hero-rating-badge"><ion-icon name="star"></ion-icon> ${m.rating || '8.8'}</span>
              <span class="hero-meta-divider">•</span>
              <span>${m.year || '2026'}</span>
              <span class="hero-meta-divider">•</span>
              <span>${m.duration || '2h 20m'}</span>
              <span class="hero-meta-divider">•</span>
              <span>${genreText}</span>
            </div>

            <p class="hero-overview">${m.description || 'Experience this blockbuster cinema release in full Ultra HD quality with crystal-clear audio and lightning-fast multi-server streaming.'}</p>
            
            <div class="hero-actions-row">
              <button class="btn btn-primary" onclick="playMovieDirect('${m.id}')"><ion-icon name="play"></ion-icon> Watch Now</button>
              <button class="btn btn-secondary" onclick="openDetail('${m.id}')"><ion-icon name="information-circle-outline"></ion-icon> Details</button>
              <button class="btn btn-icon-only" title="${isFav ? 'Remove from Watchlist' : 'Add to Watchlist'}" onclick="toggleFavorite('${m.id}', event)">
                <ion-icon name="${isFav ? 'heart' : 'heart-outline'}" style="color: ${isFav ? 'var(--primary)' : 'inherit'};"></ion-icon>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (heroDots) {
      heroDots.innerHTML = heroFeatured.map((_, idx) => `
        <div class="hero-dot ${idx === 0 ? 'active' : ''}" onclick="goToHeroSlide(${idx})"></div>
      `).join('');
    }

    updateHeroCounter(0, heroFeatured.length);
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
  }, 7000);
}

function changeHeroSlide(direction, totalSlides = null) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const count = totalSlides || slides.length;
  if (count <= 1) return;

  slides[state.heroIndex]?.classList.remove('active');
  dots[state.heroIndex]?.classList.remove('active');

  state.heroIndex = (state.heroIndex + direction + count) % count;

  slides[state.heroIndex]?.classList.add('active');
  dots[state.heroIndex]?.classList.add('active');
  updateHeroCounter(state.heroIndex, count);
}

function goToHeroSlide(idx) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides[idx]) return;

  slides[state.heroIndex]?.classList.remove('active');
  dots[state.heroIndex]?.classList.remove('active');

  state.heroIndex = idx;

  slides[state.heroIndex]?.classList.add('active');
  dots[state.heroIndex]?.classList.add('active');
  updateHeroCounter(state.heroIndex, slides.length);
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
  if (!grid || typeof LIVE_CHANNELS === 'undefined') return;

  grid.innerHTML = LIVE_CHANNELS.map(ch => `
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

// Direct Play Video Modal
function playMovieDirect(movieId) {
  closeDetail();
  const movie = MOVIES.find(m => m.id === movieId);
  if (!movie) return;

  const playerModal = document.getElementById('playerModal');
  const playerTitle = document.getElementById('playerTitle');
  const iframeEl = document.getElementById('iframeEl');
  const serverSelect = document.getElementById('serverSelect');

  if (playerTitle) playerTitle.textContent = `${movie.title} (${movie.year || '2026'})`;

  // Streaming Server Endpoints
  const servers = [
    { name: 'AutoEmbed Server (Fast)', url: `https://player.autoembed.cc/embed/movie/${movie.tmdbId || '550'}` },
    { name: 'VidLink Pro (Multi-Audio)', url: `https://vidlink.pro/movie/${movie.tmdbId || '550'}` },
    { name: 'VidSrc VIP', url: `https://vidsrc.to/embed/movie/${movie.tmdbId || '550'}` },
    { name: 'ZXC Stream', url: `https://stream.zxc.pm/movie/${movie.tmdbId || '550'}` }
  ];

  if (serverSelect) {
    serverSelect.innerHTML = servers.map((s, i) => `<option value="${s.url}">${s.name}</option>`).join('');
    serverSelect.onchange = () => {
      if (iframeEl) iframeEl.src = serverSelect.value;
    };
  }

  if (iframeEl) {
    iframeEl.classList.remove('hidden');
    iframeEl.src = servers[0].url;
  }

  playerModal?.classList.remove('hidden');
}

function closePlayer() {
  const playerModal = document.getElementById('playerModal');
  const iframeEl = document.getElementById('iframeEl');
  if (iframeEl) iframeEl.src = '';
  playerModal?.classList.add('hidden');
}

// Global Event Listeners
document.addEventListener('DOMContentLoaded', () => {
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
});

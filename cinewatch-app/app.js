/**
 * CineWatch Mobile/Desktop Standalone App Logic
 */

// Featured title lists for hero / top 10
const FEATURED_TITLES = ["The Whisper Man", "Grand Theft Auto VI: An Extended Look", "Mousetrap", "Batman: Knightfall Part 1: Knightfall", "Mutiny", "Reacher", "Lanterns", "Lioness", "Spider-Man: Brand New Day", "The Odyssey"];
const TOP_10_TITLES = ["Grand Theft Auto VI: An Extended Look", "Motor City", "Mutiny", "Batman: Knightfall Part 1: Knightfall", "Reacher", "The Last Sunrise", "Spider-Man: Brand New Day", "Lanterns", "The Odyssey", "Toy Story 5"];
const TRENDING_MOVIES_TITLES = ["Batman: Knightfall Part 1: Knightfall", "Mutiny", "Spider-Man: Brand New Day", "The Odyssey", "Motor City", "Toy Story 5", "Obsession", "Minions & Monsters", "Project Hail Mary"];
const TRENDING_SERIES_TITLES = ["Lanterns", "Reacher", "Lucky", "Silo", "One Piece", "Ted Lasso", "X-Men '97", "Lioness", "Outer Banks"];

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
function toggleFavorite(id) {
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
    showToast('Removed from Watchlist');
  } else {
    state.favorites.add(id);
    showToast('Added to Watchlist');
  }
  saveFavorites();
  renderWatchlist();
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
  renderLiveTV();
  renderAnime();
  renderWatchlist();
}

// UI Navigation & Tab Switching
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.onclick = () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    };
  });

  document.getElementById('searchBtn')?.addEventListener('click', () => switchTab('explore'));
  document.getElementById('menuBtn')?.addEventListener('click', () => showToast('CineWatch App v1.0'));
}

function switchTab(tabId) {
  state.currentTab = tabId;
  document.querySelectorAll('.nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('active', p.id === `panel-${tabId}`);
  });

  // Reset scroll
  const main = document.getElementById('appView');
  if (main) main.scrollTop = 0;
}

// Toast
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

// Render Card HTML
function createCardHTML(m, rankNum = null) {
  const isFav = state.favorites.has(m.id);
  return `
    <div class="card" onclick="openDetail('${m.id}')">
      <div class="card-poster">
        <img src="${m.poster || m.backdrop}" alt="${m.title}" loading="lazy" />
        <div class="card-badge"><ion-icon name="star"></ion-icon> ${m.rating || 'N/A'}</div>
        ${rankNum ? `<div class="card-top10-num">${rankNum}</div>` : ''}
      </div>
      <div class="card-title">${m.title}</div>
      <div class="card-sub">${m.year || ''} • ${m.type || 'Movie'}</div>
    </div>
  `;
}

// Render Home Tab
function renderHome() {
  // 1. Hero Carousel
  const heroFeatured = MOVIES.filter(m => FEATURED_TITLES.includes(m.title)).slice(0, 6);
  const heroTrack = document.getElementById('heroTrack');
  const heroDots = document.getElementById('heroDots');

  if (heroTrack && heroFeatured.length > 0) {
    heroTrack.innerHTML = heroFeatured.map(m => `
      <div class="hero-slide" style="background-image: url('${m.backdrop || m.poster}')" onclick="openDetail('${m.id}')">
        <div class="hero-content">
          <span class="hero-badge">Featured</span>
          <h2 class="hero-title">${m.title}</h2>
          <div class="hero-meta">
            <span class="rating"><ion-icon name="star"></ion-icon> ${m.rating}</span>
            <span>•</span>
            <span>${m.year}</span>
            <span>•</span>
            <span>${m.duration || m.age || ''}</span>
          </div>
          <div class="hero-actions" onclick="event.stopPropagation()">
            <button class="btn btn-primary" onclick="playMovieDirect('${m.id}')"><ion-icon name="play"></ion-icon> Play</button>
            <button class="btn btn-secondary" onclick="openDetail('${m.id}')"><ion-icon name="information-circle-outline"></ion-icon> Info</button>
          </div>
        </div>
      </div>
    `).join('');

    heroDots.innerHTML = heroFeatured.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}"></div>`).join('');

    // Auto rotate
    if (state.heroTimer) clearInterval(state.heroTimer);
    state.heroTimer = setInterval(() => {
      state.heroIndex = (state.heroIndex + 1) % heroFeatured.length;
      heroTrack.style.transform = `translateX(-${state.heroIndex * 100}%)`;
      document.querySelectorAll('.hero-dots .dot').forEach((d, i) => d.classList.toggle('active', i === state.heroIndex));
    }, 6000);
  }

  // 2. Shelves
  const shelvesContainer = document.getElementById('homeShelves');
  if (!shelvesContainer) return;

  const top10 = MOVIES.filter(m => TOP_10_TITLES.includes(m.title)).slice(0, 10);
  const trendingMovies = MOVIES.filter(m => TRENDING_MOVIES_TITLES.includes(m.title) && m.type !== 'TV Show').slice(0, 12);
  const trendingSeries = MOVIES.filter(m => TRENDING_SERIES_TITLES.includes(m.title) && (m.type === 'TV Show' || m.type === 'Series')).slice(0, 12);
  const kurdishDubbed = MOVIES.filter(m => m.overviewKurdish && m.overviewKurdish.trim().length > 0).slice(0, 12);

  shelvesContainer.innerHTML = `
    <!-- Top 10 Shelf -->
    <div class="shelf">
      <div class="shelf-head">
        <div class="shelf-title">Top 10 Today</div>
      </div>
      <div class="shelf-track">
        ${top10.map((m, idx) => createCardHTML(m, idx + 1)).join('')}
      </div>
    </div>

    <!-- Trending Movies -->
    <div class="shelf">
      <div class="shelf-head">
        <div class="shelf-title">Trending Movies</div>
      </div>
      <div class="shelf-track">
        ${trendingMovies.map(m => createCardHTML(m)).join('')}
      </div>
    </div>

    <!-- Trending Series -->
    <div class="shelf">
      <div class="shelf-head">
        <div class="shelf-title">Trending Series</div>
      </div>
      <div class="shelf-track">
        ${trendingSeries.map(m => createCardHTML(m)).join('')}
      </div>
    </div>

    <!-- Kurdish Dubbed / Subbed Shelf -->
    <div class="shelf">
      <div class="shelf-head">
        <div class="shelf-title">Kurdish Translated</div>
      </div>
      <div class="shelf-track">
        ${kurdishDubbed.map(m => createCardHTML(m)).join('')}
      </div>
    </div>
  `;
}

// Render Explore Tab
function renderExplore() {
  const input = document.getElementById('searchInput');
  const chips = document.querySelectorAll('#filterChips .chip');
  const genreContainer = document.getElementById('genreChips');
  const grid = document.getElementById('resultsGrid');
  const empty = document.getElementById('exploreEmpty');

  // Populate genres
  const genres = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"];
  if (genreContainer) {
    genreContainer.innerHTML = `<button class="chip ${state.activeGenre === 'all' ? 'active' : ''}" data-genre="all">All Genres</button>` +
      genres.map(g => `<button class="chip ${state.activeGenre === g ? 'active' : ''}" data-genre="${g}">${g}</button>`).join('');

    genreContainer.querySelectorAll('.chip').forEach(btn => {
      btn.onclick = () => {
        state.activeGenre = btn.dataset.genre;
        genreContainer.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.genre === state.activeGenre));
        filterExplore();
      };
    });
  }

  chips.forEach(btn => {
    btn.onclick = () => {
      state.activeType = btn.dataset.type;
      chips.forEach(c => c.classList.toggle('active', c.dataset.type === state.activeType));
      filterExplore();
    };
  });

  if (input) {
    input.oninput = () => filterExplore();
  }

  filterExplore();

  function filterExplore() {
    const q = (input?.value || '').toLowerCase().trim();
    let list = MOVIES.filter(m => {
      // Type check
      if (state.activeType === 'Movie' && (m.type === 'TV Show' || m.isAnime)) return false;
      if (state.activeType === 'TV Show' && (m.type !== 'TV Show' || m.isAnime)) return false;
      if (state.activeType === 'Anime' && !m.isAnime) return false;

      // Genre check
      if (state.activeGenre !== 'all' && (!m.genres || !m.genres.includes(state.activeGenre))) return false;

      // Query check
      if (q) {
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchCast = m.cast && m.cast.some(c => c.toLowerCase().includes(q));
        const matchDir = m.director && m.director.toLowerCase().includes(q);
        return matchTitle || matchCast || matchDir;
      }

      return true;
    });

    if (grid) grid.innerHTML = list.map(m => createCardHTML(m)).join('');
    if (empty) empty.classList.toggle('hidden', list.length > 0);
  }
}

// Render Live TV Tab
function renderLiveTV() {
  const grid = document.getElementById('liveGrid');
  if (!grid || !window._LIVE_CHANNELS) return;

  grid.innerHTML = window._LIVE_CHANNELS.map(ch => `
    <div class="channel-card ${ch.live ? 'live-now' : ''}" onclick="showToast('Starting stream for ${ch.name}…')">
      <div class="channel-icon">${ch.icon}</div>
      <div class="channel-name">${ch.name}</div>
      <div class="channel-cat">${ch.category}</div>
    </div>
  `).join('');
}

// Render Anime Tab
function renderAnime() {
  const grid = document.getElementById('animeGrid');
  if (!grid) return;
  const animeList = MOVIES.filter(m => m.isAnime || (m.genres && m.genres.includes('Animation')));
  grid.innerHTML = animeList.map(m => createCardHTML(m)).join('');
}

// Render Watchlist Tab
function renderWatchlist() {
  const grid = document.getElementById('watchlistGrid');
  const empty = document.getElementById('watchlistEmpty');
  if (!grid) return;

  const favList = MOVIES.filter(m => state.favorites.has(m.id));
  grid.innerHTML = favList.map(m => createCardHTML(m)).join('');
  if (empty) empty.classList.toggle('hidden', favList.length > 0);
}

// Detail Modal
function openDetail(id) {
  const movie = MOVIES.find(m => m.id === id);
  if (!movie) return;

  state.currentDetail = movie;
  const modal = document.getElementById('detailModal');
  const hero = document.getElementById('detailHero');
  const body = document.getElementById('detailBody');

  if (!modal || !hero || !body) return;

  hero.style.backgroundImage = `url('${movie.backdrop || movie.poster}')`;

  const isFav = state.favorites.has(movie.id);

  body.innerHTML = `
    <div class="detail-title">${movie.title}</div>
    <div class="detail-meta">
      <span style="color:#ffb703; font-weight:700;">★ ${movie.rating || 'N/A'}</span>
      <span>•</span>
      <span>${movie.year || ''}</span>
      <span>•</span>
      <span>${movie.duration || movie.age || ''}</span>
      <span>•</span>
      <span>${(movie.genres || []).join(', ')}</span>
    </div>
    <div class="detail-actions">
      <button class="btn btn-primary" onclick="playMovieDirect('${movie.id}')"><ion-icon name="play"></ion-icon> Watch Now</button>
      <button class="btn btn-secondary" id="favToggleBtn" onclick="toggleFavoriteDetail('${movie.id}')">
        <ion-icon name="${isFav ? 'heart' : 'heart-outline'}"></ion-icon> ${isFav ? 'Saved' : 'Watchlist'}
      </button>
    </div>
    <p class="detail-overview">${movie.overviewKurdish || movie.overview || 'No overview available.'}</p>

    ${(movie.type === 'TV Show' || movie.type === 'Series') && movie.seasons && movie.seasons.length ? renderEpisodesUI(movie) : ''}
  `;

  document.getElementById('detailClose').onclick = closeDetail;
  modal.classList.remove('hidden');
}

function toggleFavoriteDetail(id) {
  toggleFavorite(id);
  const btn = document.getElementById('favToggleBtn');
  if (btn) {
    const isFav = state.favorites.has(id);
    btn.innerHTML = `<ion-icon name="${isFav ? 'heart' : 'heart-outline'}"></ion-icon> ${isFav ? 'Saved' : 'Watchlist'}`;
  }
}

function closeDetail() {
  document.getElementById('detailModal')?.classList.add('hidden');
}

function renderEpisodesUI(movie) {
  const initialSeason = movie.seasons[0];
  return `
    <div class="episodes-section">
      <div class="episodes-head">
        <div class="shelf-title">Episodes</div>
        <select class="season-select" id="seasonSelect" onchange="switchSeason(this.value)">
          ${movie.seasons.map(s => `<option value="${s.season}">Season ${s.season}</option>`).join('')}
        </select>
      </div>
      <div class="episodes-list" id="episodesList">
        ${renderEpisodesList(movie, initialSeason.season)}
      </div>
    </div>
  `;
}

function renderEpisodesList(movie, seasonNum) {
  const season = movie.seasons.find(s => s.season == seasonNum) || movie.seasons[0];
  if (!season || !season.episodes) return '<p>No episodes available.</p>';

  return season.episodes.map(ep => {
    const mediaId = movie.cinesrcId || movie.videoUrl;
    const absEp = ep.absoluteEpisode || '';
    const aniId = movie.anilistId || '';
    const token = `tv_embed:${mediaId}:${season.season}:${ep.episode}:${absEp}:${aniId}`;
    const title = `${movie.title} - S${season.season} E${ep.episode}: ${ep.title}`;

    return `
      <div class="episode-row" onclick="playStreamToken('${token}', '${title.replace(/'/g, "\\'")}', '${movie.id}')">
        <img class="ep-thumb" src="${ep.thumbnail || movie.backdrop || movie.poster}" alt="${ep.title}" />
        <div class="ep-info">
          <div class="ep-num">Episode ${ep.episode}</div>
          <div class="ep-title">${ep.title}</div>
        </div>
        <ion-icon name="play-circle-outline" style="font-size:1.5rem; color:var(--accent-neon);"></ion-icon>
      </div>
    `;
  }).join('');
}

function switchSeason(seasonNum) {
  if (!state.currentDetail) return;
  const listEl = document.getElementById('episodesList');
  if (listEl) {
    listEl.innerHTML = renderEpisodesList(state.currentDetail, seasonNum);
  }
}

// Quick-Play Modal Player
function playMovieDirect(id) {
  const movie = MOVIES.find(m => m.id === id);
  if (!movie) return;

  if ((movie.type === 'TV Show' || movie.type === 'Series') && movie.seasons && movie.seasons.length) {
    const s1 = movie.seasons[0];
    const ep1 = s1.episodes[0];
    if (ep1) {
      const mediaId = movie.cinesrcId || movie.videoUrl;
      const token = `tv_embed:${mediaId}:${s1.season}:${ep1.episode}:${ep1.absoluteEpisode || ''}:${movie.anilistId || ''}`;
      playStreamToken(token, `${movie.title} - S${s1.season} E${ep1.episode}`, movie.id);
      return;
    }
  }

  // Single movie
  playStreamData({ type: 'movie', id: movie.videoUrl, parentId: movie.id, title: movie.title });
}

function playStreamToken(token, titleStr, parentId) {
  const parts = token.split(':');
  playStreamData({
    type: 'tv',
    id: parts[1],
    season: parts[2],
    episode: parts[3],
    parentId,
    title: titleStr
  });
}

function playStreamData(data) {
  state.currentStreamData = data;
  const modal = document.getElementById('playerModal');
  const titleEl = document.getElementById('playerTitle');
  const serverSelect = document.getElementById('serverSelect');
  const isAnime = (() => {
    const ref = MOVIES.find(m => m.id === data.parentId || m.videoUrl === data.id);
    return !!(ref?.isAnime || ref?.genres?.includes('Animation'));
  })();

  if (titleEl) titleEl.textContent = data.title || 'Playing Video';

  // Populate servers
  if (serverSelect) {
    if (isAnime) {
      serverSelect.innerHTML = `
        <option value="autoembed">AutoEmbed HD</option>
        <option value="vidlink">VidLink (Multi-Audio)</option>
        <option value="vidsrc-sbs">VidSrc</option>
        <option value="zxcstream">ZXC Stream</option>
        <option value="vidsrc-me">VidSrc ME</option>
        <option value="embvid">EmbVid</option>
      `;
    } else {
      serverSelect.innerHTML = `
        <option value="vaplayer">VAPlayer (Netflix Red)</option>
        <option value="vidsrc-sbs">VidSrc SBS</option>
        <option value="autoembed">AutoEmbed</option>
      `;
    }

    serverSelect.onchange = updatePlayerServer;
  }

  updatePlayerServer();

  document.getElementById('playerClose').onclick = closePlayer;
  modal.classList.remove('hidden');
}

function updatePlayerServer() {
  if (!state.currentStreamData) return;
  const data = state.currentStreamData;
  const server = document.getElementById('serverSelect')?.value || 'vaplayer';
  const iframe = document.getElementById('iframeEl');
  const video = document.getElementById('videoEl');

  if (!iframe) return;

  let url = '';
  if (server === 'vaplayer') {
    url = data.type === 'tv'
      ? `https://vaplayer.ru/embed/tv/${data.id}/${data.season}/${data.episode}?skin=netflix&color=e50914`
      : `https://vaplayer.ru/embed/movie/${data.id}?skin=netflix&color=e50914`;
  } else if (server === 'autoembed') {
    url = data.type === 'tv'
      ? `https://player.autoembed.cc/embed/tv/${data.id}/${data.season}/${data.episode}`
      : `https://player.autoembed.cc/embed/movie/${data.id}`;
  } else if (server === 'vidlink') {
    url = data.type === 'tv'
      ? `https://vidlink.pro/tv/${data.id}/${data.season}/${data.episode}`
      : `https://vidlink.pro/movie/${data.id}`;
  } else if (server === 'zxcstream') {
    url = data.type === 'tv'
      ? `https://player.zxcstream.xyz/embed/tv/${data.id}/${data.season}/${data.episode}`
      : `https://player.zxcstream.xyz/embed/movie/${data.id}`;
  } else if (server === 'vidsrc-me') {
    url = data.type === 'tv'
      ? `https://vidsrc.me/embed/tv/${data.id}/${data.season}/${data.episode}`
      : `https://vidsrc.me/embed/movie/${data.id}`;
  } else if (server === 'embvid') {
    const embKey = 'vm_live_xGHB0XJKZEnGxbsohGJo7P0akb8rsfLD';
    url = data.type === 'tv'
      ? `https://embvid.com/embed/tv/${data.id}/${data.season}/${data.episode}?api_key=${embKey}`
      : `https://embvid.com/embed/movie/${data.id}?api_key=${embKey}`;
  } else {
    url = data.type === 'tv'
      ? `https://vidsrc.sbs/embed/tv/${data.id}/${data.season}/${data.episode}`
      : `https://vidsrc.sbs/embed/movie/${data.id}`;
  }

  video.classList.add('hidden');
  iframe.classList.remove('hidden');
  iframe.src = url;
}

function closePlayer() {
  const iframe = document.getElementById('iframeEl');
  if (iframe) iframe.src = '';
  document.getElementById('playerModal')?.classList.add('hidden');
}

// Global Exports
window.openDetail = openDetail;
window.playMovieDirect = playMovieDirect;
window.playStreamToken = playStreamToken;
window.switchSeason = switchSeason;
window.toggleFavoriteDetail = toggleFavoriteDetail;

// App entry point
document.addEventListener('DOMContentLoaded', () => {
  loadFavorites();
  setupNavigation();
  initCatalog();
});

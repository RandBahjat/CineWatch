// Capture recovery hash immediately before Supabase clears it
if (window.location.hash.includes("type=recovery")) {
  window.CW_PENDING_RECOVERY = true;
}

/**
 * CineWatch - Pure Vanilla JavaScript (ES6+)
 * Feature-rich movie streaming platform logic
 */

// ==========================================
// 1. HIGHLIGHTS & TRENDING
// ==========================================
let FEATURED_TITLES = ["Runner","The Love Hypothesis","One Last Shot","Resident Evil","Neagley","Reacher","The End of Oak Street","Stranger Things: Tales from '85","Slow Horses","City of Blood","Mayday","The Runner","Coyote vs. Acme","Lanterns","Spider-Man: Brand New Day",
  "Drawn Together"];
let TOP_10_TRENDING_TODAY = ["The Love Hypothesis","One Last Shot",
  "Resident Evil","Brothers","c","Spider-Man: Brand New Day","Heart of the Beast" , "Digger ","Slow Horses", "Lanterns","MobLand"];
let TRENDING_THIS_WEEK_MOVIES = ["Resident Evil","The End of Oak Street","Spider-Man: Brand New Day", "The Odysessey", "Toy Story 5", "Obsession", "The Love Hypothesis", "Moana(2026)", "One Last Shot", "Digger", "The Rivals of Amziah King", "Backrooms", "You+Me â€“ Against the World", "Coyote vs. Acme", "Just Play Dead"];
let TRENDING_THIS_WEEK_SERIES = ["Monster: The Lizzie Borden Story","MobLand","Neagley", "Reacher", "Lioness", "Lanterns", "Slow Horses", "One Piece", "Ted Lasso","City of Blood", "Stranger Things: Tales from '85", "Silo"];
const POPULAR_MOVIES = ["Spider-Man: Brand New Day","Resident Evil","The End of Oak Street","Coyote vs. Acme","The Odysessey","Mutiny", "Moana(2026)", "The Runner","Obsession", "Spider-Man: No Way Home","Backrooms", "Disclosure Day", "The Death of Robin Hood", "The Last House","Drawn Together", "Michael", "Project Hail Mary","Avatar Aang: The Last Airbender","The Shawshank Redemption"];
const POPULAR_SERIES = ["MobLand (The Donovans)", "Star Trek: Strange New Worlds", "Slow Horses", "Reacher","The Mentalist","The Gentlemen", "Breaking Bad","Law & Order: Special Victims Unit", "Ted Lasso","House", "Lucky", "Off Campus", "Silo", "Game of Thrones", "The Sopranos", "Stranger Things", "The Boys","The Rookie","The Good Doctor","Dexter","From","S.W.A.T.","The Walking Dead","Stranger Things"];
let UPCOMING_MOVIES = ["Avengers: Doomsday","Digger"];

// Expose globally so apps & modules can sync seamlessly with movie.js
window.FEATURED_TITLES = FEATURED_TITLES;
window.TOP_10_TRENDING_TODAY = TOP_10_TRENDING_TODAY;
window.TRENDING_THIS_WEEK_MOVIES = TRENDING_THIS_WEEK_MOVIES;
window.TRENDING_THIS_WEEK_SERIES = TRENDING_THIS_WEEK_SERIES;
window.POPULAR_MOVIES = POPULAR_MOVIES;
window.POPULAR_SERIES = POPULAR_SERIES;
window.UPCOMING_MOVIES = UPCOMING_MOVIES;

// ==========================================
// 2. MOVIE DATABASE
// ==========================================
let MOVIES = [];

function extractYouTubeId(urlOrId) {
  if (!urlOrId) return null;
  const str = String(urlOrId).trim();
  if (!str) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
  const match = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  return match && match[1] ? match[1] : null;
}

function translateGenre(genre) {
  const cookies = document.cookie || '';
  const isSorani = cookies.includes('googtrans=/en/ckb');
  const isArabic = cookies.includes('googtrans=/en/ar');
  if (isSorani) {
    if (genre === 'all') return 'Ù‡Û•Ù…ÙˆÙˆ Ø¬Û†Ø±Û•Ú©Ø§Ù†';
    if (genre === 'Action') return 'Ø¦Ø§Ú©Ø´Ù†';
    if (genre === 'Adventure') return 'Ø³Û•Ø±Ú©ÛŽØ´ÛŒ';
    if (genre === 'Animation') return 'Ø¦Û•Ù†ÛŒÙ…Û•ÛŒØ´Ù†';
    if (genre === 'Comedy') return 'Ú©Û†Ù…ÛŒØ¯ÛŒ';
    if (genre === 'Crime') return 'ØªØ§ÙˆØ§Ù†Ú©Ø§Ø±ÛŒ';
    if (genre === 'Drama') return 'Ø¯Ø±Ø§Ù…Ø§';
    if (genre === 'Family') return 'Ø®ÛŽØ²Ø§Ù†ÛŒ';
    if (genre === 'Kids') return 'Ù…Ù†Ø¯Ø§ÚµØ§Ù†';
    if (genre === 'History') return 'Ù…ÛŽÚ˜ÙˆÙˆÛŒÛŒ';
    if (genre === 'Fantasy') return 'ÙØ§Ù†ØªØ§Ø²ÛŒØ§';
    if (genre === 'Horror') return 'ØªØ±Ø³Ù†Ø§Ú©';
    if (genre === 'Mystery') return 'Ù†Ù‡ÛŽÙ†ÛŒ';
    if (genre === 'Romance') return 'Ú•Û†Ù…Ø§Ù†Ø³ÛŒ';
    if (genre === 'Sci-Fi' || genre === 'Science-Fiction' || genre === 'Science Fiction') return 'Ø®Û•ÛŒØ§ÚµÛŒ Ø²Ø§Ù†Ø³ØªÛŒ';
    if (genre === 'Thriller') return 'Ù‡Û•Ø³ØªØ¨Ø²ÙˆÛŽÙ†';
    if (genre === 'War') return 'Ø¬Û•Ù†Ú¯';
  }
  if (isArabic) {
    if (genre === 'all') return 'Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø£Ù†ÙˆØ§Ø¹';
    if (genre === 'Action') return 'Ø£ÙƒØ´Ù†';
    if (genre === 'Adventure') return 'Ù…ØºØ§Ù…Ø±Ø©';
    if (genre === 'Animation') return 'Ø±Ø³ÙˆÙ… Ù…ØªØ­Ø±ÙƒØ©';
    if (genre === 'Comedy') return 'ÙƒÙˆÙ…ÙŠØ¯ÙŠØ§';
    if (genre === 'Crime') return 'Ø¬Ø±ÙŠÙ…Ø©';
    if (genre === 'Drama') return 'Ø¯Ø±Ø§Ù…Ø§';
    if (genre === 'Family') return 'Ø¹Ø§Ø¦Ù„ÙŠ';
    if (genre === 'Kids') return 'Ø£Ø·ÙØ§Ù„';
    if (genre === 'History') return 'ØªØ§Ø±ÙŠØ®ÙŠ';
    if (genre === 'Fantasy') return 'ÙØ§Ù†ØªØ§Ø²ÙŠØ§';
    if (genre === 'Horror') return 'Ø±Ø¹Ø¨';
    if (genre === 'Mystery') return 'ØºÙ…ÙˆØ¶';
    if (genre === 'Romance') return 'Ø±ÙˆÙ…Ø§Ù†Ø³ÙŠ';
    if (genre === 'Sci-Fi' || genre === 'Science-Fiction' || genre === 'Science Fiction') return 'Ø®ÙŠØ§Ù„ Ø¹Ù„Ù…ÙŠ';
    if (genre === 'Thriller') return 'Ø¥Ø«Ø§Ø±Ø©';
    if (genre === 'War') return 'Ø­Ø±Ø¨';
  }
  return genre;
}

function formatNumber(val) {
  if (val == null) return '';
  const str = String(val);
  const cookies = document.cookie || '';
  const isSorani = cookies.includes('googtrans=/en/ckb');
  if (!isSorani) return str;
  return str.replace(/[0-9]/g, d => 'Ù Ù¡Ù¢Ù£Ù¤Ù¥Ù¦Ù§Ù¨Ù©'[d]);
}

function formatMediaType(type) {
  const cookies = document.cookie || '';
  const isCkb = cookies.includes('googtrans=/en/ckb');
  const isAr = cookies.includes('googtrans=/en/ar');
  if (isCkb) {
    if (type === 'TV Show' || type === 'Series') return 'Ø²Ù†Ø¬ÛŒØ±Û•';
    if (type === 'Anime') return 'Ø¦Û•Ù†ÛŒÙ…ÛŽ';
    return 'ÙÛŒÙ„Ù…';
  }
  if (isAr) {
    if (type === 'TV Show' || type === 'Series') return 'Ù…Ø³Ù„Ø³Ù„';
    if (type === 'Anime') return 'Ø£Ù†Ù…ÙŠ';
    return 'ÙÙŠÙ„Ù…';
  }
  return type;
}

function getLocalizedTitle(item) {
  if (!item) return { text: "", isKurdish: true };
  return { text: item.title || "", isKurdish: true };
}

function formatRating(rating) {
  if (rating === null || rating === undefined || rating === '') return '';
  const str = String(rating).trim();
  if (!str) return '';
  // If it's a non-numeric string (e.g. "TBR", "TBD", "NR", etc.), show it exactly as written in code
  if (isNaN(Number(str))) {
    return str;
  }
  const cookies = document.cookie || '';
  const isSorani = cookies.includes('googtrans=/en/ckb');
  if (!isSorani) return str;
  // Convert digits to Kurdish / Eastern-Arabic numerals: Ù Ù¡Ù¢Ù£Ù¤Ù¥Ù¦Ù§Ù¨Ù©
  return str.replace(/[0-9]/g, d => 'Ù Ù¡Ù¢Ù£Ù¤Ù¥Ù¦Ù§Ù¨Ù©'[d]);
}

function getLocalizedOverview(item) {
  if (!item) return { text: "", isKurdish: false };
  const cookies = document.cookie || '';
  const isSorani = cookies.includes('googtrans=/en/ckb');
  if (isSorani && item.overviewKurdish) {
    return { text: item.overviewKurdish, isKurdish: true };
  }
  return { text: item.overview || "", isKurdish: false };
}

function setOverviewElement(el, info) {
  if (!el) return;
  if (info && info.text) {
    el.textContent = info.text;
    el.classList.remove("hidden");
    if (info.isKurdish) {
      el.classList.add("notranslate");
      el.setAttribute("translate", "no");
    } else {
      el.classList.remove("notranslate");
      el.removeAttribute("translate");
    }
  } else {
    el.classList.add("hidden");
  }
}

function matchMediaTitle(item, query) {
  if (!item || !query) return false;
  const q = String(query).trim().toLowerCase();
  const rawTitle = String(item.title || '').trim().toLowerCase();
  const itemYear = item.year ? String(item.year).trim() : '';
  const itemId = item.id ? String(item.id).trim().toLowerCase() : '';

  // 1. Direct ID match: "moana-2026"
  if (itemId && itemId === q) return true;

  // 2. Extract 4-digit year from query if specified (e.g. 19xx or 20xx)
  // Supports formats like: "Moana(2026)", "Moana (2026)", "Moana 2026", "Moana [2026]", "Moana-2026"
  const yearMatch = q.match(/(?:^|[^\d])(19\d\d|20\d\d)(?:[^\d]|$)/);
  const queryYear = yearMatch ? yearMatch[1] : null;

  // Clean query title by stripping year and punctuation
  const cleanQueryTitle = q
    .replace(/\s*[\(\[\{]?\s*(19\d\d|20\d\d)\s*[\)\]\}]?\s*/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  // Clean item title
  const cleanItemTitle = rawTitle
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  // Clean item base title (stripping parenthesized subtitles like "(The Donovans)")
  const cleanItemBase = rawTitle
    .replace(/\s*\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  // Normalization for common typos (e.g. whisper vs whispher)
  const normQuery = cleanQueryTitle.replace(/whispher/g, 'whisper');
  const normItem = cleanItemTitle.replace(/whispher/g, 'whisper');
  const normItemBase = cleanItemBase.replace(/whispher/g, 'whisper');

  // If query specifies a year: BOTH title and year must match!
  if (queryYear) {
    if ((normQuery === normItem || (normItemBase && normQuery === normItemBase)) && itemYear === queryYear) return true;
    if (itemId && itemId === (cleanQueryTitle.replace(/\s+/g, '-') + '-' + queryYear)) return true;
    return false;
  }

  // If query does NOT specify a year, match title cleanly
  if (normQuery === normItem || (normItemBase && normQuery === normItemBase) || rawTitle === q) return true;

  return false;
}

function getMediaListIndex(item, list) {
  if (!item || !Array.isArray(list)) return 999;
  for (let i = 0; i < list.length; i++) {
    if (matchMediaTitle(item, list[i])) return i;
  }
  return 999;
}

function findMovieByIdOrTitle(identifier) {
  if (!identifier) return null;
  const raw = String(identifier).trim();
  const lower = raw.toLowerCase();
  const slug = lower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return MOVIES.find(m => 
    m.id === raw ||
    (m.id && m.id.toLowerCase() === lower) ||
    (m.id && m.id.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug) ||
    (m.title && m.title.toLowerCase() === lower) ||
    (m.title && m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug)
  ) || null;
}

function getMoviesFromList(list, filterFn) {
  if (!Array.isArray(list)) return [];
  const results = [];
  const seenIds = new Set();

  list.forEach(query => {
    const match = MOVIES.find(m => {
      const id = m.id || (m.title + '-' + (m.year || ''));
      if (seenIds.has(id)) return false;
      if (filterFn && !filterFn(m)) return false;
      return matchMediaTitle(m, query);
    });
    if (match) {
      seenIds.add(match.id || (match.title + '-' + (match.year || '')));
      results.push(match);
    }
  });

  return results;
}

async function loadMediaFromAPI() {
  try {
    // 1. Load media from local JS files instead of Supabase per user preference
    const localMovies = window._MOVIES_DATA || [];
    const localSeries = window._SERIES_DATA || [];
    const localAnime = window._ANIME_DATA || [];

    MOVIES = [...localMovies, ...localSeries, ...localAnime];

    if (MOVIES.length === 0) {
      console.warn('CineWatch: No media data found in local files.');
    }

    // Apply post-processing
    MOVIES.forEach(m => {
      // Auto-generate a stable id from the title if none exists
      if (!m.id) {
        m.id = m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + (m.year ? '-' + m.year : '');
      }

      // Apply featured/trending from title lists (supports "Title", "Title (Year)", and ID)
      m.featured = FEATURED_TITLES.some(t => matchMediaTitle(m, t));
      m.trending = TRENDING_THIS_WEEK_MOVIES.some(t => matchMediaTitle(m, t)) || TRENDING_THIS_WEEK_SERIES.some(t => matchMediaTitle(m, t));

      // Set duration label for series
      if ((m.type === 'TV Show' || m.type === 'Series') && m.seasons && m.seasons.length) {
        m.duration = `${m.seasons.length} Season${m.seasons.length > 1 ? 's' : ''}`;
      }
    });
  } catch (err) {
    console.error('CineWatch: Failed to load media from local files:', err);
  }
}


// ==========================================
// 1b. HERO BANNER SETTINGS  (EDIT THIS SECTION)
// ==========================================
// How long each featured movie stays on screen before rotating (ms).
// Set to a very large number (e.g. 999999999) to effectively disable
// auto-rotation while you're testing edits.
const HERO_ROTATE_INTERVAL_MS = 10000;

// How many cards to show per page in the Movies / Series browse views
const BROWSE_PAGE_SIZE = 20;

// ==========================================
// 2. STATE & STORAGE MANAGEMENT
// ==========================================
var KEYS = {
  USER: "cinewatch_user",
  FAVORITES: "cinewatch_favorites",
  CONTINUE: "cinewatch_continue_watching",
  WATCH_HISTORY: "cinewatch_watch_history",
};

var state = {
  user: null,
  favorites: [],
  continueWatching: {},
  watchHistory: [],
  isCwSelectionMode: false,
  cwSelectedItems: new Set(),
  currentHeroIndex: 0,
  heroInterval: null,
  activeGenre: "all",
  activeView: "home",
  currentPlayingMovie: null,
  episodeSortOrder: "asc",
  // Browse section pagination & filter state
  moviesPage: 1,
  moviesFilter: "all",
  seriesPage: 1,
  seriesFilter: "all",
  animePage: 1,
  animeFilter: "all",
  searchFilter: "all",
};

// initialHeroState no longer needed since we use a physical DOM track

// Storage Helpers
function loadState() {
  try {
    // Clear legacy localStorage user and token so closing tabs requires login
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem("cw_token");

    const savedUser = sessionStorage.getItem(KEYS.USER);
    if (savedUser) state.user = JSON.parse(savedUser);
    if (typeof updateAdsVisibility === 'function') updateAdsVisibility();

    const savedFavs = sessionStorage.getItem(KEYS.FAVORITES) || localStorage.getItem(KEYS.FAVORITES);
    if (savedFavs) state.favorites = JSON.parse(savedFavs);

    const savedContinue = sessionStorage.getItem(KEYS.CONTINUE) || localStorage.getItem(KEYS.CONTINUE);
    if (savedContinue) state.continueWatching = JSON.parse(savedContinue);

    const savedHistory = sessionStorage.getItem(KEYS.WATCH_HISTORY) || localStorage.getItem(KEYS.WATCH_HISTORY);
    if (savedHistory) {
      state.watchHistory = JSON.parse(savedHistory);
    } else if (state.continueWatching && Object.keys(state.continueWatching).length > 0) {
      // Seed from existing continue watching data if present
      state.watchHistory = Object.values(state.continueWatching)
        .filter(it => it && it.movieId)
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .map(it => ({ movieId: it.movieId, timestamp: it.timestamp || Date.now() }));
    } else {
      state.watchHistory = [];
    }
  } catch (e) {
    console.error("Failed to load state from storage", e);
  }
}

function saveUser(userObj) {
  state.user = userObj;
  localStorage.removeItem(KEYS.USER);
  if (userObj) {
    sessionStorage.setItem(KEYS.USER, JSON.stringify(userObj));
  } else {
    sessionStorage.removeItem(KEYS.USER);
    // Clear local data on sign-out so another user doesn't see it
    state.favorites = [];
    state.continueWatching = {};
    sessionStorage.removeItem(KEYS.FAVORITES);
    sessionStorage.removeItem(KEYS.CONTINUE);
    localStorage.removeItem(KEYS.FAVORITES);
    localStorage.removeItem(KEYS.CONTINUE);
  }
  renderUserBadge();
  updateWatchlistBadge();
}

// Listen for Firebase auth state changes (fired by firebase-auth.js)
window.addEventListener("cw:authChanged", async (e) => {
  const { user, cloudData } = e.detail;

  if (user) {
    saveUser(user);

    // Merge cloud data into local state (cloud is the source of truth)
    if (cloudData) {
      if (Array.isArray(cloudData.favorites)) {
        state.favorites = cloudData.favorites;
        localStorage.setItem(KEYS.FAVORITES, JSON.stringify(state.favorites));
      }
      if (cloudData.continueWatching && typeof cloudData.continueWatching === "object") {
        state.continueWatching = cloudData.continueWatching;
        localStorage.setItem(KEYS.CONTINUE, JSON.stringify(state.continueWatching));
      }
    }

    // Only reload if the user actively just logged in (flag set by login/signup form).
    // Do NOT reload on auto-restore (Firebase fires authChanged on every page load
    // when the session is already active â€” that would cause an infinite reload loop).
    if (sessionStorage.getItem("cw_loginPending")) {
      sessionStorage.removeItem("cw_loginPending");
      window.location.reload();
      return;
    }

    // Auto-restore path: just re-render the UI with loaded data
    updateWatchlistBadge();
    renderUserBadge();
    // Only re-render and un-hide home shelves if currently on the Home view
    if (state.activeView === "home") {
      const shelf = document.getElementById("continueWatchingShelf");
      if (shelf) shelf.classList.remove("hidden");
      const wlShelf = document.getElementById("watchlistHomeShelf");
      if (wlShelf) wlShelf.classList.remove("hidden");

      renderContinueWatchingShelf();
      if (typeof renderWatchlistHomeShelf === "function") renderWatchlistHomeShelf();
    }
    if (state.activeView === "watchlist") renderWatchlist();
    if (state.activeView === "continue") renderContinueWatchingPage();
  } else {
    saveUser(null);
    if (state.activeView === "home") {
      renderContinueWatchingShelf();
      if (typeof renderWatchlistHomeShelf === "function") renderWatchlistHomeShelf();
    }
    if (state.activeView === "watchlist") renderWatchlist();
    if (state.activeView === "continue") renderContinueWatchingPage();
  }
});

// Listen for real-time Firestore movies updates (fired by firebase-auth.js)
window.addEventListener("cw:firestoreMoviesUpdated", (e) => {
  const firestoreMovies = e.detail.movies;
  if (!firestoreMovies || firestoreMovies.length === 0) return;

  firestoreMovies.forEach((fMovie) => {
    const idx = MOVIES.findIndex((m) => m.id === fMovie.id);
    if (idx > -1) {
      MOVIES[idx] = { ...MOVIES[idx], ...fMovie };
    } else {
      MOVIES.push(fMovie);
    }
  });
  if (typeof renderCarousels === "function") renderCarousels();
  if (typeof setupHeroBanner === "function") setupHeroBanner();
  if (state.activeView === "home") {
    renderContinueWatchingShelf();
    if (typeof renderWatchlistHomeShelf === "function") renderWatchlistHomeShelf();
  } else if (state.activeView === "watchlist") {
    renderWatchlist();
  } else if (state.activeView === "continue") {
    renderContinueWatchingPage();
  } else if (state.activeView === "genres") {
    renderFilteredGrid(MOVIES, "Explore All Genres");
  }
});

function toggleFavorite(movieId) {
  if (!state.user) {
    showToast("Please log into your account to add to Watchlist!");
    if (typeof openAuthModal === 'function') openAuthModal();
    return false;
  }
  const index = state.favorites.indexOf(movieId);
  let added = false;
  if (index > -1) {
    state.favorites.splice(index, 1);
    showToast("Removed from Watchlist");
  } else {
    state.favorites.push(movieId);
    added = true;
    showToast("â™¥ Added to My Watchlist!");
  }
  localStorage.setItem(KEYS.FAVORITES, JSON.stringify(state.favorites));
  if (window.CW_API && state.user) {
    window.CW_API.syncData(state.favorites, state.continueWatching);
  }
  updateWatchlistBadge();
  refreshAllFavButtons(movieId, added);

  if (state.activeView === "home") {
    if (typeof renderWatchlistHomeShelf === "function") renderWatchlistHomeShelf();
  }
  if (state.activeView === "watchlist") {
    renderWatchlist();
  }
  return added;
}

function isFavorite(movieId) {
  return state.favorites.includes(movieId);
}

function updateContinueWatching(movieId, currentTime, duration) {
  if (!currentTime || currentTime < 5 || !duration) return;

  if (currentTime / duration > 0.95) {
    removeContinueWatching(movieId);
    return;
  }

  state.continueWatching[movieId] = {
    movieId,
    currentTime,
    duration,
    timestamp: Date.now(),
  };
  localStorage.setItem(KEYS.CONTINUE, JSON.stringify(state.continueWatching));
  if (window.CW_API && state.user) {
    window.CW_API.syncData(state.favorites, state.continueWatching);
  }
  recordWatchEvent(movieId);
  renderContinueWatchingShelf();
  if (state.activeView === "continue") {
    renderContinueWatchingPage();
  }
}

function removeContinueWatching(movieId) {
  delete state.continueWatching[movieId];
  localStorage.setItem(KEYS.CONTINUE, JSON.stringify(state.continueWatching));
  if (window.CW_API && state.user) {
    window.CW_API.syncData(state.favorites, state.continueWatching);
  }
  renderContinueWatchingShelf();
  if (state.activeView === "continue") {
    renderContinueWatchingPage();
  }
}

function recordWatchEvent(movieId) {
  if (!movieId || movieId === "_episode_") return;
  try {
    if (!state.watchHistory) state.watchHistory = [];
    // Ensure item moves to top of watch history
    state.watchHistory = state.watchHistory.filter(item => item && item.movieId !== movieId);
    state.watchHistory.unshift({ movieId: movieId, timestamp: Date.now() });
    if (state.watchHistory.length > 50) state.watchHistory = state.watchHistory.slice(0, 50);
    localStorage.setItem(KEYS.WATCH_HISTORY, JSON.stringify(state.watchHistory));
    sessionStorage.setItem(KEYS.WATCH_HISTORY, JSON.stringify(state.watchHistory));
    
    // Live update of Because You Watched shelf
    if (typeof renderBecauseYouWatchedShelf === "function") {
      renderBecauseYouWatchedShelf();
    }
  } catch (e) {
    console.warn("recordWatchEvent error:", e);
  }
}

// ==========================================
// 3. UI RENDERERS & CONTROLLERS
// ==========================================

const SECTION_VIEWS = ['home', 'movies', 'series', 'anime', 'watchlist', 'continue'];

function getSectionUrl(sectionName) {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('v');
    url.searchParams.delete('movie');
    url.searchParams.delete('series');
    if (sectionName === 'home') {
      url.searchParams.delete('section');
      url.searchParams.delete('view');
    } else {
      url.searchParams.delete('view');
      url.searchParams.set('section', sectionName);
    }
    return url.toString();
  } catch (e) {
    return sectionName === 'home' ? './' : `?section=${encodeURIComponent(sectionName)}`;
  }
}

// Clear any stuck loader if page was cached/restored via bfcache
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    const loader = document.getElementById("appLoader");
    if (loader) loader.remove();
    const bar = document.getElementById("cwTopLoadingBar");
    if (bar) {
      bar.classList.remove("active");
      bar.style.width = "0%";
    }
  }
});

async function initApp() {
  const params = new URLSearchParams(window.location.search);
  const targetSection = params.get('section') || params.get('view');
  let isNavigated = false;
  try {
    isNavigated = !!(targetSection && targetSection !== 'home') || !!sessionStorage.getItem('cw_navigated');
  } catch (e) {}

  // If navigating/refreshing sections, kill the splash screen and logo immediately
  if (isNavigated) {
    const loader = document.getElementById("appLoader");
    if (loader) loader.remove();
  }

  const initStartTime = Date.now();
  const MIN_INITIAL_LOAD_TIME = isNavigated ? 0 : 350;

  const dismissLoader = async () => {
    const elapsed = Date.now() - initStartTime;
    const remaining = Math.max(0, MIN_INITIAL_LOAD_TIME - elapsed);
    if (remaining > 0) {
      await new Promise((r) => setTimeout(r, remaining));
    }

    // Complete top loading bar to 100%
    const bar = document.getElementById("cwTopLoadingBar");
    if (bar) {
      bar.style.transition = "width 0.18s ease-out";
      bar.style.width = "100%";
      setTimeout(() => {
        bar.style.opacity = "0";
        setTimeout(() => {
          bar.classList.remove("active");
          bar.style.width = "0%";
          bar.style.transition = "";
        }, 200);
      }, 150);
    }

    const loader = document.getElementById("appLoader");
    if (loader && loader.parentNode) {
      loader.remove();
    }
  };

  try {
    // Bind UI event listeners immediately
    try {
      bindEventListeners();
    } catch (e) {
      console.warn("Event listeners binding warning:", e);
    }

    // Load all movies & series from local data
    await loadMediaFromAPI();

    loadState();
    renderUserBadge();
    updateWatchlistBadge();

    // Render default catalog carousels
    renderCarousels();

    // Check for target section parameter from full-page reload
    const params = new URLSearchParams(window.location.search);
    const targetSection = params.get('section') || params.get('view');
    if (targetSection && targetSection !== 'home' && SECTION_VIEWS.includes(targetSection)) {
      state.activeView = targetSection;
      _performSwitchView(targetSection);
    } else {
      // Hero Carousel
      setupHeroBanner();

      // Render Home Shelves
      renderContinueWatchingShelf();
      if (typeof renderBecauseYouWatchedShelf === "function") renderBecauseYouWatchedShelf();
      if (typeof renderWatchlistHomeShelf === "function") renderWatchlistHomeShelf();
    }

    // Start hero auto slide (managed by startHeroAutoplay)
  } catch (err) {
    console.error("InitApp error:", err);
  } finally {
    await dismissLoader();

    // Check for deep link (e.g., ?v=spider-noir) and open the movie immediately
    const params = new URLSearchParams(window.location.search);
    const deepLinkMovie = params.get('v');
    if (deepLinkMovie) {
      setTimeout(() => openDetailsModal(deepLinkMovie), 300); // slight delay for smooth UI
    }
  }
}

// Fallback auto-dismiss loader in case of any unhandled condition
setTimeout(() => {
  const bar = document.getElementById("cwTopLoadingBar");
  if (bar && bar.classList.contains("active")) {
    bar.style.transition = "width 0.2s ease-out";
    bar.style.width = "100%";
    setTimeout(() => {
      bar.style.opacity = "0";
      setTimeout(() => {
        bar.classList.remove("active");
        bar.style.width = "0%";
      }, 300);
    }, 200);
  }
  const loader = document.getElementById("appLoader");
  if (loader) {
    loader.classList.add("fade-out");
    setTimeout(() => {
      if (loader && loader.parentNode) loader.remove();
    }, 400);
  }
}, 3000);

function getFeaturedMovies() {
  return getMoviesFromList(FEATURED_TITLES);
}

function setupHeroBanner() {
  const featured = getFeaturedMovies();
  if (featured.length === 0) return;

  const dotsContainer = document.getElementById("heroDots");
  dotsContainer.innerHTML = featured
    .map(
      (m, idx) =>
        `<div class="dot ${idx === 0 ? "active" : ""}" data-index="${idx}"></div>`,
    )
    .join("");

  dotsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("dot")) {
      const idx = parseInt(e.target.dataset.index, 10);
      state.currentHeroIndex = idx;
      updateHeroBanner();
      startHeroAutoplay(); // Reset timer on click
    }
  });

  const heroTrack = document.getElementById("heroTrack");
  if (!heroTrack) return;

  // Extract current language for manual button translations
  const cookies = document.cookie.split(';');
  let currentLang = 'en';
  for (let c of cookies) {
    if (c.trim().startsWith('googtrans=')) {
      const val = c.split('=')[1];
      const parts = val.split('/');
      if (parts.length > 2) currentLang = parts[2];
      break;
    }
  }
  const isSorani = currentLang === 'ckb';
  const isArabic = currentLang === 'ar';

  const playText = isSorani ? 'Ø³Û•ÛŒØ±Ú©Ø±Ø¯Ù†' : (isArabic ? 'ØªØ´ØºÙŠÙ„' : 'Play');
  const moreText = isSorani ? 'Ø²ÛŒØ§ØªØ± Ø¨Ø¨ÛŒÙ†Û•' : (isArabic ? 'Ø¹Ø±Ø¶ Ø§Ù„Ù…Ø²ÙŠØ¯' : 'See More');

  // Generate ALL slides dynamically from featured array
  heroTrack.innerHTML = featured.map((movie, idx) => {
    const backdropUrl = movie.backdrop || movie.poster || "";
    const bgStyle = backdropUrl ? `style="background-image: url('${backdropUrl}')"` : "";
    const genresList = (movie.genres || []).slice(0, 3).map(translateGenre).join(" &bull; ");

    return `
      <div class="hero-slide ${idx === 0 ? 'active' : ''}">
        <div class="hero-bg-image" ${bgStyle}></div>
        <div class="hero-bg-overlay"></div>
        <div class="hero-content">
            <h1 class="hero-title notranslate" translate="no">${movie.title}</h1>
            <div class="hero-meta">
                <span class="meta-rating notranslate" translate="no"><span class="star-icon">&#9733;</span> ${formatRating(movie.rating)}</span>
                <span class="meta-dot">&bull;</span>
                <span class="meta-year notranslate" translate="no">${formatNumber(movie.year)}</span>
                ${genresList ? `<span class="meta-dot">&bull;</span><span class="meta-genres-inline">${genresList}</span>` : ""}
            </div>
            <p class="hero-overview ${getLocalizedOverview(movie).isKurdish ? 'notranslate' : ''}" translate="${getLocalizedOverview(movie).isKurdish ? 'no' : 'yes'}">${getLocalizedOverview(movie).text}</p>
            <div class="hero-actions">
                <button class="btn-hero-play notranslate" translate="no" onclick="openVideoPlayer('${movie.id}')">
                    <ion-icon name="play" style="font-size: 1.15em; vertical-align: -1px; margin-right: 4px;"></ion-icon> ${playText}
                </button>
                <button class="btn-hero-more notranslate" translate="no" onclick="openDetailsModal('${movie.id}')">
                    <ion-icon name="information-circle-outline" style="font-size: 1.25em; vertical-align: -2px; margin-right: 4px;"></ion-icon> ${moreText}
                </button>
            </div>
        </div>
      </div>
    `;
  }).join("");

  // â”€â”€ Real-time Smooth Drag / Swipe to change slides â”€â”€
  const heroBanner = document.getElementById("heroBanner");
  let startX = 0;
  let currentTranslate = 0;
  let isDragging = false;
  let hasMoved = false;

  const onDragStart = (e) => {
    // Only capture primary mouse button or touch
    if (e.type.includes("mouse") && e.button !== 0) return;
    isDragging = true;
    hasMoved = false;
    startX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;

    heroBanner.classList.add("is-dragging");

    if (state.heroInterval) clearInterval(state.heroInterval);
  };

  const onDragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    let diffX = currentX - startX;

    if (Math.abs(diffX) > 6) {
      hasMoved = true;
      if (e.cancelable) e.preventDefault(); // Prevent native text/image selection
    }
  };

  const onDragEnd = (e) => {
    if (!isDragging) return;
    isDragging = false;
    heroBanner.classList.remove("is-dragging");

    const endX = e.type.includes("mouse")
      ? e.pageX
      : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : startX);
    const diffX = endX - startX;
    const isRTL = getComputedStyle(document.body).direction === "rtl";
    const effectiveDiffX = isRTL ? -diffX : diffX;

    const bannerWidth = heroBanner.offsetWidth || window.innerWidth;
    const threshold = Math.min(100, bannerWidth * 0.1);

    if (hasMoved && Math.abs(effectiveDiffX) > threshold) {
      if (effectiveDiffX < 0) {
        // Dragged left -> next slide
        state.currentHeroIndex = (state.currentHeroIndex + 1) % featured.length;
      } else {
        // Dragged right -> previous slide
        state.currentHeroIndex = (state.currentHeroIndex - 1 + featured.length) % featured.length;
      }
    }

    updateHeroBanner();
    startHeroAutoplay();
  };

  // Prevent accidental clicks on child links/buttons when a drag was performed
  heroBanner.addEventListener(
    "click",
    (e) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        hasMoved = false;
      }
    },
    true
  );

  // Prevent native HTML5 image drag
  heroBanner.addEventListener("dragstart", (e) => e.preventDefault());

  // Mouse & Touch events
  heroBanner.addEventListener("mousedown", onDragStart);
  window.addEventListener("mousemove", onDragMove);
  window.addEventListener("mouseup", onDragEnd);

  heroBanner.addEventListener("touchstart", onDragStart, { passive: true });
  heroBanner.addEventListener("touchmove", onDragMove, { passive: false });
  heroBanner.addEventListener("touchend", onDragEnd);
  heroBanner.addEventListener("touchcancel", onDragEnd);

  updateHeroBanner();
  startHeroAutoplay();
}

function startHeroAutoplay() {
  if (state.heroInterval) clearInterval(state.heroInterval);
  const featuredCount = getFeaturedMovies().length;
  if (featuredCount <= 1) return;

  state.heroInterval = setInterval(() => {
    state.currentHeroIndex = (state.currentHeroIndex + 1) % featuredCount;
    updateHeroBanner();
  }, HERO_ROTATE_INTERVAL_MS); // 10 seconds per slide
}

function updateHeroBanner() {
  const heroTrack = document.getElementById("heroTrack");
  if (!heroTrack) return;

  // Clear translateX so crossfade transition takes full effect
  heroTrack.style.transform = "";
  heroTrack.style.transition = "";

  // Update active slide for fade-in and appear animations
  heroTrack.querySelectorAll(".hero-slide").forEach((slide, i) => {
    slide.classList.toggle("active", i === state.currentHeroIndex);
  });

  // Update dots
  document.querySelectorAll("#heroDots .dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === state.currentHeroIndex);
  });
}

function createMovieCardHTML(movie, rank = null, forcePoster = false) {
  const fav = isFavorite(movie.id);
  const primaryGenre = movie.genres && movie.genres.length > 0 ? translateGenre(movie.genres[0]) : "";
  const displayType = movie.isAnime ? "Anime" : (movie.type || (movie.seasons ? "TV Show" : "Movie"));
  const rankHtml = rank !== null ? `
    <div class="top10-rank-badge">
      <span class="top10-rank-text">TOP</span>
      <span class="top10-rank-num">${formatNumber(rank.toString().padStart(2, '0'))}</span>
    </div>
  ` : "";

  const posterImg = movie.poster || movie.backdrop || "";
  const backdropImg = movie.backdrop || movie.poster || "";
  const desktopImg = forcePoster ? posterImg : backdropImg;

  return `
    <div class="movie-card" data-id="${movie.id}">
      <div class="card-poster-wrap ${forcePoster ? 'force-poster-wrap' : ''}">
        ${rankHtml}
        <picture>
          <source media="(max-width: 768px)" srcset="${posterImg}">
          <source media="(min-width: 769px)" srcset="${desktopImg}">
          <img src="${posterImg}" alt="${movie.title}" class="card-poster ${forcePoster ? 'force-poster-img' : ''}" loading="lazy" onerror="if(this.src!=='${backdropImg}')this.src='${backdropImg}'">
        </picture>
        <div class="card-gradient"></div>
        <div class="card-overlay">

        </div>
      </div>
      <div class="card-details">
        <h4 class="card-title notranslate" translate="no">${movie.title}</h4>
        <div class="card-meta">
          <span class="card-rating notranslate" translate="no"><span class="star-icon" style="color: #ffc107; margin-right: 3px;">&#9733;</span>${formatRating(movie.rating)}</span>
          ${movie.age ? `<span class="card-age badge-age notranslate" translate="no">${movie.age}</span>` : ''}
          <span class="card-year notranslate" translate="no">${formatNumber(movie.year)}</span>
          <span class="card-type notranslate" translate="no">${formatMediaType(displayType)}</span>
        </div>
      </div>
    </div>
  `;
}

async function renderCarousels() {
  const shelfMap = {
    top10Track: getMoviesFromList(TOP_10_TRENDING_TODAY).slice(0, 10),
    trendingMoviesTrack: getMoviesFromList(TRENDING_THIS_WEEK_MOVIES, (m) => m.type !== "TV Show"),
    trendingSeriesTrack: getMoviesFromList(TRENDING_THIS_WEEK_SERIES, (m) => m.type === "TV Show" || m.type === "Series"),
    popularMoviesTrack: getMoviesFromList(POPULAR_MOVIES, (m) => m.type !== "TV Show"),
    popularSeriesTrack: getMoviesFromList(POPULAR_SERIES, (m) => m.type === "TV Show" || m.type === "Series"),
    upcomingMoviesTrack: getMoviesFromList(UPCOMING_MOVIES, (m) => m.type !== "TV Show"),
  };

  const tracks = Object.keys(shelfMap);
  let chunkStartTime = performance.now();

  for (let i = 0; i < tracks.length; i++) {
    const trackId = tracks[i];
    const track = document.getElementById(trackId);
    if (!track) continue;

    // Time-slicing: Only yield if we've blocked the thread for > 40ms.
    // This makes Desktop lightning fast (no yielding) while saving Mobile from TBT penalties!
    if (performance.now() - chunkStartTime > 40) {
      await new Promise(resolve => setTimeout(resolve, 0));
      chunkStartTime = performance.now();
    }

    const movieList = shelfMap[trackId];
    if (trackId === "top10Track") {
      track.innerHTML = movieList.map((movie, index) => createMovieCardHTML(movie, index + 1, true)).join("");
    } else {
      track.innerHTML = movieList.map((movie) => createMovieCardHTML(movie)).join("");
    }

    // Click opens details modal
    track.querySelectorAll(".movie-card").forEach((card) => {
      card.onclick = () => openDetailsModal(card.dataset.id);
    });
  }
}

function renderContinueWatchingShelf() {
  const shelf = document.getElementById("continueWatchingShelf");
  const track = document.getElementById("continueTrack");
  if (!shelf || !track) return;

  // STRICT RULE: Continue Watching shelf only belongs on the Home view
  if (state.activeView !== "home") {
    shelf.classList.add("hidden");
    return;
  }

  const items = Object.values(state.continueWatching || {})
    .filter(item => item && item.movieId && MOVIES.some(m => m.id === item.movieId))
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  if (items.length === 0) {
    shelf.classList.add("hidden");
    track.innerHTML = "";
    return;
  }

  shelf.classList.remove("hidden");
  track.innerHTML = items
    .map((item) => {
      const movie = MOVIES.find((m) => m.id === item.movieId);
      if (!movie) return "";

      const isIframe = item.isIframe;
      const percent = isIframe ? 50 : Math.min(100, Math.round(((item.currentTime || 0) / (item.duration || 1)) * 100));
      const cookies = document.cookie || "";
      const isCkb = cookies.includes("googtrans=/en/ckb");
      const isAr = cookies.includes("googtrans=/en/ar");
      const inProgressText = isCkb ? "Ø¨Û•Ø±Ø¯Û•ÙˆØ§Ù… Ø¨Û•" : (isAr ? "Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø´Ø§Ù‡Ø¯Ø©" : "In Progress");
      const leftText = isCkb ? "Ø®ÙˆÙ„Û•Ú© Ù…Ø§ÙˆÛ•" : (isAr ? "Ø¯Ù‚ÙŠÙ‚Ø© Ù…ØªØ¨Ù‚ÙŠØ©" : "m left");
      const metaLabel = isIframe
        ? `<span class="notranslate" translate="no">${inProgressText}</span>`
        : `<span class="notranslate" translate="no">${formatNumber(Math.max(1, Math.round(((item.duration || 0) - (item.currentTime || 0)) / 60)))} ${leftText}</span><span class="notranslate" translate="no">${formatNumber(percent)}%</span>`;

      const posterImg = movie.poster || movie.backdrop || "";
      const backdropImg = movie.backdrop || movie.poster || "";

      return `
      <div class="movie-card continue-card" data-id="${movie.id}">
        <div class="card-poster-wrap continue-poster-wrap">
          <picture>
            <source media="(max-width: 768px)" srcset="${posterImg}">
            <source media="(min-width: 769px)" srcset="${backdropImg}">
            <img src="${posterImg}" alt="${movie.title}" class="card-poster" loading="lazy" onerror="if(this.src!=='${backdropImg}')this.src='${backdropImg}'">
          </picture>
          <div class="card-gradient"></div>
          <div class="card-overlay"></div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width: ${percent}%"></div>
          </div>
        </div>
        <div class="card-details">
          <h4 class="card-title notranslate" translate="no">${movie.title}</h4>
          <div class="card-meta">
            ${metaLabel}
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  track.querySelectorAll(".movie-card").forEach((card) => {
    card.onclick = () => {
      const item = state.continueWatching[card.dataset.id];
      if (item && item.currentTime) {
        openVideoPlayer(card.dataset.id, item.currentTime);
      } else {
        openDetailsModal(card.dataset.id);
      }
    };
  });
}

// ==========================================
// SMART AI RECOMMENDER (GENRE & THEME ENGINE)
// ==========================================
const CineAIRecommender = {
  superheroKeywords: [
    "spider-man", "spiderman", "batman", "superman", "avengers", "iron man",
    "deadpool", "wolverine", "x-men", "superhero", "superheroes", "super hero",
    "mutant", "mutants", "vigilante", "powers", "superpower", "marvel", "dc",
    "gotham", "arkham", "justice league", "lanterns", "the boys", "daredevil",
    "thor", "captain america", "hulk", "thanos", "peter parker", "bruce wayne",
    "tony stark", "clark kent", "kara zor-el"
  ],

  isSuperheroTitle(item) {
    if (!item) return false;
    const title = (item.title || "").toLowerCase();
    const overview = (item.overview || "").toLowerCase();
    for (let i = 0; i < this.superheroKeywords.length; i++) {
      const kw = this.superheroKeywords[i];
      if (title.includes(kw) || overview.includes(kw)) return true;
    }
    return false;
  },

  getRecommendationsForMovie(watchedMovie, limit = 20) {
    if (!watchedMovie || !Array.isArray(MOVIES) || MOVIES.length === 0) return [];

    const watchedId = watchedMovie.id;
    const watchedGenres = Array.isArray(watchedMovie.genres) ? watchedMovie.genres : [];
    const watchedGenresLower = watchedGenres.map(g => String(g).toLowerCase().trim());
    const isWatchedSuperhero = this.isSuperheroTitle(watchedMovie);

    // Franchise keyword detection
    const watchedTitleLower = (watchedMovie.title || "").toLowerCase();
    let franchiseKeyword = null;
    const franchises = ["spider-man", "batman", "avengers", "superman", "iron man", "deadpool", "x-men", "one piece", "reacher"];
    for (let i = 0; i < franchises.length; i++) {
      if (watchedTitleLower.includes(franchises[i])) {
        franchiseKeyword = franchises[i];
        break;
      }
    }

    const watchedCast = Array.isArray(watchedMovie.cast)
      ? watchedMovie.cast.join(" ").toLowerCase()
      : String(watchedMovie.cast || "").toLowerCase();
    const watchedDirector = String(watchedMovie.director || "").toLowerCase().trim();

    const scoredCandidates = [];

    for (let i = 0; i < MOVIES.length; i++) {
      const candidate = MOVIES[i];
      if (!candidate || candidate.id === watchedId) continue;

      const candidateGenres = Array.isArray(candidate.genres) ? candidate.genres : [];
      const candidateGenresLower = candidateGenres.map(g => String(g).toLowerCase().trim());

      // Genre overlap calculation (prioritizing the exact genres of what the user watched)
      let matchedCount = 0;
      const matchedGenreNames = [];
      for (let j = 0; j < candidateGenres.length; j++) {
        const gName = candidateGenres[j];
        if (watchedGenresLower.includes(String(gName).toLowerCase().trim())) {
          matchedCount++;
          matchedGenreNames.push(gName);
        }
      }

      const isCandidateSuperhero = this.isSuperheroTitle(candidate);

      // Must share at least one genre OR both be superhero titles
      if (matchedCount === 0 && !(isWatchedSuperhero && isCandidateSuperhero)) {
        continue;
      }

      let score = 0;

      // 1. Primary genre match weighting
      if (candidateGenresLower.length > 0 && watchedGenresLower.length > 0 && candidateGenresLower[0] === watchedGenresLower[0]) {
        score += 35;
      }
      score += matchedCount * 22; // Weight each matching genre

      // 2. Superhero affinity (if user watched superhero, strongly favor other superhero movies and series)
      if (isWatchedSuperhero && isCandidateSuperhero) {
        score += 48;
      }

      // 3. Franchise continuity (e.g. Spider-Man, Avengers, Batman)
      if (franchiseKeyword && (candidate.title || "").toLowerCase().includes(franchiseKeyword)) {
        score += 32;
      }

      // 4. Cast overlap
      if (candidate.cast && watchedCast) {
        const cCast = Array.isArray(candidate.cast) ? candidate.cast.join(" ").toLowerCase() : String(candidate.cast).toLowerCase();
        const castList = watchedCast.split(/,\s*/);
        for (let k = 0; k < castList.length; k++) {
          const actor = castList[k].trim();
          if (actor.length > 3 && cCast.includes(actor)) {
            score += 15;
            break;
          }
        }
      }

      // 5. Director overlap
      if (watchedDirector && watchedDirector.length > 2 && String(candidate.director || "").toLowerCase().includes(watchedDirector)) {
        score += 15;
      }

      // 6. Quality rating boost
      const ratingNum = parseFloat(candidate.rating) || 0;
      score += Math.min(10, Math.max(0, (ratingNum - 5) * 2));

      // Calculate confidence match percentage (82% to 99%)
      const matchPct = Math.min(99, Math.max(82, Math.round(78 + (score / 160) * 21)));

      scoredCandidates.push({
        movie: candidate,
        score,
        matchPct,
        matchedGenres: matchedGenreNames,
        isSuperhero: isCandidateSuperhero
      });
    }

    // Sort by highest score, then rating
    scoredCandidates.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const rA = parseFloat(a.movie.rating) || 0;
      const rB = parseFloat(b.movie.rating) || 0;
      return rB - rA;
    });

    return scoredCandidates.slice(0, limit);
  }
};

function renderBecauseYouWatchedShelf() {
  const shelf = document.getElementById("becauseYouWatchedShelf");
  const track = document.getElementById("becauseYouWatchedTrack");
  const headingText = document.getElementById("becauseYouWatchedHeadingText");
  const subtitleEl = document.getElementById("becauseYouWatchedSubtitle");
  if (!shelf || !track) return;

  // STRICT RULE: ONLY SHOW ON HOME VIEW
  if (state.activeView !== "home") {
    shelf.classList.add("hidden");
    return;
  }

  // Find latest watched title from watch history or continueWatching
  let latestWatched = null;
  const history = state.watchHistory || [];
  for (let i = 0; i < history.length; i++) {
    const item = history[i];
    if (item && item.movieId) {
      const m = MOVIES.find(x => x.id === item.movieId);
      if (m) {
        latestWatched = m;
        break;
      }
    }
  }

  // Fallback to latest continueWatching item if history is empty
  if (!latestWatched && state.continueWatching) {
    const cwList = Object.values(state.continueWatching)
      .filter(it => it && it.movieId)
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    for (let i = 0; i < cwList.length; i++) {
      const m = MOVIES.find(x => x.id === cwList[i].movieId);
      if (m) {
        latestWatched = m;
        break;
      }
    }
  }

  // RULE: ONLY SHOW AFTER THE USER WATCHES SOMETHING!
  if (!latestWatched) {
    shelf.classList.add("hidden");
    track.innerHTML = "";
    return;
  }

  // Compute AI recommendations based on genres and themes of the watched movie
  const recommendations = CineAIRecommender.getRecommendationsForMovie(latestWatched, 20);
  if (!recommendations || recommendations.length === 0) {
    shelf.classList.add("hidden");
    track.innerHTML = "";
    return;
  }

  // Reveal the shelf
  shelf.classList.remove("hidden");

  // Determine language
  const cookies = document.cookie || "";
  const isCkb = cookies.includes("googtrans=/en/ckb");
  const isAr = cookies.includes("googtrans=/en/ar");

  // Set clean title with watched name highlight and bidirectional isolation
  const titleStr = latestWatched.title;
  if (headingText) {
    headingText.classList.add("notranslate");
    headingText.setAttribute("translate", "no");
    if (isCkb) {
      headingText.innerHTML = `Ú†ÙˆÙ†Ú©Û• Ø³Û•ÛŒØ±ÛŒ <bdi class="watched-highlight notranslate" translate="no" dir="ltr">${titleStr}</bdi>Ù€Øª Ú©Ø±Ø¯ÙˆÙˆÛ•`;
    } else if (isAr) {
      headingText.innerHTML = `Ù„Ø£Ù†Ùƒ Ø´Ø§Ù‡Ø¯Øª <bdi class="watched-highlight notranslate" translate="no" dir="ltr">${titleStr}</bdi>`;
    } else {
      headingText.innerHTML = `Because you watched <span class="watched-highlight notranslate" translate="no">${titleStr}</span>`;
    }
  }

  // Clear any subtitle if element exists
  if (subtitleEl) {
    subtitleEl.innerHTML = "";
    subtitleEl.style.display = "none";
  }

  // Render clean standard movie cards (no match percentage badge)
  track.innerHTML = recommendations.map(({ movie }) => createMovieCardHTML(movie)).join("");

  // Wire click event to open details modal
  track.querySelectorAll(".movie-card").forEach((card) => {
    card.onclick = () => openDetailsModal(card.dataset.id);
  });
}

function renderWatchlistHomeShelf() {
  const shelf = document.getElementById("watchlistHomeShelf");
  const track = document.getElementById("watchlistHomeTrack");
  if (!shelf || !track) return;

  // STRICT RULE: Watchlist home shelf only belongs on the Home view
  if (state.activeView !== "home") {
    shelf.classList.add("hidden");
    return;
  }

  const validFavorites = (state.favorites || [])
    .map((id) => MOVIES.find((m) => m.id === id))
    .filter(Boolean);

  if (validFavorites.length === 0) {
    shelf.classList.add("hidden");
    track.innerHTML = "";
    return;
  }

  shelf.classList.remove("hidden");
  track.innerHTML = validFavorites.map((movie) => createMovieCardHTML(movie)).join("");

  track.querySelectorAll(".movie-card").forEach((card) => {
    card.onclick = () => openDetailsModal(card.dataset.id);
  });
}

function renderContinueWatchingPage() {
  const grid = document.getElementById("continueGrid");
  const emptyState = document.getElementById("emptyContinue");
  const selectBtn = document.getElementById("cwSelectBtn");
  const removeBtn = document.getElementById("cwRemoveSelectedBtn");
  const cancelBtn = document.getElementById("cwCancelSelectBtn");
  const exploreBtn = document.getElementById("exploreContinueBtn");

  if (!grid) return;

  const items = Object.values(state.continueWatching || {})
    .filter(item => item && item.movieId && MOVIES.some(m => m.id === item.movieId))
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  if (items.length === 0) {
    grid.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    if (selectBtn) selectBtn.classList.add("hidden");
    if (removeBtn) removeBtn.classList.add("hidden");
    if (cancelBtn) cancelBtn.classList.add("hidden");
    if (exploreBtn) exploreBtn.onclick = () => switchView("movies");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");

  if (selectBtn && removeBtn && cancelBtn) {
    selectBtn.classList.remove("hidden");
    if (state.isCwSelectionMode) {
      selectBtn.classList.add("hidden");
      removeBtn.classList.remove("hidden");
      cancelBtn.classList.remove("hidden");
      removeBtn.textContent = `Remove Selected (${state.cwSelectedItems.size})`;
    } else {
      selectBtn.classList.remove("hidden");
      removeBtn.classList.add("hidden");
      cancelBtn.classList.add("hidden");
    }

    selectBtn.onclick = () => {
      state.isCwSelectionMode = true;
      state.cwSelectedItems.clear();
      renderContinueWatchingPage();
    };

    cancelBtn.onclick = () => {
      state.isCwSelectionMode = false;
      state.cwSelectedItems.clear();
      renderContinueWatchingPage();
    };

    removeBtn.onclick = () => {
      state.cwSelectedItems.forEach((id) => {
        delete state.continueWatching[id];
      });
      localStorage.setItem(KEYS.CONTINUE, JSON.stringify(state.continueWatching));
      if (window.CW_API && state.user) {
        window.CW_API.syncData(state.favorites, state.continueWatching);
      }
      state.isCwSelectionMode = false;
      state.cwSelectedItems.clear();
      renderContinueWatchingShelf();
      renderContinueWatchingPage();
      showToast("Removed selected items");
    };
  }

  grid.innerHTML = items
    .map((item) => {
      const movie = MOVIES.find((m) => m.id === item.movieId);
      if (!movie) return "";

      const isIframe = item.isIframe;
      const percent = isIframe ? 50 : Math.min(100, Math.round(((item.currentTime || 0) / (item.duration || 1)) * 100));
      const cookies = document.cookie || "";
      const isCkb = cookies.includes("googtrans=/en/ckb");
      const isAr = cookies.includes("googtrans=/en/ar");
      const inProgressText = isCkb ? "Ø¨Û•Ø±Ø¯Û•ÙˆØ§Ù… Ø¨Û•" : (isAr ? "Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø´Ø§Ù‡Ø¯Ø©" : "In Progress");
      const leftText = isCkb ? "Ø®ÙˆÙ„Û•Ú© Ù…Ø§ÙˆÛ•" : (isAr ? "Ø¯Ù‚ÙŠÙ‚Ø© Ù…ØªØ¨Ù‚ÙŠØ©" : "m left");
      const metaLabel = isIframe
        ? `<span class="notranslate" translate="no">${inProgressText}</span>`
        : `<span class="notranslate" translate="no">${formatNumber(Math.max(1, Math.round(((item.duration || 0) - (item.currentTime || 0)) / 60)))} ${leftText}</span><span class="notranslate" translate="no">${formatNumber(percent)}%</span>`;

      const isSelected = state.isCwSelectionMode && state.cwSelectedItems.has(movie.id);
      const selectedClass = isSelected ? "cw-selected" : "";
      const selectionOverlay = state.isCwSelectionMode
        ? `<div class="cw-selection-overlay ${isSelected ? "active" : ""}">
             <ion-icon name="checkmark-circle"></ion-icon>
           </div>`
        : "";

      return `
      <div class="movie-card continue-card ${selectedClass}" data-id="${movie.id}">
        <div class="card-poster-wrap continue-poster-wrap">
          <picture>
            <source media="(max-width: 768px)" srcset="${movie.poster}">
            <img src="${movie.backdrop || movie.poster}" alt="${movie.title}" class="card-poster" loading="lazy">
          </picture>
          <div class="card-gradient"></div>
          ${selectionOverlay}
          <div class="card-overlay"></div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width: ${percent}%"></div>
          </div>
        </div>
        <div class="card-details">
          <h4 class="card-title notranslate" translate="no">${movie.title}</h4>
          <div class="card-meta">
            ${metaLabel}
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  grid.querySelectorAll(".movie-card").forEach((card) => {
    card.onclick = () => {
      const movieId = card.dataset.id;
      if (state.isCwSelectionMode) {
        if (state.cwSelectedItems.has(movieId)) {
          state.cwSelectedItems.delete(movieId);
        } else {
          state.cwSelectedItems.add(movieId);
        }
        renderContinueWatchingPage();
      } else {
        const item = state.continueWatching[movieId];
        if (item && item.currentTime) {
          openVideoPlayer(movieId, item.currentTime);
        } else {
          openDetailsModal(movieId);
        }
      }
    };
  });
}

function renderWatchlist() {
  const grid = document.getElementById("watchlistGrid");
  const emptyState = document.getElementById("emptyWatchlist");
  const exploreBtn = document.getElementById("exploreBtn");
  if (!grid) return;

  const validFavorites = (state.favorites || [])
    .map((id) => MOVIES.find((m) => m.id === id))
    .filter(Boolean);

  if (validFavorites.length === 0) {
    grid.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    if (exploreBtn) exploreBtn.onclick = () => switchView("movies");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");
  grid.innerHTML = validFavorites.map((movie) => createMovieCardHTML(movie, null, false)).join("");

  grid.querySelectorAll(".movie-card").forEach((card) => {
    card.onclick = () => openDetailsModal(card.dataset.id);
  });
}

function renderFilteredGrid(movieList, titleText) {
  const filteredSection = document.getElementById("filteredSection");
  const defaultShelves = document.getElementById("defaultShelves");
  const watchlistSection = document.getElementById("watchlistSection");
  const continueSection = document.getElementById("continueSection");
  const filteredGrid = document.getElementById("filteredGrid");
  const filteredTitle = document.getElementById("filteredTitle");
  const filteredCount = document.getElementById("filteredCount");

  // Hide default shelves, watchlist, continue, and browse sections; show filtered section
  defaultShelves.classList.add("hidden");
  if (watchlistSection) watchlistSection.classList.add("hidden");
  if (continueSection) continueSection.classList.add("hidden");
  const moviesSection = document.getElementById("moviesSection");
  const seriesSection = document.getElementById("seriesSection");
  if (moviesSection) moviesSection.classList.add("hidden");
  if (seriesSection) seriesSection.classList.add("hidden");
  filteredSection.classList.remove("hidden");

  filteredTitle.textContent = titleText;
  filteredCount.textContent = `${movieList.length} ${movieList.length === 1 ? "title" : "titles"} found`;

  if (movieList.length === 0) {
    filteredGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon"><ion-icon name="search-outline"></ion-icon></div>
        <h3>No titles found</h3>
        <p>Try searching for a different keyword or genre.</p>
        <button class="btn btn-primary mt-4" onclick="switchView('movies')">Explore All Titles</button>
      </div>
    `;
  } else {
    const isMobileFiltered = typeof window !== 'undefined' && window.innerWidth <= 768;
    filteredGrid.innerHTML = movieList.map(m => createMovieCardHTML(m, null, isMobileFiltered)).join("");
    filteredGrid.querySelectorAll(".movie-card").forEach((card) => {
      card.onclick = () => openDetailsModal(card.dataset.id);
    });
  }
}

// ==========================================
// BROWSE SECTION RENDERERS (Movies & Series)
// ==========================================


/** Render paginated cards into a grid container */
function renderBrowseGrid(items, gridId, page) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const start = (page - 1) * BROWSE_PAGE_SIZE;
  const pageItems = items.slice(start, start + BROWSE_PAGE_SIZE);
  if (pageItems.length === 0) {
    grid.innerHTML = `
      <div class="browse-empty">
        <div class="empty-icon">ðŸŽ¬</div>
        <h3>No titles found</h3>
        <p>Try a different filter.</p>
      </div>`;
  } else {
    const isMobileGrid = typeof window !== 'undefined' && window.innerWidth <= 768;
    grid.innerHTML = pageItems.map(m => createMovieCardHTML(m, null, isMobileGrid)).join("");
    grid.querySelectorAll(".movie-card").forEach((card) => {
      card.onclick = () => openDetailsModal(card.dataset.id);
    });
  }
}

/** Render pagination controls */
function renderBrowsePagination(paginationId, currentPage, totalPages, onPageChange) {
  const container = document.getElementById(paginationId);
  if (!container || totalPages <= 1) {
    if (container) container.innerHTML = "";
    return;
  }

  const MAX_VISIBLE = 7; // max numbered buttons (excluding prev/next)
  let pages = [];

  if (totalPages <= MAX_VISIBLE + 2) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  const cookies = document.cookie || '';
  const isCkb = cookies.includes('googtrans=/en/ckb');
  const isAr = cookies.includes('googtrans=/en/ar');
  const prevText = isCkb ? '&lsaquo; \\u067e\\u06ce\\u0634\\u0648\\u0648' : (isAr ? '&lsaquo; \\u0627\\u0644\\u0633\\u0627\\u0628\\u0642' : '&lsaquo; Prev');
  const nextText = isCkb ? '\\u062f\\u0648\\u0627\\u062a\\u0631 &rsaquo;' : (isAr ? '\\u0627\\u0644\\u062a\\u0627\\u0644\\u064a &rsaquo;' : 'Next &rsaquo;');
  const goText = isCkb ? '\\u0628\\u0695\\u06c6' : (isAr ? '\\u0627\\u0646\\u062a\\u0642\\u0627\\u0644' : 'Go');

  let html = `<button class="page-btn prev-btn notranslate" translate="no" ${currentPage === 1 ? "disabled" : ""} data-page="${currentPage - 1}">${prevText}</button>`;
  pages.forEach((p) => {
    if (p === "...") {
      html += `<span class="page-ellipsis notranslate" translate="no">&hellip;</span>`;
    } else {
      html += `<button class="page-btn notranslate ${p === currentPage ? "active" : ""}" translate="no" data-page="${p}">${formatNumber(p)}</button>`;
    }
  });
  html += `<button class="page-btn next-btn notranslate" translate="no" ${currentPage === totalPages ? "disabled" : ""} data-page="${currentPage + 1}">${nextText}</button>`;

  // Add jump to page input
  html += `
    <div class="page-jump">
      <input type="number" class="page-jump-input notranslate" translate="no" id="${paginationId}-jump-input" min="1" max="${totalPages}" placeholder="${goText}" title="Jump to page">
      <button class="page-btn page-jump-btn notranslate" translate="no" id="${paginationId}-jump-btn">${goText}</button>
    </div>
  `;

  container.innerHTML = html;

  container.querySelectorAll(".page-btn:not(:disabled):not(.page-jump-btn)").forEach((btn) => {
    btn.onclick = () => {
      const p = parseInt(btn.dataset.page, 10);
      if (!isNaN(p)) {
        if (typeof window.handlePaginationWithAd === 'function') {
          window.handlePaginationWithAd(p, onPageChange);
        } else {
          onPageChange(p);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    };
  });

  const jumpInput = document.getElementById(`${paginationId}-jump-input`);
  const jumpBtn = document.getElementById(`${paginationId}-jump-btn`);

  if (jumpInput && jumpBtn) {
    const jumpToPage = () => {
      const p = parseInt(jumpInput.value, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        if (typeof window.handlePaginationWithAd === 'function') {
          window.handlePaginationWithAd(p, onPageChange);
        } else {
          onPageChange(p);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    };
    jumpBtn.onclick = jumpToPage;
    jumpInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") jumpToPage();
    });
  }
}

/** Get filtered list for movies section */
function getMoviesList() {
  return MOVIES.filter((m) => {
    const isAnime = Boolean(m.isAnime || m.type === "Anime" || (m.genres && m.genres.includes("Anime")));
    const isSeries = Boolean(m.type === "TV Show" || m.type === "Series" || (Array.isArray(m.seasons) && m.seasons.length > 0));
    return !m.is4k && !isAnime && !isSeries && (m.type === "Movie" || !m.type);
  });
}

/** Get filtered list for series section */
function getSeriesList() {
  return MOVIES.filter((m) => {
    const isAnime = Boolean(m.isAnime || m.type === "Anime" || (m.genres && m.genres.includes("Anime")));
    return !m.is4k && !isAnime && (m.type === "TV Show" || m.type === "Series" || (Array.isArray(m.seasons) && m.seasons.length > 0));
  });
}


function get4kList() {
  return MOVIES.filter((m) => m.is4k);
}

function getAnimeList() {
  return MOVIES.filter((m) => m.isAnime || m.type === "Anime" || (m.genres && m.genres.includes("Anime")));
}

/** Apply the active genre filter to a list */
function applyBrowseFilter(list, genre) {
  if (!genre || genre === "all") return list;
  return list.filter((m)
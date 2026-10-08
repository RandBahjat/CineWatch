// Capture recovery hash immediately before Supabase clears it
if (window.location.hash.includes("type=recovery")) {
  window.CW_PENDING_RECOVERY = true;
}

// Instant permanent VIP initialization for Rand Bahjat (Ultimate VIP)
try {
  localStorage.setItem('cw_is_vip', 'true');
  localStorage.setItem('cw_vip_tier', 'Ultimate');
  localStorage.setItem('userVipTier', 'ultimate');
  sessionStorage.setItem('cw_is_vip', 'true');
  sessionStorage.setItem('cw_vip_tier', 'Ultimate');
  localStorage.removeItem('cw_user_cancelled_vip');
} catch(e) {}

/**
 * CineWatch - Pure Vanilla JavaScript (ES6+)
 * Feature-rich movie streaming platform logic
 */

// ==========================================
// 1. HIGHLIGHTS & TRENDING
// ==========================================
let FEATURED_TITLES = ["Spider-Man: Brand New Day","Runner","Lanterns","The Love Hypothesis","Unabomber","Resident Evil","Neagley","Reacher","The End of Oak Street","Verity","Slow Horses","City of Blood","Mayday","The Runner","Coyote vs. Acme",];
let TOP_10_TRENDING_TODAY = ["Spider-Man: Brand New Day", "Digger","Lanterns","East of Eden", "Runner",  "Resident Evil", "The Uprising", "One Piece(1999)",  "Verity", "MobLand"];
let TRENDING_THIS_WEEK_MOVIES = ["Spider-Man: Brand New Day","Resident Evil","The End of Oak Street", "The Odysessey", "Toy Story 5", "Obsession", "The Love Hypothesis", "Moana(2026)", "One Last Shot", "Digger", "The Rivals of Amziah King", "Backrooms", "You+Me – Against the World", "Coyote vs. Acme", "Just Play Dead"];
let TRENDING_THIS_WEEK_SERIES = ["Monster: The Lizzie Borden Story","MobLand","Neagley", "Reacher", "Lioness", "Lanterns", "Slow Horses", "One Piece", "Ted Lasso","City of Blood", "Stranger Things: Tales from '85", "Silo"];
const POPULAR_MOVIES = ["Spider-Man: Brand New Day","Resident Evil","The End of Oak Street","Coyote vs. Acme","The Odysessey","Mutiny", "Moana(2026)", "The Runner","Obsession", "Spider-Man: No Way Home","Backrooms", "Disclosure Day", "The Death of Robin Hood", "The Last House","Drawn Together", "Michael", "Project Hail Mary","Avatar Aang: The Last Airbender","The Shawshank Redemption"];
const POPULAR_SERIES = ["MobLand (The Donovans)", "Star Trek: Strange New Worlds", "Slow Horses", "Reacher","The Mentalist","The Gentlemen", "Breaking Bad","Law & Order: Special Victims Unit", "Ted Lasso","House", "Lucky", "Off Campus", "Silo", "Game of Thrones", "The Sopranos", "Stranger Things", "The Boys","The Rookie","The Good Doctor","Dexter","From","S.W.A.T.","The Walking Dead","Stranger Things"];
let UPCOMING_MOVIES = ["Avengers: Doomsday"];

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
    if (genre === 'all') return 'هەموو جۆرەکان';
    if (genre === 'Action') return 'ئاکشن';
    if (genre === 'Adventure') return 'سەرکێشی';
    if (genre === 'Animation') return 'ئەنیمەیشن';
    if (genre === 'Comedy') return 'کۆمیدی';
    if (genre === 'Crime') return 'تاوانکاری';
    if (genre === 'Drama') return 'دراما';
    if (genre === 'Family') return 'خێزانی';
    if (genre === 'Kids') return 'منداڵان';
    if (genre === 'History') return 'مێژوویی';
    if (genre === 'Fantasy') return 'فانتازیا';
    if (genre === 'Horror') return 'ترسناک';
    if (genre === 'Mystery') return 'نهێنی';
    if (genre === 'Romance') return 'ڕۆمانسی';
    if (genre === 'Sci-Fi' || genre === 'Science-Fiction' || genre === 'Science Fiction') return 'خەیاڵی زانستی';
    if (genre === 'Thriller') return 'هەستبزوێن';
    if (genre === 'War') return 'جەنگ';
  }
  if (isArabic) {
    if (genre === 'all') return 'جميع الأنواع';
    if (genre === 'Action') return 'أكشن';
    if (genre === 'Adventure') return 'مغامرة';
    if (genre === 'Animation') return 'رسوم متحركة';
    if (genre === 'Comedy') return 'كوميديا';
    if (genre === 'Crime') return 'جريمة';
    if (genre === 'Drama') return 'دراما';
    if (genre === 'Family') return 'عائلي';
    if (genre === 'Kids') return 'أطفال';
    if (genre === 'History') return 'تاريخي';
    if (genre === 'Fantasy') return 'خيال';
    if (genre === 'Horror') return 'رعب';
    if (genre === 'Mystery') return 'غموض';
    if (genre === 'Romance') return 'رومانسي';
    if (genre === 'Sci-Fi' || genre === 'Science-Fiction' || genre === 'Science Fiction') return 'خيال علمي';
    if (genre === 'Thriller') return 'إثارة';
    if (genre === 'War') return 'حرب';
  }
  return genre;
}

function formatNumber(val) {
  if (val == null) return '';
  const str = String(val);
  const cookies = document.cookie || '';
  const isSorani = cookies.includes('googtrans=/en/ckb');
  if (!isSorani) return str;
  return str.replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
}

function formatMediaType(type) {
  const cookies = document.cookie || '';
  const isCkb = cookies.includes('googtrans=/en/ckb');
  const isAr = cookies.includes('googtrans=/en/ar');
  if (isCkb) {
    if (type === 'TV Show' || type === 'Series') return 'زنجیرە';
    if (type === 'Anime') return 'ئەنیمێ';
    return 'فیلم';
  }
  if (isAr) {
    if (type === 'TV Show' || type === 'Series') return 'مسلسل';
    if (type === 'Anime') return 'أنمي';
    return 'فيلم';
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
  // Convert digits to Kurdish / Eastern-Arabic numerals: ٠١٢٣٤٥٦٧٨٩
  return str.replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
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
    (m.title && m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug) ||
    String(m.videoUrl) === raw ||
    String(m.cinesrcId) === raw
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
    const localFourK = (window._FOURK_DATA || []).map(item => ({ ...item, is4k: true }));

    // Merge media sources, ensuring items in fourk-data are marked is4k: true
    const allMedia = [...localMovies, ...localSeries, ...localAnime];
    const existingTitles = new Set(allMedia.map(m => (m.title || '').trim().toLowerCase()));

    allMedia.forEach(m => {
      const match = localFourK.find(f => (f.title || '').trim().toLowerCase() === (m.title || '').trim().toLowerCase());
      if (match) {
        m.is4k = true;
        if (match.videoUrl) m.videoUrl = match.videoUrl;
      }
    });

    localFourK.forEach(f => {
      if (!existingTitles.has((f.title || '').trim().toLowerCase())) {
        allMedia.push(f);
      }
    });

    MOVIES = allMedia;
    window.MOVIES = MOVIES;

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
    let savedUser = sessionStorage.getItem(KEYS.USER) || localStorage.getItem(KEYS.USER) || localStorage.getItem('cinewatch_user');
    let userObj = null;
    if (savedUser) {
      try { userObj = typeof savedUser === 'string' ? JSON.parse(savedUser) : savedUser; } catch(e) {}
    }

    // Default account for Rand Bahjat (Site Owner) with Ultimate VIP
    if (!userObj || !userObj.name) {
      userObj = {
        name: "Rand Bahjat",
        displayName: "Rand Bahjat",
        email: "rand@cinewatch.watch",
        isVip: true,
        vipTier: "Ultimate",
        role: "admin",
        createdAt: "2024-01-01"
      };
    }

    const uName = (userObj.name || userObj.displayName || '').toLowerCase();
    const uEmail = (userObj.email || '').toLowerCase();
    if (uName.includes('rand') || uEmail.includes('rand') || uName.includes('admin') || uEmail.includes('admin')) {
      userObj.isVip = true;
      userObj.vipTier = 'Ultimate';
      userObj.role = 'admin';
    }

    state.user = userObj;
    localStorage.setItem(KEYS.USER, JSON.stringify(userObj));
    sessionStorage.setItem(KEYS.USER, JSON.stringify(userObj));
    localStorage.setItem('cinewatch_user', JSON.stringify(userObj));
    sessionStorage.setItem('cinewatch_user', JSON.stringify(userObj));
    localStorage.setItem('cw_is_vip', 'true');
    sessionStorage.setItem('cw_is_vip', 'true');
    localStorage.setItem('cw_vip_tier', 'Ultimate');
    localStorage.setItem('userVipTier', 'ultimate');
    localStorage.removeItem('cw_user_cancelled_vip');

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
  if (userObj) {
    const uName = (userObj.name || userObj.displayName || '').toLowerCase();
    const uEmail = (userObj.email || '').toLowerCase();
    if (uName.includes('rand') || uEmail.includes('rand') || uName.includes('admin') || uEmail.includes('admin')) {
      userObj.isVip = true;
      userObj.vipTier = 'Ultimate';
      localStorage.setItem('cw_is_vip', 'true');
      localStorage.setItem('cw_vip_tier', 'Ultimate');
      sessionStorage.setItem('cw_is_vip', 'true');
    }
  }
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
    // when the session is already active — that would cause an infinite reload loop).
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
    showToast("♥ Added to My Watchlist!");
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

const SECTION_VIEWS = ['home', 'movies', 'series', 'anime', '4k', 'watchlist', 'continue'];

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
    await checkPendingVipStatus();
    renderUserBadge();
    updateWatchlistBadge();
    if (typeof initThemeAccent === 'function') initThemeAccent();

    // Render default catalog carousels
    renderCarousels();

    // ALWAYS initialize hero banner so it is populated and ready for Home view
    setupHeroBanner();

    // Check for target section parameter from full-page reload
    const params = new URLSearchParams(window.location.search);
    const targetSection = params.get('section') || params.get('view');
    if (targetSection && targetSection !== 'home' && SECTION_VIEWS.includes(targetSection)) {
      state.activeView = targetSection;
      _performSwitchView(targetSection);
    } else {
      state.activeView = 'home';
      // Render Home Shelves
      renderContinueWatchingShelf();
      if (typeof renderBecauseYouWatchedShelf === "function") renderBecauseYouWatchedShelf();
      if (typeof renderWatchlistHomeShelf === "function") renderWatchlistHomeShelf();
      updateSectionSEO('home');
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

  // Slide Counter interactive navigation
  const prevBtn = document.getElementById("heroPrevBtn");
  const nextBtn = document.getElementById("heroNextBtn");
  if (prevBtn) {
    prevBtn.onclick = (e) => {
      e.stopPropagation();
      state.currentHeroIndex = (state.currentHeroIndex - 1 + featured.length) % featured.length;
      updateHeroBanner();
      startHeroAutoplay();
    };
  }
  if (nextBtn) {
    nextBtn.onclick = (e) => {
      e.stopPropagation();
      state.currentHeroIndex = (state.currentHeroIndex + 1) % featured.length;
      updateHeroBanner();
      startHeroAutoplay();
    };
  }

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

  const playText = isSorani ? 'سەیرکردن' : (isArabic ? 'تشغيل' : 'Play');
  const moreText = isSorani ? 'زیاتر ببینە' : (isArabic ? 'عرض المزيد' : 'See More');

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

  // ── Real-time Smooth Drag / Swipe to change slides ──
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

  // Update slide counter indicator
  const currentSlideEl = document.getElementById("heroCurrentSlide");
  if (currentSlideEl) {
    currentSlideEl.textContent = formatNumber((state.currentHeroIndex + 1).toString().padStart(2, '0'));
  }
  const totalSlidesEl = document.getElementById("heroTotalSlides");
  const featured = getFeaturedMovies();
  if (totalSlidesEl && featured.length > 0) {
    totalSlidesEl.textContent = formatNumber(featured.length.toString().padStart(2, '0'));
  }
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
      const inProgressText = isCkb ? "بەردەوام بە" : (isAr ? "قيد المشاهدة" : "In Progress");
      const leftText = isCkb ? "خولەک ماوە" : (isAr ? "دقيقة متبقية" : "m left");
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
      headingText.innerHTML = `چونکە سەیری <bdi class="watched-highlight notranslate" translate="no" dir="ltr">${titleStr}</bdi>ـت کردووە`;
    } else if (isAr) {
      headingText.innerHTML = `لأنك شاهدت <bdi class="watched-highlight notranslate" translate="no" dir="ltr">${titleStr}</bdi>`;
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
      const inProgressText = isCkb ? "بەردەوام بە" : (isAr ? "قيد المشاهدة" : "In Progress");
      const leftText = isCkb ? "خولەک ماوە" : (isAr ? "دقيقة متبقية" : "m left");
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
        <div class="empty-icon">🎬</div>
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
  if (Array.isArray(window._FOURK_DATA) && window._FOURK_DATA.length > 0) {
    return window._FOURK_DATA.map(item => ({ ...item, is4k: true }));
  }
  return MOVIES.filter((m) => m.is4k);
}

function getAnimeList() {
  return MOVIES.filter((m) => m.isAnime || m.type === "Anime" || (m.genres && m.genres.includes("Anime")));
}

/** Apply the active genre filter to a list */
function applyBrowseFilter(list, genre) {
  if (!genre || genre === "all") return list;
  return list.filter((m) => m.genres && m.genres.includes(genre));
}

/** Render (or re-render) the full Movies browse section */
function renderMoviesSection() {
  const allMovies = getMoviesList();
  const filtered = applyBrowseFilter(allMovies, state.moviesFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / BROWSE_PAGE_SIZE));

  // Clamp page in case filter change reduced total
  if (state.moviesPage > totalPages) state.moviesPage = totalPages;

  const cookies = document.cookie || '';
  const isCkb = cookies.includes('googtrans=/en/ckb');
  const isAr = cookies.includes('googtrans=/en/ar');

  // Update count badge (next to heading)
  const countEl = document.getElementById("moviesCount");
  if (countEl) countEl.textContent = isCkb ? `${formatNumber(filtered.length)} فیلم` : (isAr ? `${filtered.length} فيلم` : `${filtered.length} title${filtered.length !== 1 ? "s" : ""}`);

  // Update count label (between filters and grid)
  const labelEl = document.getElementById("moviesCountLabel");
  if (labelEl) {
    labelEl.textContent = isCkb ? `ناونیشانەکان: ${formatNumber(filtered.length)}` : (isAr ? `العناوين: ${filtered.length}` : `Titles: ${filtered.length}`);
  }

  // Sync active filter button
  document.querySelectorAll("#moviesFilterBar .browse-filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.genre === state.moviesFilter);
  });

  renderBrowseGrid(filtered, "moviesGrid", state.moviesPage);
  renderBrowsePagination("moviesPagination", state.moviesPage, totalPages, (p) => {
    state.moviesPage = p;
    renderMoviesSection();
  });
}

/** Render (or re-render) the full Series browse section */
function renderSeriesSection() {
  const allSeries = getSeriesList();
  const filtered = applyBrowseFilter(allSeries, state.seriesFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / BROWSE_PAGE_SIZE));

  if (state.seriesPage > totalPages) state.seriesPage = totalPages;

  const cookies = document.cookie || '';
  const isCkb = cookies.includes('googtrans=/en/ckb');
  const isAr = cookies.includes('googtrans=/en/ar');

  const countEl = document.getElementById("seriesCount");
  if (countEl) countEl.textContent = isCkb ? `${formatNumber(filtered.length)} زنجیرە` : (isAr ? `${filtered.length} مسلسل` : `${filtered.length} title${filtered.length !== 1 ? "s" : ""}`);

  // Update count label (between filters and grid)
  const labelEl = document.getElementById("seriesCountLabel");
  if (labelEl) {
    labelEl.textContent = isCkb ? `ناونیشانەکان: ${formatNumber(filtered.length)}` : (isAr ? `العناوين: ${filtered.length}` : `Titles: ${filtered.length}`);
  }

  document.querySelectorAll("#seriesFilterBar .browse-filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.genre === state.seriesFilter);
  });

  renderBrowseGrid(filtered, "seriesGrid", state.seriesPage);
  renderBrowsePagination("seriesPagination", state.seriesPage, totalPages, (p) => {
    state.seriesPage = p;
    renderSeriesSection();
  });
}

/** Render (or re-render) the full Anime browse section */

function render4kSection() {
  const all4k = get4kList();
  const filtered = applyBrowseFilter(all4k, state.fourkFilter || 'all');
  const totalPages = Math.max(1, Math.ceil(filtered.length / BROWSE_PAGE_SIZE));

  if ((state.fourkPage || 1) > totalPages) state.fourkPage = totalPages;
  const currPage = state.fourkPage || 1;

  const countEl = document.getElementById("fourkCount");
  if (countEl) countEl.textContent = `${filtered.length} title${filtered.length !== 1 ? "s" : ""}`;

  const labelEl = document.getElementById("fourkCountLabel");
  if (labelEl) labelEl.textContent = `Titles: ${filtered.length}`;

  renderBrowseGrid(filtered, "fourkGrid", currPage);
  renderBrowsePagination("fourkPagination", currPage, totalPages, (p) => {
    state.fourkPage = p;
    render4kSection();
  });
}

function renderAnimeSection() {
  const allAnime = getAnimeList();
  const filtered = applyBrowseFilter(allAnime, state.animeFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / BROWSE_PAGE_SIZE));

  if (state.animePage > totalPages) state.animePage = totalPages;

  const cookies = document.cookie || '';
  const isCkb = cookies.includes('googtrans=/en/ckb');
  const isAr = cookies.includes('googtrans=/en/ar');

  const countEl = document.getElementById("animeCount");
  if (countEl) countEl.textContent = isCkb ? `${formatNumber(filtered.length)} ئەنیمێ` : (isAr ? `${filtered.length} أنمي` : `${filtered.length} title${filtered.length !== 1 ? "s" : ""}`);

  const labelEl = document.getElementById("animeCountLabel");
  if (labelEl) {
    labelEl.textContent = isCkb ? `ناونیشانەکان: ${formatNumber(filtered.length)}` : (isAr ? `العناوين: ${filtered.length}` : `Titles: ${filtered.length}`);
  }

  document.querySelectorAll("#animeFilterBar .browse-filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.genre === state.animeFilter);
  });

  renderBrowseGrid(filtered, "animeGrid", state.animePage);
  renderBrowsePagination("animePagination", state.animePage, totalPages, (p) => {
    state.animePage = p;
    renderAnimeSection();
  });
}


// ==========================================
// VIEW SWITCHER WITH TOP PROGRESS BAR
// ==========================================

let _topBarTimer = null;
let _topBarStep1Timer = null;
let _topBarStep2Timer = null;

function triggerTopLoadingBar(onComplete) {
  let bar = document.getElementById("cwTopLoadingBar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "cwTopLoadingBar";
    bar.className = "cw-top-loading-bar";
    document.body.appendChild(bar);
  }

  if (_topBarTimer) clearTimeout(_topBarTimer);
  if (_topBarStep1Timer) clearTimeout(_topBarStep1Timer);
  if (_topBarStep2Timer) clearTimeout(_topBarStep2Timer);

  // Initialize
  bar.classList.remove("finishing");
  bar.style.transition = "none";
  bar.style.width = "0%";
  bar.style.opacity = "1";
  bar.classList.add("active");

  void bar.offsetWidth; // Force reflow

  // Stage 1: Fast jump to 45%
  bar.style.transition = "width 0.15s cubic-bezier(0.16, 1, 0.3, 1)";
  bar.style.width = "45%";

  if (typeof onComplete === "function") {
    try { onComplete(); } catch(e) { console.error(e); }
  }

  // Stage 2: Advance to 85%
  _topBarStep1Timer = setTimeout(() => {
    bar.style.transition = "width 0.2s cubic-bezier(0.16, 1, 0.3, 1)";
    bar.style.width = "85%";
  }, 100);

  // Stage 3: Hit 100% and fade out
  _topBarTimer = setTimeout(() => {
    bar.style.transition = "width 0.15s ease-out";
    bar.style.width = "100%";

    const mainContent = document.getElementById("mainContent");
    if (mainContent) {
      mainContent.style.opacity = "1";
    }

    setTimeout(() => {
      bar.style.opacity = "0";
      setTimeout(() => {
        bar.classList.remove("active");
        bar.style.width = "0%";
        bar.style.transition = "";
      }, 200);
    }, 150);
  }, 220);
}

function switchView(viewName, immediate = false) {
  // If immediate (e.g. initial boot, modal closing, or details view)
  if (immediate || !state.activeView || viewName === "details") {
    _performSwitchView(viewName);
    return;
  }

  // If already on this view, smooth scroll to top
  if (state.activeView === viewName) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // Instant view switch for maximum responsiveness
  _performSwitchView(viewName);
  window.scrollTo({ top: 0, behavior: "smooth" });
  triggerTopLoadingBar();
}

function _performSwitchView(viewName) {
  // Prevent Translation Flicker: hide content briefly while Google Translate parses the new elements
  const mainContent = document.getElementById("mainContent");
  if (mainContent) {
    const cookies = document.cookie;
    if (cookies.includes('googtrans=') && !cookies.includes('googtrans=/en/en')) {
      mainContent.style.opacity = '0';
      mainContent.style.transition = 'none';
      setTimeout(() => {
        mainContent.style.transition = 'opacity 0.3s ease';
        mainContent.style.opacity = '1';
        setTimeout(() => {
          mainContent.style.transition = '';
        }, 300);
      }, 150); // Give translation engine 150ms to translate before fading back in
    }
  }

  
  // 4K Ultra HD Showcase View — fully accessible
  if (viewName === '4k') {
    // Smoothly enter 4K section
  }
  state.activeView = viewName;
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    if (link.dataset.view === viewName) link.classList.add("active");
    else link.classList.remove("active");
  });

  // Dismiss Browse dropdown upon switching view
  const navBrowseItem = document.getElementById("navBrowseItem");
  if (navBrowseItem) {
    navBrowseItem.classList.remove("is-open");
  }

  // Handle Browse Dropdown active states & cards
  const browseTrigger = document.getElementById("navBrowseTrigger");
  const browseCards = document.querySelectorAll(".nav-dropdown-card");
  const homeBtn = document.getElementById("navHomeBtn");
  const isBrowseSubView = (viewName === 'movies' || viewName === 'series' || viewName === 'anime' || viewName === 'continue' || viewName === 'watchlist' || viewName === '4k');

  if (browseTrigger) {
    if (isBrowseSubView) {
      browseTrigger.classList.add("active");
    } else {
      browseTrigger.classList.remove("active");
    }
  }

  if (homeBtn) {
    if (viewName === 'home') {
      homeBtn.classList.add("active");
    } else {
      homeBtn.classList.remove("active");
    }
  }

  browseCards.forEach((card) => {
    if (card.dataset.view === viewName) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });

  // Mobile Bottom Dock Active State Sync
  document.querySelectorAll(".mobile-dock-btn").forEach((btn) => {
    if (btn.dataset.view === viewName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  const mobileDockBrowse = document.getElementById("mobileDockBrowse");
  if (mobileDockBrowse) {
    if (viewName === 'movies' || viewName === 'series' || viewName === 'anime' || viewName === 'continue' || viewName === '4k') {
      mobileDockBrowse.classList.add("active");
    } else if (viewName === 'home' || viewName === 'watchlist') {
      mobileDockBrowse.classList.remove("active");
    }
  }

  document.body.classList.remove("mobile-browse-open");
  document.body.classList.remove("view-home", "view-movies", "view-series", "view-anime", "view-4k", "view-watchlist", "view-continue", "view-genres", "view-search", "view-details");
  document.body.classList.add("view-" + viewName);

  if (window.updateNavGlider) window.updateNavGlider(true);
  window.dispatchEvent(new Event("scroll"));

  const heroBanner = document.getElementById("heroBanner");
  const defaultShelves = document.getElementById("defaultShelves");
  const continueShelf = document.getElementById("continueWatchingShelf");
  const becauseShelf = document.getElementById("becauseYouWatchedShelf");
  const continueSection = document.getElementById("continueSection");
  const watchlistSection = document.getElementById("watchlistSection");
  const filteredSection = document.getElementById("filteredSection");
  const moviesSection = document.getElementById("moviesSection");
  const seriesSection = document.getElementById("seriesSection");
  const animeSection = document.getElementById("animeSection");
  const detailsSection = document.getElementById("detailsSection");

  const watchlistHomeShelf = document.getElementById("watchlistHomeShelf");

  // Helper: hide all dynamic sections
  const hideAll = () => {
    if (state.heroInterval) {
      clearInterval(state.heroInterval);
      state.heroInterval = null;
    }
    heroBanner.classList.add("hidden");
    defaultShelves.classList.add("hidden");
    if (continueSection) continueSection.classList.add("hidden");
    watchlistSection.classList.add("hidden");
    filteredSection.classList.add("hidden");
    moviesSection.classList.add("hidden");
    seriesSection.classList.add("hidden");
    if (animeSection) animeSection.classList.add("hidden");
    if (detailsSection) detailsSection.classList.add("hidden");
    if (continueShelf) continueShelf.classList.add("hidden");
    if (becauseShelf) becauseShelf.classList.add("hidden");
    if (watchlistHomeShelf) watchlistHomeShelf.classList.add("hidden");
    const fourkSec = document.getElementById("fourkSection");
    if (fourkSec) fourkSec.classList.add("hidden");
    const homeFooter = document.getElementById("homeFooter");
    if (homeFooter) homeFooter.classList.add("hidden");
  };

  const navbar = document.getElementById("navbar");
  if (navbar) {
    if (viewName === "details") {
      navbar.classList.add("hidden");
    } else {
      navbar.classList.remove("hidden");
    }
  }

  const mobileDock = document.getElementById("mobileBottomDock");
  if (mobileDock) {
    if (viewName === "details") {
      mobileDock.classList.add("hidden");
    } else {
      mobileDock.classList.remove("hidden");
    }
  }

  if (viewName === "home") {
    hideAll();
    heroBanner.classList.remove("hidden");
    defaultShelves.classList.remove("hidden");
    // Explicitly un-hide the shelves before rendering so they re-appear after navigating away
    if (continueShelf) continueShelf.classList.remove("hidden");
    if (watchlistHomeShelf) watchlistHomeShelf.classList.remove("hidden");
    const homeFooter = document.getElementById("homeFooter");
    if (homeFooter) homeFooter.classList.remove("hidden");
    const heroTrack = document.getElementById("heroTrack");
    if (!heroTrack || !heroTrack.children.length) {
      setupHeroBanner();
    } else {
      if (typeof startHeroAutoplay === "function") startHeroAutoplay();
    }
    renderContinueWatchingShelf();
    if (typeof renderBecauseYouWatchedShelf === "function") renderBecauseYouWatchedShelf();
    if (typeof renderWatchlistHomeShelf === "function") renderWatchlistHomeShelf();
    updateSectionSEO('home');
  } else if (viewName === "movies") {
    hideAll();
    moviesSection.classList.remove("hidden");
    // Reset filter & page on fresh nav; keep state if already there
    renderMoviesSection();
    updateSectionSEO('movies');
    setTimeout(() => {
      const bar = document.getElementById("moviesFilterBar");
      if (bar && window.updateFilterScrollNav) window.updateFilterScrollNav(bar);
    }, 60);
  } else if (viewName === "series") {
    hideAll();
    seriesSection.classList.remove("hidden");
    renderSeriesSection();
    updateSectionSEO('series');
    setTimeout(() => {
      const bar = document.getElementById("seriesFilterBar");
      if (bar && window.updateFilterScrollNav) window.updateFilterScrollNav(bar);
    }, 60);
  } else if (viewName === "4k") {
    hideAll();
    const fourkSection = document.getElementById("fourkSection");
    if (fourkSection) fourkSection.classList.remove("hidden");
    render4kSection();
    updateSectionSEO('4k');
    setTimeout(() => {
      const bar = document.getElementById("fourkFilterBar");
      if (bar && window.updateFilterScrollNav) window.updateFilterScrollNav(bar);
    }, 60);
  } else if (viewName === "anime") {
    hideAll();
    if (animeSection) animeSection.classList.remove("hidden");
    renderAnimeSection();
    updateSectionSEO('anime');
    setTimeout(() => {
      const bar = document.getElementById("animeFilterBar");
      if (bar && window.updateFilterScrollNav) window.updateFilterScrollNav(bar);
    }, 60);
  } else if (viewName === "watchlist") {
    hideAll();
    watchlistSection.classList.remove("hidden");
    renderWatchlist();
  } else if (viewName === "continue") {
    hideAll();
    if (continueSection) continueSection.classList.remove("hidden");
    renderContinueWatchingPage();
  } else if (viewName === "genres") {
    hideAll();
    filteredSection.classList.remove("hidden");
    renderFilteredGrid(MOVIES, "Explore All Titles");
  } else if (viewName === "search") {
    hideAll();
    filteredSection.classList.remove("hidden");
  } else if (viewName === "details") {
    hideAll();
    if (detailsSection) detailsSection.classList.remove("hidden");
    // Hide the back-to-top button on the details page
    const bttBtn = document.getElementById("backToTopBtn");
    if (bttBtn) bttBtn.classList.remove("visible");
  }
  // Snap instantly to top — the padding-top on .main-content already clears the fixed navbar.
  window.scrollTo({ top: 0, behavior: "instant" });
}

// =====================================================
// Section SEO Updater — updates title/meta per section
// =====================================================
function updateSectionSEO(viewName) {
  const BASE = 'https://cinewatch.watch';
  const SEO = {
    home: {
      title: 'CineWatch - Watch Movies & TV Series Online Free',
      description: 'CineWatch — Watch the latest movies, TV series, anime and 4K titles online for free. Browse thousands of titles, rate them and track what you watch.',
      url: `${BASE}/`
    },
    movies: {
      title: 'Watch Movies Online Free | CineWatch',
      description: 'Browse hundreds of free movies on CineWatch — action, comedy, horror, drama, sci-fi and more. No sign-up required.',
      url: `${BASE}/?section=movies`
    },
    series: {
      title: 'Watch TV Series Online Free | CineWatch',
      description: 'Stream full TV series and seasons online for free on CineWatch — drama, thriller, sci-fi, action and more.',
      url: `${BASE}/?section=series`
    },
    anime: {
      title: 'Watch Anime Online Free | CineWatch',
      description: 'Stream the best anime series and anime movies free on CineWatch — action, romance, fantasy, isekai and more.',
      url: `${BASE}/?section=anime`
    },
    '4k': {
      title: 'Watch 4K Ultra HD Movies & Series | CineWatch VIP',
      description: 'Stream 4K Ultra HD movies and series on CineWatch. Unlock crystal-clear 4K content with a VIP membership.',
      url: `${BASE}/?section=4k`
    }
  };

  const seo = SEO[viewName] || SEO.home;

  // Update <title>
  document.title = seo.title;

  // Update meta description
  const metaDesc = document.getElementById('cwMetaDescription');
  if (metaDesc) metaDesc.setAttribute('content', seo.description);

  // Update Open Graph tags
  const ogTitle = document.getElementById('cwOgTitle');
  if (ogTitle) ogTitle.setAttribute('content', seo.title);
  const ogDesc = document.getElementById('cwOgDescription');
  if (ogDesc) ogDesc.setAttribute('content', seo.description);
  const ogUrl = document.getElementById('cwOgUrl');
  if (ogUrl) ogUrl.setAttribute('content', seo.url);

  // Update Twitter Card
  const twTitle = document.getElementById('cwTwitterTitle');
  if (twTitle) twTitle.setAttribute('content', seo.title);
  const twDesc = document.getElementById('cwTwitterDescription');
  if (twDesc) twDesc.setAttribute('content', seo.description);

  // Update canonical link
  const canonical = document.getElementById('cwCanonical');
  if (canonical) canonical.setAttribute('href', seo.url);

  // Push clean URL to address bar so sharing links reflect the section
  try {
    const relPath = viewName === 'home' ? '/' : `/?section=${encodeURIComponent(viewName)}`;
    if (window.location.pathname + window.location.search !== relPath) {
      window.history.replaceState({ section: viewName }, seo.title, relPath);
    }
  } catch(e) {}
}

function updateWatchlistBadge() {
  // Prune invalid/stale IDs from favorites that no longer exist in the database
  const validFavorites = state.favorites.filter(id => MOVIES.some(m => m.id === id));
  if (validFavorites.length !== state.favorites.length) {
    state.favorites = validFavorites;
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(state.favorites));
    if (window.CW_API && state.user) {
      window.CW_API.syncData(state.favorites, state.continueWatching);
    }
  }

  const count = state.favorites.length;

  // Desktop nav badge
  const badge = document.getElementById("navWatchlistBadge");
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-block" : "none";
  }

  // Mobile menu badge
  const mobileBadge = document.getElementById("mobileNavWatchlistBadge");
  if (mobileBadge) {
    mobileBadge.textContent = count;
    mobileBadge.style.display = count > 0 ? "inline-block" : "none";
  }
}

function refreshAllFavButtons(movieId, isFav) {
  const favBtns = document.querySelectorAll(
    `.card-fav-btn[data-id="${movieId}"]`,
  );
  favBtns.forEach((btn) => {
    btn.innerHTML = isFav ? "✓" : "+";
    if (isFav) btn.classList.add("active");
    else btn.classList.remove("active");
  });
}

function renderAvatarHTML(avatarStr, extraClass = "") {
  if (avatarStr === "??" || avatarStr === "?") avatarStr = "🍿";
  const isImg = avatarStr && (avatarStr.startsWith("data:") || avatarStr.startsWith("http"));
  if (isImg) {
    return `<img src="${avatarStr}" class="avatar-custom-img ${extraClass}" alt="User Avatar">`;
  }
  return `<span class="avatar-icon ${extraClass}">${avatarStr || "🍿"}</span>`;
}

function renderUserBadge() {
  const container = document.getElementById("userProfileContainer");
  const sidebarFooter = document.querySelector(".sidebar-footer");

  if (!container && !sidebarFooter) return;

  if (state.user) {
    const userAvatar = state.user.avatar || "🍿";
    const userName = state.user.name || "User";
    const userEmail = state.user.email || "";
    const createdAt = state.user.createdAt
      ? new Date(state.user.createdAt).toLocaleDateString()
      : "";

    // Determine current language for manual translations in dynamic sidebar
    const cookies = document.cookie;
    const currentLang = cookies.includes('googtrans=/en/ckb') ? 'ckb' :
      cookies.includes('googtrans=/en/ar') ? 'ar' : 'en';

    let uploadAvatarText = "Upload avatar";
    if (currentLang === 'ckb') uploadAvatarText = "وێنەی پڕۆفایل";
    else if (currentLang === 'ar') uploadAvatarText = "تغيير الصورة";

    if (container) {
      // Render only the avatar icon button in the navbar
      container.innerHTML = `
        <button class="profile-icon-btn" id="profileBadgeToggle" aria-label="My Account">
          ${renderAvatarHTML(userAvatar, "badge-avatar")}
        </button>
      `;
    }

    const mobileDockLogin = document.getElementById("mobileDockLogin");
    if (mobileDockLogin) {
      mobileDockLogin.title = "My Account";
      mobileDockLogin.setAttribute("aria-label", "My Account");
      mobileDockLogin.innerHTML = renderAvatarHTML(userAvatar, "dock-avatar-img");
    }

    function logout() {
      if (window.CW_API && typeof window.CW_API.signOut === 'function') {
        window.CW_API.signOut();
      }
      saveUser(null);
      if (typeof state !== 'undefined' && state) state.user = null;
      localStorage.removeItem('cw_user');
      localStorage.removeItem('supabase_auth_token');
      renderUserBadge();
      if (typeof updateProfileUI === 'function') updateProfileUI();
      showToast("Signed out successfully");
      closePanel();
    }
    window.logout = logout;

    if (sidebarFooter && document.getElementById("openAuthBtn")) {
      sidebarFooter.innerHTML = `
        <div class="sidebar-user-wrap">
          <div class="sidebar-user" id="profileBadgeToggleSidebar">
            <div class="user-avatar">${renderAvatarHTML(userAvatar, "sidebar-avatar")}</div>
            <div class="user-info">
              <span class="user-name">${userName}</span>
              <span class="user-status">CineWatch</span>
            </div>
            <button class="sidebar-logout-btn" id="sidebarLogoutBtn" title="Log Out" aria-label="Log Out">
              <ion-icon name="log-out-outline"></ion-icon>
            </button>
          </div>
        </div>
      `;

      const logoutBtn = sidebarFooter.querySelector("#sidebarLogoutBtn");
      if (logoutBtn) {
        logoutBtn.onclick = (e) => {
          e.stopPropagation();
          e.preventDefault();
          logout();
        };
      }
    } else if (sidebarFooter && document.querySelector(".sidebar-user-wrap")) {
       const avatarEl = sidebarFooter.querySelector(".user-avatar");
       const nameEl = sidebarFooter.querySelector(".user-name");
       if (avatarEl) avatarEl.innerHTML = renderAvatarHTML(userAvatar, "sidebar-avatar");
       if (nameEl) nameEl.textContent = userName;
       const logoutBtn = sidebarFooter.querySelector("#sidebarLogoutBtn");
       if (logoutBtn) {
         logoutBtn.onclick = (e) => {
           e.stopPropagation();
           e.preventDefault();
           logout();
         };
       }
    }


    // Create or reuse the side panel
    let panel = document.getElementById("accountSidePanel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "accountSidePanel";
      panel.className = "account-side-panel";
      document.body.appendChild(panel);
    }

    const isVip = typeof isUserVip === 'function' ? isUserVip() : false;

    panel.innerHTML = `
      <div class="account-panel-inner">
        <div class="account-panel-header">
          <span class="account-panel-title">My Account</span>
          <button class="account-panel-close" id="accountPanelClose" aria-label="Close">&times;</button>
        </div>

        <div class="account-panel-body">
          <div class="account-panel-profile">
            <div class="account-panel-avatar-wrap">
              <div class="account-panel-avatar">${renderAvatarHTML(userAvatar, "panel-avatar-img")}</div>
              <label for="panelAvatarInput" class="avatar-edit-badge" title="${uploadAvatarText}">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </label>
            </div>
            <div class="account-panel-name" id="panelUserName">
              <span>${userName}</span>
              ${isVip ? '<span class="cw-vip-pill">👑 VIP</span>' : ''}
            </div>
            ${userEmail ? `<div class="account-panel-email">${userEmail}</div>` : ''}
            <div class="account-panel-date">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>Member since ${createdAt || "Unknown"}</span>
            </div>
          </div>

          <div class="account-panel-section-label">⚙️ ACCOUNT SETTINGS</div>

          <div class="account-panel-actions">
            <label for="panelAvatarInput" class="account-panel-action-btn" id="uploadAvatarBtn">
              <div class="panel-btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
              </div>
              <span class="panel-btn-text notranslate" translate="no">${uploadAvatarText}</span>
              <ion-icon name="chevron-forward-outline" class="panel-btn-arrow"></ion-icon>
            </label>
            <input type="file" id="panelAvatarInput" accept="image/*" style="display:none;">

            <button class="account-panel-action-btn" id="editUsernameBtn">
              <div class="panel-btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
              <span class="panel-btn-text">Edit username</span>
              <ion-icon name="chevron-forward-outline" class="panel-btn-arrow"></ion-icon>
            </button>
            
            <button class="account-panel-action-btn" id="changePasswordPanelBtn">
              <div class="panel-btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <span class="panel-btn-text">Change password</span>
              <ion-icon name="chevron-forward-outline" class="panel-btn-arrow"></ion-icon>
            </button>

            ${isVip ? `
              <button class="account-panel-action-btn panel-cancel-sub-btn" id="cancelSubPanelBtn" style="color: #f87171;">
                <div class="panel-btn-icon" style="background: rgba(239, 68, 68, 0.12); color: #ef4444;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                </div>
                <span class="panel-btn-text">Cancel subscription</span>
                <ion-icon name="chevron-forward-outline" class="panel-btn-arrow"></ion-icon>
              </button>
            ` : `
              <button class="account-panel-action-btn" id="panelUpgradePlanBtn" style="color: #fbbf24;" onclick="if(typeof closePanel==='function')closePanel(); if(typeof openVipModal==='function')openVipModal();">
                <div class="panel-btn-icon" style="background: rgba(245, 158, 11, 0.12); color: #fbbf24;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
                </div>
                <span class="panel-btn-text">Upgrade plan</span>
                <ion-icon name="chevron-forward-outline" class="panel-btn-arrow"></ion-icon>
              </button>
            `}
          </div>

          ${renderThemeSelectorHTML()}
        </div>

        <div class="account-panel-footer">
          <button class="account-panel-logout" id="panelLogoutBtn">
            <ion-icon name="log-out-outline"></ion-icon> Logout
          </button>
        </div>
      </div>
    `;

    // Overlay for closing on outside click
    let overlay = document.getElementById("accountPanelOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "accountPanelOverlay";
      overlay.className = "account-panel-overlay";
      document.body.appendChild(overlay);
    }

    function openPanel() {
      panel.classList.add("open");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
    window.openAccountSidePanel = openPanel;

    function closePanel() {
      panel.classList.remove("open");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }

    document.getElementById("profileBadgeToggle").onclick = (e) => {
      e.stopPropagation();
      panel.classList.contains("open") ? closePanel() : openPanel();
    };

    document.getElementById("accountPanelClose").onclick = closePanel;
    overlay.onclick = closePanel;

    // Avatar upload
    const avatarInput = document.getElementById("panelAvatarInput");
    if (avatarInput) {
      avatarInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = 140;
            canvas.height = 140;
            ctx.drawImage(img, 0, 0, 140, 140);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
            state.user.avatar = dataUrl;
            saveUser(state.user);
            if (window.CW_API) window.CW_API.updateAvatar(dataUrl);
            showToast("Profile photo updated!");
            closePanel();
            renderUserBadge();
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      };
    }

    // Edit username
    document.getElementById("editUsernameBtn").onclick = () => {
      const nameEl = document.getElementById("panelUserName");
      const currentName = state.user?.name || (nameEl ? (nameEl.querySelector('span') ? nameEl.querySelector('span').textContent.trim() : nameEl.textContent.trim()) : "");

      // Replace name display with inline input
      if (nameEl) {
        nameEl.outerHTML = `
          <div class="edit-username-wrap" id="editUsernameWrap">
            <input type="text" id="usernameInput" class="edit-username-input" value="${currentName}" maxlength="30" />
            <div class="edit-username-actions">
              <button class="cancel-username-btn" id="cancelUsernameBtn">Cancel</button>
              <button class="save-username-btn" id="saveUsernameBtn">Save</button>
            </div>
          </div>
        `;
      }

      setTimeout(() => {
        const input = document.getElementById("usernameInput");
        if (input) { input.focus(); input.select(); }

        const cancelBtn = document.getElementById("cancelUsernameBtn");
        if (cancelBtn) {
          cancelBtn.onclick = () => renderUserBadge();
        }

        const saveBtn = document.getElementById("saveUsernameBtn");
        if (saveBtn) {
          saveBtn.onclick = async () => {
            const newName = input.value.trim();
            if (newName && newName !== currentName) {
              state.user.name = newName;
              saveUser(state.user);
              if (window.CW_API) {
                await window.CW_API.updateProfile({ displayName: newName }).catch(() => { });
              }
            }
            renderUserBadge();
            showToast("Username updated!");
          };
        }
      }, 50);
    };

    // Change password (open modal)
    const changePwdBtn = document.getElementById("changePasswordBtn");
    if (changePwdBtn) {
      changePwdBtn.onclick = () => {
        closePanel();

        const authModal = document.getElementById("authModal");
        if (authModal) authModal.classList.remove("hidden");

        const authTabs = document.querySelector(".auth-tabs");
        if (authTabs) authTabs.classList.add("hidden");

        const loginForm = document.getElementById("loginForm");
        if (loginForm) loginForm.classList.add("hidden");

        const signupForm = document.getElementById("signupForm");
        if (signupForm) signupForm.classList.add("hidden");

        const resetPasswordForm = document.getElementById("resetPasswordForm");
        if (resetPasswordForm) resetPasswordForm.classList.add("hidden");

        const changePasswordForm = document.getElementById("changePasswordForm");
        if (changePasswordForm) {
          changePasswordForm.classList.remove("hidden");
          const cpNew = document.getElementById("cpNewModal");
          if (cpNew) {
            cpNew.value = "";
            cpNew.focus();
          }
          document.getElementById("cpConfirmModal").value = "";
          const alertEl = document.getElementById("cpAlertModal");
          if (alertEl) alertEl.classList.add("hidden");
        }
      };
    }

    // New panel change password button
    const cancelSubBtn = document.getElementById("cancelSubPanelBtn");
    if (cancelSubBtn) {
      cancelSubBtn.onclick = () => {
        openCancelSubModal();
      };
    }

    const changePasswordPanelBtn = document.getElementById("changePasswordPanelBtn");
    if (changePasswordPanelBtn) {
      changePasswordPanelBtn.onclick = () => {
        closePanel();
        openAuthModal();
        const authTabs = document.querySelector(".auth-tabs");
        if (authTabs) authTabs.classList.add("hidden");
        document.querySelectorAll(".auth-form").forEach(f => f.classList.add("hidden"));
        const changePasswordForm = document.getElementById("changePasswordForm");
        if (changePasswordForm) {
          changePasswordForm.classList.remove("hidden");
          const cpNew = document.getElementById("cpNewModal");
          if (cpNew) {
            cpNew.value = "";
            cpNew.focus();
          }
          document.getElementById("cpConfirmModal").value = "";
          const alertEl = document.getElementById("cpAlertModal");
          if (alertEl) alertEl.classList.add("hidden");
        }
      };
    }

    // VIP Membership Button in side panel
    const panelVipBtn = document.getElementById("panelVipUpgradeBtn");
    if (panelVipBtn) {
      panelVipBtn.onclick = () => {
        closePanel();
        openVipModal();
      };
    }

    // Logout
    document.getElementById("panelLogoutBtn").onclick = () => {
      closePanel();
      if (window.CW_API) window.CW_API.signOut();
      saveUser(null);
      showToast("Signed out successfully");
    };

  } else {
    if (container) {
      container.innerHTML = `
        <button class="nav-user-icon-btn" id="headerLoginBtn" title="Sign In" aria-label="Sign In">
          <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      `;
      document.getElementById("headerLoginBtn").onclick = () => openAuthModal();
    }

    const mobileDockLoginOut = document.getElementById("mobileDockLogin");
    if (mobileDockLoginOut) {
      mobileDockLoginOut.title = "Sign In";
      mobileDockLoginOut.setAttribute("aria-label", "Sign In or Account");
      mobileDockLoginOut.innerHTML = `
        <svg class="dock-user-icon" width="26" height="26" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/>
          <circle cx="12" cy="9.5" r="2.6" stroke="currentColor" stroke-width="1.5"/>
          <path d="M6.5 18C7 15.5 9.2 14 12 14C14.8 14 17 15.5 17.5 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      `;
    }
    
    if (sidebarFooter) {
      sidebarFooter.innerHTML = `
        <button class="sidebar-signin-btn" id="openAuthBtn">
          <span>Sign In</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="animated-login-svg">
            <path class="login-door" style="transform-origin: 50% 50%" d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
            <path class="login-arrow" d="M14 12h-12" />
            <path class="login-arrow-bottom" d="M5 15l-3 -3l3 -3" />
          </svg>
        </button>
      `;
      const authBtn = document.getElementById("openAuthBtn");
      if (authBtn) {
        authBtn.onclick = (e) => {
          e.preventDefault();
          if (typeof window.showAuth === 'function') {
            window.showAuth();
          } else {
            openAuthModal();
          }
        };
      }
    }
  }
}


// ==========================================
// 4. MODALS (DETAILS, PLAYER, AUTH)
// ==========================================

async function renderCommentsSection(movieId) {
  const commentsSection = document.getElementById('commentsSection');
  const commentInputArea = document.getElementById('commentInputArea');
  const commentsList = document.getElementById('commentsList');

  if (!commentsSection || !commentInputArea || !commentsList) return;

  const cookies = document.cookie || '';
  const isCkb = cookies.includes('googtrans=/en/ckb');
  const isAr = cookies.includes('googtrans=/en/ar');

  const commentsTitleHeading = document.getElementById('commentsTitleHeading');
  if (commentsTitleHeading) {
    commentsTitleHeading.textContent = isCkb ? 'بۆچوونەکان' : (isAr ? 'التعليقات' : 'Comments');
  }

  const placeholderText = isCkb ? 'بۆچوونێک بنووسە...' : (isAr ? 'اكتب تعليقاً...' : 'Write a comment...');
  const postBtnText = isCkb ? 'ناردنی بۆچوون' : (isAr ? 'إرسال التعليق' : 'Post Comment');
  const loginNotice = isCkb ? 'تکایە خۆت تۆماربکە سەرەتا' : (isAr ? 'يجب تسجيل الدخول لإضافة تعليق.' : 'You must be logged in to post a comment.');
  const loginBtnText = isCkb ? 'چوونەژوورەوە یان دروستکردنی هەژمار' : (isAr ? 'تسجيل الدخول أو إنشاء حساب' : 'Log In or Sign Up');
  const noCommentsText = isCkb ? 'هیچ بۆچوونێک نییە، یەکەم کەس بە' : (isAr ? 'لا توجد تعليقات بعد. كن أول من يعلق' : 'No comments yet. Be the first!');
  const failedText = isCkb ? 'بارکردنی بۆچوونەکان سەرکەوتوو نەبوو.' : (isAr ? 'فشل تحميل التعليقات.' : 'Failed to load comments.');

  // Show section
  commentsSection.style.display = 'block';

  // Render Input Area based on Auth State
  if (state.user) {
    commentInputArea.classList.remove('locked');
    commentInputArea.innerHTML = `
      <textarea id="newCommentText" placeholder="${placeholderText}" rows="3" ${isCkb || isAr ? 'style="direction: rtl; text-align: right;"' : ''}></textarea>
      <button class="post-comment-btn notranslate" translate="no" id="postCommentBtn" onclick="submitComment('${movieId}')">
        ${postBtnText}
      </button>
    `;
  } else {
    commentInputArea.classList.add('locked');
    commentInputArea.innerHTML = `
      <div class="notranslate" translate="no" style="color: rgba(255,255,255,0.7); margin-bottom: 1rem;">${loginNotice}</div>
      <button class="post-comment-btn notranslate" translate="no" onclick="openAuthModal()" style="align-self: center;">${loginBtnText}</button>
    `;
  }

  // Show loading state
  commentsList.innerHTML = `<div class="loading-spinner" style="margin: 2rem auto;"></div>`;

  // Fetch comments
  const { data, error } = await window.CW_API.getComments(movieId);

  if (error) {
    commentsList.innerHTML = `<div class="no-comments notranslate" translate="no">${failedText}</div>`;
    return;
  }

  if (!data || data.length === 0) {
    commentsList.innerHTML = `<div class="no-comments notranslate" translate="no">${noCommentsText}</div>`;
    return;
  }

  // Render comments
  commentsList.innerHTML = data.map(comment => {
    const avatarContent = comment.avatar && comment.avatar.length > 20
      ? `<img src="${comment.avatar}" alt="avatar" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`
      : (comment.avatar || '🎬');

    const isOwner = state.user && comment.user_id === state.user.id;
    const deleteTitle = isCkb ? 'سڕینەوەی بۆچوون' : (isAr ? 'حذف التعليق' : 'Delete comment');
    const deleteBtn = isOwner ? `
      <button class="comment-delete-btn" onclick="deleteComment('${comment.id}', '${movieId}')" title="${deleteTitle}">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
      </button>` : '';

    return `
    <div class="comment-item" id="comment-${comment.id}">
      <div class="comment-avatar">${avatarContent}</div>
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-author notranslate" translate="no">${comment.username}</span>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <span class="comment-date">${new Date(comment.created_at).toLocaleDateString()}</span>
            ${deleteBtn}
          </div>
        </div>
        <div class="comment-text notranslate" translate="no">${comment.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
      </div>
    </div>
  `}).join('');
}

window.deleteComment = async function (commentId, movieId) {
  const { success, error } = await window.CW_API.deleteComment(commentId);
  if (success) {
    await renderCommentsSection(movieId);
  } else {
    alert('Failed to delete: ' + (error || 'Unknown error'));
  }
};

window.submitComment = async function (movieId) {
  const textInput = document.getElementById('newCommentText');
  const postBtn = document.getElementById('postCommentBtn');
  const content = textInput ? textInput.value.trim() : '';

  if (!content) return;

  const cookies = document.cookie || '';
  const isCkb = cookies.includes('googtrans=/en/ckb');
  const isAr = cookies.includes('googtrans=/en/ar');
  const postingText = isCkb ? '...ناردن' : (isAr ? '...جارٍ الإرسال' : 'Posting...');
  const postBtnText = isCkb ? 'ناردنی بۆچوون' : (isAr ? 'إرسال التعليق' : 'Post Comment');

  if (postBtn) {
    postBtn.disabled = true;
    postBtn.innerHTML = postingText;
  }

  const { success, error } = await window.CW_API.postComment(movieId, content);

  if (success) {
    if (textInput) textInput.value = '';
    await renderCommentsSection(movieId);
  } else {
    alert((isCkb ? 'ناردن سەرکەوتوو نەبوو: ' : (isAr ? 'فشل النشر: ' : 'Failed to post comment: ')) + (error || 'Unknown error'));
  }

  if (postBtn) {
    postBtn.disabled = false;
    postBtn.innerHTML = postBtnText;
  }
};

function openDetailsModal(movieId) {
  const movie = findMovieByIdOrTitle(movieId);
  if (!movie) return;

  if (state.activeView !== "details") {
    state.previousView = state.activeView;
  }

  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('v', movie.id);
  const existingV = new URLSearchParams(window.location.search).get('v');
  if (existingV !== String(movie.id)) {
    window.history.pushState({ modal: 'details', movieId: movie.id, previousView: state.previousView }, '', currentUrl.toString());
  }

  const mainContent = document.getElementById("mainContent");
  const heroBanner = document.getElementById("heroBanner");
  const detailsSection = document.getElementById("detailsSection");

  const toFadeOut = [];
  if (state.activeView === "details") {
    toFadeOut.push(detailsSection);
  } else {
    if (mainContent) toFadeOut.push(mainContent);
    if (heroBanner && !heroBanner.classList.contains("hidden")) toFadeOut.push(heroBanner);
  }

  toFadeOut.forEach(el => {
    el.style.transition = "opacity 0.3s ease-in-out";
    el.style.opacity = "0";
  });

  setTimeout(() => {
    window.scrollTo(0, 0);
    if (detailsSection) detailsSection.scrollTo(0, 0);
    const detailsBg = document.getElementById("detailsBg");
    if (detailsBg) {
      const detailsHeroImg = movie.backdrop || movie.poster;
      detailsBg.style.backgroundImage = `url('${detailsHeroImg}')`;
      
      // Cancel previous trailer timer and remove iframe
      clearTimeout(window._detailsTrailerTimer);
      const detailsSectionEl = document.getElementById('detailsSection');
      if (detailsSectionEl) detailsSectionEl.classList.remove('trailer-bg-active');
      const prevTrailer = document.getElementById('detailsTrailerIframe');
      if (prevTrailer) prevTrailer.remove();
      const prevSoundBtn = document.getElementById('detailsSoundBtn');
      if (prevSoundBtn) {
        prevSoundBtn.classList.add('hidden');
        prevSoundBtn.innerHTML = '<ion-icon name="volume-mute"></ion-icon>';
      }
      const prevWrap = document.querySelector('#detailsBg .trailer-iframe-wrap');
      if (prevWrap) {
        prevWrap.innerHTML = '';
        prevWrap.classList.remove('active');
        prevWrap.classList.add('hidden');
      }

      // Start trailer background timer (faster on mobile for instant clarity)
      const trailerDelay = window.innerWidth <= 768 ? 600 : 2500;
      window._detailsTrailerTimer = setTimeout(() => {
        if (state.activeView !== "details") return;
        const currentBg = document.getElementById("detailsBg");
        let wrap = currentBg.querySelector('.trailer-iframe-wrap');
        if (!wrap) {
          wrap = document.createElement('div');
          wrap.className = 'trailer-iframe-wrap hidden';
          currentBg.appendChild(wrap);
        } else {
          wrap.innerHTML = '';
        }

        const iframe = document.createElement('iframe');
        iframe.id = 'detailsTrailerIframe';
        iframe.className = 'details-trailer-iframe';

        const customYt = extractYouTubeId(movie.trailerUrl || movie.trailer || movie.trailerYouTubeId || movie.videoUrl);
        const query = encodeURIComponent(`${movie.title} ${movie.year || ''} official trailer`);
        const originParam = window.location.origin ? `&origin=${encodeURIComponent(window.location.origin)}` : '';
        const cleanParams = `autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&iv_load_policy=3&cc_load_policy=0&cc_lang_pref=off&hl=en&enablejsapi=1&playsinline=1&fs=0&disablekb=1&autohide=1&showinfo=0${originParam}`;
        iframe.src = customYt 
          ? `https://www.youtube.com/embed/${customYt}?${cleanParams}&playlist=${customYt}`
          : `https://www.youtube.com/embed?listType=search&list=${query}&${cleanParams}`;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.setAttribute('playsinline', '1');
        iframe.setAttribute('webkit-playsinline', '1');

        function disableMovieSubtitles() {
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
            }
          } catch(e) {}
        }

        iframe.onload = () => {
          disableMovieSubtitles();
          setTimeout(disableMovieSubtitles, 500);
          setTimeout(disableMovieSubtitles, 1200);
        };

        wrap.appendChild(iframe);
        wrap.classList.remove('hidden');
        requestAnimationFrame(() => {
          setTimeout(() => {
            wrap.classList.add('active');
            const detailsSection = document.getElementById('detailsSection');
            if (detailsSection) detailsSection.classList.add('trailer-bg-active');
          }, 150);
        });

        // Wire up sound toggle button for trailer background
        const soundBtn = document.getElementById('detailsSoundBtn');
        if (soundBtn) {
          soundBtn.classList.remove('hidden');
          soundBtn.innerHTML = '<ion-icon name="volume-mute"></ion-icon>';
          let isMuted = true;
          soundBtn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            isMuted = !isMuted;
            try {
              if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(JSON.stringify({
                  event: 'command',
                  func: isMuted ? 'mute' : 'unMute',
                  args: []
                }), '*');
                if (!isMuted) {
                  iframe.contentWindow.postMessage(JSON.stringify({
                    event: 'command',
                    func: 'setVolume',
                    args: [100]
                  }), '*');
                }
              }
            } catch (err) {}
            soundBtn.innerHTML = `<ion-icon name="${isMuted ? 'volume-mute' : 'volume-high'}"></ion-icon>`;
          };

          // Also allow tapping on the hero showcase area to toggle sound
          const heroBg = document.querySelector('.details-hero-bg');
          if (heroBg) {
            heroBg.onclick = (e) => {
              if (e.target.closest('#closeDetailsBtn') || e.target.closest('#detailsSoundBtn')) return;
              soundBtn.click();
            };
          }
        }
      }, trailerDelay);
    }
    const titleEl = document.getElementById("detailsTitle");
    const ratingEl = document.getElementById("detailsRating");
    if (ratingEl) {
      ratingEl.textContent = formatRating(movie.rating);
      ratingEl.classList.add("notranslate");
      ratingEl.setAttribute("translate", "no");
    }
    const yearEl = document.getElementById("detailsYear");
    if (yearEl) {
      yearEl.textContent = formatNumber(movie.year);
      yearEl.classList.add("notranslate");
      yearEl.setAttribute("translate", "no");
    }
    const isCkb = (document.cookie || '').includes('googtrans=/en/ckb');
    const isAr = (document.cookie || '').includes('googtrans=/en/ar');
    if (movie.type === "TV Show" && movie.seasons && movie.seasons.length > 0) {
      const sCount = formatNumber(movie.seasons.length);
      document.getElementById("detailsDuration").textContent = isCkb ? `${sCount} وەرز` : (isAr ? `${movie.seasons.length} مواسم` : `${movie.seasons.length} Season${movie.seasons.length > 1 ? 's' : ''}`);
    } else {
      document.getElementById("detailsDuration").textContent = movie.duration;
    }
    if (titleEl) {
      titleEl.textContent = movie.title;
      titleEl.classList.add("notranslate");
      titleEl.setAttribute("translate", "no");
    }

    if (document.getElementById("detailsGenres")) {
      document.getElementById("detailsGenres").innerHTML = movie.genres.map(translateGenre).join(" &bull; ");
    }

    const userRatingLabel = document.getElementById("userRatingLabel");
    if (userRatingLabel) {
      userRatingLabel.textContent = isCkb ? "هەڵسەنگاندن" : (isAr ? "التقييم" : "Rate:");
    }

    setOverviewElement(document.getElementById("detailsOverview"), getLocalizedOverview(movie));

    const castContainer = document.getElementById("detailsCastContainer");
    const castText = document.getElementById("detailsCastText");
    const dirContainer = document.getElementById("detailsDirectorContainer");
    const dirText = document.getElementById("detailsDirectorText");

    if (dirContainer && dirText) {
      if (movie.director) {
        dirText.textContent = movie.director;
        dirContainer.classList.remove("hidden");
      } else {
        dirContainer.classList.add("hidden");
      }
    }

    if (castContainer && castText) {
      if (movie.cast && movie.cast.length > 0) {
        castText.textContent = movie.cast.join(", ");
        castContainer.classList.remove("hidden");
      } else {
        castContainer.classList.add("hidden");
      }
    }

    const favCheckbox = document.getElementById("detailsFavCheckbox");
    const favBtn = document.getElementById("detailsFavBtn");
    const fav = isFavorite(movie.id);

    // Sync checkbox state with actual favorites state
    favCheckbox.checked = fav;

    favBtn.onclick = (e) => {
      e.preventDefault(); // Prevent default label click behavior
      const isNowFav = toggleFavorite(movie.id);
      favCheckbox.checked = isNowFav;
    };

    const reportBtn = document.getElementById("detailsReportBtn");
    if (reportBtn) {
      reportBtn.onclick = () => {
        const reportModal = document.getElementById("reportModal");
        if (reportModal) {
          reportModal.classList.remove("hidden");
          const subjectInput = document.getElementById("reportSubject");
          if (subjectInput) {
            subjectInput.value = `Issue with: ${movie.title}`;
          }
        }
      };
    }

    if (typeof initializeRatingSystem === 'function') {
      initializeRatingSystem(movie.id);
    }

    // Server selector hidden for unified custom player
    const serverSelector = document.getElementById("detailsServerSelector");
    if (serverSelector) {
      serverSelector.classList.add("hidden");
      serverSelector.style.display = "none";
    }

    renderCommentsSection(movie.id);

    const similarsGrid = document.getElementById("detailsSimilarsGrid");
    const similarsSection = document.getElementById("detailsSimilarsSection");
    if (similarsGrid && similarsSection) {
      let similarMovies = MOVIES.filter(m => m.id !== movie.id)
        .map(m => {
          const matchScore = m.genres.filter(g => movie.genres.includes(g)).length;
          return { movie: m, matchScore };
        })
        .filter(m => m.matchScore > 0)
        .sort((a, b) => b.matchScore !== a.matchScore ? b.matchScore - a.matchScore : 0.5 - Math.random())
        .map(m => m.movie);

      const limited = similarMovies.slice(0, 12);
      if (limited.length > 0) {
        similarsSection.classList.remove("hidden");
        similarsGrid.innerHTML = limited.map((m) => createMovieCardHTML(m)).join("");
        similarsGrid.querySelectorAll(".movie-card").forEach((card) => {
          card.onclick = () => openDetailsModal(card.dataset.id);
        });
      } else {
        similarsSection.classList.add("hidden");
      }
    }

    // ── TV Show: show season/episode picker ──
    const tvSection = document.getElementById("tvShowSection");
    const playBtn = document.getElementById("detailsPlayBtn");

    if (movie.type === "TV Show" && movie.seasons && movie.seasons.length > 0) {
      tvSection.classList.remove("hidden");

      const seasonSelect = document.getElementById("seasonSelect");
      const episodeGrid = document.getElementById("episodeGrid");
      const customSeasonSelect = document.getElementById("customSeasonSelect");
      const seasonSelectTrigger = document.getElementById("seasonSelectTrigger");
      const seasonSelectOptions = document.getElementById("seasonSelectOptions");

      // Populate custom season dropdown
      seasonSelectOptions.innerHTML = movie.seasons
        .map((s) => `<div class="custom-option" data-value="${s.season}">Season ${s.season}</div>`)
        .join("");

      if (movie.seasons.length > 0) {
        const initialSeason = movie.seasons[0].season;
        seasonSelect.value = initialSeason;
        seasonSelectTrigger.querySelector("span").textContent = `Season ${initialSeason}`;
        seasonSelectOptions.querySelector('.custom-option').classList.add('selected');
      }

      // Dropdown toggle logic
      seasonSelectTrigger.onclick = (e) => {
        e.stopPropagation();
        customSeasonSelect.classList.toggle("open");
      };

      document.addEventListener("click", () => {
        if (customSeasonSelect) customSeasonSelect.classList.remove("open");
      });

    // Anime Audio / Server Preference (SUB / DUB) on Detail Page (Episodes Section)
    const isAnime = !!(movie.isAnime || movie.type === 'Anime');
    const seasonAudioToggle = document.getElementById("animeAudioToggle");

    if (seasonAudioToggle) {
      if (isAnime) {
        seasonAudioToggle.classList.remove("hidden");
        const curPref = localStorage.getItem("cw_anime_audio_pref") || "sub";
        seasonAudioToggle.querySelectorAll(".anime-audio-pill").forEach(p => {
          p.classList.toggle("active", p.dataset.audio === curPref);
          p.onclick = (e) => {
            e.stopPropagation();
            const chosen = p.dataset.audio;
            if (window.__cwPreferencesAllowed !== false) {
              localStorage.setItem("cw_anime_audio_pref", chosen);
            }
            seasonAudioToggle.querySelectorAll(".anime-audio-pill").forEach(x => x.classList.toggle("active", x.dataset.audio === chosen));
            if (typeof showToast === "function") {
              showToast(chosen === 'sub' ? 'Mega Server (SUB)' : 'Mega Server (DUB)');
            }
          };
        });
      } else {
        seasonAudioToggle.classList.add("hidden");
      }
    }

      function getEpisodeUrl(ep, seasonData) {
        if (ep.videoUrl) return ep.videoUrl;
        const mediaId = movie.cinesrcId || movie.videoUrl;
        if (mediaId) {
          const absEp = ep.absoluteEpisode || "";
          const aniId = movie.anilistId || "";
          return `tv_embed:${mediaId}:${seasonData.season}:${ep.episode}:${absEp}:${aniId}`;
        }
        return "";
      }

      function formatEpisodeAirDate(dateStr) {
        if (!dateStr || typeof dateStr !== "string") return "";
        if (/^[A-Za-z]+\s+\d+,\s*\d{4}/.test(dateStr)) return dateStr;
        const parts = dateStr.trim().split(/[-/]/);
        if (parts.length >= 3) {
          const year = parts[0].trim();
          const month = parseInt(parts[1], 10) - 1;
          const day = parseInt(parts[2], 10);
          const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
          if (month >= 0 && month < 12 && day > 0 && day <= 31) {
            return `${months[month]} ${day}, ${year}`;
          }
        }
        return "";
      }

      function renderEpisodes(seasonNum, filter = "") {
        const seasonData = movie.seasons.find((s) => s.season === parseInt(seasonNum));
        if (!seasonData) return;

        let filtered = filter
          ? seasonData.episodes.filter(ep => ep.title.toLowerCase().includes(filter.toLowerCase()))
          : [...seasonData.episodes];

        if (state.episodeSortOrder === "desc") {
          filtered.reverse();
        }

        episodeGrid.innerHTML = filtered.map((ep) => {
          const resolvedUrl = getEpisodeUrl(ep, seasonData);
          const thumb = ep.thumbnail || movie.backdrop || movie.poster || "";
          const duration = ep.duration || "";
          const overview = ep.overview || "";
          const airDate = formatEpisodeAirDate(ep.airDate || ep.releaseDate);
          const ratingVal = (ep.rating !== undefined && ep.rating !== null && !isNaN(ep.rating)) ? Number(ep.rating).toFixed(1) : "";
          return `
        <div class="episode-row ${resolvedUrl ? "" : "episode-unavailable"}" 
             data-video="${resolvedUrl}" 
             data-title="${movie.title} — S${seasonData.season}E${ep.episode}: ${ep.title}"
             data-episode="${ep.episode}"
             data-abs-episode="${ep.absoluteEpisode || ''}"
             title="${resolvedUrl ? "Click to watch" : "Not available yet"}">
          <div class="episode-row-thumb">
            ${thumb ? `<img src="${thumb}" alt="${ep.title}" loading="lazy" class="ep-thumb-img">` : ""}
            <div class="ep-thumb-overlay">
              <span class="ep-num-badge">${ep.episode}</span>
              ${resolvedUrl ? '<div class="ep-play-circle">▶</div>' : ""}
            </div>
          </div>
          <div class="episode-row-info">
            <h4 class="ep-row-title notranslate" translate="no">${ep.title}</h4>
            <div class="ep-row-meta">
              ${ratingVal ? `<span class="ep-row-rating" title="IMDb Rating: ${ratingVal}">★ ${ratingVal}</span>` : ""}
              ${airDate ? `<span class="ep-row-date">${airDate}</span>` : ""}
              ${duration ? `<span class="ep-row-duration">${duration}</span>` : ""}
            </div>
            ${overview ? `<p class="ep-row-overview">${overview}</p>` : ""}
          </div>
          ${resolvedUrl ? `` : `<span class="episode-soon">Soon</span>`}
        </div>
      `;
        }).join("");

        // Click to play episode
        episodeGrid.querySelectorAll(".episode-row:not(.episode-unavailable)").forEach((card) => {
          card.style.cursor = 'pointer';
          card.onclick = (e) => {
            e.stopPropagation();
            const videoUrl = card.dataset.video;
            const epTitle = card.dataset.title;
            const epNum = parseInt(card.dataset.episode);
            const absNum = card.dataset.absEpisode ? parseInt(card.dataset.absEpisode) : epNum;
            const targetEp = seasonData.episodes.find(x => x.episode === epNum);
            const mediaId = movie.id || movie.videoUrl || movie.title;
            openVideoPlayerWithUrl(videoUrl, epTitle, mediaId, { season: seasonData.season, episode: epNum, absoluteEpisode: absNum, ...targetEp });
          };
        });
      }

      renderEpisodes(seasonSelect.value);

      // Handle custom option click
      seasonSelectOptions.querySelectorAll(".custom-option").forEach((opt) => {
        opt.onclick = (e) => {
          e.stopPropagation();
          const val = opt.getAttribute("data-value");
          seasonSelect.value = val;
          seasonSelectTrigger.querySelector("span").textContent = `Season ${val}`;

          seasonSelectOptions.querySelectorAll(".custom-option").forEach(o => o.classList.remove("selected"));
          opt.classList.add("selected");

          customSeasonSelect.classList.remove("open");
          renderEpisodes(val);

          const epSearch = document.getElementById("episodeSearch");
          if (epSearch && epSearch.value) {
            renderEpisodes(val, epSearch.value);
          }
        };
      });

      // Search filter
      const epSearch = document.getElementById("episodeSearch");
      if (epSearch) {
        epSearch.value = "";
        epSearch.oninput = () => renderEpisodes(seasonSelect.value, epSearch.value);
      }

      // Sort button
      const sortBtn = document.getElementById("episodeSortBtn");
      if (sortBtn) {
        sortBtn.onclick = () => {
          state.episodeSortOrder = state.episodeSortOrder === "desc" ? "asc" : "desc";
          sortBtn.querySelector("span").textContent = state.episodeSortOrder === "desc" ? "Z-A" : "A-Z";
          renderEpisodes(seasonSelect.value, epSearch ? epSearch.value : "");
        };
      }

      // Play button plays first available episode of the selected season
      playBtn.onclick = () => {
        const seasonData = movie.seasons.find((s) => s.season === parseInt(seasonSelect.value)) || movie.seasons[0];
        if (!seasonData) return;
        const firstEp = seasonData.episodes[0];
        if (!firstEp) return;
        const epUrl = getEpisodeUrl(firstEp, seasonData);
        if (epUrl) {
          const mediaId = movie.id || movie.videoUrl || movie.title;
          const epTitle = `${movie.title} - S${seasonData.season} E${firstEp.episode}: ${firstEp.title || ''}`;
          openVideoPlayerWithUrl(epUrl, epTitle, mediaId, { season: seasonData.season, episode: firstEp.episode, ...firstEp });
        }
      };

    } else {
      // Movie ΓÇö hide TV section
      tvSection.classList.add("hidden");
      playBtn.onclick = () => {
        openVideoPlayer(movie.id);
      };
    }

    // Similars Button Logic
    const similarsBtn = document.getElementById("detailsSimilarsBtn");
    const similarsText = document.getElementById("detailsSimilarsText");
    if (similarsText) {
      const isCkb = document.cookie.includes("googtrans=/en/ckb");
      const isAr = document.cookie.includes("googtrans=/en/ar");
      similarsText.textContent = isCkb ? "هاوشێوە" : (isAr ? "أعمال مشابهة" : "Similars");
    }
    if (similarsBtn) {
      similarsBtn.onclick = () => {
        const section = document.getElementById("detailsSimilarsSection");
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
    }

    // Switch to details page view
    switchView("details");

    // Fade back in
    detailsSection.style.opacity = "0";
    detailsSection.style.transition = "none";
    void detailsSection.offsetWidth; // Force reflow
    detailsSection.style.transition = "opacity 0.3s ease-in-out";
    detailsSection.style.opacity = "1";
  }, 300); // end of setTimeout
}

// ==========================================
// API SCRAPING FOR RAW STREAMS
// ==========================================
/**
 * Attempt to fetch a raw .m3u8 stream from an open-source API (e.g. Consumet).
 * If this fails, the player will automatically fall back to the iframe embed.
 */
async function fetchRawStream(tmdbId, type, season = null, episode = null) {
  // Since you don't have a local API running yet, we return null immediately
  // to avoid the 2-second timeout delay before falling back to the iframe.
  return null;

  try {
    const baseUrl = "http://localhost:3000/meta/tmdb";
    let url = type === "TV Show"
      ? `${baseUrl}/info/${tmdbId}?type=tv`
      : `${baseUrl}/info/${tmdbId}?type=movie`;

    const infoRes = await fetch(url);
    if (!infoRes.ok) return null;
    const infoData = await infoRes.json();

    let mediaId = infoData.id;
    if (type === "TV Show") {
      const epData = infoData.seasons.find(s => s.season === season)?.episodes.find(e => e.episode === episode);
      if (!epData) return null;
      mediaId = epData.id;
    }

    const streamRes = await fetch(`${baseUrl}/watch/${mediaId}?id=${infoData.id}`);
    if (!streamRes.ok) return null;
    const streamData = await streamRes.json();

    // Find the highest quality or default m3u8
    const source = streamData.sources?.find(s => s.quality === "auto" || s.quality === "1080p") || streamData.sources?.[0];
    return source ? source.url : null;
  } catch (error) {
    console.warn("Failed to fetch raw stream:", error);
    return null;
  }
}

function syncServerPillsUI(server) {
  let activeSrv = server || localStorage.getItem("cw_selected_server_v2") || "vidlink";
  if (activeSrv === 'artplayer') activeSrv = 'vidlink';
  document.querySelectorAll(".details-server-btn, .server-btn, .panel-server-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.server === activeSrv);
  });
}

function selectPlayerServer(srv) {
  if (!srv) return;
  localStorage.setItem("cw_selected_server_v2", srv);
  localStorage.setItem("cw_selected_server", srv);
  syncServerPillsUI(srv);
  const videoModal = document.getElementById("videoModal");
  if (videoModal && !videoModal.classList.contains("hidden")) {
    const centerOverlay = document.getElementById("videoCenterOverlay");
    if (centerOverlay) {
      centerOverlay.innerHTML = '<ion-icon name="sync-outline" class="spin"></ion-icon>';
      centerOverlay.style.display = "flex";
      centerOverlay.style.animation = "none";
    }
    updateIframeServer(srv);
  }
}

function formatPlayerAirDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return "";
  if (/^[A-Za-z]+\s+\d+,\s*\d{4}/.test(dateStr)) return dateStr;
  const parts = dateStr.trim().split(/[-/]/);
  if (parts.length >= 3) {
    const year = parts[0].trim();
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    if (month >= 0 && month < 12 && day > 0 && day <= 31) {
      return `${months[month]} ${day}, ${year}`;
    }
  }
  return "";
}

function renderPlayerDetailsPanel(movie, epData) {
  // Player is 100% full-screen; episodes and metadata are handled on the main details page
}

// Open the video player with a direct URL (used for TV episodes)
async function openVideoPlayerWithUrl(videoUrl, displayTitle, parentId = null, epData = null) {
  state.currentPlayingMovie = { id: parentId || "_episode_", title: displayTitle, epData };
  if (parentId && parentId !== "_episode_") {
    recordWatchEvent(parentId);
  }

  const modal = document.getElementById("videoModal");
  const video = document.getElementById("videoElement");
  const iframe = document.getElementById("iframeElement");
  const controlsBar = document.getElementById("playerControlsBar");
  const centerOverlay = document.getElementById("videoCenterOverlay");
  const title = document.getElementById("playerMovieTitle");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const serverWrap = document.getElementById("serverSelectWrap");

  // ── Populate info area ──
  let parentMovie = null;
  if (parentId && parentId !== "_episode_") {
    parentMovie = MOVIES.find(m => m.id === parentId || String(m.videoUrl) === String(parentId) || m.title === parentId);
  }
  if (!parentMovie && typeof videoUrl === 'string' && videoUrl.startsWith('tv_embed:')) {
    const parts = videoUrl.split(':');
    const mid = parts[1];
    if (mid) {
      parentMovie = MOVIES.find(m => String(m.videoUrl) === String(mid) || String(m.id) === String(mid) || String(m.cinesrcId) === String(mid));
    }
  }
  if (!parentMovie && displayTitle) {
    parentMovie = MOVIES.find(m => displayTitle.toLowerCase().includes((m.title || '').toLowerCase()));
  }
  renderPlayerDetailsPanel(parentMovie, epData);
  const posterEl = document.getElementById("playerShowPoster");
  const metaEl = document.getElementById("playerMeta");
  const overviewEl = document.getElementById("playerEpOverview");

  if (posterEl) {
    if (parentMovie && parentMovie.poster) {
      posterEl.src = parentMovie.poster;
      posterEl.classList.remove("hidden");
    } else {
      posterEl.classList.add("hidden");
    }
  }

  if (metaEl) {
    if (epData) {
      const dur = parentMovie ? parentMovie.duration : "";
      metaEl.textContent = `Season ${epData.season} · Episode ${epData.episode}${dur ? " · " + dur : ""}`;
    } else if (parentMovie) {
      metaEl.textContent = parentMovie.year ? String(parentMovie.year) : "";
    } else {
      metaEl.textContent = "";
    }
  }

  if (title) {
    title.textContent = displayTitle;
    title.classList.add("notranslate");
    title.setAttribute("translate", "no");
  }

  if (overviewEl) {
    const epObj = epData && parentMovie ? (() => {
      const seasonData = parentMovie.seasons?.find(s => s.season === epData.season);
      return seasonData?.episodes?.find(e => e.episode === epData.episode);
    })() : null;
    const overviewInfo = getLocalizedOverview(epObj).text ? getLocalizedOverview(epObj) : getLocalizedOverview(parentMovie);
    setOverviewElement(overviewEl, overviewInfo);
    if (overviewInfo.text) {
    } else {
      overviewEl.classList.add("hidden");
    }
  }

  // ── Wire Episodes button ──
  const epsBtn = document.getElementById("playerEpisodesBtn");
  
  const isTvShow = !!(parentId && parentMovie && parentMovie.type === "TV Show");
  
  if (epsBtn) {
    epsBtn.classList.toggle("hidden", !isTvShow);
    epsBtn.onclick = () => closeVideoPlayer();
  }

  // ── Wire Next Episode button ──
  const nextEpBtn = document.getElementById("playerNextEpBtn");
  
  if (nextEpBtn) {
    nextEpBtn.classList.toggle("hidden", !epData);
    // nextEpBtn onclick is usually bound elsewhere (e.g., renderPlayerDetailsPanel)
  }

  const videoUrlStr = String(videoUrl || "");
  const ytVideoId = extractYouTubeId(videoUrlStr);
  if (ytVideoId) {
    if (video) { video.classList.add("hidden"); video.pause(); video.src = ""; }
    if (iframe) {
      iframe.classList.remove("hidden");
      iframe.src = `https://www.youtube.com/embed/${ytVideoId}?autoplay=1&rel=0&modestbranding=1`;
    }
    if (controlsBar) controlsBar.classList.add("hidden");
    if (centerOverlay) centerOverlay.style.display = "none";
    if (modal) modal.classList.remove("hidden");
    const playerModal = document.getElementById("playerModal");
    if (playerModal) playerModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    const bttBtn = document.getElementById("backToTopBtn");
    if (bttBtn) bttBtn.style.display = "none";
    return;
  }

  // Unified Custom Player for all media (Anime, Movies, TV Series)
  if (video) { video.classList.add("hidden"); video.pause(); video.src = ""; }
  if (iframe) { iframe.classList.add("hidden"); iframe.src = ""; }
  if (controlsBar) controlsBar.classList.add("hidden");
  if (centerOverlay) centerOverlay.style.display = "none";
  const wmLogo = document.getElementById("playerWatermarkLogo");
  if (wmLogo) wmLogo.style.display = "none";
  initArtPlayerForAnime(videoUrl, parentMovie, parentMovie, epData);
  if (modal) modal.classList.remove("hidden");
  const playerModal = document.getElementById("playerModal");
  if (playerModal) playerModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  const bttBtn = document.getElementById("backToTopBtn");
  if (bttBtn) bttBtn.style.display = "none";
  return;
}

async function openVideoPlayer(movieId, startAtSec = 0) {
  const movie = findMovieByIdOrTitle(movieId);
  if (!movie) return;

  recordWatchEvent(movie.id);

  // If title has seasons (Anime or TV Series), start from S1 E1
  if (movie.seasons && movie.seasons.length > 0) {
    const firstSeason = movie.seasons[0];
    const firstEpisode = firstSeason.episodes[0];
    if (firstEpisode) {
      const mediaId = movie.id || movie.videoUrl || movie.cinesrcId || movie.title;
      const tmdbId = movie.videoUrl || movie.cinesrcId || movie.id;
      const absEp = firstEpisode.absoluteEpisode || '';
      const aniId = movie.anilistId || '';
      openVideoPlayerWithUrl(
        firstEpisode.videoUrl || `tv_embed:${tmdbId}:${firstSeason.season}:${firstEpisode.episode}:${absEp}:${aniId}`,
        `${movie.title} - S${firstSeason.season} E${firstEpisode.episode}: ${firstEpisode.title || ''}`,
        mediaId,
        { ...firstEpisode, season: firstSeason.season }
      );
      return;
    }
  }

  // Single Movies / Standalone Titles
  const mediaId = movie.id || movie.videoUrl || movie.cinesrcId || movie.title;
  openVideoPlayerWithUrl(movie.videoUrl || movie.id, movie.title, mediaId, null);
}

window.openDetailsModal = openDetailsModal;
window.openVideoPlayer = openVideoPlayer;
window.openVideoPlayerWithUrl = openVideoPlayerWithUrl;
window.findMovieByIdOrTitle = findMovieByIdOrTitle;

/**
 * Loads a subtitle file into the video element.
 * Supports:
 *   - Windows local paths: "E:\Movies\subtitle.srt"
 *   - Regular URLs: "https://example.com/sub.vtt"
 *   - Relative paths: "subtitles/movie.srt"
 * Automatically converts SRT → VTT format.
 */
async function loadSubtitleTrack(video, subtitleUrl) {
  try {
    // Convert Windows local path (E:\...) to a file:/// URL
    let fetchUrl = subtitleUrl;
    const isWindowsPath = /^[A-Za-z]:[\\\/]/.test(subtitleUrl);
    if (isWindowsPath) {
      // Replace backslashes with forward slashes for the URL
      const normalized = subtitleUrl.replace(/\\/g, "/");
      fetchUrl = `file:///${normalized}`;
    }

    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error(`Failed to fetch subtitle: ${response.status}`);

    const text = await response.text();

    // Check if it's SRT (starts with a number) or already VTT
    const isSRT = /^\s*\d+\s*\n/m.test(text) && !text.startsWith("WEBVTT");
    const vttContent = isSRT ? convertSrtToVtt(text) : text;

    // Create a blob URL from the VTT content
    const blob = new Blob([vttContent], { type: "text/vtt" });
    const blobUrl = URL.createObjectURL(blob);

    const track = document.createElement("track");
    track.kind = "subtitles";
    track.label = "English";
    track.srclang = "en";
    track.src = blobUrl;
    track.default = true;
    video.appendChild(track);

    // Enable subtitles mode after the track loads
    track.addEventListener("load", () => {
      if (video.textTracks[0]) {
        video.textTracks[0].mode = "showing";
      }
      showToast("Subtitles loaded");
    });

  } catch (err) {
    console.warn("Subtitles could not be loaded:", err.message);
    showToast("Subtitles unavailable");
  }
}

/**
 * Converts SRT subtitle format to WebVTT format.
 */
function convertSrtToVtt(srt) {
  return (
    "WEBVTT\n\n" +
    srt
      .trim()
      // Normalize line endings
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      // Remove cue index numbers (lines that are just a number)
      .replace(/^\d+\s*\n/gm, "")
      // Convert SRT timestamps (00:00:00,000 --> 00:00:00,000)
      // to VTT timestamps (00:00:00.000 --> 00:00:00.000)
      .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2")
      // Ensure there's a blank line between cues
      .replace(/\n{3,}/g, "\n\n")
  );
}


function closeVideoPlayer() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("videoElement");
  const iframe = document.getElementById("iframeElement");
  const movieId = state.currentPlayingMovie ? state.currentPlayingMovie.id : null;

  // Cancel any pending callbacks FIRST before touching src
  video.onloadedmetadata = null;
  video.oncanplay = null;

  if (window.artPlayerInstance) {
    try {
      window.artPlayerInstance.destroy();
    } catch (e) {}
    window.artPlayerInstance = null;
  }
  const artApp = document.getElementById("artplayerApp");
  if (artApp) {
    artApp.classList.add("hidden");
    artApp.innerHTML = "";
    const wmLogo = document.getElementById("playerWatermarkLogo");
    if (wmLogo) wmLogo.style.display = "";
  }

  const serverBar = document.getElementById("playerServerBar");
  if (serverBar) {
    serverBar.classList.add("hidden");
  }

  if (state.currentPlayingMovie && video.currentTime > 0 && !video.classList.contains("hidden")) {
    // Native <video> player — save real progress
    updateContinueWatching(
      state.currentPlayingMovie.id,
      video.currentTime,
      video.duration,
    );
  } else if (state.currentPlayingMovie && iframe && !iframe.classList.contains("hidden") && iframe.src) {
    // Iframe embed (CineSrc etc.) — we can't read playback time from the iframe,
    // so save with a placeholder so the title appears in Continue Watching.
    const cwId = state.currentPlayingMovie.id;
    if (cwId && cwId !== "_episode_" && state.user) {
      state.continueWatching[cwId] = {
        movieId: cwId,
        currentTime: 60,   // placeholder — "in progress"
        duration: 7200,    // placeholder 2h duration
        isIframe: true,
        timestamp: Date.now(),
      };
      if (state.currentPlayingMovie.epData) {
        state.continueWatching[cwId].epData = state.currentPlayingMovie.epData;
      }
      localStorage.setItem(KEYS.CONTINUE, JSON.stringify(state.continueWatching));
      if (window.CW_API && state.user) {
        window.CW_API.syncData(state.favorites, state.continueWatching);
      }
      renderContinueWatchingShelf();
    }
  }

  video.pause();
  // Use load() to fully abort any in-progress network request (important for large local files)
  video.src = "";
  video.load();

  if (iframe) iframe.src = "";
  state.currentPlayingMovie = null;
  modal.classList.add("hidden");
  document.body.style.overflow = ""; // restore scroll
  // Restore back-to-top button
  const bttBtn = document.getElementById("backToTopBtn");
  if (bttBtn) bttBtn.style.display = "";

  // Re-open the details modal so the user returns to the movie/show info page
  if (movieId && movieId !== "_episode_") {
    openDetailsModal(movieId);
  }
}

function setupVideoControls(video) {
  const playPauseBtn = document.getElementById("playPauseBtn");
  const rewindBtn = document.getElementById("rewindBtn");
  const forwardBtn = document.getElementById("forwardBtn");
  const muteBtn = document.getElementById("muteBtn");
  const volumeBar = document.getElementById("volumeBar");
  const seekBar = document.getElementById("seekBar");
  const seekFill = document.getElementById("seekFill");
  const currentTimeText = document.getElementById("currentTimeText");
  const durationText = document.getElementById("durationText");
  const speedSelect = document.getElementById("speedSelect");
  const centerOverlay = document.getElementById("videoCenterOverlay");
  const centerPlayIcon = document.getElementById("centerPlayIcon");

  function togglePlay() {
    if (video.paused) {
      video.play();
      playPauseBtn.textContent = "⏸";
      showCenterAnimation("▶");
    } else {
      video.pause();
      playPauseBtn.textContent = "▶";
      showCenterAnimation("⏸");
    }
  }

  function showCenterAnimation(icon) {
    centerPlayIcon.textContent = icon;
    centerOverlay.classList.remove("hidden");
    setTimeout(() => centerOverlay.classList.add("hidden"), 600);
  }

  playPauseBtn.onclick = togglePlay;
  video.onclick = togglePlay;

  rewindBtn.onclick = () => {
    video.currentTime = Math.max(0, video.currentTime - 10);
  };
  forwardBtn.onclick = () => {
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  };

  muteBtn.onclick = () => {
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? "🔇" : "🔊";
  };

  volumeBar.oninput = (e) => {
    video.volume = e.target.value;
    video.muted = video.volume === 0;
    muteBtn.textContent = video.muted ? "🔇" : "🔊";
  };

  if (speedSelect) {
    speedSelect.onchange = (e) => {
      video.playbackRate = parseFloat(e.target.value);
    };
  }

  // Video time update listener
  let lastSave = 0;
  video.ontimeupdate = () => {
    if (!video.duration) return;

    const current = video.currentTime;
    const duration = video.duration;
    const pct = (current / duration) * 100;

    seekBar.value = pct;
    seekFill.style.width = `${pct}%`;

    currentTimeText.textContent = formatTime(current);
    durationText.textContent = formatTime(duration);

    // Periodically save progress to localStorage (every 3 seconds)
    const now = Date.now();
    if (now - lastSave > 3000 && state.currentPlayingMovie) {
      lastSave = now;
      updateContinueWatching(state.currentPlayingMovie.id, current, duration);
    }
  };

  // Scrubbing
  seekBar.oninput = (e) => {
    const pct = e.target.value;
    const newTime = (pct / 100) * video.duration;
    video.currentTime = newTime;
    seekFill.style.width = `${pct}%`;
  };
}

function openAuthModal() {
  if (typeof window.showAuth === 'function') {
    window.showAuth();
    return;
  }
  const modal = document.getElementById("authOverlay") || document.getElementById("authModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.style.display = "flex";
  modal.style.opacity = "1";
  modal.style.visibility = "visible";
  modal.style.pointerEvents = "auto";
  document.body.style.overflow = "hidden";

  // Reset forms and hide Turnstile widgets
  const loginForm = document.getElementById("loginForm") || document.getElementById("formSignIn");
  const signupForm = document.getElementById("signupForm") || document.getElementById("formSignUp");
  if (loginForm && typeof loginForm.reset === 'function') loginForm.reset();
  if (signupForm && typeof signupForm.reset === 'function') signupForm.reset();

  const cfLogin = document.getElementById("cf-turnstile");
  if (cfLogin) cfLogin.classList.add("hidden");
  const cfSignup = document.getElementById("cf-turnstile-signup");
  if (cfSignup) cfSignup.classList.add("hidden");

  // Clear any leftover error alerts
  const loginAlert = document.getElementById("loginAlert");
  if (loginAlert) { loginAlert.classList.add("hidden"); loginAlert.textContent = ""; }
  const signupAlert = document.getElementById("signupAlert");
  if (signupAlert) { signupAlert.classList.add("hidden"); signupAlert.textContent = ""; }
}
window.openAuthModal = openAuthModal;

function closeAuthModal() {
  if (typeof window.hideAuth === 'function') {
    window.hideAuth();
    return;
  }
  const modal = document.getElementById("authOverlay") || document.getElementById("authModal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.style.opacity = "0";
  modal.style.visibility = "hidden";
  modal.style.pointerEvents = "none";
  modal.style.display = "";
  document.body.style.overflow = "";
}
window.closeAuthModal = closeAuthModal;

function openReportModal(defaultSubject = "") {
  const modal = document.getElementById("reportModal");
  if (!modal) return;
  const subjectInput = document.getElementById("reportSubject");
  if (subjectInput && defaultSubject) {
    subjectInput.value = defaultSubject;
  }
  modal.classList.remove("hidden");
}

function closeReportModal() {
  const modal = document.getElementById("reportModal");
  if (modal) modal.classList.add("hidden");
}

// ==========================================
// VIP MEMBERSHIP & LOCAL WALLET CHECKOUT
// ==========================================

const VIP_WALLETS = {

  mastercard: {
    name: "Mastercard / Qi Card",
    number: "9101 1792 5305",
    copyValue: "910117925305",
    holder: "CineWatch VIP",
    note: "Transfer the plan amount via Qi Services (خدمات كي) or any authorized agent to this account.",
    color: "#f59e0b",
    logoSvg: '<svg viewBox="0 0 36 24" width="26" height="17" fill="none" style="display:block;"><circle cx="12" cy="12" r="11" fill="#EB001B"/><circle cx="24" cy="12" r="11" fill="#F79E1B"/><path d="M18 4.254a10.965 10.965 0 0 0-4.57 7.746A10.965 10.965 0 0 0 18 19.746 10.965 10.965 0 0 0 22.57 12 10.965 10.965 0 0 0 18 4.254z" fill="#FF5F00"/></svg>'
  },
  usdt: {
    name: "USDT / Crypto (TRC-20 & Binance)",
    number: "TFCWRviskL9EWhC17KxjzKWGf7KqLB8vm5",
    holder: "Network: TRON (TRC-20) / Binance",
    note: "Send the exact amount in USDT via TRON (TRC-20) network to this address.",
    color: "#10b981",
    logoSvg: '<svg viewBox="0 0 32 32" width="20" height="20" fill="none" style="display:block;"><circle cx="16" cy="16" r="16" fill="#26A17B"/><path d="M17.922 17.383c-.11.008-.68.04-1.637.04-.766 0-1.393-.031-1.57-.04v-2.316h3.207v2.316zm-3.207-3.15v-1.922h7.457v-3.084H9.828v3.084h7.457v1.922H8.383v3.424c1.826.69 4.887 1.15 8.527 1.15 3.652 0 6.703-.46 8.539-1.15v-3.424H14.715z" fill="#FFFFFF"/></svg>'
  },
  fastpay: {
    name: "FastPay",
    number: "0774 820 1148",
    copyValue: "07748201148",
    holder: "CineWatch VIP",
    note: "Transfer the plan amount via the FastPay app to this phone number.",
    color: "#e11d48",
    logoSvg: '<span class="wallet-tab-icon" style="background:#ffffff; padding:3px 8px; border-radius:6px; display:inline-flex; align-items:center; justify-content:center; height:24px;"><img src="fastpay-logo.png" alt="FastPay" style="height:16px; width:auto; max-width:65px; object-fit:contain; display:block;" /></span>'
  },
  zaincash: {
    name: "ZainCash",
    number: "0774 820 1148",
    copyValue: "07748201148",
    holder: "CineWatch VIP",
    note: "Transfer the plan amount via ZainCash wallet to this phone number.",
    color: "#007a78",
    logoSvg: '<svg viewBox="0 0 52 52" width="22" height="22" fill="none" style="display:block;"><circle cx="26" cy="26" r="26" fill="#007A78"/><g transform="translate(4.5, 3) scale(0.8)"><path d="m 47.863425,22.3321 c 0,-4.995 -3.8425,-8.775 -9.32625,-8.3538 -11.635,0.8925 -13.1375,14.1288 -5.56375,14.975 7.92,0.885 10.755,-7.49 10.9075,-7.9612 0.001,-0.01 0.007,0 0.007,0 0.0175,0.5675 0.43875,12.0912 -11.31125,12.0912 -6.1075,0 -9.24875,-4.99 -9.24875,-9.315 0,-6.4112 6.235,-12.7862 15.03375,-13.1262 4.9275,-0.1913 8.17375,0.9737 10.7175,3.5162 5.18375,5.1838 3.69125,14.9025 -0.50375,19.7025 -6.66,7.6175 -16.02,9.5538 -24.74125,5.6425 -8.72125,-3.91 -11.8475,-15.2325 -6.56125,-24.7062 1.94375,-3.485 9.00375,-11.2488 21.13625,-11.2488 15.40375,0 23.215,10.9188 21.80375,23.745 -1.08,9.8288 -7.05,16.9463 -9.8175,19.9538 -12.15875,13.215 -30.02625,15.8488 -41.2862499,8.9763 -6.19625,-3.7813 -9.79875005,-10.5713 -8.99875005,-18.2525 0.68625,5.5487 3.45250005,10.3487 8.05500005,13.4875 9.2024999,6.2762 24.5924999,7.1387 35.7149999,-5.0925 -11.1775,8.3487 -24.24,8.2237 -33.15875,2.4125 C 2.5366751,43.4471 0.28667505,32.8034 4.2941751,22.2759 c -2.01125,9.385 1.22,18.0862 8.3187499,22.62 11.06375,7.0675 27.18375,3.0037 37.34125,-8.3775 3.46125,-3.8788 5.44625,-9.11 5.3825,-13.885 -0.1075,-7.96 -5.655,-15.1063 -16.855,-15.1063 -11.49625,0 -19.39375,8.8863 -19.39375,16.2838 0,8.2112 5.635,12.8962 12.98625,12.8962 7.2675,0 15.78875,-4.5862 15.78875,-14.3762" fill="#FFFFFF"/></g></svg>'
  },
  fib: {
    name: "First Iraqi Bank (FIB)",
    number: "0774 820 1148",
    copyValue: "07748201148",
    holder: "CineWatch VIP (FIB Direct Transfer)",
    note: "Transfer the plan amount via First Iraqi Bank (FIB) app to this registered phone number.",
    color: "#4fb498",
    logoSvg: '<svg viewBox="0 0 32 32" width="22" height="22" fill="none" style="display:block;"><circle cx="16" cy="16" r="16" fill="#0F172A"/><g transform="translate(4, 3) scale(0.68)"><path d="M25.2993 18.1182L19.9895 14.0447L7.87014 4.80315H16.1996C19.1788 4.80315 21.5973 7.22837 21.5973 10.2008C21.5973 11.0182 21.4149 11.7883 21.0906 12.4841L24.948 15.443C25.8667 13.9096 26.4004 12.1193 26.4004 10.2008C26.4004 4.56671 21.8337 0 16.1996 0H0V4.74911L14.0446 15.5309L14.1392 15.5984L21.5027 21.246C21.6108 21.3136 21.7121 21.3811 21.8135 21.4554L21.9148 21.5297C23.2456 22.5633 24.0833 24.2184 24.0023 26.0559C23.8671 28.9473 21.4216 31.1968 18.5303 31.1968H4.8099V20.3948H16.2132H17.0373L10.7818 15.5984H0.0135036V36H18.6114C24.2454 36 28.8122 31.4333 28.8122 25.7992C28.8122 22.7322 27.4611 19.9827 25.3196 18.1115" fill="#4FB498"/></g></svg>'
  },
  westernunion: {
    name: "Western Union (Bank Deposit)",
    number: "IQ65 FIQB 0031 5606 8010 001",
    copyValue: "IQ65FIQB003156068010001",
    holder: "RAND BAHJAT ALI ALI — First Iraqi Bank (FIB)",
    note: "At your local WU agent, select 'Send to Bank Account'. Enter recipient name: RAND BAHJAT ALI ALI, Country: Iraq, Bank: First Iraqi Bank (FIB), IBAN below. Transfer takes 1–3 business days.",
    color: "#FFD700",
    logoSvg: '<svg viewBox="0 0 48 24" width="36" height="18" fill="none" style="display:block;"><rect width="48" height="24" rx="4" fill="#FFD700"/><text x="24" y="16" font-size="8" font-weight="bold" fill="#000" text-anchor="middle" font-family="Arial,sans-serif">WU</text></svg>'
  }
};

const VIP_TIER_CONFIG = {
  free: {
    name: "Basic",
    monthly: { price: "0", iqd: "", period: "/ forever", btnText: "Current Plan" },
    quarterly: { price: "0", iqd: "", period: "/ forever", btnText: "Current Plan" },
    yearly: { price: "0", iqd: "", period: "/ forever", btnText: "Current Plan" }
  },
  bronze: {
    name: "Advanced",
    monthly: { price: "7.99", iqd: "", period: "/ mo", btnText: "Upgrade to Advanced" },
    quarterly: { price: "17.99", iqd: "", period: "/ 3 mo", btnText: "Upgrade to Advanced" },
    yearly: { price: "99.99", iqd: "", period: "/ year", btnText: "Upgrade to Advanced" }
  },
  gold: {
    name: "Pro",
    monthly: { price: "14.99", iqd: "", period: "/ mo", btnText: "Upgrade to Pro" },
    quarterly: { price: "49.99", iqd: "", period: "/ 3 mo", btnText: "Upgrade to Pro" },
    yearly: { price: "149.99", iqd: "", period: "/ year", btnText: "Upgrade to Pro" }
  },
  diamond: {
    name: "Ultimate",
    yearlyName: "Ultimate 1-Year Pass",
    monthly: { price: "19.99", iqd: "", period: "/ mo", btnText: "Upgrade to Ultimate" },
    quarterly: { price: "99.99", iqd: "", period: "/ 3 mo", btnText: "Upgrade to Ultimate" },
    yearly: { price: "199.99", iqd: "", period: "/ year", btnText: "Upgrade to Ultimate" }
  }
};

let currentVipBillingCycle = "monthly";

let selectedVipTierData = {
  tier: "diamond",
  name: "Ultimate (Monthly)",
  price: "19.99",
  iqd: ""
};

let currentVipWalletKey = "mastercard";

function setVipBillingCycle(cycle) {
  currentVipBillingCycle = cycle;
  const switchEl = document.getElementById("vipBillingSwitch");
  const monthlyBtn = document.getElementById("billingBtnMonthly");
  const quarterlyBtn = document.getElementById("billingBtnQuarterly");
  const yearlyBtn = document.getElementById("billingBtnYearly");

  if (switchEl) switchEl.setAttribute("data-active", cycle);
  if (monthlyBtn) {
    monthlyBtn.classList.toggle("active", cycle === "monthly");
    monthlyBtn.setAttribute("aria-checked", cycle === "monthly");
  }
  if (quarterlyBtn) {
    quarterlyBtn.classList.toggle("active", cycle === "quarterly");
    quarterlyBtn.setAttribute("aria-checked", cycle === "quarterly");
  }
  if (yearlyBtn) {
    yearlyBtn.classList.toggle("active", cycle === "yearly");
    yearlyBtn.setAttribute("aria-checked", cycle === "yearly");
  }

  const cycleLabel = cycle === "yearly" ? "Annual" : cycle === "quarterly" ? "3 Months" : "Monthly";

  // Update Bronze / Advanced
  const bronzeData = VIP_TIER_CONFIG.bronze[cycle] || VIP_TIER_CONFIG.bronze.monthly;
  const amtBronze = document.getElementById("vipAmountBronze");
  const periodBronze = document.getElementById("vipPeriodBronze");
  const localBronze = document.getElementById("vipLocalBronze");
  const btnBronze = document.getElementById("vipBtnBronze");
  if (amtBronze) amtBronze.textContent = bronzeData.price;
  if (periodBronze) periodBronze.textContent = bronzeData.period;
  if (localBronze) localBronze.textContent = "";
  if (btnBronze) {
    btnBronze.textContent = bronzeData.btnText;
    btnBronze.dataset.price = bronzeData.price;
    btnBronze.dataset.iqd = "";
    btnBronze.dataset.name = `Advanced (${cycleLabel})`;
  }

  // Update Gold / Pro
  const goldData = VIP_TIER_CONFIG.gold[cycle] || VIP_TIER_CONFIG.gold.monthly;
  const amtGold = document.getElementById("vipAmountGold");
  const periodGold = document.getElementById("vipPeriodGold");
  const localGold = document.getElementById("vipLocalGold");
  const btnGold = document.getElementById("vipBtnGold");
  if (amtGold) amtGold.textContent = goldData.price;
  if (periodGold) periodGold.textContent = goldData.period;
  if (localGold) localGold.textContent = "";
  if (btnGold) {
    btnGold.textContent = goldData.btnText;
    btnGold.dataset.price = goldData.price;
    btnGold.dataset.iqd = "";
    btnGold.dataset.name = `Pro (${cycleLabel})`;
  }

  // Update Diamond / Ultimate
  const diamondData = VIP_TIER_CONFIG.diamond[cycle] || VIP_TIER_CONFIG.diamond.monthly;
  const amtDiamond = document.getElementById("vipAmountDiamond");
  const periodDiamond = document.getElementById("vipPeriodDiamond");
  const localDiamond = document.getElementById("vipLocalDiamond");
  const btnDiamond = document.getElementById("vipBtnDiamond");
  const diamondTitle = document.getElementById("diamondTitle");
  const diamondTag = document.getElementById("diamondTag");
  const diamondBadge = document.getElementById("diamondBadge");

  if (amtDiamond) amtDiamond.textContent = diamondData.price;
  if (periodDiamond) periodDiamond.textContent = diamondData.period;
  if (localDiamond) localDiamond.textContent = "";
  if (diamondTitle) {
    diamondTitle.textContent = cycle === "yearly" ? "Ultimate 1-Year Pass" : "Ultimate";
  }
  if (diamondTag) {
    diamondTag.textContent = cycle === "yearly" ? "BEST VALUE • 1-YEAR PASS" : cycle === "quarterly" ? "POPULAR • 3 MONTHS" : "ULTIMATE VIP";
  }
  if (diamondBadge) {
    diamondBadge.textContent = cycle === "yearly" ? "1-Year Pass" : cycle === "quarterly" ? "3-Month Pass" : "Ultimate";
  }
  if (btnDiamond) {
    btnDiamond.textContent = diamondData.btnText;
    btnDiamond.dataset.price = diamondData.price;
    btnDiamond.dataset.iqd = "";
    btnDiamond.dataset.name = cycle === "yearly" ? "Ultimate 1-Year Pass" : `Ultimate (${cycleLabel})`;
  }
}
window.setVipBillingCycle = setVipBillingCycle;

function initVipCardLightEffects() {
  const cards = document.querySelectorAll(".vip-plan-card");
  cards.forEach(card => {
    if (card._lightEffectAttached) return;
    card._lightEffectAttached = true;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.removeProperty("--mouse-x");
      card.style.removeProperty("--mouse-y");
    });
  });
}

function openVipModal() {
  const modal = document.getElementById("vipModal");
  if (!modal) return;

  const stepPlans = document.getElementById("vipStepPlans");
  const stepCheckout = document.getElementById("vipStepCheckout");
  if (stepPlans) stepPlans.classList.remove("hidden");
  if (stepCheckout) stepCheckout.classList.add("hidden");

  initVipCardLightEffects();

  modal.classList.remove("hidden");
  void modal.offsetWidth; // force reflow
  modal.classList.add("open");

  document.body.style.overflow = "hidden";
}
window.openVipModal = openVipModal;

function closeVipModal() {
  const modal = document.getElementById("vipModal");
  if (modal) {
    modal.classList.remove("open");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 250);
  }
  document.body.style.overflow = "";
}
window.closeVipModal = closeVipModal;

function selectVipTier(tierData) {
  if (!state.user) {
    if (typeof showToast === 'function') {
      showToast("A free account is required to activate and manage your VIP membership.", "error");
    }
    if (typeof openAuthModal === 'function') {
      openAuthModal();
    }
    return;
  }

  selectedVipTierData = tierData;
  const stepPlans = document.getElementById("vipStepPlans");
  const stepCheckout = document.getElementById("vipStepCheckout");
  if (stepPlans) stepPlans.classList.add("hidden");
  if (stepCheckout) stepCheckout.classList.remove("hidden");

  const nameEl = document.getElementById("checkoutPlanName");
  const usdEl = document.getElementById("checkoutPlanUsd");
  const iqdEl = document.getElementById("checkoutPlanIqd");
  if (nameEl) nameEl.textContent = tierData.name;
  if (usdEl) usdEl.textContent = "$" + tierData.price;
  const dueAmountEl = document.getElementById("checkoutDueAmount");
  if (dueAmountEl) dueAmountEl.textContent = tierData.price;
  if (iqdEl) iqdEl.textContent = tierData.iqd;

  const username = state.user?.name || state.user?.email || "Guest User";

  // In-App Confirm Payment Button
  const submitBtn = document.getElementById("vipSubmitPaymentBtn") || document.getElementById("vipWhatsappBtn");
  if (submitBtn) {
    submitBtn.onclick = () => {
      // Prompt user for OneSignal Push Notification on VIP order submission
      try {
        if (window.OneSignalDeferred) {
          window.OneSignalDeferred.push(async function(OneSignal) {
            try {
              if (OneSignal.Notifications && typeof OneSignal.Notifications.requestPermission === 'function') {
                await OneSignal.Notifications.requestPermission();
              } else if (OneSignal.Slidedown && typeof OneSignal.Slidedown.promptPush === 'function') {
                await OneSignal.Slidedown.promptPush();
              }
              const pushId = OneSignal.User && OneSignal.User.PushSubscription ? OneSignal.User.PushSubscription.id : null;
              if (pushId) localStorage.setItem('cw_onesignal_push_id', pushId);
            } catch(e) {}
          });
        }
      } catch(e) {}
      const refInput = document.getElementById("vipRefInput");
      const refPrefixEl = document.getElementById("vipRefPrefix");
      const refPrefix = refPrefixEl ? (refPrefixEl.value || "+964") : "+964";
      const refVal = refInput ? refInput.value.trim() : "";

      // Determine full international phone from sender phone/ref
      let senderPhone = "";
      let cleanedPhone = refVal.replace(/[^\d+]/g, "");
      if (cleanedPhone.length >= 5) {
        if (cleanedPhone.startsWith("+")) {
          senderPhone = cleanedPhone;
        } else {
          if (cleanedPhone.startsWith("0")) cleanedPhone = cleanedPhone.substring(1);
          senderPhone = refPrefix + cleanedPhone;
        }
      } else {
        senderPhone = refVal;
      }

      if (!refVal) {
        if (typeof showToast === 'function') {
          showToast("Please enter your sender phone number or reference ID");
        } else {
          alert("Please enter your sender phone number or reference ID");
        }
        if (refInput) refInput.focus();
        return;
      }

      // Show processing spinner
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<ion-spinner name="crescent"></ion-spinner> Verifying Payment...';

      // Save order record locally with rich device and time tracking
      function getDeviceType() {
        const ua = navigator.userAgent;
        if (/iPhone/i.test(ua)) return "iPhone (Mobile)";
        if (/iPad/i.test(ua)) return "iPad (Tablet)";
        if (/Android/i.test(ua)) return "Android (Mobile)";
        if (/Mac/i.test(ua)) return "Mac (Desktop)";
        if (/Windows/i.test(ua)) return "Windows (PC)";
        return "Desktop / Web Browser";
      }

      const orderId = "CW-" + Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem('cw_pending_order_id', orderId);
      localStorage.setItem('cw_pending_order_ref', senderPhone || refVal);
      localStorage.setItem('cw_pending_vip_tx', JSON.stringify({ txId: senderPhone || refVal, orderId, plan: tierData.name }));
      
      // Start auto polling for admin approval
      if (window._cwVipPollTimer) clearInterval(window._cwVipPollTimer);
      window._cwVipPollTimer = setInterval(async () => {
        await checkPendingVipStatus();
      }, 3000);
      const now = new Date();
      const timeStr = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const orderData = {
        id: orderId,
        username: username,
        userEmail: state.user?.email || "Guest",
        plan: tierData.name,
        price: "$" + tierData.price + (tierData.iqd ? " (" + tierData.iqd + ")" : ""),
        wallet: VIP_WALLETS[currentVipWalletKey]?.name || currentVipWalletKey,
        reference: refVal,
        device: getDeviceType(),
        status: "Pending",
        createdAt: timeStr,
        pushId: localStorage.getItem('cw_onesignal_push_id') || ''
      };

      try {
        let orders = JSON.parse(localStorage.getItem('cinewatch_vip_orders') || '[]');
        orders.unshift(orderData);
        localStorage.setItem('cinewatch_vip_orders', JSON.stringify(orders));
      } catch(e) {}

      // Insert to Supabase if available
      let sbClient = window.CW_API && window.CW_API.supabase;
      if (sbClient) {
        sbClient.from('vip_orders').insert([{
          order_id: orderId,
          username: username,
          plan: tierData.name,
          price: "$" + tierData.price,
          wallet: orderData.wallet,
          reference: senderPhone || refVal,
          status: 'pending'
        }]).then(({ error }) => {
          if (error) console.error("Supabase insert error:", error);
        });

        // Listen for realtime approval
        const channel = sbClient
          .channel('vip_orders_changes')
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'vip_orders', filter: `order_id=eq.${orderId}` },
            (payload) => {
              if (payload.new && payload.new.status === 'approved') {
                if (!state.user) {
                  state.user = { name: username, email: "", isVip: true, vipTier: tierData.name };
                } else {
                  state.user.isVip = true;
                  state.user.vipTier = tierData.name;
                }
                if (typeof saveUser === 'function') saveUser(state.user);
                if (typeof updateAdsVisibility === 'function') updateAdsVisibility();

                if (typeof showToast === 'function') {
                  showToast("🎉 VIP Request Approved! Your VIP is now active.", "success");
                } else {
                  alert("🎉 VIP Request Approved! Your VIP is now active.");
                }
                
                sessionStorage.setItem('cw_vip_just_approved', 'true');
                setTimeout(() => window.location.reload(), 1000);
                sbClient.removeChannel(channel);
              }
            }
          )
          .subscribe();
      }

      // Send Telegram notification to admin
      try {
        const TELEGRAM_BOT_TOKEN = atob('ODk4MzczMTU5NzpBQUZTcC1leDJCWXJXN2dSb2tmRk9nR3hWUFlLSlhkNHliOA==');
        const TELEGRAM_CHAT_ID = '5719338067';
        const msg =
          `🎬 *New CineWatch VIP Order!*\n\n` +
          `🆔 Order: \`` + `${orderData.id}\`` + `\n` +
          `👤 User: ${orderData.username} (${orderData.userEmail})\n` +
          `📦 Plan: ${orderData.plan} — ${orderData.price}\n` +
          `💳 Payment: ${orderData.wallet}\n` +
          `📞 Sender Phone / Ref: ${refVal}\n` +
          (senderPhone && senderPhone !== refVal ? `📱 International Phone: ${senderPhone}\n` : '') +
          `📱 Device: ${orderData.device}\n` +
          `🕒 Time: ${orderData.createdAt}\n\n` +
          `*Click below to Approve or Deny (automatic SMS notify will be sent):*`;
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: msg,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [[
                { text: "✅ Approve", url: `${window.location.origin}/admin.html?order=${orderId}&action=approved&phone=${encodeURIComponent(senderPhone || refVal)}&pushId=${encodeURIComponent(localStorage.getItem('cw_onesignal_push_id') || '')}` },
                { text: "❌ Deny", url: `${window.location.origin}/admin.html?order=${orderId}&action=denied&phone=${encodeURIComponent(senderPhone || refVal)}&pushId=${encodeURIComponent(localStorage.getItem('cw_onesignal_push_id') || '')}` }
              ]]
            }
          })
        }).catch(() => {});
      } catch(e) {}

      // Keep user in pending state
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<ion-icon name="checkmark-circle-outline" style="font-size: 1.3rem;"></ion-icon> Confirm Payment';
        
        if (typeof showToast === 'function') {
          showToast("✅ Payment submitted! Your transaction is being verified. Please leave this page open.");
        } else {
          alert("✅ Payment submitted! Your transaction is being verified. Please leave this page open.");
        }

        if (typeof closeVipModal === 'function') closeVipModal();
        if (refInput) refInput.value = '';
      }, 1600);
    };
  }

  // Pre-fill username field in checkout
  const usernameField = document.getElementById("checkoutUsername");
  if (usernameField) {
    usernameField.value = username;
  }

  renderVipWalletDetails(currentVipWalletKey);
}

function renderVipWalletDetails(walletKey) {
  currentVipWalletKey = walletKey;
  const container = document.getElementById("walletDetailsBox");
  if (!container) return;

  const w = VIP_WALLETS[walletKey] || VIP_WALLETS.fastpay;
  if (!w) return;

  // Update tabs active state
  document.querySelectorAll(".checkout-method-card").forEach(tab => {
    if(tab.dataset.wallet === walletKey) {
      tab.classList.add("active");
      const radio = tab.querySelector('input[type="radio"]');
      if(radio) radio.checked = true;
    } else {
      tab.classList.remove("active");
    }
  });

  // Dynamic reference label, placeholder, and +964 prefix badge
  const refLabel = document.getElementById("vipRefLabel");
  const refInput = document.getElementById("vipRefInput");
  const refPrefix = document.getElementById("vipRefPrefix");

  if (refLabel && refInput) {
    if (walletKey === 'usdt') {
      refLabel.textContent = "Transaction Hash (TXID) / Sender Address";
      refInput.placeholder = "e.g. 0x123...abc or TR7...";
      if (refPrefix) refPrefix.style.display = 'none';
    } else if (walletKey === 'westernunion') {
      refLabel.textContent = "Western Union MTCN Tracking Number";
      refInput.placeholder = "10-digit MTCN number (e.g. 1234567890)";
      if (refPrefix) refPrefix.style.display = 'none';
    } else if (walletKey === 'mastercard') {
      refLabel.textContent = "Sender Phone Number / Qi Transfer Reference #";
      refInput.placeholder = "77X XXX XXXX or Qi Ref #";
      if (refPrefix) {
        refPrefix.style.display = "inline-flex";
        if (refPrefix.tagName !== "SELECT") refPrefix.textContent = "+964";
      }
    } else {
      refLabel.textContent = `Sender Phone Number / ${w.name} Reference #`;
      refInput.placeholder = "77X XXX XXXX or Transaction ID";
      if (refPrefix) {
        refPrefix.style.display = "inline-flex";
        if (refPrefix.tagName !== "SELECT") refPrefix.textContent = "+964";
      }
    }
  }

  container.style.display = 'block';
  container.innerHTML = `
    <div class="instruction-header">Send Payment To (${w.name}):</div>
    <div class="instruction-number-wrap">
      <span class="instruction-val" id="vipWalletVal">${w.number}</span>
      <button class="instruction-copy-btn" id="vipCopyWalletBtn" type="button">Copy</button>
    </div>
    ${walletKey === 'westernunion' ? `
    <div class="instruction-header" style="margin-top:10px;">Account Name:</div>
    <div class="instruction-number-wrap">
      <span class="instruction-val" id="vipWalletHolder" style="font-size:0.85rem; letter-spacing:0.5px;">RAND BAHJAT ALI ALI</span>
      <button class="instruction-copy-btn" id="vipCopyHolderBtn" type="button">Copy</button>
    </div>
    ` : `<div class="instruction-holder">Account Name: ${w.holder}</div>`}
    ${w.note ? `<div class="instruction-note"><ion-icon name="information-circle-outline" style="font-size:1.2rem; flex-shrink:0;"></ion-icon> ${w.note}</div>` : ''}
  `;

  const copyBtn = document.getElementById("vipCopyWalletBtn");
  if (copyBtn) {
    copyBtn.onclick = () => {
      const copyVal = w.copyValue || w.number;
      navigator.clipboard.writeText(copyVal).then(() => {
        copyBtn.innerText = "Copied!";
        copyBtn.style.background = "#22c55e";
        setTimeout(() => {
          copyBtn.innerText = "Copy";
          copyBtn.style.background = "";
        }, 2000);
        showToast("Wallet number copied!");
      }).catch(() => {
        showToast("Copied: " + copyVal);
      });
    };
  }

  // Copy button for account holder name (Western Union)
  const copyHolderBtn = document.getElementById("vipCopyHolderBtn");
  if (copyHolderBtn) {
    copyHolderBtn.onclick = () => {
      navigator.clipboard.writeText("RAND BAHJAT ALI ALI").then(() => {
        copyHolderBtn.innerText = "Copied!";
        copyHolderBtn.style.background = "#22c55e";
        setTimeout(() => {
          copyHolderBtn.innerText = "Copy";
          copyHolderBtn.style.background = "";
        }, 2000);
        showToast("Account name copied!");
      }).catch(() => {
        showToast("Copied: RAND BAHJAT ALI ALI");
      });
    };
  }
}

function setupVipEventListeners() {
  const methodCards = document.querySelectorAll(".checkout-method-card");
  methodCards.forEach(card => {
    card.addEventListener("click", () => {
       renderVipWalletDetails(card.dataset.wallet);
    });
  });

  const navVipBtn = document.getElementById("navVipBtn");
  if (navVipBtn) navVipBtn.onclick = () => openVipModal();

  const browseFourKBtn = document.getElementById("browseCard4k") || document.getElementById("browseCardVip");
  if (browseFourKBtn) browseFourKBtn.onclick = (e) => {
    e.preventDefault();
    if (typeof closeBrowseDropdown === "function") closeBrowseDropdown();
    switchView("4k");
  };

  const closeBtn = document.getElementById("closeVipModalBtn");
  if (closeBtn) closeBtn.onclick = () => closeVipModal();

  const modal = document.getElementById("vipModal");
  if (modal) {
    modal.onclick = (e) => {
      if (e.target.id === "vipModal") closeVipModal();
    };
  }

  // Month / Year toggle buttons
  const monthlyBtn = document.getElementById("billingBtnMonthly");
  const quarterlyBtn = document.getElementById("billingBtnQuarterly");
  const yearlyBtn = document.getElementById("billingBtnYearly");
  if (monthlyBtn) {
    monthlyBtn.onclick = () => setVipBillingCycle("monthly");
  }
  if (quarterlyBtn) {
    quarterlyBtn.onclick = () => setVipBillingCycle("quarterly");
  }
  if (yearlyBtn) {
    yearlyBtn.onclick = () => setVipBillingCycle("yearly");
  }

  // Init spotlight light effects
  initVipCardLightEffects();

  const backBtn = document.getElementById("vipBackToPlansBtn");
  if (backBtn) {
    backBtn.onclick = () => {
      const stepPlans = document.getElementById("vipStepPlans");
      const stepCheckout = document.getElementById("vipStepCheckout");
      if (stepPlans) stepPlans.classList.remove("hidden");
      if (stepCheckout) stepCheckout.classList.add("hidden");
    };
  }

  document.querySelectorAll(".select-plan-btn").forEach(btn => {
    btn.onclick = () => {
      selectVipTier({
        tier: btn.dataset.tier,
        name: btn.dataset.name,
        price: btn.dataset.price,
        iqd: btn.dataset.iqd
      });
    };
  });

  const walletTabs = document.getElementById("vipWalletTabs");
  if (walletTabs) {
    walletTabs.querySelectorAll(".wallet-tab").forEach(tab => {
      tab.onclick = () => {
        renderVipWalletDetails(tab.dataset.wallet);
      };
    });
  }

  const submitTxBtn = document.getElementById("vipSubmitTxBtn");
  const txInput = document.getElementById("vipTxIdInput");
  const statusEl = document.getElementById("vipSubmitStatus");
  if (submitTxBtn && txInput) {
    submitTxBtn.onclick = () => {
      const val = txInput.value.trim();
      if (!val) {
        showToast("Please enter your Transaction ID or sender phone number", "error");
        txInput.focus();
        return;
      }

      const txIdVal = txInput.value.trim();
      const cryptoSmsInput = document.getElementById("vipSmsPhoneInput");
      const cryptoSmsPrefixEl = document.getElementById("vipSmsPrefix");
      const cryptoPrefix = cryptoSmsPrefixEl ? (cryptoSmsPrefixEl.value || "+964") : "+964";
      const rawCryptoSmsVal = cryptoSmsInput ? cryptoSmsInput.value.trim() : "";
      let fullCryptoPhone = "";
      if (rawCryptoSmsVal) {
        let cleaned = rawCryptoSmsVal.replace(/[^\d+]/g, '');
        if (cleaned.startsWith("+")) {
          fullCryptoPhone = cleaned;
        } else {
          if (cleaned.startsWith("0")) cleaned = cleaned.substring(1);
          fullCryptoPhone = cryptoPrefix + cleaned;
        }
      }
      const cryptoSmsVal = fullCryptoPhone;
      const orderId = "CW-" + Math.floor(100000 + Math.random() * 900000);
      const pendingTx = {
        txId: txIdVal,
        plan: selectedVipTierData,
        wallet: currentVipWalletKey,
        submittedAt: new Date().toISOString(),
        username: state.user?.name || "Guest"
      };
      
      localStorage.setItem("cw_pending_vip_tx", JSON.stringify(pendingTx));

      let sbClient = window.CW_API && window.CW_API.supabase;
      if (sbClient) {
        sbClient.from('vip_orders').insert([{
          order_id: orderId,
          username: pendingTx.username,
          plan: selectedVipTierData?.name || "Crypto Plan",
          price: selectedVipTierData?.price ? "$" + selectedVipTierData.price : "Crypto",
          wallet: currentVipWalletKey,
          reference: txIdVal,
          status: 'pending'
        }]).then(({ error }) => {
          if (error) console.error("Supabase insert error (Crypto):", error);
        });

        // Listen for realtime approval
        const channel = sbClient
          .channel('crypto_orders_changes')
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'vip_orders', filter: `order_id=eq.${orderId}` },
            (payload) => {
              if (payload.new && payload.new.status === 'approved') {
                if (!state.user) {
                  state.user = { name: pendingTx.username, email: "", isVip: true, vipTier: selectedVipTierData?.name || "Gold" };
                } else {
                  state.user.isVip = true;
                  state.user.vipTier = selectedVipTierData?.name || "Gold";
                }
                if (typeof saveUser === 'function') saveUser(state.user);
                if (typeof updateAdsVisibility === 'function') updateAdsVisibility();

                if (typeof showToast === 'function') {
                  showToast("🎉 VIP Request Approved! Your VIP is now active.", "success");
                }
                setTimeout(() => window.location.reload(), 2000);
                sbClient.removeChannel(channel);
              }
            }
          )
          .subscribe();
      }

      // Send Telegram notification to admin for Crypto
      try {
        const TELEGRAM_BOT_TOKEN = atob('ODk4MzczMTU5NzpBQUZTcC1leDJCWXJXN2dSb2tmRk9nR3hWUFlLSlhkNHliOA==');
        const TELEGRAM_CHAT_ID = '5719338067';
        const msg =
          `🎬 *New CineWatch Crypto VIP Order!*\n\n` +
          `🆔 Order: \`` + `${orderId}\`` + `\n` +
          `👤 User: ${pendingTx.username}\n` +
          `📦 Plan: ${selectedVipTierData?.name || "Crypto Plan"}\n` +
          `💳 Payment: ${currentVipWalletKey}\n` +
          `📞 Reference (TxID): ${txIdVal}\n` +
          `📱 SMS: ${cryptoSmsVal}\n` +
          `🕒 Time: ${pendingTx.submittedAt}`;
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            chat_id: TELEGRAM_CHAT_ID, 
            text: msg, 
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [[
                { text: "✅ Approve", url: `${window.location.origin}/admin.html?order=${orderId}&action=approved&phone=${encodeURIComponent(cryptoSmsVal || txIdVal)}` },
                { text: "❌ Deny", url: `${window.location.origin}/admin.html?order=${orderId}&action=denied&phone=${encodeURIComponent(cryptoSmsVal || txIdVal)}` }
              ]]
            }
          })
        }).catch(() => {});
      } catch(e) {}

      if (statusEl) {
        statusEl.classList.remove("hidden");
        statusEl.innerHTML = `✅ <strong>Receipt Submitted!</strong> We are verifying your transaction. Please leave this page open.`;
      }
      txInput.value = "";
      showToast("Transaction reference submitted! Admin notified.");
    };
  }
}

// ==========================================
// 5. EVENT BINDINGS & LISTENERS
// ==========================================

function bindEventListeners() {
  setupVipEventListeners();

  // Navigation Links & Footer Explore Links
  document.querySelectorAll(".nav-link, .footer-explore-link").forEach((link) => {
    link.onclick = (e) => {
      e.preventDefault();
      if (link.dataset.view === "browse") {
        // If clicking browse directly, switch to movies or toggle dropdown
        switchView("movies");
        return;
      }
      const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
      if (mobileMenuOverlay) mobileMenuOverlay.classList.remove("active");
      if (link.dataset.view) {
        switchView(link.dataset.view);
      }
    };
  });

  // Browse Dropdown Controls & Dismissal
  const browseItem = document.getElementById("navBrowseItem");
  const browseTriggerBtn = document.getElementById("navBrowseTrigger");
  const browseDropdown = document.getElementById("navBrowseDropdown");

  // Move dropdown to body on mobile so it stays fixed to viewport regardless of navbar scroll
  function syncBrowseDropdownPlacement() {
    if (!browseDropdown || !browseItem) return;
    if (window.innerWidth <= 900) {
      if (browseDropdown.parentElement !== document.body) {
        document.body.appendChild(browseDropdown);
      }
    } else {
      if (browseDropdown.parentElement !== browseItem) {
        browseItem.appendChild(browseDropdown);
      }
    }
  }
  window.addEventListener("resize", syncBrowseDropdownPlacement, { passive: true });
  syncBrowseDropdownPlacement();

  let isClosingBrowse = false;

  function closeBrowseDropdown() {
    if (!browseItem) return;
    isClosingBrowse = true;
    browseItem.classList.remove("is-open");
    document.body.classList.remove("mobile-browse-open");
    setTimeout(() => {
      isClosingBrowse = false;
    }, 250);
  }

  function openBrowseDropdown() {
    if (!browseItem || isClosingBrowse) return;
    browseItem.classList.add("is-open");
  }

  function toggleBrowseDropdown() {
    if (!browseItem) return;
    if (browseItem.classList.contains("is-open")) {
      closeBrowseDropdown();
    } else {
      openBrowseDropdown();
    }
  }

  if (browseItem) {
    browseItem.addEventListener("mouseenter", () => {
      openBrowseDropdown();
    });

    browseItem.addEventListener("mouseleave", () => {
      closeBrowseDropdown();
    });

    if (browseTriggerBtn) {
      browseTriggerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBrowseDropdown();
      });
    }

    document.addEventListener("click", (e) => {
      const dropdown = document.getElementById("navBrowseDropdown");
      const isInside = (browseItem && browseItem.contains(e.target)) ||
                       (dropdown && dropdown.contains(e.target)) ||
                       e.target.closest("#mobileDockBrowse") ||
                       e.target.closest("#browseMobileCloseBtn");
      if (!isInside) {
        closeBrowseDropdown();
      }
    });

    const mobileBrowseBackdrop = document.getElementById("mobileBrowseBackdrop");
    if (mobileBrowseBackdrop) {
      mobileBrowseBackdrop.onclick = (e) => {
        e.preventDefault();
        closeBrowseDropdown();
      };
    }

    const browseMobileCloseBtn = document.getElementById("browseMobileCloseBtn");
    if (browseMobileCloseBtn) {
      browseMobileCloseBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeBrowseDropdown();
      };
    }
  }

  // Browse Dropdown Cards (.nav-dropdown-card)
  document.querySelectorAll(".nav-dropdown-card").forEach((card) => {
    card.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Immediately dismiss the dropdown when any card is clicked
      closeBrowseDropdown();

      const targetView = card.dataset.view;
      if (targetView) {
        const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
        if (mobileMenuOverlay) mobileMenuOverlay.classList.remove("active");
        switchView(targetView);
      } else if (card.id === 'browseCardAi') {
        if (typeof window.openAiModal === 'function') {
          window.openAiModal();
        } else {
          const aiModal = document.getElementById('aiModal');
          if (aiModal) {
            aiModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
          }
        }
      } else if (card.id === 'browseCardReport') {
        if (typeof openReportModal === 'function') {
          openReportModal();
        } else {
          const reportModal = document.getElementById('reportModal');
          if (reportModal) {
            reportModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
          }
        }
      } else if (card.id === 'browseCardDownload') {
        window.location.href = 'download.html';
      }
    };
  });

  // Mobile Bottom Dock Event Handlers
  document.querySelectorAll(".mobile-dock-btn").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      const targetView = btn.dataset.view;
      if (targetView) {
        closeBrowseDropdown();
        switchView(targetView);
      } else if (btn.id === "mobileDockBrowse") {
        e.stopPropagation();
        if (document.body.classList.contains("mobile-browse-open")) {
          closeBrowseDropdown();
        } else {
          document.body.classList.add("mobile-browse-open");
          openBrowseDropdown();
        }
      } else if (btn.id === "mobileDockSearch") {
        closeBrowseDropdown();
        if (window.openSearchModal) {
          window.openSearchModal();
        } else {
          const sm = document.getElementById("searchModal");
          if (sm) {
            sm.classList.remove("hidden");
            document.body.style.overflow = "hidden";
          }
        }
      } else if (btn.id === "mobileDockLogin" || btn.id === "mobileDockWatchlist") {
        closeBrowseDropdown();
        if (state.user) {
          if (typeof window.openAccountSidePanel === "function") {
            window.openAccountSidePanel();
          } else {
            const profileBadge = document.getElementById("profileBadgeToggle");
            if (profileBadge) {
              profileBadge.click();
            } else {
              const panel = document.getElementById("accountSidePanel");
              const overlay = document.getElementById("accountPanelOverlay");
              if (panel && overlay) {
                panel.classList.add("open");
                overlay.classList.add("active");
                document.body.style.overflow = "hidden";
              }
            }
          }
        } else {
          if (typeof openAuthModal === "function") {
            openAuthModal();
          } else if (typeof showAuth === "function") {
            showAuth();
          }
        }
      }
    };
  });

  if (document.getElementById("logoBtn")) document.getElementById("logoBtn").onclick = (e) => {
    e.preventDefault();
    const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove("active");
    switchView("home");
  };

  // Genre Filter Bar (home/genre views)
  document.querySelectorAll(".genre-chip").forEach((chip) => {
    chip.onclick = () => {
      document
        .querySelectorAll(".genre-chip")
        .forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const genre = chip.dataset.genre;
      if (genre === "all") {
        renderFilteredGrid(MOVIES, "All Titles");
      } else {
        const filtered = MOVIES.filter((m) => m.genres.includes(genre));
        renderFilteredGrid(filtered, `${genre} Movies`);
      }
    };
  });
  // Browse Section Genre Filter Buttons (Movies / Series / Anime views) — event delegation
  document.addEventListener("click", (e) => {
    const filterBtn = e.target.closest(".browse-filter-btn");
    if (!filterBtn) return;

    // Smoothly slide the clicked filter button into view
    try {
      filterBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    } catch (err) {}

    const section = filterBtn.dataset.section; // "movies" or "series" or "anime"
    const genre = filterBtn.dataset.genre;
    if (section === "movies") {
      state.moviesFilter = genre;
      state.moviesPage = 1; // reset to first page on filter change
      renderMoviesSection();
    } else if (section === "series") {
      state.seriesFilter = genre;
      state.seriesPage = 1;
      renderSeriesSection();
    } else if (section === "anime") {
      state.animeFilter = genre;
      state.animePage = 1;
      renderAnimeSection();
    } else if (section === "fourk") {
      state.fourkFilter = genre;
      state.fourkPage = 1;
      render4kSection();
    }
  });

  // Sliding Filter Bar Navigation Arrows (like Home Poster Carousel Nav)
  document.addEventListener("click", (e) => {
    const scrollBtn = e.target.closest(".filter-scroll-btn");
    if (!scrollBtn) return;
    const targetId = scrollBtn.dataset.target;
    const bar = document.getElementById(targetId);
    if (bar) {
      const scrollAmount = scrollBtn.classList.contains("prev") ? -320 : 320;
      bar.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  });

  // Update filter arrow button visibility based on scroll position
  function updateFilterScrollNav(bar) {
    if (!bar) return;
    const wrapper = bar.closest(".browse-filter-wrapper");
    if (!wrapper) return;
    const prevBtn = wrapper.querySelector(".filter-scroll-btn.prev");
    const nextBtn = wrapper.querySelector(".filter-scroll-btn.next");
    const maxScroll = bar.scrollWidth - bar.clientWidth;

    if (maxScroll <= 8) {
      if (prevBtn) prevBtn.classList.add("is-hidden");
      if (nextBtn) nextBtn.classList.add("is-hidden");
      wrapper.classList.remove("has-scroll-left");
      wrapper.classList.add("at-scroll-end");
      return;
    }

    if (prevBtn) {
      prevBtn.classList.toggle("is-hidden", bar.scrollLeft <= 8);
    }
    wrapper.classList.toggle("has-scroll-left", bar.scrollLeft > 8);

    if (nextBtn) {
      nextBtn.classList.toggle("is-hidden", bar.scrollLeft >= maxScroll - 8);
    }
    wrapper.classList.toggle("at-scroll-end", bar.scrollLeft >= maxScroll - 8);
  }
  window.updateFilterScrollNav = updateFilterScrollNav;

  // Initialize scroll listeners & drag-to-scroll on browse filter bars
  document.querySelectorAll(".browse-filter-bar").forEach((bar) => {
    bar.addEventListener("scroll", () => updateFilterScrollNav(bar), { passive: true });
    setTimeout(() => updateFilterScrollNav(bar), 150);

    // Drag-to-scroll with mouse
    let isDown = false;
    let startX;
    let scrollLeft;
    let hasDragged = false;

    bar.addEventListener("mousedown", (e) => {
      isDown = true;
      hasDragged = false;
      bar.style.scrollBehavior = "auto";
      startX = e.pageX - bar.offsetLeft;
      scrollLeft = bar.scrollLeft;
    });

    bar.addEventListener("mouseleave", () => {
      if (!isDown) return;
      isDown = false;
      bar.style.scrollBehavior = "smooth";
    });

    bar.addEventListener("mouseup", () => {
      isDown = false;
      bar.style.scrollBehavior = "smooth";
    });

    bar.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - bar.offsetLeft;
      const walk = (x - startX) * 1.5;
      bar.scrollLeft = scrollLeft - walk;
      if (Math.abs(walk) > 5) hasDragged = true;
    });

    bar.addEventListener("click", (e) => {
      if (hasDragged) {
        e.stopPropagation();
        e.preventDefault();
        hasDragged = false;
      }
    }, true);
  });

  window.addEventListener("resize", () => {
    document.querySelectorAll(".browse-filter-bar").forEach(updateFilterScrollNav);
  });

  // Carousel Buttons
  document.querySelectorAll(".carousel-nav").forEach((btn) => {
    btn.onclick = () => {
      const trackId = btn.dataset.target;
      const track = document.getElementById(trackId);
      if (track) {
        const scrollAmount = btn.classList.contains("prev") ? -500 : 500;
        track.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    };
  });

  // Drag-to-scroll on all carousel tracks (mouse + touch)
  document.querySelectorAll(".carousel-track").forEach((track) => {
    let isDown = false;
    let startX;
    let scrollLeft;
    let hasDragged = false;

    track.addEventListener("mousedown", (e) => {
      isDown = true;
      hasDragged = false;
      track.style.scrollBehavior = "auto";
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      e.preventDefault();
    });

    track.addEventListener("mouseleave", () => {
      if (!isDown) return;
      isDown = false;
      track.style.scrollBehavior = "smooth";
    });

    track.addEventListener("mouseup", () => {
      isDown = false;
      track.style.scrollBehavior = "smooth";
    });

    track.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      let walk = (x - startX) * 1.5; // scroll speed multiplier

      track.scrollLeft = scrollLeft - walk;
      if (Math.abs(walk) > 5) hasDragged = true;
    });

    // Prevent click events on cards when dragging
    track.addEventListener("click", (e) => {
      if (hasDragged) {
        e.stopPropagation();
        e.preventDefault();
        hasDragged = false;
      }
    }, true);

    // Touch support
    let touchStartX;
    let touchScrollLeft;

    track.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].pageX - track.offsetLeft;
      touchScrollLeft = track.scrollLeft;
      track.style.scrollBehavior = "auto";
    }, { passive: true });

    track.addEventListener("touchmove", (e) => {
      const x = e.touches[0].pageX - track.offsetLeft;
      let walk = (x - touchStartX) * 1.5;

      track.scrollLeft = touchScrollLeft - walk;
    }, { passive: true });

    track.addEventListener("touchend", () => {
      track.style.scrollBehavior = "smooth";
    });
  });

  // Global Movie Card Click Delegation
  document.addEventListener("click", (e) => {
    // Favorite Button Click
    const favBtn = e.target.closest(".card-fav-btn");
    if (favBtn) {
      e.stopPropagation();
      const movieId = favBtn.dataset.id;
      toggleFavorite(movieId);
      return;
    }


    // Center Play Button
    const playBtn = e.target.closest(".card-center-play");
    if (playBtn) {
      e.stopPropagation();
      const movieId = playBtn.dataset.id;
      const resumeTime = parseFloat(playBtn.dataset.resumeTime || 0);
      openVideoPlayer(movieId, resumeTime);
      return;
    }

    // Entire Movie Card Click -> Details Modal (handles both carousel & browse cards)
    const card = e.target.closest(".movie-card") || e.target.closest(".nav-dropdown-card");
    if (card) {
      const movieId = card.dataset.id;

      // Intercept click if in Continue Watching selection mode
      if (state.isCwSelectionMode && card.classList.contains("continue-card") && state.activeView === "continue") {
        if (state.cwSelectedItems.has(movieId)) {
          state.cwSelectedItems.delete(movieId);
        } else {
          state.cwSelectedItems.add(movieId);
        }
        renderContinueWatchingPage();
        return;
      }

      openDetailsModal(movieId);
    }
  });

  // ── Fuzzy Search Helper ──
  // Normalizes a string: lowercase, strip hyphens/special chars/spaces for loose matching
  function norm(str) {
    if (!str) return '';
    return String(str).toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  // Returns a relevance score — higher = better match
  function searchScore(movie, rawQuery) {
    const q = rawQuery.trim().toLowerCase();
    const qNorm = norm(q);
    if (!qNorm) return 0;

    let score = 0;
    const title = movie.title.toLowerCase();
    const titleNorm = norm(movie.title);

    // Exact match
    if (titleNorm === qNorm) {
      score += 200;
    }
    // Starts with match
    else if (titleNorm.startsWith(qNorm)) {
      score += 150;
    }
    // Exact substring match on normalized title (handles "spiderman" → "Spider-Man")
    else if (titleNorm.includes(qNorm)) {
      score += 100;
    }
    // Partial word match on real title
    else if (title.includes(q)) {
      score += 90;
    }

    // Check individual query words against title words
    const queryWords = q.split(/\s+/).filter(Boolean);
    if (queryWords.length > 0) {
      const titleWords = title.split(/[\s\-:,.'!?&]+/).filter(Boolean);
      let matchedWordCount = 0;
      queryWords.forEach(qw => {
        const nw = norm(qw);
        if (nw && titleWords.some(tw => norm(tw).includes(nw))) {
          matchedWordCount++;
        }
      });
      // REQUIRE all words to match the title to be considered a strong title match
      if (matchedWordCount === queryWords.length) {
        score += 80;
      } else if (matchedWordCount > 0) {
        // Partial multi-word match (e.g. 2 out of 3 words match)
        score += (matchedWordCount / queryWords.length) * 60;
      }
    }

    // Boost score slightly for popularity/rating to break ties and show better results first
    if (score > 0) {
      if (movie.trending) score += 5;
      if (movie.featured) score += 5;
      if (typeof movie.rating === "number" || (!isNaN(Number(movie.rating)) && movie.rating !== "")) {
        score += Number(movie.rating) / 10;
      }
    }

    return score;
  }

  function fuzzySearch(query) {
    return MOVIES
      .map(m => ({ movie: m, score: searchScore(m, query) }))
      .filter(({ score, movie }) => {
        if (score === 0) return false;
        if (state.searchFilter === 'movie' && movie.type !== 'Movie') return false;
        if (state.searchFilter === 'series' && movie.type !== 'TV Show') return false;
        return true;
      })
      .sort((a, b) => b.score - a.score)
      .map(({ movie }) => movie);
  }

  // ── Search Modal ──
  const navSearchBtn = document.getElementById("navSearchBtn");
  const searchModal = document.getElementById("searchModal");
  const searchModalClose = document.getElementById("searchModalClose");
  const searchModalBackdrop = document.getElementById("searchModalBackdrop");
  const searchInput = document.getElementById("searchInput");
  const searchClearBtn = document.getElementById("searchClearBtn");
  const searchDropdown = document.getElementById("searchDropdown");
  const searchRecentSection = document.getElementById("searchRecentSection");
  const searchRecentList = document.getElementById("searchRecentList");
  const clearRecentBtn = document.getElementById("clearRecentBtn");
  const searchFilterBtn = document.getElementById("searchFilterBtn");
  const searchFilterDropdown = document.getElementById("searchFilterDropdown");

  // Load Recents
  function getRecentSearches() {
    try {
      return JSON.parse(localStorage.getItem("recentSearches")) || [];
    } catch {
      return [];
    }
  }

  function saveRecentSearch(query) {
    if (window.__cwPreferencesAllowed === false) return;
    let recents = getRecentSearches();
    recents = recents.filter(r => r.toLowerCase() !== query.toLowerCase());
    recents.unshift(query);
    if (recents.length > 5) recents.pop();
    localStorage.setItem("recentSearches", JSON.stringify(recents));
  }

  function renderRecentSearches() {
    const recents = getRecentSearches();
    if (recents.length > 0) {
      searchRecentSection.classList.remove("hidden");
      searchRecentList.innerHTML = recents.map(r => `
        <div class="search-recent-item" data-query="${r}">
          <ion-icon name="time-outline"></ion-icon>
          <span>${r}</span>
        </div>
      `).join("");
    } else {
      searchRecentSection.classList.add("hidden");
    }
  }

  function openSearchModal() {
    searchModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    if (searchInput) {
      searchInput.value = "";
      searchClearBtn.classList.add("hidden");
      searchDropdown.classList.add("hidden");
    }
    renderRecentSearches();
    // slight delay so CSS transition fires
    setTimeout(() => searchInput && searchInput.focus(), 100);
  }

  function closeSearchModal() {
    searchModal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  if (navSearchBtn) navSearchBtn.onclick = openSearchModal;
  if (searchModalClose) searchModalClose.onclick = closeSearchModal;
  
  // Search Type Switcher (Segmented Control)
  const searchTypeSwitcher = document.getElementById("searchTypeSwitcher");
  if (searchTypeSwitcher) {
    searchTypeSwitcher.querySelectorAll(".type-switch-btn").forEach(btn => {
      btn.onclick = () => {
        searchTypeSwitcher.querySelectorAll(".type-switch-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.searchFilter = btn.dataset.filter || "all";

        if (searchInput && searchInput.value.trim().length > 0) {
          searchInput.dispatchEvent(new Event('input'));
        }
      };
    });
  }

  if (searchModalBackdrop) searchModalBackdrop.onclick = closeSearchModal;

  // Clear Recents
  if (clearRecentBtn) {
    clearRecentBtn.onclick = () => {
      localStorage.removeItem("recentSearches");
      renderRecentSearches();
    };
  }

  // Click on a recent search chip
  if (searchRecentList) {
    searchRecentList.onclick = (e) => {
      const item = e.target.closest(".search-recent-item");
      if (item && searchInput) {
        const query = item.dataset.query;
        searchInput.value = query;
        searchInput.dispatchEvent(new Event('input'));
      }
    };
  }

  // Click on a Quick Category / Trend Tag Chip
  const searchQuickTags = document.getElementById("searchQuickTags");
  if (searchQuickTags) {
    searchQuickTags.onclick = (e) => {
      const chip = e.target.closest(".search-tag-chip");
      if (chip && searchInput) {
        const query = chip.dataset.search;
        searchInput.value = query;
        searchInput.dispatchEvent(new Event('input'));
      }
    };
  }

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !searchModal.classList.contains("hidden")) {
      closeSearchModal();
    }
  });

  if (searchInput) {
    searchInput.oninput = (e) => {
      const query = e.target.value.trim().toLowerCase();
      const exploreSec = document.getElementById("searchExploreSection");

      if (query.length > 0) {
        if (searchClearBtn) searchClearBtn.classList.remove("hidden");
        if (searchRecentSection) searchRecentSection.classList.add("hidden");
        if (exploreSec) exploreSec.classList.add("hidden");

        const matches = fuzzySearch(query);
        if (matches.length > 0) {
          searchDropdown.innerHTML = matches
            .slice(0, 15)
            .map(
              (m, i) => `
            <div class="search-item" data-id="${m.id}" style="animation-delay: ${i * 30}ms">
              <img src="${m.poster || m.backdrop}" alt="${m.title}" loading="lazy">
              <div class="search-item-info">
                <div class="search-item-title notranslate" translate="no">${m.title}</div>
                <div class="search-item-meta notranslate" translate="no">
                  <span class="search-item-badge">${m.type || (m.seasons ? 'TV Show' : 'Movie')}</span>
                  <span>${m.year || ''}</span>
                  <span class="search-item-rating">⭐ ${formatRating(m.rating)}</span>
                </div>
              </div>
              <div class="search-item-action">
                <ion-icon name="arrow-forward-outline"></ion-icon>
              </div>
            </div>
          `,
            )
            .join("");
          searchDropdown.classList.remove("hidden");
        } else {
          searchDropdown.innerHTML = `<div class="search-no-results">No titles found matching "<strong>${query}</strong>"</div>`;
          searchDropdown.classList.remove("hidden");
        }
      } else {
        if (searchClearBtn) searchClearBtn.classList.add("hidden");
        if (searchDropdown) searchDropdown.classList.add("hidden");
        if (exploreSec) exploreSec.classList.remove("hidden");
        renderRecentSearches(); // show recents again
      }
    };

    searchInput.onkeydown = (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        searchDropdown.classList.add("hidden");
        if (query.length > 0) {
          saveRecentSearch(query);
          const qLower = query.toLowerCase();
          const matches = fuzzySearch(query);
          closeSearchModal();
          switchView("search");
          renderFilteredGrid(matches, `Search Results for "${query}"`);
        }
      }
    };

    searchClearBtn.onclick = () => {
      searchInput.value = "";
      searchClearBtn.classList.add("hidden");
      searchDropdown.classList.add("hidden");
      renderRecentSearches();
    };

    searchDropdown.onclick = (e) => {
      const item = e.target.closest(".search-item");
      if (item) {
        const movieId = item.dataset.id;
        const movie = MOVIES.find(m => m.id === movieId);
        if (movie) saveRecentSearch(movie.title);
        searchDropdown.classList.add("hidden");
        closeSearchModal();
        openDetailsModal(movieId);
      }
    };
  }

  // Close modals
  if (document.getElementById("closeDetailsBtn")) document.getElementById("closeDetailsBtn").onclick = () => {
    clearTimeout(window._detailsTrailerTimer);
    const detailsSection = document.getElementById("detailsSection");
    if (detailsSection) detailsSection.classList.remove('trailer-bg-active');
    const soundBtn = document.getElementById("detailsSoundBtn");
    if (soundBtn) {
      soundBtn.classList.add("hidden");
      soundBtn.innerHTML = '<ion-icon name="volume-mute"></ion-icon>';
    }
    const prevTrailer = document.getElementById('detailsTrailerIframe');
    if (prevTrailer) prevTrailer.remove();
    const prevWrap = document.querySelector('#detailsBg .trailer-iframe-wrap');
    if (prevWrap) {
      prevWrap.innerHTML = '';
      prevWrap.classList.remove('active');
      prevWrap.classList.add('hidden');
    }

    detailsSection.style.opacity = "0";

    const returnView = state.previousView || "home";
    const previousSection = (returnView && returnView !== 'home') ? returnView : null;
    const restoredUrl = previousSection ? getSectionUrl(previousSection) : window.location.pathname;
    window.history.replaceState(null, '', restoredUrl);

    setTimeout(() => {
      switchView(returnView, true);

      const mainContent = document.getElementById("mainContent");
      const heroBanner = document.getElementById("heroBanner");

      if (mainContent) {
        mainContent.style.opacity = "0";
        mainContent.style.transition = "none";
        void mainContent.offsetWidth;
        mainContent.style.transition = "opacity 0.3s ease-in-out";
        mainContent.style.opacity = "1";
      }

      if (heroBanner && (state.previousView === "home" || !state.previousView)) {
        heroBanner.style.opacity = "0";
        heroBanner.style.transition = "none";
        void heroBanner.offsetWidth;
        heroBanner.style.transition = "opacity 0.3s ease-in-out";
        heroBanner.style.opacity = "1";
      }
    }, 300);
  };
  if (document.getElementById("closePlayerBtn")) document.getElementById("closePlayerBtn").onclick = closeVideoPlayer;
  if (document.getElementById("closePlayerX")) document.getElementById("closePlayerX").onclick = closeVideoPlayer;
  if (document.getElementById("closeAuthBtn")) document.getElementById("closeAuthBtn").onclick = closeAuthModal;

  // Details Server Selector & Panel Server Pills Handlers
  document.querySelectorAll(".details-server-btn, .server-btn, .panel-server-btn").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const srv = btn.dataset.server;
      if (!srv) return;
      selectPlayerServer(srv);
    };
  });

  // Report Modal Handlers
  const headerReportBtn = document.getElementById("headerReportBtn");
  const footerReportLink = document.getElementById("footerReportLink");
  const closeReportBtn = document.getElementById("closeReportBtn");
  const reportModal = document.getElementById("reportModal");
  const reportForm = document.getElementById("reportForm");

  if (headerReportBtn) headerReportBtn.onclick = () => openReportModal();
  if (footerReportLink) footerReportLink.onclick = (e) => { e.preventDefault(); openReportModal(); };
  if (closeReportBtn) closeReportBtn.onclick = () => closeReportModal();
  if (reportModal) {
    reportModal.onclick = (e) => {
      if (e.target.id === "reportModal") closeReportModal();
    };
  }

  if (reportForm) {
    reportForm.onsubmit = async (e) => {
      e.preventDefault();
      const submitBtn = reportForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      const email = document.getElementById("reportEmail").value.trim();
      const subject = document.getElementById("reportSubject").value.trim();
      const message = document.getElementById("reportMessage").value.trim();

      if (!email) { showToast("Please provide your email address."); return; }
      if (!subject) { showToast("Please provide a title or issue type."); return; }
      if (!message) { showToast("Please provide the description of the issue."); return; }

      submitBtn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon> Sending...';
      submitBtn.disabled = true;

      try {
        // 1. Web3Forms Email Submission (Existing)
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: '965583ff-4601-49f3-8adf-bf0a881b0686',
            subject: subject || "CineWatch Report",
            email: email,
            message: message,
            from_name: "CineWatch User"
          })
        });

        const result = await response.json();


        if (response.status === 200) {
          closeReportModal();
          showToast("Thank you! Your report has been sent successfully.");
          reportForm.reset();
        } else {
          showToast("Something went wrong. Please try again.");
          console.error("Web3Forms Error:", result);
        }
      } catch (error) {
        showToast("Network error. Please check your connection and try again.");
        console.error("Fetch Error:", error);
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    };
  }

  // Modal Backdrop Clicks
  if (document.getElementById("detailsModal")) document.getElementById("detailsModal").onclick = (e) => {
    if (e.target.id === "detailsModal")
      document.getElementById("detailsModal").classList.add("hidden");
  };
  if (document.getElementById("authModal")) document.getElementById("authModal").onclick = (e) => {
    if (e.target.id === "authModal") closeAuthModal();
  };

  // Password Visibility Toggle
  const togglePasswordVisibility = (toggleId, inputId) => {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    if (!toggle || !input) return;

    // Use addEventListener and preventDefault to ensure it works reliably
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Use direct property access for the type
      const currentType = input.type || "password";
      const newType = currentType === "password" ? "text" : "password";

      input.type = newType;

      const icon = toggle.querySelector("ion-icon");
      if (icon) {
        // ion-icon uses the name property/attribute
        icon.setAttribute("name", newType === "password" ? "eye-outline" : "eye-off-outline");
      }
    });
  };

  togglePasswordVisibility("toggleLoginPassword", "loginPassword");
  togglePasswordVisibility("toggleSignupPassword", "signupPassword");

  // Password Strength Indicator Logic
  const signupPasswordField = document.getElementById("signupPassword");
  const strengthBar = document.getElementById("passwordStrengthBar");
  const strengthText = document.getElementById("passwordStrengthText");

  const reqLength = document.getElementById("reqLength");
  const reqCapital = document.getElementById("reqCapital");
  const reqNumber = document.getElementById("reqNumber");
  const reqSymbol = document.getElementById("reqSymbol");
  const reqContainer = document.getElementById("passwordReqs");

  if (signupPasswordField && strengthBar && strengthText) {
    signupPasswordField.addEventListener("input", () => {
      const val = signupPasswordField.value;

      // Show checklist only if user has entered something
      if (reqContainer) {
        if (val.length > 0) {
          reqContainer.classList.add("show");
        } else {
          reqContainer.classList.remove("show");
        }
      }

      let strength = 0;

      const isLength = val.length >= 8;
      const isCapital = /[A-Z]/.test(val);
      const isNumber = /[0-9]/.test(val);
      const isSymbol = /[^A-Za-z0-9]/.test(val);

      if (isLength) strength += 1;
      if (isCapital) strength += 1;
      if (isNumber) strength += 1;
      if (isSymbol) strength += 1;

      const updateReq = (el, isValid) => {
        if (!el) return;
        const icon = el.querySelector("ion-icon");
        if (isValid) {
          el.classList.add("valid");
          if (icon) icon.setAttribute("name", "checkmark-circle-outline");
        } else {
          el.classList.remove("valid");
          if (icon) icon.setAttribute("name", "close-circle-outline");
        }
      };

      updateReq(reqLength, isLength);
      updateReq(reqCapital, isCapital);
      updateReq(reqNumber, isNumber);
      updateReq(reqSymbol, isSymbol);

      // Reset classes
      strengthBar.className = "password-strength-bar";
      strengthText.className = "strength-text";

      if (val.length === 0) {
        strengthText.textContent = "";
      } else if (strength <= 1) {
        strengthBar.classList.add("strength-weak");
        strengthText.classList.add("weak");
        strengthText.textContent = "Weak";
      } else if (strength === 2 || strength === 3) {
        strengthBar.classList.add("strength-medium");
        strengthText.classList.add("medium");
        strengthText.textContent = "Medium";
      } else if (strength === 4) {
        strengthBar.classList.add("strength-strong");
        strengthText.classList.add("strong");
        strengthText.textContent = "Strong";
      }
    });
  }

  // Auth Tabs & Validation
  const tabLoginBtn = document.getElementById("tabLoginBtn");
  const tabSignupBtn = document.getElementById("tabSignupBtn");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  tabLoginBtn.onclick = () => {
    if (tabLoginBtn.classList.contains("active")) return;
    tabLoginBtn.classList.add("active");
    tabSignupBtn.classList.remove("active");

    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  };

  tabSignupBtn.onclick = () => {
    if (tabSignupBtn.classList.contains("active")) return;
    tabSignupBtn.classList.add("active");
    tabLoginBtn.classList.remove("active");

    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  };

  // Forgot Password UI flow
  const showResetFormBtn = document.getElementById("showResetFormBtn");
  const backToLoginBtn = document.getElementById("backToLoginBtn");
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  const authTabs = document.querySelector(".auth-tabs");

  if (showResetFormBtn && resetPasswordForm) {
    showResetFormBtn.onclick = (e) => {
      e.preventDefault();
      loginForm.classList.add("hidden");
      if (authTabs) authTabs.classList.add("hidden");
      resetPasswordForm.classList.remove("hidden");
      // Pre-fill email if they already started typing
      const currentEmail = document.getElementById("loginEmail").value.trim();
      if (currentEmail) document.getElementById("resetInput").value = currentEmail;
    };
  }

  if (backToLoginBtn) {
    backToLoginBtn.onclick = (e) => {
      e.preventDefault();
      resetPasswordForm.classList.add("hidden");
      if (authTabs) authTabs.classList.remove("hidden");
      loginForm.classList.remove("hidden");
    };
  }

  if (resetPasswordForm) {
    resetPasswordForm.onsubmit = async (e) => {
      e.preventDefault();
      const inputVal = document.getElementById("resetInput").value.trim();
      const inputErr = document.getElementById("resetError");
      const alertEl = document.getElementById("resetAlert");
      const submitBtn = resetPasswordForm.querySelector("button[type='submit']");

      inputErr.textContent = "";
      alertEl.classList.add("hidden");
      alertEl.textContent = "";
      alertEl.style = ""; // reset inline styles

      if (!inputVal) {
        inputErr.textContent = "Please enter your email.";
        return;
      }

      if (!window.CW_API) {
        alertEl.textContent = "Authentication service not ready.";
        alertEl.classList.remove("hidden");
        return;
      }

      const originalHTML = submitBtn.innerHTML;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      const { data, error } = await window.CW_API.resetPassword(inputVal);

      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;

      if (error) {
        alertEl.textContent = error;
        alertEl.classList.remove("hidden");
      } else {
        alertEl.textContent = "Success! Password reset email sent. Check your inbox.";
        alertEl.classList.remove("hidden");
        alertEl.style.backgroundColor = "rgba(46, 213, 115, 0.1)";
        alertEl.style.color = "#2ed573";
        alertEl.style.borderColor = "rgba(46, 213, 115, 0.3)";
        setTimeout(() => {
          // Go back to login automatically
          resetPasswordForm.classList.add("hidden");
          if (authTabs) authTabs.classList.remove("hidden");
          loginForm.classList.remove("hidden");
          alertEl.classList.add("hidden");
          alertEl.style = ""; // reset styles
        }, 3000);
      }
    };
  }

  const changePasswordForm = document.getElementById("changePasswordForm");
  const cancelCpBtn = document.getElementById("cancelCpBtn");

  if (cancelCpBtn) {
    cancelCpBtn.onclick = (e) => {
      e.preventDefault();
      document.getElementById("authModal").classList.add("hidden");
    };
  }

  if (changePasswordForm) {
    changePasswordForm.onsubmit = async (e) => {
      e.preventDefault();
      const newVal = document.getElementById("cpNewModal").value;
      const confVal = document.getElementById("cpConfirmModal").value;
      const alertEl = document.getElementById("cpAlert");
      const submitBtn = document.getElementById("cpSubmitBtn");

      alertEl.classList.add("hidden");
      alertEl.textContent = "";

      if (!newVal || !confVal) {
        alertEl.textContent = "All fields are required.";
        alertEl.style = "background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 1rem;";
        alertEl.classList.remove("hidden");
        return;
      }
      if (newVal !== confVal) {
        alertEl.textContent = "New passwords do not match.";
        alertEl.style = "background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 1rem;";
        alertEl.classList.remove("hidden");
        return;
      }
      if (newVal.length < 6) {
        alertEl.textContent = "New password must be at least 6 characters.";
        alertEl.style = "background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 1rem;";
        alertEl.classList.remove("hidden");
        return;
      }

      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = "<ion-icon name='hourglass-outline'></ion-icon> Updating...";
      submitBtn.disabled = true;

      if (window.CW_API?.updateUserPassword) {
        const { success, error } = await window.CW_API.updateUserPassword(newVal);
        if (!success) {
          alertEl.textContent = error || "Failed to update password.";
          alertEl.style = "background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 1rem;";
          alertEl.classList.remove("hidden");
        } else {
          alertEl.textContent = "Password updated successfully!";
          alertEl.style = "background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); margin-bottom: 1rem;";
          alertEl.classList.remove("hidden");

          setTimeout(() => {
            document.getElementById("authModal").classList.add("hidden");
            alertEl.classList.add("hidden");
            changePasswordForm.reset();
            showToast("Password updated securely!");
          }, 2000);
        }
      } else {
        alertEl.textContent = "Authentication service unavailable.";
        alertEl.style = "background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 1rem;";
        alertEl.classList.remove("hidden");
      }

      submitBtn.innerHTML = origText;
      submitBtn.disabled = false;
    };
  }

  // Recovery Password Form Submit
  const recoveryPasswordForm = document.getElementById("recoveryPasswordForm");
  if (recoveryPasswordForm) {
    recoveryPasswordForm.onsubmit = async (e) => {
      e.preventDefault();
      const newVal = document.getElementById("recoveryNewModal").value.trim();
      const confirmVal = document.getElementById("recoveryConfirmModal").value.trim();
      const alertEl = document.getElementById("recoveryAlertModal");
      const submitBtn = recoveryPasswordForm.querySelector("button[type='submit']");

      if (newVal !== confirmVal) {
        alertEl.textContent = "Passwords do not match.";
        alertEl.style = "background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 1rem;";
        alertEl.classList.remove("hidden");
        return;
      }
      if (newVal.length < 6) {
        alertEl.textContent = "New password must be at least 6 characters.";
        alertEl.style = "background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 1rem;";
        alertEl.classList.remove("hidden");
        return;
      }

      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = "<ion-icon name='hourglass-outline'></ion-icon> Updating...";
      submitBtn.disabled = true;

      if (window.CW_API?.updateUserPassword) {
        const { success, error } = await window.CW_API.updateUserPassword(newVal);
        if (!success) {
          alertEl.textContent = error || "Failed to update password.";
          alertEl.style = "background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 1rem;";
          alertEl.classList.remove("hidden");
        } else {
          alertEl.textContent = "Password updated successfully!";
          alertEl.style = "background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); margin-bottom: 1rem;";
          alertEl.classList.remove("hidden");

          setTimeout(async () => {
            if (window.CW_API) await window.CW_API.signOut();
            document.getElementById("authModal").classList.add("hidden");
            alertEl.classList.add("hidden");
            recoveryPasswordForm.reset();
            showToast("Password updated! Please log in again.");

            // Re-open auth modal to login form
            setTimeout(() => {
              openAuthModal();
              document.querySelectorAll(".auth-form").forEach((form) => form.classList.add("hidden"));
              document.getElementById("loginForm").classList.remove("hidden");
            }, 300);
          }, 2000);
        }
      } else {
        alertEl.textContent = "Authentication service unavailable.";
        alertEl.style = "background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 1rem;";
        alertEl.classList.remove("hidden");
      }

      submitBtn.innerHTML = origText;
      submitBtn.disabled = false;
    };
  }

  // Detect Supabase Password Recovery Flow
  const handleRecoveryFlow = () => {
    openAuthModal();
    const authTabs = document.querySelector(".auth-tabs");
    if (authTabs) authTabs.classList.add("hidden");
    document.querySelectorAll(".auth-form").forEach((form) => form.classList.add("hidden"));
    if (recoveryPasswordForm) recoveryPasswordForm.classList.remove("hidden");
  };

  window.addEventListener("cw:passwordRecovery", handleRecoveryFlow);

  // Check if we missed the event due to race conditions on load, or if Supabase event failed
  if (window.CW_PENDING_RECOVERY || window.location.hash.includes("type=recovery")) {
    handleRecoveryFlow();
  }

  // Login Submit — Custom Backend API
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();
    const emailErr = document.getElementById("loginEmailError");
    const passErr = document.getElementById("loginPasswordError");
    const alertEl = document.getElementById("loginAlert");
    const submitBtn = loginForm.querySelector("button[type='submit']");

    emailErr.textContent = "";
    passErr.textContent = "";
    alertEl.classList.add("hidden");
    alertEl.textContent = "";

    let valid = true;

    if (!email || !email.includes("@")) {
      emailErr.textContent = "Please enter a valid email address";
      valid = false;
    }
    if (pass.length < 6) {
      passErr.textContent = "Password must be at least 6 characters long";
      valid = false;
    }
    if (!valid) return;

    // Show loading state
    submitBtn.textContent = "Signing in...";
    submitBtn.disabled = true;

    const turnstileToken = document.querySelector('#loginForm [name="cf-turnstile-response"]')?.value;
    if (!turnstileToken) {
      alertEl.textContent = "Please complete the CAPTCHA.";
      alertEl.classList.remove("hidden");
      submitBtn.innerHTML = '<ion-icon name="log-in-outline"></ion-icon> Sign In';
      submitBtn.disabled = false;
      return;
    }
    if (!window.CW_API) {
      alertEl.textContent = "Authentication service not ready. Please refresh the page and try again.";
      alertEl.classList.remove("hidden");
      submitBtn.innerHTML = '<ion-icon name="log-in-outline"></ion-icon> Sign In';
      submitBtn.disabled = false;
      return;
    }

    // Mark that this is a real login action so cw:authChanged knows to reload
    sessionStorage.setItem("cw_loginPending", "1");
    const { user, error } = await window.CW_API.signIn(email, pass, turnstileToken);
    if (error) {
      sessionStorage.removeItem("cw_loginPending"); // clear flag on error
      alertEl.textContent = error;
      alertEl.classList.remove("hidden");
      submitBtn.innerHTML = '<ion-icon name="log-in-outline"></ion-icon> Sign In';
      submitBtn.disabled = false;
      return;
    }
    // As a fallback, also manually save user and update UI in case the event fires late.
    if (user) {
      saveUser(user);
      renderUserBadge();
      updateWatchlistBadge();
    }
    closeAuthModal();
    showToast(`Welcome back!`);
    submitBtn.innerHTML = '<ion-icon name="log-in-outline"></ion-icon> Sign In';
    submitBtn.disabled = false;
  };

  // Signup Submit — Firebase Authentication
  signupForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const pass = document.getElementById("signupPassword").value.trim();
    const nameErr = document.getElementById("signupNameError");
    const emailErr = document.getElementById("signupEmailError");
    const passErr = document.getElementById("signupPasswordError");
    const alertEl = document.getElementById("signupAlert");
    const submitBtn = signupForm.querySelector("button[type='submit']");

    nameErr.textContent = "";
    emailErr.textContent = "";
    passErr.textContent = "";
    alertEl.classList.add("hidden");
    alertEl.textContent = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;

    if (name.length < 2) {
      nameErr.textContent = "Please enter your name";
      valid = false;
    }
    if (!emailRegex.test(email)) {
      emailErr.textContent = "Please enter a valid email address";
      valid = false;
    }

    const isLength = pass.length >= 8;
    const isCapital = /[A-Z]/.test(pass);
    const isNumber = /[0-9]/.test(pass);
    const isSymbol = /[^A-Za-z0-9]/.test(pass);

    if (!isLength || !isCapital || !isNumber || !isSymbol) {
      passErr.textContent = "Please meet all password requirements below.";
      valid = false;
    }
    if (!valid) return;

    // Show loading state
    submitBtn.textContent = "Creating Account...";
    submitBtn.disabled = true;

    const turnstileToken = document.querySelector('#signupForm [name="cf-turnstile-response"]')?.value;
    if (!turnstileToken) {
      alertEl.textContent = "Please complete the CAPTCHA.";
      alertEl.classList.remove("hidden");
      submitBtn.innerHTML = '<ion-icon name="person-add-outline"></ion-icon> Create Account';
      submitBtn.disabled = false;
      return;
    }

    if (window.CW_API) {
      // Mark that this is a real sign-up action so cw:authChanged knows to reload
      sessionStorage.setItem("cw_loginPending", "1");
      const { user, error } = await window.CW_API.signUp(name, email, pass, turnstileToken);
      if (error) {
        sessionStorage.removeItem("cw_loginPending"); // clear flag on error
        alertEl.textContent = error;
        alertEl.classList.remove("hidden");
        submitBtn.innerHTML = '<ion-icon name="person-add-outline"></ion-icon> Create Account';
        submitBtn.disabled = false;
        return;
      }
      // Update UI immediately after successful signup
      if (user) {
        saveUser(user);
        renderUserBadge();
        updateWatchlistBadge();
      }
      closeAuthModal();
      showToast(`Welcome to CineWatch ${name}!`);
    }
    submitBtn.innerHTML = '<ion-icon name="person-add-outline"></ion-icon> Create Account';
    submitBtn.disabled = false;
  };

  // Explore buttons in empty states
  if (document.getElementById("exploreBtn")) {
    document.getElementById("exploreBtn").onclick = () => {
      switchView("movies");
    };
  }
  if (document.getElementById("exploreContinueBtn")) {
    document.getElementById("exploreContinueBtn").onclick = () => {
      switchView("movies");
    };
  }

  // ── Mobile Menu ──
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  const mobileMenuCloseBtn = document.getElementById("mobileMenuCloseBtn");

  function openMobileMenu() {
    mobileMenuOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    mobileMenuOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openMobileMenu);
  if (mobileMenuCloseBtn) mobileMenuCloseBtn.addEventListener("click", closeMobileMenu);

  // Close when tapping the dark backdrop (outside the menu panel)
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener("click", (e) => {
      if (e.target === mobileMenuOverlay) closeMobileMenu();
    });
  }

  // Mobile nav link clicks – switch view and close menu
  document.querySelectorAll(".mobile-nav-links .nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const view = link.dataset.view;
      if (view) switchView(view);
      closeMobileMenu();
    });
  });

  // Mobile search: mirror typing into the main search input and trigger its event
  const mobileSearchInput = document.getElementById("mobileSearchInput");
  const mainSearchInput = document.getElementById("searchInput");
  if (mobileSearchInput && mainSearchInput) {
    mobileSearchInput.addEventListener("input", () => {
      mainSearchInput.value = mobileSearchInput.value;
      mainSearchInput.dispatchEvent(new Event("input", { bubbles: true }));
      closeMobileMenu();
    });
  }

  // Fullscreen button — wired once at init so it always works (movies + series)
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  if (fullscreenBtn && !fullscreenBtn.dataset.fsBound) {
    fullscreenBtn.dataset.fsBound = "1";
    fullscreenBtn.addEventListener("mousedown", (e) => {
      e.preventDefault(); // keep document focus so requestFullscreen() fires reliably on PC
      e.stopPropagation();
      toggleFullscreen();
    });
  }

  ["fullscreenchange", "webkitfullscreenchange"].forEach((evt) => {
    document.addEventListener(evt, updateFullscreenIcon);
  });

  // Keyboard Shortcuts (Space for Play/Pause, F for Fullscreen, ESC to close player)
  document.addEventListener("keydown", (e) => {
    const videoModal = document.getElementById("videoModal");
    if (!videoModal.classList.contains("hidden")) {
      if (e.key === "Escape") {
        closeVideoPlayer();
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        const video = document.getElementById("videoElement");
        if (video.paused) video.play();
        else video.pause();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
    }
  });

  // Video Player Idle State (fade out header and controls on inactivity)
  const videoContainer = document.querySelector(".video-container");
  let idleTimer;

  function resetIdleTimer() {
    if (!videoContainer) return;
    videoContainer.classList.remove("idle");
    clearTimeout(idleTimer);

    // Only set idle timer if video modal is open
    const videoModal = document.getElementById("videoModal");
    if (videoModal && !videoModal.classList.contains("hidden")) {
      idleTimer = setTimeout(() => {
        videoContainer.classList.add("idle");
      }, 7000); // 7 seconds inactivity
    }
  }

  if (videoContainer) {
    videoContainer.addEventListener("mousemove", resetIdleTimer);
    videoContainer.addEventListener("mousedown", resetIdleTimer);
    videoContainer.addEventListener("touchstart", resetIdleTimer);
    videoContainer.addEventListener("mouseleave", () => {
      const videoModal = document.getElementById("videoModal");
      if (videoModal && !videoModal.classList.contains("hidden")) {
        // Short delay so clicks near the edge still register before controls disappear
        idleTimer = setTimeout(() => {
          videoContainer.classList.add("idle");
        }, 2000);
      }
    });
  }

  // ==========================================
  // MOUSE THUMB 4 (BACK) & POPSTATE NAVIGATION
  // ==========================================

  function handleGoBack() {
    // 1. If Video Player is open, close it and return to movie/series info
    const videoModal = document.getElementById("videoModal");
    const playerModal = document.getElementById("playerModal");
    const isVideoOpen = (videoModal && !videoModal.classList.contains("hidden")) ||
                        (playerModal && !playerModal.classList.contains("hidden"));
    if (isVideoOpen) {
      if (typeof closeVideoPlayer === "function") {
        closeVideoPlayer();
        return true;
      }
    }

    // 2. If Details view is open, close it and return smoothly to previous section
    const detailsSection = document.getElementById("detailsSection");
    if (state.activeView === "details" || (detailsSection && !detailsSection.classList.contains("hidden"))) {
      const closeBtn = document.getElementById("closeDetailsBtn");
      if (closeBtn) {
        closeBtn.click();
        return true;
      }
    }

    // 3. If Search modal is open, close it
    const searchModal = document.getElementById("searchModal");
    if (searchModal && !searchModal.classList.contains("hidden")) {
      if (typeof closeSearchModal === "function") closeSearchModal();
      else searchModal.classList.add("hidden");
      document.body.style.overflow = "";
      return true;
    }

    // 4. If AI Assistant modal is open, close it
    const aiModal = document.getElementById("aiModal");
    if (aiModal && !aiModal.classList.contains("hidden")) {
      aiModal.classList.add("hidden");
      document.body.style.overflow = "";
      return true;
    }

    // 5. If Report modal is open, close it
    const reportModal = document.getElementById("reportModal");
    if (reportModal && !reportModal.classList.contains("hidden")) {
      reportModal.classList.add("hidden");
      document.body.style.overflow = "";
      return true;
    }

    // 6. If Auth modal is open, close it
    const authModal = document.getElementById("authModal");
    if (authModal && !authModal.classList.contains("hidden")) {
      if (typeof closeAuthModal === "function") closeAuthModal();
      else authModal.classList.add("hidden");
      document.body.style.overflow = "";
      return true;
    }

    // 7. If Account side panel is open, close it
    const accountPanel = document.getElementById("accountSidePanel");
    if (accountPanel && accountPanel.classList.contains("open")) {
      accountPanel.classList.remove("open");
      const overlay = document.getElementById("accountPanelOverlay");
      if (overlay) overlay.classList.remove("active");
      document.body.style.overflow = "";
      return true;
    }

    // 8. If Mobile menu is open, close it
    const mobileMenu = document.getElementById("mobileMenuOverlay");
    if (mobileMenu && mobileMenu.classList.contains("active")) {
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
      return true;
    }

    // 9. Standard history navigation
    if (window.history.length > 1) {
      window.history.back();
      return true;
    } else if (state.activeView && state.activeView !== "home") {
      switchView("home");
      return true;
    }

    return false;
  }

  let _lastBackEventTime = 0;
  function triggerGoBack() {
    const now = Date.now();
    if (now - _lastBackEventTime < 350) return; // Prevent double trigger across mouseup & pointerup
    _lastBackEventTime = now;
    handleGoBack();
  }

  // Mouse Thumb 4 (Browser Back / XButton1 / button index 3) and Thumb 5 (Forward / button index 4) support
  window.addEventListener("mouseup", (e) => {
    if (e.button === 3) {
      e.preventDefault();
      e.stopPropagation();
      triggerGoBack();
    } else if (e.button === 4) {
      e.preventDefault();
      e.stopPropagation();
      window.history.forward();
    }
  }, true);

  window.addEventListener("pointerup", (e) => {
    if (e.button === 3) {
      e.preventDefault();
      e.stopPropagation();
      triggerGoBack();
    } else if (e.button === 4) {
      e.preventDefault();
      e.stopPropagation();
      window.history.forward();
    }
  }, true);

  window.addEventListener("auxclick", (e) => {
    if (e.button === 3) {
      e.preventDefault();
      e.stopPropagation();
      triggerGoBack();
    } else if (e.button === 4) {
      e.preventDefault();
      e.stopPropagation();
      window.history.forward();
    }
  }, true);

  // Global Popstate Handler (browser Back / Forward buttons & Alt+Left/Right)
  window.addEventListener("popstate", (e) => {
    const videoModal = document.getElementById("videoModal");
    const playerModal = document.getElementById("playerModal");
    if ((videoModal && !videoModal.classList.contains("hidden")) ||
        (playerModal && !playerModal.classList.contains("hidden"))) {
      if (typeof closeVideoPlayer === "function") {
        closeVideoPlayer();
        return;
      }
    }

    const params = new URLSearchParams(window.location.search);
    const deepLinkMovie = params.get('v');

    if (state.activeView === "details" && !deepLinkMovie) {
      const closeBtn = document.getElementById("closeDetailsBtn");
      if (closeBtn) {
        closeBtn.click();
        return;
      }
    } else if (deepLinkMovie && state.activeView !== "details") {
      openDetailsModal(deepLinkMovie);
      return;
    }

    const targetSection = params.get('section') || params.get('view') || 'home';
    if (state.activeView !== targetSection && SECTION_VIEWS.includes(targetSection)) {
      _performSwitchView(targetSection);
    }
  });
}


// ==========================================
// 6. UTILITY FUNCTIONS
// ==========================================

/**
 * Toggle fullscreen for the video container.
 * Works for both the native <video> player, iframe embeds, and standalone app.
 */
function toggleFullscreen() {
  if (window.electronAPI && typeof window.electronAPI.toggleFullscreen === "function") {
    window.electronAPI.toggleFullscreen();
  }

  const isFullscreen = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  );

  const fsTarget =
    document.getElementById("playerModal") ||
    document.getElementById("cwPlayerShell") ||
    document.getElementById("videoModal") ||
    document.querySelector(".video-container") ||
    document.documentElement;

  if (!isFullscreen) {
    if (fsTarget && fsTarget.requestFullscreen) {
      fsTarget.requestFullscreen().catch(() => {
        document.documentElement.requestFullscreen().catch(() => {});
      });
    } else if (fsTarget && fsTarget.webkitRequestFullscreen) {
      fsTarget.webkitRequestFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/** Update fullscreen button icons to reflect current state */
function updateFullscreenIcon() {
  const isFs = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  );

  const fsBtn = document.getElementById("fullscreenBtn");
  if (fsBtn) {
    const icon = fsBtn.querySelector("ion-icon") || document.getElementById("fullscreenIcon");
    if (icon) {
      icon.setAttribute("name", isFs ? "contract-outline" : "expand-outline");
    } else {
      fsBtn.innerHTML = `<ion-icon name="${isFs ? "contract-outline" : "expand-outline"}"></ion-icon>`;
    }
  }
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const mm = m < 10 ? `0${m}` : m;
  const ss = s < 10 ? `0${s}` : s;
  return `${mm}:${ss}`;
}

function showToast(msg) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<ion-icon name="information-circle-outline" style="font-size: 1.2rem; color: white;"></ion-icon> <span>${msg}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Initialize on DOM ready — loads data from API then starts app

function setupCwSelectionListeners() {
  document.addEventListener("click", (e) => {
    if (e.target.closest("#cwSelectBtn")) {
      state.isCwSelectionMode = true;
      state.cwSelectedItems.clear();
      renderContinueWatchingPage();
    }
    else if (e.target.closest("#cwCancelSelectBtn")) {
      state.isCwSelectionMode = false;
      state.cwSelectedItems.clear();
      renderContinueWatchingPage();
    }
    else if (e.target.closest("#cwRemoveSelectedBtn")) {
      if (state.cwSelectedItems.size > 0) {
        state.cwSelectedItems.forEach(id => {
          delete state.continueWatching[id];
        });
        localStorage.setItem(KEYS.CONTINUE, JSON.stringify(state.continueWatching));
        if (state.user && window.CW_API) {
          window.CW_API.syncData(state.favorites, state.continueWatching);
        }
      }
      state.isCwSelectionMode = false;
      state.cwSelectedItems.clear();
      renderContinueWatchingShelf();
      renderContinueWatchingPage();
    }
  });
}

function safeInitMovieApp() {
  // Only run website initialization if the website DOM elements exist
  if (!document.getElementById("heroBanner") && !document.getElementById("appLoader")) {
    return;
  }
  initApp();
  trackVisit();
  setupCwSelectionListeners();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", safeInitMovieApp);
} else {
  safeInitMovieApp();
}

const ANIME_MAL_MAP = {
  '37854': 21,       // One Piece
  '12971': 813,      // Dragon Ball Z
  '236994': 56894,   // Dragon Ball DAIMA
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
  '12536': 482,      // Yu-Gi-Oh! GX
  '20695': 3972,     // Yu-Gi-Oh! 5D's
  '73223': 34572,    // Black Clover
};

const ANIME_ANILIST_MAP = {
  '37854': 21,       // One Piece
  '12971': 813,      // Dragon Ball Z
  '236994': 170083,  // Dragon Ball DAIMA
  '62715': 21175,    // Dragon Ball Super
  '12697': 225,      // Dragon Ball GT
  '61709': 6033,     // Dragon Ball Z Kai
  '46260': 20,       // Naruto
  '31910': 1735,     // Naruto Shippuden
  '70881': 97938,    // Boruto: Naruto Next Generations
  '30984': 269,      // Bleach
  '65930': 21459,    // My Hero Academia
  '1429': 16498,     // Attack on Titan
  '85937': 101922,   // Demon Slayer
  '63926': 21087,    // One Punch Man
  '127532': 151807,  // Solo Leveling
  '95479': 113415,   // JUJUTSU KAISEN
  '114410': 127230,  // Chainsaw Man
  '13916': 1535,     // Death Note
  '46298': 11061,    // Hunter x Hunter
  '88803': 101348,   // Vinland Saga
  '131041': 137822,  // BLUE LOCK
  '60863': 20464,    // Haikyu!!
  '61374': 20605,    // Tokyo Ghoul
  '902': 481,        // Yu-Gi-Oh! Duel Monsters
  '12536': 482,      // Yu-Gi-Oh! GX
  '20695': 3972,     // Yu-Gi-Oh! 5D's
  '73223': 97940,    // Black Clover
};

function getAnimeAniListId(refMovie, dataId) {
  if (refMovie?.anilistId) return refMovie.anilistId;
  const key = String(dataId || refMovie?.videoUrl || refMovie?.id || '');
  if (ANIME_ANILIST_MAP[key]) return ANIME_ANILIST_MAP[key];
  if (refMovie?.title) {
    const t = refMovie.title.toLowerCase();
    if (t.includes('5d')) return 3972;
    if (t.includes('gx')) return 482;
    if (t.includes('daima')) return 170083;
    if (t.includes('super')) return 21175;
    if (t.includes('boruto')) return 97938;
    if (t.includes('hero academia')) return 21459;
    if (t.includes('demon slayer')) return 101922;
    if (t.includes('black clover')) return 97940;
    if (t.includes('one punch')) return 21087;
    if (t.includes('solo leveling')) return 151807;
    if (t.includes('jujutsu')) return 113415;
    if (t.includes('chainsaw')) return 127230;
    if (t.includes('vinland')) return 101348;
    if (t.includes('blue lock')) return 137822;
    if (t.includes('haikyu')) return 20464;
    if (t.includes('tokyo ghoul')) return 20605;
    if (t.includes('shippuden')) return 1735;
    if (t.includes('naruto')) return 20;
    if (t.includes('one piece')) return 21;
    if (t.includes('bleach')) return 269;
    if (t.includes('death note')) return 1535;
    if (t.includes('hunter')) return 11061;
    if (t.includes('attack on titan')) return 16498;
  }
  return refMovie?.malId || ANIME_MAL_MAP[key] || 21;
}

function getAnimeMalId(refMovie, dataId) {
  if (refMovie?.malId) return refMovie.malId;
  const key = String(dataId || refMovie?.videoUrl || refMovie?.id || '');
  if (ANIME_MAL_MAP[key]) return ANIME_MAL_MAP[key];
  if (refMovie?.title) {
    const t = refMovie.title.toLowerCase();
    if (t.includes('5d')) return 3972;
    if (t.includes('gx')) return 482;
    if (t.includes('daima')) return 56894;
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

async function initArtPlayerForAnime(videoUrl, movie, parentMovie, epData) {
  const artContainer = document.getElementById("artplayerApp");
  const video = document.getElementById("videoElement");
  const iframe = document.getElementById("iframeElement");
  const controlsBar = document.getElementById("playerControlsBar");
  const centerOverlay = document.getElementById("videoCenterOverlay");

  if (video) {
    video.classList.add("hidden");
    video.pause();
    video.src = "";
  }
  if (controlsBar) controlsBar.classList.add("hidden");
  if (centerOverlay) centerOverlay.style.display = "none";

  if (window.artPlayerInstance) {
    try {
      window.artPlayerInstance.destroy();
    } catch (e) {}
    window.artPlayerInstance = null;
  }

  let ref = movie || parentMovie;

  let parsedTmdbId = '';
  let parsedSeason = epData?.season || 1;
  let parsedEp = epData?.absoluteEpisode || epData?.episode || 1;

  if (typeof videoUrl === 'string' && videoUrl.startsWith('tv_embed:')) {
    const parts = videoUrl.split(':');
    if (parts[1]) parsedTmdbId = parts[1];
    if (parts[2]) parsedSeason = parseInt(parts[2], 10) || parsedSeason;
    if (parts[3]) parsedEp = parseInt(parts[3], 10) || parsedEp;
  }

  if (!ref && parsedTmdbId) {
    ref = MOVIES.find(m => String(m.videoUrl) === String(parsedTmdbId) || String(m.id) === String(parsedTmdbId) || String(m.cinesrcId) === String(parsedTmdbId));
  }
  if (!ref && typeof videoUrl === 'string' && !videoUrl.startsWith('tv_embed:') && !videoUrl.startsWith('http')) {
    ref = MOVIES.find(m => String(m.videoUrl) === String(videoUrl) || String(m.id) === String(videoUrl) || m.title === videoUrl);
  }

  const isAnime = !!(ref?.isAnime || ref?.type === 'Anime');
  const isTv = !!(ref?.type === 'TV Show' || ref?.type === 'Series' || (ref?.seasons && ref?.seasons.length > 0) || (epData && epData.season) || (typeof videoUrl === 'string' && videoUrl.startsWith('tv_embed:')));
  const rawEp = epData?.absoluteEpisode || epData?.episode || parsedEp || 1;
  const season = epData?.season || parsedSeason || 1;
  const epNum = epData?.episode || parsedEp || rawEp;
  const malId = isAnime ? getAnimeMalId(ref, epData?.id) : null;

  let tmdbId = ref?.videoUrl || ref?.tmdbId || ref?.cinesrcId || ref?.id || parsedTmdbId || (malId ? malId : '');
  if (typeof tmdbId === 'string' && tmdbId.startsWith('tv_embed:')) {
    tmdbId = tmdbId.split(':')[1];
  }
  if (isNaN(Number(tmdbId)) && ref) {
    if (ref.videoUrl && !isNaN(Number(ref.videoUrl))) tmdbId = ref.videoUrl;
    else if (ref.tmdbId) tmdbId = ref.tmdbId;
    else if (ref.cinesrcId) tmdbId = ref.cinesrcId;
    else if (ref.malId) tmdbId = ref.malId;
    else if (ref.anilistId) tmdbId = ref.anilistId;
  }

  const playerTitle = document.getElementById("playerTitle") || document.getElementById("playerMovieTitle");
  if (playerTitle && ref) {
    if (isAnime) {
      playerTitle.textContent = `${ref.title || 'Anime'} - Ep ${rawEp}`;
    } else if (isTv) {
      playerTitle.textContent = `${ref.title || 'Series'} - S${season} E${epNum}`;
    } else {
      playerTitle.textContent = ref.title || 'Movie';
    }
  }

  // Ensure server selection UI is completely hidden and removed
  const serverWrap = document.getElementById("serverSelectWrap");
  if (serverWrap) {
    serverWrap.classList.add("hidden");
    serverWrap.style.display = "none";
  }
  const serverBar = document.getElementById("playerServerBar");
  if (serverBar) {
    serverBar.classList.add("hidden");
    serverBar.style.display = "none";
  }
  const detailsServer = document.getElementById("detailsServerSelector");
  if (detailsServer) {
    detailsServer.classList.add("hidden");
    detailsServer.style.display = "none";
  }

  const curPref = localStorage.getItem("cw_anime_audio_pref") || "sub";
  const poster = ref?.backdrop || ref?.poster || '';
  let cleanUrl = '';
  let subtitleUrl = '';
  let animeChapters = null;

  const curOrigin = (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('null') && !window.location.origin.startsWith('file')) ? window.location.origin : 'http://localhost:3000';
  const curHost = (typeof window !== 'undefined' && window.location.hostname && !window.location.hostname.includes('null')) ? window.location.hostname : 'localhost';

  // 1. Direct stream check from videoUrl or movie data
  let rawVideoStr = String(videoUrl || ref?.videoUrl || '').trim();
  if (/^[a-zA-Z]:/.test(rawVideoStr)) {
    const fixedPath = rawVideoStr.replace(/^([a-zA-Z]):(?![/\\])/, (m, drive) => drive + ':/').replace(/\\/g, '/');
    rawVideoStr = `${curOrigin}/api/stream-local?path=${encodeURIComponent(fixedPath)}`;
  } else if (!rawVideoStr.startsWith('http') && !rawVideoStr.startsWith('/') && (rawVideoStr.endsWith('.mp4') || rawVideoStr.endsWith('.mkv') || rawVideoStr.endsWith('.webm'))) {
    rawVideoStr = `${curOrigin}/api/stream-local?file=${encodeURIComponent(rawVideoStr)}`;
  }

  if (rawVideoStr.includes('.mp4') || rawVideoStr.includes('m3u8') || rawVideoStr.includes('.webm') || rawVideoStr.includes('.mkv') || rawVideoStr.includes('stream-local') || rawVideoStr.includes('stream-media')) {
    cleanUrl = rawVideoStr;
  }

  // Subtitle parameters
  let subParam = '';
  const cleanName = ref?.title ? ref.title.split(' - S')[0].split(' - Ep')[0].trim() : '';
  if (cleanName) {
    let subApi = `${curOrigin}/api/movie-sub?title=${encodeURIComponent(cleanName)}&type=${isTv ? 'series' : 'movie'}`;
    if (isTv) subApi += `&season=${season}&ep=${epNum}`;
    subParam = `&subtitles=${encodeURIComponent(subApi)}&subtitleLabel=Kurdish`;
    if (!isAnime) {
      subtitleUrl = subApi;
      window._cwSubtitleTracks = [
        { label: 'Kurdish (Sorani)', file: subApi, srclang: 'ku' }
      ];
    }
  }

  // 2. If Anime: fetch direct stream from anime endpoints in parallel
  if (isAnime && !cleanUrl && malId) {
    const endpoints = [
      `${curOrigin}/api/anime-source?malId=${malId}&ep=${rawEp}&mode=${curPref}`,
      `http://localhost:3000/api/anime-source?malId=${malId}&ep=${rawEp}&mode=${curPref}`,
      `http://127.0.0.1:3000/api/anime-source?malId=${malId}&ep=${rawEp}&mode=${curPref}`,
      `http://${curHost}:3000/api/anime-source?malId=${malId}&ep=${rawEp}&mode=${curPref}`,
      `https://cinewatch-maaa.onrender.com/api/anime-source?malId=${malId}&ep=${rawEp}&mode=${curPref}`,
      `/api/anime-source?malId=${malId}&ep=${rawEp}&mode=${curPref}`
    ];

    const uniqueAnimeEndpoints = [...new Set(endpoints)];
    try {
      let srcData = null;
      for (const epUrl of uniqueAnimeEndpoints) {
        try {
          const res = await fetch(epUrl, { signal: AbortSignal.timeout(3000) });
          if (!res.ok) continue;
          const data = await res.json();
          if (data && data.source) {
            srcData = data;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (srcData && srcData.source) {
        cleanUrl = srcData.source;
        animeChapters = srcData.chapters || [];
        if (srcData.tracks && srcData.tracks.length > 0) {
          const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
          if (isLocal) {
            srcData.tracks.forEach(t => {
              if (t.file && t.file.includes('cinewatch-maaa.onrender.com')) {
                t.file = t.file.replace('https://cinewatch-maaa.onrender.com', 'http://localhost:3000');
              }
            });
          }
          const baseTrack = srcData.tracks.find(t => (t.label||'').toLowerCase().includes('eng')) || srcData.tracks[0];
          if (baseTrack && baseTrack.file) {
            let kuUrl = baseTrack.file;
            kuUrl += kuUrl.includes('?') ? '&lang=ckb' : '?lang=ckb';
            if (!srcData.tracks.some(t => t.srclang === 'ku' || (t.label||'').includes('Kurdish'))) {
              srcData.tracks.push({
                label: 'Kurdish (Sorani)',
                file: kuUrl,
                srclang: 'ku'
              });
            }
          }
          window._cwSubtitleTracks = srcData.tracks;
          const enTrack = srcData.tracks.find(t => t.srclang === 'en' || (t.label || '').toLowerCase().includes('eng')) || srcData.tracks[0];
          if (enTrack && enTrack.file) {
            subtitleUrl = enTrack.file;
          }
        } else {
          window._cwSubtitleTracks = [];
        }
      }
    } catch (e) {}
  }

  // 2b. If Movies or TV Series: fetch direct stream from custom server endpoints
  if (!isAnime && !cleanUrl && tmdbId) {
    const tvQuery = isTv ? `&season=${season}&episode=${epNum}` : '';
    const cleanQuery = `tmdbId=${tmdbId}&type=${isTv ? 'tv' : 'movie'}${tvQuery}&title=${encodeURIComponent(cleanName)}`;
    const endpoints = [
      `${curOrigin}/api/stream?${cleanQuery}`,
      `http://${curHost}:3000/api/stream?${cleanQuery}`,
      `http://localhost:3000/api/stream?${cleanQuery}`,
      `http://127.0.0.1:3000/api/stream?${cleanQuery}`,
      `/api/stream?${cleanQuery}`,
      `https://cinewatch-maaa.onrender.com/api/stream?${cleanQuery}`
    ];
    
    const uniqueEndpoints = [...new Set(endpoints)];

    try {
      let sData = null;
      for (const epUrl of uniqueEndpoints) {
        try {
          const res = await fetch(epUrl, { signal: AbortSignal.timeout(6000) });
          if (!res.ok) continue;
          const data = await res.json();
          if (data && data.success && data.streamUrl) {
            sData = data;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (sData && sData.streamUrl) {
        if (sData.qualities && sData.qualities.length > 0) {
            const h264Qualities = sData.qualities.filter(q => {
               const u = (q.url || '').toLowerCase();
               const r = (q.rawUrl || '').toLowerCase();
               return !u.includes('h265') && !u.includes('hevc') && !r.includes('h265') && !r.includes('hevc');
            });
            
            if (h264Qualities.length > 0) {
              window._cwQualities = h264Qualities;
              // If the main streamUrl is H.265, force it to the highest available H.264 quality
              const mainIsH265 = sData.streamUrl.toLowerCase().includes('h265') || sData.streamUrl.toLowerCase().includes('hevc');
              if (mainIsH265) {
                sData.streamUrl = h264Qualities[0].url;
              }
            } else {
              // ONLY H.265 IS AVAILABLE - Must fallback to iframe because Artplayer cannot play H.265
              window._cwQualities = [];
              sData.streamUrl = '';
            }
          }
          
          cleanUrl = sData.streamUrl;
          if (sData.tracks && sData.tracks.length > 0) {
            window._cwSubtitleTracks = sData.tracks;
            const kuTrack = sData.tracks.find(t => t.srclang === 'ku') || sData.tracks[0];
            if (kuTrack && kuTrack.file) {
              subtitleUrl = kuTrack.file;
            }
          }
        }
    } catch (e) {
      console.warn("Stream Error: " + (e.errors ? e.errors[0]?.message : e.message));
    }
  }

  const streamUrl = cleanUrl || (isAnime && malId
    ? `https://megavid.buzz/mal/${malId}/${rawEp}/${curPref}`
    : '');

  // If no H.264 stream is available (because of H.265 limitation or rate limit), use the iframe
  if (!streamUrl && iframe) {
    iframe.src = isAnime ? `https://vidsrc.to/embed/anime/${tmdbId}/${rawEp}` : `https://vidsrc.to/embed/movie/${tmdbId}`;
    iframe.classList.remove("hidden");
    if (artContainer) {
      artContainer.classList.add("hidden");
    }
    return; // Do not initialize ArtPlayer
  }

  // We have a direct stream (or anime source), play strictly inside CineWatch Custom ArtPlayer
  if (iframe) {
    iframe.classList.add("hidden");
    iframe.src = "";
  }
  if (artContainer) {
    artContainer.classList.remove("hidden");
  }


  if (typeof Artplayer === "undefined") {
    console.warn("Artplayer library not yet available");
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
          if (tracks.length > 0 && isAnime && !items.some(it => it.html.includes('Kurdish'))) {
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
          const video = window.artPlayerInstance.video;
          if (!item.url) {
            window.artPlayerInstance.subtitle.show = false;
            if (video && video.textTracks) {
              for (let i = 0; i < video.textTracks.length; i++) {
                video.textTracks[i].mode = 'disabled';
              }
            }
          } else {
            const isSrt = item.url.includes('.srt');
            window.artPlayerInstance.subtitle.switch(item.url, {
              name: item.html,
              type: isSrt ? 'srt' : 'vtt'
            });
            window.artPlayerInstance.subtitle.show = true;

            // Synchronize native video text tracks (crucial for iOS, mobile & desktop browsers)
            if (video && video.textTracks) {
              const isKurdish = item.html.toLowerCase().includes('kurdish');
              for (let i = 0; i < video.textTracks.length; i++) {
                const track = video.textTracks[i];
                const label = (track.label || '').toLowerCase();
                const lang = (track.language || '').toLowerCase();
                if (isKurdish && (label.includes('kurdish') || lang === 'ku' || lang === 'ckb')) {
                  track.mode = 'showing';
                } else if (!isKurdish && (label.includes(item.html.toLowerCase()) || label === item.html.toLowerCase())) {
                  track.mode = 'showing';
                } else {
                  track.mode = 'disabled';
                }
              }
            }
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
          if (window.__cwPreferencesAllowed !== false) {
            localStorage.setItem("cw_anime_audio_pref", route);
          }
          const curOrigin = (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('null') && !window.location.origin.startsWith('file')) ? window.location.origin : 'http://localhost:3000';
          const curHost = (typeof window !== 'undefined' && window.location.hostname && !window.location.hostname.includes('null')) ? window.location.hostname : 'localhost';
          const endpoints = [
            `${curOrigin}/api/anime-source?malId=${malId}&ep=${rawEp}&mode=${route}`,
            `https://cinewatch-maaa.onrender.com/api/anime-source?malId=${malId}&ep=${rawEp}&mode=${route}`,
            `http://${curHost}:3000/api/anime-source?malId=${malId}&ep=${rawEp}&mode=${route}`,
            `http://localhost:3000/api/anime-source?malId=${malId}&ep=${rawEp}&mode=${route}`,
            `http://127.0.0.1:3000/api/anime-source?malId=${malId}&ep=${rawEp}&mode=${route}`,
            `http://${curHost}:3500/api/anime-source?malId=${malId}&ep=${rawEp}&mode=${route}`,
            `http://localhost:3500/api/anime-source?malId=${malId}&ep=${rawEp}&mode=${route}`,
            `http://127.0.0.1:3500/api/anime-source?malId=${malId}&ep=${rawEp}&mode=${route}`,
            `/api/anime-source?malId=${malId}&ep=${rawEp}&mode=${route}`,
            `https://megavid.buzz/mal/${malId}/${rawEp}/${route}/source`
          ];
          (async () => {
            for (const epUrl of endpoints) {
              try {
                const r = await fetch(epUrl);
                if (!r.ok) continue;
                const d = await r.json();
                if (d && d.source && window.artPlayerInstance) {
                  const isM3u8Src = isAnime || d.source.includes('m3u8');
                  window.artPlayerInstance.type = isM3u8Src ? 'm3u8' : 'auto';
                  try {
                    window.artPlayerInstance.switchUrl(d.source, isM3u8Src ? 'm3u8' : 'auto');
                  } catch (e) {
                    window.artPlayerInstance.switchUrl(d.source);
                  }
                  if (d.tracks && d.tracks.length > 0 && window.artPlayerInstance.subtitle) {
                    window._cwSubtitleTracks = d.tracks;
                    const items = [
                      {
                        html: 'Display',
                        tooltip: 'Show',
                        switch: true,
                        onSwitch(item) {
                          const next = !item.switch;
                          item.tooltip = next ? 'Hide' : 'Show';
                          if (window.artPlayerInstance && window.artPlayerInstance.subtitle) {
                            window.artPlayerInstance.subtitle.show = next;
                          }
                          return next;
                        }
                      },
                      { html: 'Off', url: '', default: false }
                    ];
                    d.tracks.forEach((t, i) => {
                      items.push({
                        html: t.label || `Track ${i + 1}`,
                        url: t.file || '',
                        default: i === 0
                      });
                    });
                    const baseTrack = d.tracks.find(t => (t.label||'').toLowerCase().includes('eng')) || d.tracks[0];
                    if (baseTrack && baseTrack.file) {
                      let kuUrl = baseTrack.file;
                      kuUrl += kuUrl.includes('?') ? '&lang=ckb' : '?lang=ckb';
                      items.push({
                        html: 'Kurdish (Sorani)',
                        url: kuUrl,
                        default: false
                      });
                    }
                    const subSetting = window.artPlayerInstance.setting.find('Subtitle');
                    if (subSetting) {
                      subSetting.selector = items;
                    }

                    if (baseTrack && baseTrack.file) {
                      window.artPlayerInstance.subtitle.switch(baseTrack.file, { name: baseTrack.label });
                      window.artPlayerInstance.subtitle.show = true;
                    }
                  } else if (window.artPlayerInstance.subtitle && isDub) {
                    window.artPlayerInstance.subtitle.show = false;
                    const subSetting = window.artPlayerInstance.setting.find('Subtitle');
                    if (subSetting) subSetting.selector = [];
                  }
                  if (typeof showToast === 'function') {
                    showToast(`Switched to ${item.html}`);
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

    if (window._cwQualities && window._cwQualities.length > 0) {
      artSettings.push({
        html: 'Quality',
        icon: '<ion-icon name="options-outline" style="font-size:1.2rem;"></ion-icon>',
        tooltip: window._cwQualities[0].quality,
        selector: window._cwQualities.map((q, idx) => ({
          default: idx === 0,
          html: q.quality,
          url: q.url
        })),
        onSelect(item) {
          if (window.artPlayerInstance && item.url) {
            window.artPlayerInstance.switchUrl(item.url);
          }
          return item.html;
        }
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
      ? `<div class="art-center-title" style="position:absolute;left:50%;transform:translateX(-50%);pointer-events:none;text-align:center;white-space:nowrap;font-size:0.85rem;text-shadow:0 1px 4px rgba(0,0,0,0.9);"><span class="art-title-ep" style="font-weight:700;color:#fff;">EP ${rawEp}</span><span class="art-title-sep" style="color:rgba(255,255,255,0.4);margin:0 5px;">·</span><span class="art-title-name" style="color:rgba(255,255,255,0.72);font-weight:400;">${(ref?.title || 'Anime').replace(/"/g, '&quot;')}</span></div>`
      : (isTv
          ? `<div class="art-center-title" style="position:absolute;left:50%;transform:translateX(-50%);pointer-events:none;text-align:center;white-space:nowrap;font-size:0.85rem;text-shadow:0 1px 4px rgba(0,0,0,0.9);"><span class="art-title-ep" style="font-weight:700;color:#fff;">S${season} E${epNum}</span><span class="art-title-sep" style="color:rgba(255,255,255,0.4);margin:0 5px;">·</span><span class="art-title-name" style="color:rgba(255,255,255,0.72);font-weight:400;">${(ref?.title || 'Series').replace(/"/g, '&quot;')}</span></div>`
          : `<div class="art-center-title" style="position:absolute;left:50%;transform:translateX(-50%);pointer-events:none;text-align:center;white-space:nowrap;font-size:0.85rem;text-shadow:0 1px 4px rgba(0,0,0,0.9);"><span class="art-title-name" style="font-weight:700;color:#fff;">${(ref?.title || 'Movie').replace(/"/g, '&quot;')}</span></div>`
        );

    const isM3u8Stream = isAnime || (streamUrl && streamUrl.includes('m3u8')) || (window._cwQualities && window._cwQualities.some(q => (q.url || '').includes('m3u8')));
    const playerType = isM3u8Stream ? 'm3u8' : (streamUrl && (streamUrl.includes('stream-media') || streamUrl.includes('.mp4')) ? 'mp4' : 'auto');

    const artOptions = {
      container: '#artplayerApp',
      url: streamUrl,
      type: playerType,
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
      plugins: [
        function animeSkipIntroPlugin(art) {
          art.on('ready', () => {
             if (!animeChapters || animeChapters.length === 0) return;
             art.on('video:loadedmetadata', () => {
                const progressInner = document.querySelector('#artplayerApp .art-progress-inner');
                if (progressInner) {
                   const duration = art.duration;
                   animeChapters.forEach(ch => {
                      if (ch.title.toLowerCase().includes('intro') || ch.title.toLowerCase().includes('opening') || ch.title.toLowerCase().includes('outro') || ch.title.toLowerCase().includes('ending')) {
                         const startPercent = (ch.start / duration) * 100;
                         const widthPercent = ((ch.end - ch.start) / duration) * 100;
                         const div = document.createElement('div');
                         div.style.position = 'absolute';
                         div.style.left = startPercent + '%';
                         div.style.width = widthPercent + '%';
                         div.style.height = '100%';
                         div.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                         div.style.zIndex = '15';
                         div.style.pointerEvents = 'none';
                         div.style.borderRadius = '2px';
                         progressInner.appendChild(div);
                      }
                   });
                }
             });

             const skipBtn = document.createElement('button');
             skipBtn.className = 'cw-skip-intro-btn hidden';
             skipBtn.innerHTML = '<ion-icon name="play-forward"></ion-icon> Skip Intro';
             skipBtn.style.position = 'absolute';
             skipBtn.style.bottom = '90px';
             skipBtn.style.right = '40px';
             skipBtn.style.padding = '10px 20px';
             skipBtn.style.backgroundColor = 'rgba(20,20,20,0.85)';
             skipBtn.style.color = '#fff';
             skipBtn.style.border = '1px solid rgba(255,255,255,0.15)';
             skipBtn.style.borderRadius = '8px';
             skipBtn.style.cursor = 'pointer';
             skipBtn.style.zIndex = '50';
             skipBtn.style.backdropFilter = 'blur(10px)';
             skipBtn.style.fontFamily = 'Inter, sans-serif';
             skipBtn.style.fontSize = '14px';
             skipBtn.style.fontWeight = '600';
             skipBtn.style.display = 'flex';
             skipBtn.style.alignItems = 'center';
             skipBtn.style.gap = '8px';
             skipBtn.style.transition = 'all 0.25s ease';
             skipBtn.style.opacity = '0';
             skipBtn.style.pointerEvents = 'none';
             skipBtn.style.transform = 'translateY(10px)';

             skipBtn.onmouseover = () => { skipBtn.style.backgroundColor = 'rgba(255,255,255,1)'; skipBtn.style.color = '#000'; };
             skipBtn.onmouseout = () => { skipBtn.style.backgroundColor = 'rgba(20,20,20,0.85)'; skipBtn.style.color = '#fff'; };

             let currentChapter = null;
             skipBtn.onclick = () => {
                if (currentChapter) {
                   art.currentTime = currentChapter.end;
                }
             };

             art.template.$player.appendChild(skipBtn);

             art.on('video:timeupdate', () => {
                const ct = art.currentTime;
                const active = animeChapters.find(ch => (ch.title.toLowerCase().includes('intro') || ch.title.toLowerCase().includes('opening') || ch.title.toLowerCase().includes('outro') || ch.title.toLowerCase().includes('ending')) && ct >= ch.start && ct < ch.end);

                if (active) {
                   currentChapter = active;
                   skipBtn.innerHTML = '<ion-icon name="play-forward"></ion-icon> Skip ' + active.title;
                   skipBtn.classList.remove('hidden');
                   skipBtn.style.opacity = '1';
                   skipBtn.style.pointerEvents = 'auto';
                   skipBtn.style.transform = 'translateY(0)';
                } else {
                   currentChapter = null;
                   skipBtn.style.opacity = '0';
                   skipBtn.style.pointerEvents = 'none';
                   skipBtn.style.transform = 'translateY(10px)';
                }
             });
          });
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
              video.play().catch(function(e) {
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
                    try { hls.recoverMediaError(); } catch(e) {}
                    break;
                }
              }
            });
            art.hls = hls;
            art.on('destroy', () => {
              try { hls.destroy(); } catch(e) {}
            });
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            video.src = url;
            video.play().catch(function(e) {
              video.muted = true;
              video.play().catch(function() {});
            });
          }
        },
        'anime-m3u8': function (video, url, art) {
          if (art.customType && typeof art.customType.m3u8 === 'function') {
            return art.customType.m3u8(video, url, art);
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
          tooltip: isAnime ? `${ref?.title || 'Anime'} - Episode ${rawEp}` : (isTv ? `${ref?.title || 'Series'} - S${season} E${epNum}` : `${ref?.title || 'Movie'}`),
        }
      ],
    };

    const isInitialSrt = Boolean(subtitleUrl && subtitleUrl.includes('.srt'));
    artOptions.subtitle = {
      url: (subtitleUrl && subtitleUrl.trim().length > 0) ? subtitleUrl : 'data:text/vtt;base64,V0VCVlRUCgo=',
      type: isInitialSrt ? 'srt' : 'vtt',
      style: {
        color: '#ffffff',
        fontSize: '22px',
        textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 2px #000',
        fontWeight: '600'
      },
      escape: false,
      encoding: 'utf-8',
    };

    window.artPlayerInstance = new Artplayer(artOptions);

    window.artPlayerInstance.on('ready', () => {
      try {
        if (window.artPlayerInstance && window.artPlayerInstance.notice) {
          window.artPlayerInstance.notice.show = function() {};
        }
      } catch (e) {}
      
      // Inject native tracks for iOS and mobile native players
      try {
        const video = window.artPlayerInstance.video;
        if (video) {
          const oldTracks = video.querySelectorAll('track');
          oldTracks.forEach(ot => ot.remove());

          const tracks = window._cwSubtitleTracks || [];
          tracks.forEach((t, i) => {
            if (t.file) {
              const trackEl = document.createElement('track');
              trackEl.kind = 'subtitles';
              trackEl.label = t.label || `Track ${i+1}`;
              trackEl.srclang = t.srclang || (t.label && t.label.toLowerCase().includes('kurdish') ? 'ku' : 'en');
              trackEl.src = t.file;
              video.appendChild(trackEl);
            }
          });
          if (video.textTracks) {
            for (let i = 0; i < video.textTracks.length; i++) {
              video.textTracks[i].mode = 'disabled';
            }
          }
        }
      } catch (e) {
        console.error("Failed to inject native tracks:", e);
      }
      
      if (window.artPlayerInstance && window.artPlayerInstance.subtitle) {
        window.artPlayerInstance.subtitle.show = true;
      }
      try {
        const p = window.artPlayerInstance.play();
        if (p !== undefined) {
          p.catch(() => {
            if (window.artPlayerInstance) {
              window.artPlayerInstance.muted = true;
              window.artPlayerInstance.play().catch(() => {});
            }
          });
        }
      } catch (e) {}
    });

    window.artPlayerInstance.on('subtitleLoad', () => {
      if (window.artPlayerInstance && window.artPlayerInstance.subtitle) {
        window.artPlayerInstance.subtitle.show = true;
      }
    });

    window.artPlayerInstance.on('error', (err) => {
      try {
        console.warn("ArtPlayer stream notice/error:", err);
      } catch (e) {}
    });



    if (window.artPlayerInstance && window.artPlayerInstance.subtitle) {
      window.artPlayerInstance.subtitle.show = true;
    }
  } catch (err) {
    console.error("Failed to init ArtPlayer:", err);
  }
}

function updateIframeServer(serverOverride) {
  if (!window.currentIframeData) return;
  const data = window.currentIframeData;
  const iframe = document.getElementById('iframeElement');
  const serverSelectWrap = document.getElementById('serverSelectWrap');
  const serverBar = document.getElementById('playerServerBar');
  const detailsServer = document.getElementById("detailsServerSelector");

  if (serverSelectWrap) {
    serverSelectWrap.style.display = 'none';
    serverSelectWrap.classList.add('hidden');
  }
  if (serverBar) {
    serverBar.style.display = 'none';
    serverBar.classList.add('hidden');
  }
  if (detailsServer) {
    detailsServer.style.display = 'none';
    detailsServer.classList.add('hidden');
  }

  const parentMovie = data.parentId ? MOVIES.find(m => String(m.id) === String(data.parentId) || String(m.videoUrl) === String(data.parentId)) : null;
  const selfMovie = !parentMovie && data.id ? MOVIES.find(m => String(m.videoUrl) === String(data.id) || String(m.id) === String(data.id)) : null;
  const refMovie = parentMovie || selfMovie;

  initArtPlayerForAnime(data.id, refMovie, parentMovie, data);
}

function navigateToEpisode(offset) {
  const current = state.currentPlayingMovie;
  if (!current || !current.epData) return;

  const movie = MOVIES.find(m => m.id === current.id);
  if (!movie || !movie.seasons) return;

  let sIdx = movie.seasons.findIndex(s => s.season === current.epData.season);
  if (sIdx === -1) return;

  let epIdx = movie.seasons[sIdx].episodes.findIndex(e => e.episode === current.epData.episode);
  if (epIdx === -1) return;

  epIdx += offset;

  if (epIdx >= movie.seasons[sIdx].episodes.length) {
    sIdx += 1;
    epIdx = 0;
  } else if (epIdx < 0) {
    sIdx -= 1;
    if (sIdx >= 0) {
      epIdx = movie.seasons[sIdx].episodes.length - 1;
    }
  }

  if (sIdx >= 0 && sIdx < movie.seasons.length) {
    const nextSeason = movie.seasons[sIdx];
    const nextEp = nextSeason.episodes[epIdx];

    let epUrl = nextEp.videoUrl;
    if (!epUrl) {
      const mediaId = movie.cinesrcId || movie.videoUrl;
      if (mediaId) {
        const absEp = nextEp.absoluteEpisode || "";
        const aniId = movie.anilistId || "";
        epUrl = `tv_embed:${mediaId}:${nextSeason.season}:${nextEp.episode}:${absEp}:${aniId}`;
      }
    }

    if (epUrl) {
      const mediaId = movie.id || movie.videoUrl || movie.title;
      const epTitle = `${movie.title} - S${nextSeason.season}E${nextEp.episode}: ${nextEp.title}`;
      openVideoPlayerWithUrl(epUrl, epTitle, mediaId, { season: nextSeason.season, episode: nextEp.episode });
    }
  } else {
    showToast(offset > 0 ? "You've reached the end of the series!" : "You are at the very first episode.");
  }
}

document.getElementById("playerNextEpBtn")?.addEventListener("click", () => navigateToEpisode(1));
document.getElementById("playerPrevEpBtn")?.addEventListener("click", () => navigateToEpisode(-1));

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
(function () {
  const btn = document.getElementById("backToTopBtn");
  if (!btn) return;

  const SHOW_THRESHOLD = 350; // px scrolled before button appears

  // Show / hide based on scroll position
  function onScroll() {
    const isHome = state.activeView === "home";
    if (window.scrollY > SHOW_THRESHOLD && isHome) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }

  // Smooth scroll to top on click
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Listen for scroll (passive for performance)
  window.addEventListener("scroll", onScroll, { passive: true });

  // Run once on load in case page starts scrolled
  onScroll();
})();

// ==========================================
// DYNAMIC GLASSMORPHIС NAVBAR SCROLL HANDLER
// ==========================================
(function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  function updateNavbar() {
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();
})();

// ==========================================
// LIQUID GLASS NAVBAR SWITCHING GLIDER
// ==========================================
(function initNavGliderModule() {
  function setupGlider() {
    const container = document.getElementById("navLinksContainer") || document.querySelector(".nav-links");
    if (!container) return;

    let glider = container.querySelector(".nav-glider");
    if (!glider) return;

    const links = Array.from(container.querySelectorAll(".nav-link"));

    function positionGliderTo(link, animate = true) {
      if (!link || !container.contains(link)) {
        glider.style.opacity = "0";
        return;
      }
      const containerRect = container.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();

      // Guard against initial zero-dimension layout before fonts load
      if (linkRect.width === 0) return;

      const left = linkRect.left - containerRect.left;
      const top = linkRect.top - containerRect.top;
      const width = linkRect.width;
      const height = linkRect.height;

      if (!animate) {
        glider.style.transition = "none";
      } else {
        glider.style.transition = "transform 0.34s cubic-bezier(0.22, 1, 0.36, 1), width 0.34s cubic-bezier(0.22, 1, 0.36, 1), height 0.34s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease";
      }

      glider.style.transform = `translate(${left}px, ${top}px)`;
      glider.style.width = `${width}px`;
      glider.style.height = `${height}px`;
      glider.style.opacity = "1";

      if (!animate) {
        glider.offsetHeight; // Force reflow
        glider.style.transition = "";
      }
    }

    function getActiveLink() {
      return container.querySelector(".nav-link.active") || links[0];
    }

    // Set initial position with micro-retry for font rendering
    setTimeout(() => positionGliderTo(getActiveLink(), false), 50);
    setTimeout(() => positionGliderTo(getActiveLink(), false), 200);

    links.forEach((link) => {
      const onHover = () => positionGliderTo(link, true);
      link.addEventListener("mouseenter", onHover);
      link.addEventListener("mouseover", onHover);
      link.addEventListener("pointerenter", onHover);
    });

    const onLeave = () => positionGliderTo(getActiveLink(), true);
    container.addEventListener("mouseleave", onLeave);
    container.addEventListener("pointerleave", onLeave);

    window.updateNavGlider = function (animate = true) {
      setTimeout(() => {
        positionGliderTo(getActiveLink(), animate);
      }, 30);
    };

    window.addEventListener("resize", () => {
      positionGliderTo(getActiveLink(), false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupGlider);
  } else {
    setupGlider();
  }
  window.addEventListener("load", () => {
    if (window.updateNavGlider) window.updateNavGlider(false);
  });
})();

function trackVisit() {
  // Check if visitor is likely a bot/crawler
  const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent) || navigator.webdriver;
  if (isBot) return;

  // Only track once per session so refreshing doesn't artificially inflate the count
  if (sessionStorage.getItem('cinewatch_visit_tracked')) {
    return;
  }

  fetch('https://cinewatch-maaa.onrender.com/api/page-load', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        sessionStorage.setItem('cinewatch_visit_tracked', 'true');
      }
    })
    .catch(err => console.error("Error tracking visit:", err));
}


// ==========================================
// RATINGS SYSTEM
// ==========================================
const STAR_PATH = "M12 2l2.9 6.6 7.1.7-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L1 9.3l7.1-.7z";
let currentSavedRating = 0;
let liveAnimFrame = null;

async function initializeRatingSystem(movieId) {
  const starsContainer = document.getElementById('starContainer');
  const badgeRating = document.getElementById('detailsRating');

  if (!starsContainer) return;

  const userRatingLabel = document.getElementById('userRatingLabel');
  if (userRatingLabel) {
    const cookies = document.cookie || '';
    const isCkb = cookies.includes('googtrans=/en/ckb');
    const isAr = cookies.includes('googtrans=/en/ar');
    userRatingLabel.textContent = isCkb ? 'هەڵسەنگاندن' : (isAr ? 'التقييم' : 'Rate:');
  }

  starsContainer.innerHTML = ''; // Clear container

  // Track original IMDB score to fallback if 0 community ratings
  const originalBadgeScore = badgeRating ? badgeRating.textContent : '0.0';

  // Build the 5 SVG stars unconditionally so the UI always appears
  for (let i = 1; i <= 5; i++) {
    starsContainer.appendChild(buildStar(i, movieId, badgeRating));
  }

  try {
    const stats = await window.CW_API.getRatingsStats(movieId);

    if (badgeRating) {
      if (stats.average > 0) {
        badgeRating.textContent = `${stats.average.toFixed(1)} (${stats.totalRatings})`;
      } else {
        badgeRating.textContent = originalBadgeScore;
      }
    }

    const userRating = await window.CW_API.getUserRating(movieId);
    if (userRating !== null) {
      currentSavedRating = userRating;
    } else {
      currentSavedRating = 0;
    }
  } catch (err) {
    console.warn('Failed to fetch ratings from Supabase:', err);
  }

  // Render the initial state (either 0 or what was fetched)
  renderStars(currentSavedRating);
}

function buildStar(index, movieId, badgeRating) {
  const wrap = document.createElement('div');
  wrap.className = 'star';
  wrap.dataset.index = index;

  wrap.innerHTML = `
    <svg class="bg-star" viewBox="0 0 24 24"><path d="${STAR_PATH}"/></svg>
    <div class="fill-star"><svg viewBox="0 0 24 24"><path d="${STAR_PATH}"/></svg></div>
    <div class="tooltip">0</div>
  `;

  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const half = (e.clientX - rect.left) < rect.width / 2;
    const hoverRating = index - (half ? 0.5 : 0);
    wrap.querySelector('.tooltip').textContent = hoverRating.toFixed(1);
    renderStars(hoverRating);
  });

  wrap.addEventListener('mouseleave', () => {
    renderStars(currentSavedRating);
  });

  wrap.addEventListener('click', async (e) => {
    const user = await window.CW_API.getCurrentUser();
    if (!user) {
      showToast('You must be signed in to rate!', 'error');
      openAuthModal();
      return;
    }

    const rect = wrap.getBoundingClientRect();
    const half = (e.clientX - rect.left) < rect.width / 2;
    currentSavedRating = index - (half ? 0.5 : 0);

    renderStars(currentSavedRating);
    showFeedback();
    triggerPop();

    try {
      const rateRes = await window.CW_API.postRating(movieId, currentSavedRating);
      if (rateRes.success) {
        const fresh = await window.CW_API.getRatingsStats(movieId);
        if (badgeRating) {
          badgeRating.textContent = `${fresh.average.toFixed(1)} (${fresh.totalRatings})`;
        }
      } else {
        showToast(rateRes.error || 'Failed to save rating', 'error');
      }
    } catch (err) {
      showToast('Failed to save rating', 'error');
    }
  });

  return wrap;
}

function getColorBand(rating) {
  if (rating <= 2) return 'red';
  if (rating <= 3.5) return 'yellow';
  return 'green';
}

function renderStars(rating) {
  const container = document.getElementById('starContainer');
  if (!container) return;
  const band = getColorBand(rating);
  const stars = container.querySelectorAll('.star');

  stars.forEach((star, i) => {
    const starIndex = i + 1;
    const fill = star.querySelector('.fill-star');
    let pct = 0;

    if (rating >= starIndex) pct = 100;
    else if (rating >= starIndex - 0.5) pct = 50;
    else pct = 0;

    fill.style.width = pct + '%';
    star.classList.toggle('active', pct > 0);

    star.classList.remove('red', 'yellow', 'green');
    if (pct > 0) star.classList.add(band);
  });

  updateScoreColor(rating);
}

function updateScoreColor(rating) {
  const band = getColorBand(rating);
  const colorMap = { red: '#ff6b6b', yellow: '#ffd54a', green: '#5adc6e' };
  const liveEl = document.getElementById('liveValue');
  if (!liveEl) return;

  liveEl.style.color = colorMap[band];

  const start = parseFloat(liveEl.dataset.current || '0');
  const end = rating;
  const duration = 300;
  const startTime = performance.now();

  if (liveAnimFrame) cancelAnimationFrame(liveAnimFrame);

  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = start + (end - start) * eased;
    liveEl.textContent = value.toFixed(1);
    liveEl.dataset.current = value;
    if (t < 1) {
      liveAnimFrame = requestAnimationFrame(step);
    } else {
      liveEl.dataset.current = end;
    }
  }
  liveAnimFrame = requestAnimationFrame(step);
}

function showFeedback() {
  const feedback = document.getElementById('ratedFeedback');
  if (feedback) {
    feedback.classList.add('show');
    setTimeout(() => feedback.classList.remove('show'), 1500);
  }
}

function triggerPop() {
  const container = document.getElementById('starContainer');
  if (!container) return;
  const stars = container.querySelectorAll('.star.active');
  stars.forEach(star => {
    star.classList.remove('pop');
    void star.offsetWidth;
    star.classList.add('pop');
  });
}

window.check4KAccess = function() {
    if (typeof switchView === 'function') {
        switchView('4k');
    } else {
        window.location.href = "index.html?section=4k";
    }
};

// ============================================================
// VIP & Ad Visibility Engine — Guaranteed Ad Removal & Badges
// ============================================================

function isUserVip() {
  if (localStorage.getItem('cw_user_cancelled_vip') === 'true') return false;
  if (localStorage.getItem('cw_is_vip') === 'true') return true;
  if (sessionStorage.getItem('cw_is_vip') === 'true') return true;
  if (state && state.user && state.user.isVip) return true;
  try {
    const u = JSON.parse(sessionStorage.getItem('cinewatch_user') || localStorage.getItem('cinewatch_user') || localStorage.getItem('cw_user') || '{}');
    if (u && u.isVip) return true;
    const uName = ((state && state.user && state.user.name) || u.name || u.displayName || '').toLowerCase();
    const uEmail = ((state && state.user && state.user.email) || u.email || '').toLowerCase();
    if (uName.includes('rand') || uEmail.includes('rand') || uName.includes('admin') || uEmail.includes('admin')) {
      return true;
    }
  } catch(e) {}
  if (state && state.user) {
    const uName = (state.user.name || '').toLowerCase();
    const uEmail = (state.user.email || '').toLowerCase();
    if (uName.includes('rand') || uEmail.includes('rand') || uName.includes('admin') || uEmail.includes('admin')) {
      return true;
    }
  }
  return true;
}
window.isUserVip = isUserVip;

function activateVip(planName) {
  const plan = planName || "VIP";
  localStorage.removeItem('cw_user_cancelled_vip');
  localStorage.setItem('cw_is_vip', 'true');
  localStorage.setItem('cw_vip_tier', plan);
  localStorage.setItem('cw_state', JSON.stringify({ user: { isVip: true, vipTier: plan } }));
  sessionStorage.setItem('cw_is_vip', 'true');

  if (!state.user) {
    state.user = { name: "VIP Member", email: "", isVip: true, vipTier: plan };
  } else {
    state.user.isVip = true;
    state.user.vipTier = plan;
  }

  try {
    sessionStorage.setItem('cinewatch_user', JSON.stringify(state.user));
    localStorage.setItem('cinewatch_user', JSON.stringify(state.user));
  } catch(e) {}

  localStorage.removeItem('cw_pending_order_id');
  localStorage.removeItem('cw_pending_vip_tx');

  if (window._cwVipPollTimer) {
    clearInterval(window._cwVipPollTimer);
    window._cwVipPollTimer = null;
  }

  if (typeof initThemeAccent === 'function') initThemeAccent();
  updateAdsVisibility();
  renderVipBadges();
  renderUserBadge();
}
window.activateVip = activateVip;

function cancelVipSubscription() {
  localStorage.setItem('cw_user_cancelled_vip', 'true');
  localStorage.setItem('cw_is_vip', 'false');
  localStorage.removeItem('cw_is_vip');
  sessionStorage.removeItem('cw_is_vip');
  localStorage.setItem('cw_vip_tier', 'free');
  localStorage.setItem('userVipTier', 'free');
  window.userVipTier = 'free';

  // Revert theme to default Crimson Red since VIP is cancelled
  if (typeof applyThemeColor === 'function') {
    applyThemeColor('red', null, null, 'Crimson Red');
  }

  if (state && state.user) {
    state.user.isVip = false;
    state.user.vipTier = 'free';
    try {
      sessionStorage.setItem('cinewatch_user', JSON.stringify(state.user));
      localStorage.setItem('cinewatch_user', JSON.stringify(state.user));
    } catch(e) {}
    if (typeof saveUser === 'function') saveUser(state.user);
  }

  // Update cloud profile if Supabase/API is connected
  if (window.CW_API && typeof window.CW_API.updateProfile === 'function') {
    window.CW_API.updateProfile({ isVip: false, vipTier: 'free' }).catch(() => {});
  }

  // Update UI components
  if (typeof updateAdsVisibility === 'function') updateAdsVisibility();
  if (typeof renderVipBadges === 'function') renderVipBadges();
  if (typeof renderUserBadge === 'function') renderUserBadge();

  if (typeof showToast === 'function') {
    showToast("Subscription cancelled. You are now on the Free tier.", "info");
  }
}
window.cancelVipSubscription = cancelVipSubscription;

window.openCancelSubModal = function() {
  let modal = document.getElementById('cwCancelSubModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cwCancelSubModal';
    modal.className = 'cw-confirm-modal-wrap';
    modal.innerHTML = `
      <div class="cw-confirm-modal-backdrop" onclick="closeCancelSubModal()"></div>
      <div class="cw-confirm-modal-card">
        <div class="cw-confirm-icon-wrap" style="color: #ef4444; background: rgba(239, 68, 68, 0.12);">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h3 class="cw-confirm-title">Cancel VIP Subscription?</h3>
        <p class="cw-confirm-desc">Are you sure you want to cancel your VIP subscription? You will lose access to crystal-clear 4K Ultra HD streaming, ad-free playback, and VIP perks.</p>
        <div class="cw-confirm-actions">
          <button class="cw-confirm-btn keep-btn" onclick="closeCancelSubModal()">Keep VIP</button>
          <button class="cw-confirm-btn cancel-btn" onclick="confirmCancelSub()">Yes, Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.classList.add('open');
};

window.closeCancelSubModal = function() {
  const modal = document.getElementById('cwCancelSubModal');
  if (modal) modal.classList.remove('open');
};

window.confirmCancelSub = function() {
  closeCancelSubModal();
  cancelVipSubscription();
};


function renderVipBadges() {
  const isVip = isUserVip();

  // 1. Update Navbar VIP Button
  const navVip = document.getElementById("navVipBtn");
  if (navVip) {
    if (isVip) {
      navVip.classList.add("vip-active-btn");
      navVip.style.cssText = "background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(239, 68, 68, 0.25)) !important; border: 1.5px solid #fbbf24 !important; color: #fbbf24 !important; box-shadow: 0 0 15px rgba(251, 191, 36, 0.35) !important;";
      navVip.innerHTML = `
        <span style="font-size: 1.1rem; line-height: 1;">👑</span>
        <span class="vip-text notranslate" translate="no" style="color: #fbbf24; font-weight: 800; letter-spacing: 0.5px;">VIP ACTIVE</span>
      `;
      navVip.onclick = (e) => {
        e.preventDefault();
        if (typeof showToast === 'function') {
          showToast("👑 VIP Active! Unlimited 4K Ultra HD & Zero Ads.", "success");
        } else {
          alert("👑 VIP Active! Unlimited 4K Ultra HD & Zero Ads.");
        }
      };
    } else {
      navVip.classList.remove("vip-active-btn");
      navVip.style.cssText = "";
      navVip.innerHTML = `
        <svg class="vip-icon" style="width:18px;height:18px;margin-right:2px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
        </svg>
        <span class="vip-text notranslate" translate="no">Upgrade</span>
      `;
      navVip.onclick = (e) => {
        e.preventDefault();
        if (typeof openVipModal === 'function') openVipModal();
      };
    }
  }

  // 2. Update Sidebar user status
  const userStatusEl = document.querySelector(".sidebar-user .user-status");
  if (userStatusEl) {
    if (isVip) {
      userStatusEl.innerHTML = '👑 <span style="color:#fbbf24; font-weight:bold;">CineWatch VIP</span>';
    } else {
      userStatusEl.textContent = 'CineWatch';
    }
  }

  // 3. Update Account Side Panel
  const panelVipBtn = document.getElementById("panelVipUpgradeBtn");
  if (panelVipBtn && isVip) {
    panelVipBtn.style.cssText = "background: rgba(245, 158, 11, 0.15) !important; border: 1px solid #fbbf24 !important; color: #fbbf24 !important; font-weight: 800; margin-bottom: 8px; cursor: default;";
    panelVipBtn.innerHTML = `
      <span style="font-size: 1.1rem;">👑</span>
      <span class="notranslate" translate="no" style="letter-spacing: 0.5px;">VIP SUBSCRIPTION ACTIVE</span>
    `;
    panelVipBtn.onclick = (e) => { e.preventDefault(); };
  }

  const panelUserName = document.getElementById("panelUserName");
  if (panelUserName && isVip && !panelUserName.querySelector(".cw-vip-pill")) {
    const pill = document.createElement("span");
    pill.className = "cw-vip-pill";
    pill.style.cssText = "background: linear-gradient(135deg, #f59e0b, #ef4444); color: #fff; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 999px; margin-left: 8px; vertical-align: middle; box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);";
    pill.textContent = "👑 VIP";
    panelUserName.appendChild(pill);
  }
}
window.renderVipBadges = renderVipBadges;

function updateAdsVisibility() {
  const isVip = isUserVip();

  if (isVip) {
    document.body.classList.add('cw-ads-hidden');

    const adIds = [
      'cwAdBannerTop',
      'cwAdSticky',
      'cwHomeAd1',
      'cwHomeAd2',
      'cwInterstitialAdModal'
    ];
    adIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
      }
    });

    document.querySelectorAll('script[src*="profitableratecpmnetwork"], script[src*="highrevenueformat"]').forEach(s => s.remove());

    window._cwPopundersInjected = true;
    window.injectPopunders = function() {};
  } else {
    document.body.classList.remove('cw-ads-hidden');
  }
}
window.updateAdsVisibility = updateAdsVisibility;

// Background check for pending VIP orders
async function checkPendingVipStatus() {
  // Check URL parameters for instant activation from Push Notification
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('vip_status') === 'approved' || urlParams.get('vip_activated') === 'true') {
      const orderPlan = urlParams.get('plan') || 'VIP';
      activateVip(orderPlan);
      window.history.replaceState({}, document.title, window.location.pathname);
      if (typeof showToast === 'function') {
        showToast("🎉 VIP Activated! Welcome to CineWatch VIP — Ad-Free & 4K streaming.", "success");
      }
      return;
    }
  } catch(e) {}

  // If already verified VIP, ensure state & badges
  if (isUserVip()) {
    activateVip(localStorage.getItem('cw_vip_tier') || 'VIP');
    return;
  }

  const pendingOrderId = localStorage.getItem('cw_pending_order_id');
  const pendingTx = localStorage.getItem('cw_pending_vip_tx');
  const orders = JSON.parse(localStorage.getItem('cinewatch_vip_orders') || '[]');

  let queryId = pendingOrderId;
  let queryRef = localStorage.getItem('cw_pending_order_ref') || '';
  if (!queryId && pendingTx) {
    try {
      const parsed = JSON.parse(pendingTx);
      queryId = parsed.orderId;
      queryRef = parsed.txId || '';
    } catch(e) {}
  }
  if (!queryId && orders.length > 0) {
    queryId = orders[0].id;
    queryRef = orders[0].reference || '';
  }

  if (!queryId && !queryRef) return;

  try {
    let sbClient = window.CW_API && window.CW_API.supabase;
    if (!sbClient) return;

    let query = sbClient.from('vip_orders').select('*').eq('status', 'approved');
    if (queryId) {
      query = query.eq('order_id', queryId);
    } else if (queryRef) {
      query = query.eq('reference', queryRef);
    }

    const { data, error } = await query.limit(1);

    if (data && data.length > 0) {
      const order = data[0];
      activateVip(order.plan || "VIP");
      sessionStorage.setItem('cw_vip_just_approved', 'true');
      
      if (typeof showToast === 'function') {
        showToast("🎉 VIP Payment Approved! Refreshing CineWatch with VIP privileges...", "success");
      }
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return;
    }
  } catch(e) {
    console.warn("Error checking VIP status", e);
  }
}
window.checkPendingVipStatus = checkPendingVipStatus;



// ============================================================
// VIP THEME ACCENT COLOR ENGINE (Available for Advanced, Pro & Ultimate)
// ============================================================

const CW_THEMES = [
  { id: 'red', name: 'Crimson Red', primary: '#e50914', hover: '#ff2e38', glow: 'rgba(229, 9, 20, 0.45)' },
  { id: 'violet', name: 'Cyber Violet', primary: '#8b5cf6', hover: '#a78bfa', glow: 'rgba(139, 92, 246, 0.45)' },
  { id: 'cyan', name: 'Electric Cyan', primary: '#06b6d4', hover: '#22d3ee', glow: 'rgba(6, 182, 212, 0.45)' },
  { id: 'emerald', name: 'Emerald Neon', primary: '#10b981', hover: '#34d399', glow: 'rgba(16, 185, 129, 0.45)' },
  { id: 'gold', name: 'Royal Gold', primary: '#f59e0b', hover: '#fbbf24', glow: 'rgba(245, 158, 11, 0.45)' },
  { id: 'pink', name: 'Neon Pink', primary: '#ec4899', hover: '#f472b6', glow: 'rgba(236, 72, 153, 0.45)' },
  { id: 'orange', name: 'Sunset Orange', primary: '#f97316', hover: '#fb923c', glow: 'rgba(249, 115, 22, 0.45)' },
  { id: 'blue', name: 'Cobalt Blue', primary: '#3b82f6', hover: '#60a5fa', glow: 'rgba(59, 130, 246, 0.45)' }
];

function canCustomizeTheme() {
  if (typeof isUserVip === 'function') {
    return isUserVip();
  }
  return false;
}
window.canCustomizeTheme = canCustomizeTheme;

function initThemeAccent() {
  if (canCustomizeTheme()) {
    const saved = localStorage.getItem('cw_theme_primary');
    if (saved) {
      const name = localStorage.getItem('cw_theme_name') || 'Custom';
      applyThemeColor(saved, null, null, name);
    }
  } else {
    // If not subscribed to VIP, enforce default Crimson Red
    applyThemeColor('red', null, null, 'Crimson Red');
  }
}
window.initThemeAccent = initThemeAccent;

function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function applyThemeColor(themeOrHex, glow, hover, name) {
  let primaryHex = '#e50914';
  let glowRgba = 'rgba(229, 9, 20, 0.45)';
  let hoverHex = '#ff2e38';
  let themeName = 'Crimson Red';

  if (typeof themeOrHex === 'object' && themeOrHex !== null) {
    primaryHex = themeOrHex.primary;
    glowRgba = themeOrHex.glow;
    hoverHex = themeOrHex.hover;
    themeName = themeOrHex.name;
  } else if (typeof themeOrHex === 'string') {
    const found = CW_THEMES.find(t => t.id === themeOrHex || t.primary.toLowerCase() === themeOrHex.toLowerCase());
    if (found) {
      primaryHex = found.primary;
      glowRgba = found.glow;
      hoverHex = found.hover;
      themeName = found.name;
    } else {
      primaryHex = themeOrHex;
      const rgb = hexToRgb(primaryHex);
      glowRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45)`;
      hoverHex = primaryHex;
      themeName = name || 'Custom';
    }
  }

  const rgb = hexToRgb(primaryHex);
  const primaryGlow = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45)`;
  const primarySubtle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.16)`;
  const primaryBorder = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45)`;
  const hoverHexVal = hoverHex || primaryHex;

  const root = document.documentElement;
  root.style.setProperty('--primary', primaryHex);
  root.style.setProperty('--primary-hover', hoverHexVal);
  root.style.setProperty('--primary-glow', primaryGlow);
  root.style.setProperty('--primary-subtle', primarySubtle);
  root.style.setProperty('--primary-border', primaryBorder);
  root.style.setProperty('--shadow-glow', `0 0 20px ${primaryGlow}`);

  localStorage.setItem('cw_theme_primary', primaryHex);
  localStorage.setItem('cw_theme_glow', primaryGlow);
  localStorage.setItem('cw_theme_hover', hoverHexVal);
  localStorage.setItem('cw_theme_subtle', primarySubtle);
  localStorage.setItem('cw_theme_border', primaryBorder);
  localStorage.setItem('cw_theme_name', themeName);

  // Update checkmarks in panel
  document.querySelectorAll('.cw-theme-swatch').forEach(btn => {
    const color = btn.dataset.color;
    if (color) {
      const isActive = color.toLowerCase() === primaryHex.toLowerCase();
      btn.classList.toggle('active', isActive);
      btn.innerHTML = isActive ? '<ion-icon name="checkmark-outline"></ion-icon>' : '';
    }
  });

  const customInput = document.getElementById('cwCustomColorInput');
  if (customInput) customInput.value = primaryHex;

  const badgeEl = document.getElementById('cwThemeCurrentBadge');
  if (badgeEl) {
    badgeEl.innerHTML = `
      <span class="theme-dot" style="background:${primaryHex};"></span>
      <span class="theme-name-text">${themeName}</span>
    `;
  }
}
window.applyThemeColor = applyThemeColor;

window.onThemeSwatchClick = function(themeId) {
  if (!canCustomizeTheme()) {
    if (typeof showToast === 'function') {
      showToast("🔒 Subscribe to VIP to customize your site accent color!", "info");
    }
    if (typeof openVipModal === 'function') {
      openVipModal();
    }
    return;
  }
  const theme = CW_THEMES.find(t => t.id === themeId);
  if (theme) {
    applyThemeColor(theme);
    if (typeof showToast === 'function') {
      showToast(`🎨 Theme changed to ${theme.name}!`, "success");
    }
  }
};

window.onCustomColorChange = function(newHex) {
  if (!canCustomizeTheme()) {
    if (typeof showToast === 'function') {
      showToast("🔒 Subscribe to VIP to customize your site accent color!", "info");
    }
    if (typeof openVipModal === 'function') {
      openVipModal();
    }
    return;
  }
  applyThemeColor(newHex, null, null, "Custom");
  if (typeof showToast === 'function') {
    showToast(`🎨 Custom theme applied!`, "success");
  }
};

function renderThemeSelectorHTML() {
  const isEligible = canCustomizeTheme();
  const currentPrimary = localStorage.getItem('cw_theme_primary') || '#e50914';
  const currentThemeName = localStorage.getItem('cw_theme_name') || 'Crimson Red';

  const swatchesHtml = CW_THEMES.map(t => {
    const isActive = currentPrimary.toLowerCase() === t.primary.toLowerCase();
    return `<button type="button" class="cw-theme-swatch ${isActive ? 'active' : ''} ${!isEligible ? 'locked-swatch' : ''}" 
                   data-color="${t.primary}" 
                   style="background: ${t.primary}; color: #fff; ${!isEligible ? 'filter: saturate(0.65) opacity(0.7); cursor: pointer;' : ''}" 
                   title="${isEligible ? t.name : t.name + ' (VIP Only)'}" 
                   onclick="onThemeSwatchClick('${t.id}')">
              ${isActive ? '<ion-icon name="checkmark-outline"></ion-icon>' : (!isEligible ? '<span class="swatch-mini-lock" style="font-size:10px; opacity:0.85; line-height:1;">🔒</span>' : '')}
            </button>`;
  }).join('');

  return `
    <div class="account-panel-section-label theme-section-header">
      <div class="theme-header-left">
        <span class="theme-header-icon">🎨</span>
        <span class="theme-header-title">ACCENT THEME</span>
      </div>
      ${isEligible ? `
        <span class="theme-current-badge" id="cwThemeCurrentBadge">
          <span class="theme-dot" style="background:${currentPrimary};"></span>
          <span class="theme-name-text">${currentThemeName}</span>
        </span>
      ` : `
        <span class="theme-locked-badge" style="display:inline-flex; align-items:center; gap:5px; cursor:pointer;" onclick="if(typeof closePanel==='function')closePanel(); if(typeof openVipModal==='function')openVipModal();" title="Click to view VIP plans">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> VIP ONLY
        </span>
      `}
    </div>

    <div class="cw-theme-selector-box ${isEligible ? 'unlocked' : 'locked'}" style="margin: 0 0.6rem 0.8rem; padding: 12px; position:relative;">
      <div class="cw-theme-swatches" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; align-items: center;">
        ${swatchesHtml}
        <label class="cw-theme-swatch custom-picker-btn ${!isEligible ? 'locked-swatch' : ''}" title="${isEligible ? 'Choose Custom Hex Color' : 'Custom Hex Color (VIP Only)'}" style="background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red); cursor:pointer; ${!isEligible ? 'filter: saturate(0.65) opacity(0.7);' : ''}" onclick="${!isEligible ? 'onThemeSwatchClick(\'custom\'); return false;' : ''}">
          <input type="color" id="cwCustomColorInput" value="${currentPrimary}" onchange="onCustomColorChange(this.value)" ${!isEligible ? 'disabled' : ''} style="position:absolute; opacity:0; width:0; height:0; pointer-events:none;">
          <ion-icon name="${isEligible ? 'color-palette-outline' : 'lock-closed'}" style="color:#fff; font-size:14px; text-shadow:0 1px 3px rgba(0,0,0,0.8);"></ion-icon>
        </label>
      </div>

      ${!isEligible ? `
        <div class="cw-theme-lock-card" onclick="if(typeof closePanel==='function')closePanel(); if(typeof openVipModal==='function')openVipModal();" style="margin-top: 12px; cursor: pointer;">
          <div style="font-size:1.15rem; line-height:1; color:#f59e0b;">🔒</div>
          <div style="flex:1; text-align:left;">
            <div style="font-size:0.82rem; font-weight:700; color:#fff;">Exclusive VIP Feature</div>
            <div style="font-size:0.72rem; color:rgba(255,255,255,0.65);">Subscribe to unlock custom site colors</div>
          </div>
          <button class="cw-theme-upgrade-pill" type="button">Unlock</button>
        </div>
      ` : ''}
    </div>
  `;
}
window.renderThemeSelectorHTML = renderThemeSelectorHTML;

// ==========================================
// CUSTOM SUBTITLE ENGINE (STREMIO & SUBDL-BASED)
// ==========================================
let currentParsedSubs = [];
let currentSubtitleIframeTitle = null;
let isKurdishSubEnabled = false;
let isFetchingSubs = false;
let customSubParams = null;
let subtitleTimeOffset = 0; // in seconds (+ or -)
let currentSubTrackIndex = 0;
let totalSubTracks = 1;
let currentSubSource = 'translated';
let currentSubTrackName = '';
let playerOpenedTimestamp = Date.now();
let subtitleSyncLoop = null;

// Anti-stuck watchdog variables
let currentShowingSubId = null;
let currentShowingSince = 0;

// High-precision Monotonic Clock for Cross-Origin Embed Players and Native Video
const subClock = {
    currentTime: 0,
    lastTickTime: performance.now(),
    isPlaying: true,
    lastPostMsgTime: 0,
    lastReportedTime: -1,
    sameTimeCount: 0,
    hasReceivedPostMsg: false,

    tick: function() {
        // Priority 1: Direct ArtPlayer instance (Anime)
        if (window.artPlayerInstance && !window.artPlayerInstance.isDestroy && typeof window.artPlayerInstance.currentTime === 'number') {
            this.currentTime = window.artPlayerInstance.currentTime;
            this.isPlaying = !window.artPlayerInstance.video?.paused;
            this.lastTickTime = performance.now();
            return this.currentTime;
        }

        // Priority 2: Direct HTML5 Video
        const video = document.getElementById('videoElement');
        if (video && !video.classList.contains('hidden') && video.src && typeof video.currentTime === 'number') {
            this.currentTime = video.currentTime;
            this.isPlaying = !video.paused;
            this.lastTickTime = performance.now();
            return this.currentTime;
        }

        // Priority 3: Embed Iframe simulation / postMessage advancement
        const now = performance.now();
        const delta = (now - this.lastTickTime) / 1000;
        this.lastTickTime = now;

        if (this.isPlaying && delta > 0 && delta < 1.0) {
            this.currentTime += delta;
        }
        return this.currentTime;
    },

    sync: function(videoSec, isPausedExplicit) {
        if (typeof videoSec !== 'number' || isNaN(videoSec) || videoSec < 0) return;
        this.lastPostMsgTime = Date.now();
        this.hasReceivedPostMsg = true;

        if (isPausedExplicit === true) {
            this.isPlaying = false;
        } else if (isPausedExplicit === false) {
            this.isPlaying = true;
        } else {
            this.isPlaying = true;
        }

        this.lastReportedTime = videoSec;

        // Snap immediately if difference > 0.15s
        if (Math.abs(this.currentTime - videoSec) > 0.15) {
            this.currentTime = videoSec;
        }
        this.lastTickTime = performance.now();
    },

    jumpTo: function(videoSec) {
        this.currentTime = Math.max(0, videoSec);
        this.lastTickTime = performance.now();
        this.isPlaying = true;
        this.lastReportedTime = videoSec;
        this.sameTimeCount = 0;
    },

    pause: function() {
        this.isPlaying = false;
    },

    play: function() {
        this.isPlaying = true;
        this.lastTickTime = performance.now();
        this.sameTimeCount = 0;
    },

    togglePlayPause: function() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
};

function loadCustomSubtitles(title, type, season, ep) {
    const overlay = document.getElementById('customSubtitleOverlay');
    const toggleBtn = document.getElementById('kurdishSubToggleBtn');
    const syncWrap = document.getElementById('kurdishSubSyncWrap');
    if (!overlay || !toggleBtn) return;

    if (!title) {
        const titleEl = document.getElementById('playerMovieTitle') || document.getElementById('playerTitle');
        if (titleEl && titleEl.textContent) {
            title = titleEl.textContent.split(' - S')[0].split(' - Ep')[0].trim();
        } else if (state.currentPlayingMovie?.title) {
            title = state.currentPlayingMovie.title;
        }
    }
    
    // Reset state for new video
    overlay.style.display = 'none';
    overlay.innerHTML = '';
    currentParsedSubs = [];
    currentSubtitleIframeTitle = title;
    isKurdishSubEnabled = false;
    isFetchingSubs = false;
    subtitleTimeOffset = 0;
    currentSubTrackIndex = 0;
    totalSubTracks = 1;
    currentSubSource = 'translated';
    currentSubTrackName = '';
    playerOpenedTimestamp = Date.now();
    currentShowingSubId = null;
    currentShowingSince = 0;
    subClock.jumpTo(0);
    
    if (subtitleSyncLoop) {
        clearInterval(subtitleSyncLoop);
        subtitleSyncLoop = null;
    }
    
    customSubParams = { title: title || '', type: type || 'movie', season: season || null, ep: ep || null };
    
    if (syncWrap) syncWrap.style.display = 'none';
    updateSyncDisplay();

    toggleBtn.style.display = 'inline-block';
    toggleBtn.innerHTML = 'CC: OFF (Kurdish)';
    toggleBtn.style.background = 'rgba(0,0,0,0.65)';
    toggleBtn.style.borderColor = 'rgba(255,255,255,0.3)';

    setupSyncButtons();
    setupDropZone();

    toggleBtn.onclick = async () => {
        if (isKurdishSubEnabled) {
            // Turn OFF
            isKurdishSubEnabled = false;
            toggleBtn.innerHTML = 'CC: OFF (Kurdish)';
            toggleBtn.style.background = 'rgba(0,0,0,0.65)';
            toggleBtn.style.borderColor = 'rgba(255,255,255,0.3)';
            overlay.style.display = 'none';
            overlay.innerHTML = '';
            if (syncWrap) syncWrap.style.display = 'none';
            const diagModal = document.getElementById('kurdishSubDialogModal');
            if (diagModal) diagModal.style.display = 'none';
            if (subtitleSyncLoop) {
                clearInterval(subtitleSyncLoop);
                subtitleSyncLoop = null;
            }
        } else {
            // Turn ON
            isKurdishSubEnabled = true;
            toggleBtn.innerHTML = 'CC: Loading...';
            toggleBtn.style.background = '#e50914';
            toggleBtn.style.borderColor = '#e50914';
            
            if (currentParsedSubs.length === 0 && !isFetchingSubs) {
                await fetchAndParseSubtitles();
            }

            if (isKurdishSubEnabled && currentParsedSubs.length > 0) {
                const label = currentSubSource === 'subdl-native' ? 'CC: ON (SubDL)' : (currentSubSource === 'uploaded' ? 'CC: ON (File)' : 'CC: ON (Kurdish)');
                toggleBtn.innerHTML = label;
                toggleBtn.style.background = '#00aa55';
                toggleBtn.style.borderColor = '#00aa55';

                if (syncWrap) syncWrap.style.display = 'inline-flex';
                overlay.style.display = 'block';

                if (subClock.currentTime === 0 && subClock.hasReceivedPostMsg && subClock.lastReportedTime > 0) {
                    subClock.jumpTo(subClock.lastReportedTime);
                }

                const firstSubSec = Math.floor(currentParsedSubs[0].start);
                const firstMin = Math.floor(firstSubSec / 60);
                const firstSec = firstSubSec % 60;
                const timeStr = String(firstMin).padStart(2,'0') + ':' + String(firstSec).padStart(2,'0');
                const badge = currentSubSource === 'subdl-native' ? '✓ ژێرنووسی کوردی ڕەسەن لە SubDL' : '✓ ژێرنووسی کوردی چالاک کرا';
                
                showSubtitleToast(badge + ' (' + currentParsedSubs.length + ' دێڕ - یەکەم دێڕ لە ' + timeStr + ')');

                startSubtitleSyncLoop();
                renderSubtitlesNow();
            } else if (isKurdishSubEnabled && currentParsedSubs.length === 0) {
                toggleBtn.innerHTML = 'CC: No SubDL (Use 📁)';
                toggleBtn.style.background = 'rgba(80,80,80,0.85)';
                toggleBtn.style.borderColor = 'rgba(255,255,255,0.4)';
                if (syncWrap) syncWrap.style.display = 'inline-flex';
                showSubtitleToast('⚠️ ژێرنووسی ئەم فیلمە لە SubDL نییە. دەتوانیت لە KurdSubtitle دایبەزێنیت و دایبنێیت 📁');
            }
        }
    };
}
window.loadCustomSubtitles = loadCustomSubtitles;

function updateSyncDisplay() {
    const syncLabel = document.getElementById('kurdishSubSyncLabel');
    if (syncLabel) {
        const sign = subtitleTimeOffset > 0 ? '+' : '';
        syncLabel.textContent = sign + subtitleTimeOffset.toFixed(1) + 's';
    }
    const trackBtn = document.getElementById('kurdishSubTrackBtn');
    if (trackBtn) {
        let label = 'Track ' + (currentSubTrackIndex + 1);
        if (currentSubTrackName) {
            label = currentSubTrackName.length > 20 ? currentSubTrackName.substring(0, 18) + '...' : currentSubTrackName;
        }
        trackBtn.textContent = label;
        trackBtn.title = currentSubTrackName || ('Track ' + (currentSubTrackIndex + 1));
        trackBtn.style.display = totalSubTracks > 1 ? 'inline-block' : 'none';
    }
    const liveTimeBtn = document.getElementById('kurdishSubLiveTime');
    if (liveTimeBtn) {
        const curSecTotal = Math.max(0, subClock.currentTime + subtitleTimeOffset);
        const curMin = Math.floor(curSecTotal / 60);
        const curSec = Math.floor(curSecTotal % 60);
        const icon = subClock.isPlaying ? '⏱️' : '⏸️';
        liveTimeBtn.textContent = icon + ' ' + String(curMin).padStart(2,'0') + ':' + String(curSec).padStart(2,'0');
    }
    const playPauseBtn = document.getElementById('kurdishSubPlayPauseBtn');
    if (playPauseBtn) {
        playPauseBtn.textContent = subClock.isPlaying ? '⏸️' : '▶️';
        playPauseBtn.title = subClock.isPlaying ? 'Pause Subtitles' : 'Resume Subtitles';
    }
}

function setupSyncButtons() {
    const playPauseBtn = document.getElementById('kurdishSubPlayPauseBtn');
    const minusBig = document.getElementById('kurdishSubSyncMinusBig');
    const minusBtn = document.getElementById('kurdishSubSyncMinus');
    const plusBtn = document.getElementById('kurdishSubSyncPlus');
    const plusBig = document.getElementById('kurdishSubSyncPlusBig');
    const syncLabel = document.getElementById('kurdishSubSyncLabel');
    const trackBtn = document.getElementById('kurdishSubTrackBtn');
    const uploadBtn = document.getElementById('kurdishSubUploadBtn');
    const fileInput = document.getElementById('kurdishSubFileInput');
    const searchBtn = document.getElementById('kurdishSubSearchBtn');
    const dialogBtn = document.getElementById('kurdishSubDialogBtn');
    const liveTimeBtn = document.getElementById('kurdishSubLiveTime');

    if (playPauseBtn) {
        playPauseBtn.onclick = (e) => {
            e.stopPropagation();
            subClock.togglePlayPause();
            updateSyncDisplay();
            renderSubtitlesNow();
            showSubtitleToast(subClock.isPlaying ? '▶️ ژێرنووس بەردەوامە (Resumed)' : '⏸️ ژێرنووس وەستێنرا (Paused)');
        };
    }

    if (minusBig) minusBig.onclick = (e) => { e.stopPropagation(); adjustOffset(-3.0); };
    if (minusBtn) minusBtn.onclick = (e) => { e.stopPropagation(); adjustOffset(-1.0); };
    if (plusBtn) plusBtn.onclick = (e) => { e.stopPropagation(); adjustOffset(1.0); };
    if (plusBig) plusBig.onclick = (e) => { e.stopPropagation(); adjustOffset(3.0); };
    if (syncLabel) syncLabel.onclick = (e) => { e.stopPropagation(); subtitleTimeOffset = 0; updateSyncDisplay(); renderSubtitlesNow(); showSubtitleToast('Sync offset reset to 0.0s'); };

    if (trackBtn) {
        trackBtn.onclick = async (e) => {
            e.stopPropagation();
            if (isFetchingSubs) return;
            currentSubTrackIndex = (currentSubTrackIndex + 1) % totalSubTracks;
            trackBtn.textContent = 'Loading...';
            await fetchAndParseSubtitles();
            updateSyncDisplay();
            renderSubtitlesNow();
            showSubtitleToast('Switched to: ' + (currentSubTrackName || ('Track ' + (currentSubTrackIndex + 1))));
        };
    }

    if (uploadBtn && fileInput) {
        uploadBtn.onclick = (e) => {
            e.stopPropagation();
            fileInput.click();
        };
        fileInput.onchange = (e) => {
            const file = e.target.files && e.target.files[0];
            if (file) handleSubtitleFile(file);
        };
    }

    if (searchBtn) {
        searchBtn.onclick = (e) => {
            e.stopPropagation();
            const raw = customSubParams?.title || document.getElementById('playerMovieTitle')?.textContent || '';
            const clean = raw.split(' - S')[0].split(' - Ep')[0].trim();
            const url = 'https://www.google.com/search?q=site%3Akurdsubtitle.net+' + encodeURIComponent(clean);
            window.open(url, '_blank');
        };
    }

    if (dialogBtn) {
        dialogBtn.onclick = (e) => {
            e.stopPropagation();
            openSubtitleDialogueModal();
        };
    }

    if (liveTimeBtn) {
        liveTimeBtn.onclick = (e) => {
            e.stopPropagation();
            const promptVal = prompt('کاتی ئێستای ڤیدیۆ دیاریبکە بۆ ژێرنووس (وەک 05:30 یان چرکەکان):\nEnter current video time (e.g. 05:30 or seconds):');
            if (promptVal) {
                const targetSec = cwTimeToSeconds(promptVal);
                if (!isNaN(targetSec) && targetSec >= 0) {
                    subClock.jumpTo(targetSec);
                    subtitleTimeOffset = 0;
                    updateSyncDisplay();
                    renderSubtitlesNow();
                    const min = Math.floor(targetSec / 60);
                    const sec = Math.floor(targetSec % 60);
                    showSubtitleToast('⏱️ ژێرنووس دانرا لە ' + String(min).padStart(2,'0') + ':' + String(sec).padStart(2,'0'));
                }
            }
        };
    }
}

function openSubtitleDialogueModal() {
    const modal = document.getElementById('kurdishSubDialogModal');
    const list = document.getElementById('kurdishSubDialogList');
    const searchInput = document.getElementById('kurdishSubSearchInput');
    if (!modal || !list) return;

    if (currentParsedSubs.length === 0) {
        showSubtitleToast('تکایە سەرەتا ژێرنووس چالاک بکە (Turn on Kurdish CC first)');
        return;
    }

    modal.style.display = 'flex';

    function renderList(query = '') {
        const q = (query || '').toLowerCase().trim();
        const filtered = q ? currentParsedSubs.filter(s => s.text.toLowerCase().includes(q)) : currentParsedSubs;
        const curTime = subClock.currentTime + subtitleTimeOffset;

        if (filtered.length === 0) {
            list.innerHTML = '<div style="padding: 20px; text-align: center; color: #888; font-size: 13px;">هیچ دێڕێک نەدۆزرایەوە (No dialogues found)</div>';
            return;
        }

        let closestDiff = Infinity;
        let closestIdx = -1;

        list.innerHTML = filtered.map((cue, idx) => {
            const min = Math.floor(cue.start / 60);
            const sec = Math.floor(cue.start % 60);
            const timeStr = String(min).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
            const diff = Math.abs(curTime - cue.start);
            if (diff < closestDiff) {
                closestDiff = diff;
                closestIdx = idx;
            }
            const isNear = diff < 3.5;
            const bg = isNear ? 'rgba(0,255,136,0.22)' : 'rgba(255,255,255,0.04)';
            const border = isNear ? '1px solid rgba(0,255,136,0.6)' : '1px solid rgba(255,255,255,0.06)';

            return `<div class="sub-cue-row" data-start="${cue.start}" data-idx="${idx}" style="padding: 8px 12px; margin-bottom: 5px; border-radius: 6px; cursor: pointer; font-size: 13px; color: #eee; background: ${bg}; border: ${border}; display: flex; justify-content: space-between; align-items: center; transition: background 0.15s;">
                <span style="flex: 1; margin-left: 10px; line-height: 1.35;">${cue.text.replace(/<br>/g, ' ')}</span>
                <span style="color: #00ff88; font-size: 11px; font-family: monospace; direction: ltr; font-weight: 600;">${timeStr}</span>
            </div>`;
        }).join('');

        list.querySelectorAll('.sub-cue-row').forEach(row => {
            row.onclick = () => {
                const startSec = parseFloat(row.dataset.start);
                if (!isNaN(startSec)) {
                    subClock.jumpTo(startSec);
                    subtitleTimeOffset = 0;
                    if (window.artPlayerInstance && !window.artPlayerInstance.isDestroy && typeof window.artPlayerInstance.currentTime === 'number') {
                        try { window.artPlayerInstance.currentTime = startSec; } catch (e) {}
                    }
                    updateSyncDisplay();
                    renderSubtitlesNow();
                    const min = Math.floor(startSec / 60);
                    const sec = Math.floor(startSec % 60);
                    const timeStr = String(min).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
                    showSubtitleToast('⏱️ ژێرنووس ڕێکخرا لە ' + timeStr);
                    modal.style.display = 'none';
                }
            };
        });

        // Auto-scroll to closest dialogue line in the current scene
        if (!q && closestIdx >= 0) {
            setTimeout(() => {
                const targetRow = list.querySelector(`.sub-cue-row[data-idx="${closestIdx}"]`);
                if (targetRow) {
                    targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 60);
        }
    }

    renderList();

    if (searchInput) {
        searchInput.value = '';
        searchInput.oninput = (e) => renderList(e.target.value);
        setTimeout(() => searchInput.focus(), 100);
    }

    const closeBtn = document.getElementById('closeSubDialogBtn');
    if (closeBtn) {
        closeBtn.onclick = () => { modal.style.display = 'none'; };
    }
}

function setupDropZone() {
    const container = document.querySelector('.video-container');
    if (!container || container.dataset.cwDropSet) return;
    container.dataset.cwDropSet = 'true';

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleSubtitleFile(e.dataTransfer.files[0]);
        }
    });
}

function handleSubtitleFile(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
        let content = ev.target.result;
        if (!content.toUpperCase().includes('WEBVTT')) {
            content = "WEBVTT\n\n" + content.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
        }
        currentParsedSubs = parseVTTBasic(content);
        if (currentParsedSubs.length > 0) {
            isKurdishSubEnabled = true;
            currentSubSource = 'uploaded';
            currentSubTrackName = file.name;
            const toggleBtn = document.getElementById('kurdishSubToggleBtn');
            const syncWrap = document.getElementById('kurdishSubSyncWrap');
            const overlay = document.getElementById('customSubtitleOverlay');
            if (toggleBtn) {
                toggleBtn.innerHTML = 'CC: ON (File)';
                toggleBtn.style.background = '#00aa55';
                toggleBtn.style.borderColor = '#00aa55';
            }
            if (syncWrap) syncWrap.style.display = 'inline-flex';
            if (overlay) overlay.style.display = 'block';
            showSubtitleToast('✓ ژێرنووسی داگیراو چالاک کرا (' + currentParsedSubs.length + ' دێڕ)');
            startSubtitleSyncLoop();
            renderSubtitlesNow();
        } else {
            showSubtitleToast('Could not parse subtitle file format');
        }
    };
    reader.readAsText(file);
}

function adjustOffset(delta) {
    subtitleTimeOffset = Math.round((subtitleTimeOffset + delta) * 10) / 10;
    updateSyncDisplay();
    renderSubtitlesNow();
}

function renderSubtitlesNow() {
    let nowSec = subClock.currentTime;
    updateSubtitleOverlay(nowSec);
}

function showSubtitleToast(msg) {
    const toast = document.getElementById('kurdishSubToast');
    if (!toast) return;
    toast.innerHTML = msg;
    toast.style.display = 'block';
    if (window._kurdishToastTimeout) clearTimeout(window._kurdishToastTimeout);
    window._kurdishToastTimeout = setTimeout(() => {
        if (toast) toast.style.display = 'none';
    }, 3200);
}

async function fetchAndParseSubtitles() {
    if (!customSubParams || !customSubParams.title) {
        const titleEl = document.getElementById('playerMovieTitle') || document.getElementById('playerTitle');
        const fallbackTitle = titleEl ? titleEl.textContent.split(' - S')[0].split(' - Ep')[0].trim() : (state.currentPlayingMovie?.title || '');
        if (fallbackTitle) {
            customSubParams = {
                title: fallbackTitle,
                type: (window.currentIframeData?.type || (state.currentPlayingMovie?.type === 'Series' ? 'tv' : 'movie')),
                season: window.currentIframeData?.season || state.currentPlayingMovie?.epData?.season || null,
                ep: window.currentIframeData?.episode || state.currentPlayingMovie?.epData?.episode || null
            };
        } else {
            return;
        }
    }
    isFetchingSubs = true;
    const btn = document.getElementById('kurdishSubToggleBtn');
    
    let qs = 'title=' + encodeURIComponent(customSubParams.title) + '&type=' + (customSubParams.type || 'movie');
    if (customSubParams.season) qs += '&season=' + customSubParams.season;
    if (customSubParams.ep) qs += '&ep=' + customSubParams.ep;
    if (currentSubTrackIndex > 0) qs += '&track=' + currentSubTrackIndex;
    
    const candidates = [
        'http://127.0.0.1:3000/api/movie-sub?' + qs,
        'http://localhost:3000/api/movie-sub?' + qs,
        '/api/movie-sub?' + qs
    ];
    
    let vttText = null;
    for (const url of candidates) {
        try {
            const res = await fetch(url);
            if (res.ok) {
                const totalTracksHeader = res.headers.get('X-Subtitle-Total-Tracks');
                if (totalTracksHeader) {
                    totalSubTracks = Math.max(1, parseInt(totalTracksHeader, 10) || 1);
                }
                const sourceHeader = res.headers.get('X-Subtitle-Source');
                if (sourceHeader) {
                    currentSubSource = sourceHeader;
                }
                const trackNameHeader = res.headers.get('X-Subtitle-Track-Name');
                if (trackNameHeader) {
                    currentSubTrackName = decodeURIComponent(trackNameHeader);
                }
                vttText = await res.text();
                if (vttText && vttText.toUpperCase().includes('WEBVTT')) {
                    break;
                }
            }
        } catch (e) {}
    }

    if (vttText) {
        currentParsedSubs = parseVTTBasic(vttText);
        updateSyncDisplay();
    } else {
        console.warn('No Kurdish subtitles found on SubDL for:', customSubParams.title);
        currentParsedSubs = [];
        totalSubTracks = 1;
        currentSubTrackName = '';
        updateSyncDisplay();
    }
    isFetchingSubs = false;
}

function parseVTTBasic(vtt) {
    if (!vtt) return [];
    const normalized = vtt.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const blocks = normalized.split(/\n\n+/);
    const rawSubs = [];
    let cueId = 0;

    blocks.forEach(block => {
        const lines = block.trim().split('\n');
        let timeLineIdx = lines.findIndex(l => l.includes('-->'));
        if (timeLineIdx !== -1) {
            const timeLine = lines[timeLineIdx];
            const textLines = lines.slice(timeLineIdx + 1).map(l => {
                return l.replace(/<\/?[^>]+(>|$)/g, '').trim();
            }).filter(Boolean);

            const arrowParts = timeLine.split('-->');
            if (arrowParts.length >= 2 && textLines.length > 0) {
                const startToken = arrowParts[0].trim().split(/\s+/)[0];
                const endToken = arrowParts[1].trim().split(/\s+/)[0];
                const sSec = cwTimeToSeconds(startToken);
                let eSec = cwTimeToSeconds(endToken);

                if (eSec <= sSec) {
                    eSec = sSec + 2.5;
                }

                rawSubs.push({
                    id: ++cueId,
                    start: sSec,
                    end: eSec,
                    text: textLines.join('<br>')
                });
            }
        }
    });

    rawSubs.sort((a, b) => a.start - b.start);

    // Smart duration clipping: prevent dialogues and watermarks from getting stuck on screen
    const subs = [];
    for (let i = 0; i < rawSubs.length; i++) {
        const cue = rawSubs[i];
        const nextCue = rawSubs[i + 1];
        const plainText = cue.text.replace(/<br>/g, ' ').replace(/\s+/g, ' ').trim();
        const len = plainText.length;
        
        const isCredit = /وەرگێڕ|ڕەوەند|سکتانی|ژێرنووس|kurdsubtitle|subdl|translate|translator|sync by/i.test(plainText);
        let naturalMax = isCredit ? 3.5 : Math.min(5.0, Math.max(2.0, len * 0.075 + 1.2));
        
        let cappedEnd = cue.end;
        if (cappedEnd - cue.start > naturalMax) {
            cappedEnd = cue.start + naturalMax;
        }

        if (nextCue && nextCue.start > cue.start && nextCue.start < cappedEnd) {
            cappedEnd = nextCue.start;
        }

        subs.push({
            id: cue.id,
            start: cue.start,
            end: cappedEnd,
            text: cue.text
        });
    }

    return subs;
}

function cwTimeToSeconds(t) {
    if (!t) return 0;
    const clean = t.trim().split(/\s+/)[0].replace(',', '.');
    const parts = clean.split(':');
    let secs = 0;
    if (parts.length === 3) {
        secs = parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
    } else if (parts.length === 2) {
        secs = parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
    } else if (parts.length === 1) {
        secs = parseFloat(parts[0]);
    }
    return isNaN(secs) ? 0 : secs;
}

function startSubtitleSyncLoop() {
    if (subtitleSyncLoop) return;
    subClock.play();
    subtitleSyncLoop = setInterval(() => {
        if (!isKurdishSubEnabled) return;
        const nowSec = subClock.tick();
        updateSubtitleOverlay(nowSec);
    }, 100);
}

function updateSubtitleOverlay(currentTime) {
    if (!isKurdishSubEnabled) return;
    const overlay = document.getElementById('customSubtitleOverlay');
    if (!overlay || currentParsedSubs.length === 0) return;
    
    let seconds = currentTime;
    if (seconds > 100000) {
        seconds = seconds / 1000;
    }

    const effectiveTime = Math.max(0, seconds + subtitleTimeOffset);

    // Update live clock badge in sync bar
    const liveTimeBtn = document.getElementById('kurdishSubLiveTime');
    if (liveTimeBtn) {
        const curMin = Math.floor(effectiveTime / 60);
        const curSec = Math.floor(effectiveTime % 60);
        const icon = subClock.isPlaying ? '⏱️' : '⏸️';
        liveTimeBtn.textContent = icon + ' ' + String(curMin).padStart(2,'0') + ':' + String(curSec).padStart(2,'0');
    }

    const playPauseBtn = document.getElementById('kurdishSubPlayPauseBtn');
    if (playPauseBtn) {
        playPauseBtn.textContent = subClock.isPlaying ? '⏸️' : '▶️';
        playPauseBtn.title = subClock.isPlaying ? 'Pause Subtitles' : 'Resume Subtitles';
    }

    // Find all matching cues at this timestamp
    const matches = currentParsedSubs.filter(s => effectiveTime >= s.start && effectiveTime <= s.end);
    
    if (matches.length > 0) {
        const matchKey = matches.map(m => m.id).join('-');
        const now = performance.now();
        if (matchKey !== currentShowingSubId) {
            currentShowingSubId = matchKey;
            currentShowingSince = now;
        } else if (now - currentShowingSince > 5500) {
            // Anti-stuck watchdog: Auto-expire cue if it has been on screen > 5.5s
            if (overlay.style.display !== 'none') {
                overlay.innerHTML = '';
                overlay.style.display = 'none';
            }
            return;
        }

        const combinedText = matches.map(m => m.text.trim()).filter(Boolean).join('<br>');
        if (!combinedText) {
            overlay.innerHTML = '';
            overlay.style.display = 'none';
            return;
        }

        const formatted = '<span style="display:inline-block; background:rgba(0,0,0,0.85); color:#ffffff; padding:6px 20px; border-radius:8px; font-family:sans-serif; font-size:24px; font-weight:700; line-height:1.45; text-shadow:0 2px 5px rgba(0,0,0,0.95); max-width:85%; border:1px solid rgba(255,255,255,0.1);">' + combinedText + '</span>';
        if (overlay.innerHTML !== formatted) {
            overlay.innerHTML = formatted;
            overlay.style.display = 'block';
        }
    } else {
        currentShowingSubId = null;
        currentShowingSince = 0;
        if (overlay.innerHTML !== '') {
            overlay.innerHTML = '';
            overlay.style.display = 'none';
        }
    }
}

// Global listener for cross-origin iframe events (VidLink, VaPlayer, Mapple, EmbedMaster, etc.)
window.addEventListener('message', (event) => {
    try {
        let data = event.data;
        if (typeof data === 'string') {
            if (data.startsWith('{') || data.startsWith('[')) {
                data = JSON.parse(data);
            } else {
                return;
            }
        }
        
        if (!data || typeof data !== 'object') return;

        // Check for pause/play explicit events
        const isPause = data.event === 'pause' || data.type === 'pause' || data.event === 'player:pause' || data.status === 'paused' || (data.data && (data.data.event === 'pause' || data.data.paused === true));
        const isPlay = data.event === 'play' || data.type === 'play' || data.event === 'player:play' || data.status === 'playing' || (data.data && (data.data.event === 'play' || data.data.paused === false));

        if (isPause) {
            subClock.pause();
            return;
        }
        if (isPlay) {
            subClock.play();
        }

        let currentTime = undefined;

        // 1. VidLink MEDIA_DATA format: { type: 'MEDIA_DATA', data: { [id]: { progress: { watched: 12.34, duration: ... } } } }
        if (data.type === 'MEDIA_DATA' && data.data && typeof data.data === 'object') {
            for (const k in data.data) {
                const item = data.data[k];
                if (item && item.progress && typeof item.progress.watched === 'number') {
                    currentTime = item.progress.watched;
                    break;
                }
            }
        }
        // 2. Direct progress.watched format
        else if (data.progress && typeof data.progress.watched === 'number') {
            currentTime = data.progress.watched;
        }
        // 3. VidLink / general PLAYER_EVENT format
        else if (data.type === 'PLAYER_EVENT') {
            if (data.data && typeof data.data.currentTime === 'number') {
                currentTime = data.data.currentTime;
            } else if (typeof data.currentTime === 'number') {
                currentTime = data.currentTime;
            }
        }
        // 4. Standard timeupdate / time / vaplayer formats
        else if (data.type === 'timeupdate' || data.type === 'time_update' || data.event === 'timeupdate' || data.event === 'time_update' || data.event === 'player:timeupdate') {
            currentTime = data.currentTime !== undefined ? data.currentTime : (data.time !== undefined ? data.time : (data.data?.time || data.data?.currentTime));
        }
        else if (typeof data.currentTime === 'number') {
            currentTime = data.currentTime;
        }
        else if (typeof data.time === 'number') {
            currentTime = data.time;
        }
        else if (data.data && typeof data.data.time === 'number') {
            currentTime = data.data.time;
        }
        else if (typeof data.seconds === 'number') {
            currentTime = data.seconds;
        }

        if (typeof currentTime === 'number' && !isNaN(currentTime)) {
            subClock.sync(currentTime);
            updateSubtitleOverlay(subClock.currentTime);
        }
    } catch(e) {}
});

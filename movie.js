// Capture recovery hash immediately before Supabase clears it
if (window.location.hash.includes("type=recovery")) {
  window.CW_PENDING_RECOVERY = true;
}

/**
 * CineWatch — Pure Vanilla JavaScript (ES6+)
 * Feature-rich movie streaming platform logic
 */

// ==========================================
// 1. HIGHLIGHTS & TRENDING
// ==========================================
let FEATURED_TITLES = ["Grand Theft Auto VI: An Extended Look","Batman: Knightfall Part 1: Knightfall", "Mutiny", "Reacher", "Lanterns", "Lioness", "Spider-Man: Brand New Day", "The Last Sunrise", "The Odyssey", "Obsession", "The Last House", "Silo"];
let TOP_10_TRENDING_TODAY = ["Grand Theft Auto VI: An Extended Look","Motor City", "Mutiny", "Batman: Knightfall Part 1: Knightfall","Reacher", "The Last Sunrise", "Spider-Man: Brand New Day", "Lanterns", "The Odyssey", "The Odyssey", "Motor City", "Toy Story 5", "Obsession"];
let TRENDING_THIS_WEEK_MOVIES = ["Batman: Knightfall Part 1: Knightfall", "Mutiny", "Spider-Man: Brand New Day", "The Odyssey", "Motor City", "Toy Story 5", "Obsession", "Minions & Monsters", "The Last House", "Disclosure Day", "The Invite", "The End of Oak Street", "Backrooms", "Camp Rock 3", "Evil Dead Burn", "Project Hail Mary", "Supergirl"];
let TRENDING_THIS_WEEK_SERIES = ["Lanterns", "Reacher", "Lucky", "Silo", "One Piece", "Ted Lasso", "X-Men '97", "Lioness", "Outer Banks"];
const POPULAR_MOVIES = ["Spider-Man: Brand New Day", "The Odyssey", "Minions & Monsters", "The Invite", "Spider-Man: No Way Home", "The End of Oak Street", "Disclosure Day", "Camp Rock 3", "The Last House", "Michael", "Project Hail Mary"];
const POPULAR_SERIES = ["Reacher", "House of the Dragon", "Ted Lasso", "The Mentalist", "Lucky", "Off Campus", "Silo", "Game of Thrones", "The Sopranos", "Stranger Things", "The Boys"];

// ==========================================
// 2. MOVIE DATABASE
// ==========================================
let MOVIES = [];

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
    if (genre === 'Fantasy') return 'فانتازيا';
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
  const num = parseFloat(rating).toFixed(1);
  const cookies = document.cookie || '';
  const isSorani = cookies.includes('googtrans=/en/ckb');
  if (!isSorani) return num;
  // Convert to Kurdish / Eastern-Arabic numerals: ٠١٢٣٤٥٦٧٨٩
  return num.replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
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

      // Apply featured/trending from title lists
      m.featured = FEATURED_TITLES.includes(m.title);
      m.trending = TRENDING_THIS_WEEK_MOVIES.includes(m.title) || TRENDING_THIS_WEEK_SERIES.includes(m.title);

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
const KEYS = {
  USER: "cinewatch_user",
  FAVORITES: "cinewatch_favorites",
  CONTINUE: "cinewatch_continue_watching",
};

const state = {
  user: null,
  favorites: [],
  continueWatching: {},
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

    const savedFavs = sessionStorage.getItem(KEYS.FAVORITES) || localStorage.getItem(KEYS.FAVORITES);
    if (savedFavs) state.favorites = JSON.parse(savedFavs);

    const savedContinue = sessionStorage.getItem(KEYS.CONTINUE) || localStorage.getItem(KEYS.CONTINUE);
    if (savedContinue) state.continueWatching = JSON.parse(savedContinue);
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
    // when the session is already active — that would cause an infinite reload loop).
    if (sessionStorage.getItem("cw_loginPending")) {
      sessionStorage.removeItem("cw_loginPending");
      window.location.reload();
      return;
    }

    // Auto-restore path: just re-render the UI with loaded data
    updateWatchlistBadge();
    renderUserBadge();
    // Un-hide the shelf element first — on page load it still has 'hidden' from HTML
    // because switchView("home") hasn't been called yet to remove it
    const shelf = document.getElementById("continueWatchingShelf");
    if (shelf) shelf.classList.remove("hidden");
    const wlShelf = document.getElementById("watchlistHomeShelf");
    if (wlShelf) wlShelf.classList.remove("hidden");

    renderContinueWatchingShelf();
    if (typeof renderWatchlistHomeShelf === "function") renderWatchlistHomeShelf();
    if (state.activeView === "watchlist") renderWatchlist();
    if (state.activeView === "continue") renderContinueWatchingPage();
  } else {
    saveUser(null);
    renderContinueWatchingShelf();
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

  // Re-render components with real-time Firestore movies
  if (typeof renderCarousels === "function") renderCarousels();
  if (typeof setupHeroBanner === "function") setupHeroBanner();
  if (state.activeView === "home") {
    renderContinueWatchingShelf();
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
    showToast("Please sign in to add to your Watchlist.");
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
  // Sync to Firestore cloud
  if (window.CW_API && state.user) {
    window.CW_API.syncData(state.favorites, state.continueWatching);
  }
  updateWatchlistBadge();
  refreshAllFavButtons(movieId, added);

  // If currently in Watchlist view, re-render watchlist
  if (state.activeView === "watchlist") {
    renderWatchlist();
  }
  return added;
}

function isFavorite(movieId) {
  return state.favorites.includes(movieId);
}

function updateContinueWatching(movieId, currentTime, duration) {
  // Require signed in user to save progress
  if (!state.user) return;
  if (!currentTime || currentTime < 5 || !duration) return;

  // If watched > 95%, remove from continue watching
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
  // Sync to Firestore cloud
  if (window.CW_API && state.user) {
    window.CW_API.syncData(state.favorites, state.continueWatching);
  }
  renderContinueWatchingShelf();
  if (state.activeView === "continue") {
    renderContinueWatchingPage();
  }
}

function removeContinueWatching(movieId) {
  delete state.continueWatching[movieId];
  localStorage.setItem(KEYS.CONTINUE, JSON.stringify(state.continueWatching));
  // Sync to Firestore cloud
  if (window.CW_API && state.user) {
    window.CW_API.syncData(state.favorites, state.continueWatching);
  }
  renderContinueWatchingShelf();
  if (state.activeView === "continue") {
    renderContinueWatchingPage();
  }
}

// ==========================================
// 3. UI RENDERERS & CONTROLLERS
// ==========================================

async function initApp() {
  const dismissLoader = () => {
    const loader = document.getElementById("appLoader");
    if (loader) {
      loader.classList.add("fade-out");
      setTimeout(() => {
        if (loader && loader.parentNode) {
          loader.remove();
        }
      }, 400);
    }
  };

  try {
    // Load all movies & series from MongoDB first
    await loadMediaFromAPI();

    loadState();
    renderUserBadge();
    updateWatchlistBadge();

    // Hero Carousel
    setupHeroBanner();

    // Render Shelves
    renderCarousels();
    renderContinueWatchingShelf();
    if (typeof renderWatchlistHomeShelf === "function") renderWatchlistHomeShelf();

    // Event Listeners Setup
    bindEventListeners();

    // Start hero auto slide (managed by startHeroAutoplay)
  } catch (err) {
    console.error("InitApp error:", err);
  } finally {
    dismissLoader();

    // Check for deep link (e.g., ?v=spider-noir) and open the movie immediately
    const params = new URLSearchParams(window.location.search);
    const deepLinkMovie = params.get('v');
    if (deepLinkMovie) {
      setTimeout(() => openDetailsModal(deepLinkMovie), 300); // slight delay for smooth UI
    }
  }
}


function getFeaturedMovies() {
  return MOVIES.filter((m) => m.featured).sort((a, b) => {
    return FEATURED_TITLES.indexOf(a.title) - FEATURED_TITLES.indexOf(b.title);
  });
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

  const playText = isSorani ? 'سەیرکردن' : (isArabic ? 'تشغيل' : 'Play');
  const moreText = isSorani ? 'زیاتر ببینە' : (isArabic ? 'عرض المزيد' : 'See More');

  // Generate ALL slides dynamically from featured array
  heroTrack.innerHTML = featured.map((movie, idx) => {
    const backdropUrl = movie.backdrop || movie.poster || "";
    const bgStyle = backdropUrl ? `style="background-image: url('${backdropUrl}')"` : "";
    const genresList = (movie.genres || []).slice(0, 3).map(translateGenre).join(" • ");

    return `
      <div class="hero-slide">
        <div class="hero-bg-image" ${bgStyle}></div>
        <div class="hero-bg-overlay"></div>
        <div class="hero-content">
            <h1 class="hero-title notranslate" translate="no">${movie.title}</h1>
            <div class="hero-meta">
                <span class="meta-rating notranslate" translate="no"><span class="star-icon">★</span> ${formatRating(movie.rating)}</span>
                <span class="meta-dot">•</span>
                <span class="meta-year notranslate" translate="no">${formatNumber(movie.year)}</span>
                ${genresList ? `<span class="meta-dot">•</span><span class="meta-genres-inline">${genresList}</span>` : ""}
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
    const bannerWidth = heroBanner.offsetWidth || window.innerWidth;

    const isRtl = getComputedStyle(document.body).direction === "rtl";
    const directionSign = isRtl ? 1 : -1;
    currentTranslate = directionSign * state.currentHeroIndex * bannerWidth;

    heroTrack.style.transition = "none";
    heroBanner.classList.add("is-dragging");

    if (state.heroInterval) clearInterval(state.heroInterval);
  };

  const onDragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    let diffX = currentX - startX;

    if (Math.abs(diffX) > 6) {
      hasMoved = true;
    }

    if (hasMoved) {
      if (e.cancelable) e.preventDefault(); // Prevent native text/image selection
      heroTrack.style.transform = `translateX(${currentTranslate + diffX}px)`;
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

  heroTrack.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";

  // Handle RTL layout direction for Sorani
  const isRtl = getComputedStyle(document.body).direction === "rtl";
  const directionSign = isRtl ? 1 : -1;
  heroTrack.style.transform = `translateX(${directionSign * state.currentHeroIndex * 100}%)`;

  // Update dots
  document.querySelectorAll("#heroDots .dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === state.currentHeroIndex);
  });
}

function createMovieCardHTML(movie, rank = null, forcePoster = false) {
  const fav = isFavorite(movie.id);
  const primaryGenre = movie.genres && movie.genres.length > 0 ? translateGenre(movie.genres[0]) : "";
  const displayType = movie.type || (movie.seasons ? "TV Show" : "Movie");
  const rankHtml = rank !== null ? `
    <div class="top10-rank-badge">
      <span class="top10-rank-text">TOP</span>
      <span class="top10-rank-num">${formatNumber(rank.toString().padStart(2, '0'))}</span>
    </div>
  ` : "";

  const imgSrc = forcePoster ? movie.poster : (movie.backdrop || movie.poster);
  const sourceTag = forcePoster ? "" : `<source media="(max-width: 768px)" srcset="${movie.poster}">`;

  return `
    <div class="movie-card" data-id="${movie.id}">
      <div class="card-poster-wrap ${forcePoster ? 'force-poster-wrap' : ''}">
        ${rankHtml}
        <picture>
          ${sourceTag}
          <img src="${imgSrc}" alt="${movie.title}" class="card-poster ${forcePoster ? 'force-poster-img' : ''}" loading="lazy">
        </picture>
        <div class="card-gradient"></div>
        <div class="card-overlay">

        </div>
      </div>
      <div class="card-details">
        <h4 class="card-title notranslate" translate="no">${movie.title}</h4>
        <div class="card-meta">
          <span class="card-rating notranslate" translate="no">⭐ ${formatRating(movie.rating)}</span>
          <span class="card-year notranslate" translate="no">${formatNumber(movie.year)}</span>
          <span class="card-type notranslate" translate="no">${formatMediaType(displayType)}</span>
        </div>
      </div>
    </div>
  `;
}

async function renderCarousels() {
  const shelfMap = {
    top10Track: MOVIES.filter((m) => TOP_10_TRENDING_TODAY.includes(m.title)).sort((a, b) => TOP_10_TRENDING_TODAY.indexOf(a.title) - TOP_10_TRENDING_TODAY.indexOf(b.title)),
    trendingMoviesTrack: MOVIES.filter((m) => TRENDING_THIS_WEEK_MOVIES.includes(m.title) && m.type !== "TV Show").sort((a, b) => TRENDING_THIS_WEEK_MOVIES.indexOf(a.title) - TRENDING_THIS_WEEK_MOVIES.indexOf(b.title)),
    trendingSeriesTrack: MOVIES.filter((m) => TRENDING_THIS_WEEK_SERIES.includes(m.title) && (m.type === "TV Show" || m.type === "Series")).sort((a, b) => TRENDING_THIS_WEEK_SERIES.indexOf(a.title) - TRENDING_THIS_WEEK_SERIES.indexOf(b.title)),
    popularMoviesTrack: MOVIES.filter((m) => POPULAR_MOVIES.includes(m.title) && m.type !== "TV Show").sort((a, b) => POPULAR_MOVIES.indexOf(a.title) - POPULAR_MOVIES.indexOf(b.title)),
    popularSeriesTrack: MOVIES.filter((m) => POPULAR_SERIES.includes(m.title) && (m.type === "TV Show" || m.type === "Series")).sort((a, b) => POPULAR_SERIES.indexOf(a.title) - POPULAR_SERIES.indexOf(b.title)),
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

  // Only show for signed-in users
  if (!state.user) {
    shelf.classList.add("hidden");
    return;
  }

  const items = Object.values(state.continueWatching).sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  if (items.length === 0) {
    shelf.classList.add("hidden");
    return;
  }

  if (state.activeView === "home") {
    shelf.classList.remove("hidden");
  }
  track.innerHTML = items
    .map((item) => {
      const movie = MOVIES.find((m) => m.id === item.movieId);
      if (!movie) return "";

      // For iframe-tracked entries we don't have real timestamps — show "In Progress"
      const isIframe = item.isIframe;
      const percent = isIframe ? 50 : Math.min(100, Math.round((item.currentTime / item.duration) * 100));
      const metaLabel = isIframe
        ? `<span>In Progress</span>`
        : `<span>${Math.max(1, Math.round((item.duration - item.currentTime) / 60))}m left</span><span>${percent}%</span>`;

      return `
      <div class="movie-card continue-card" data-id="${movie.id}">
        <div class="card-poster-wrap continue-poster-wrap">
          <picture>
            <source media="(max-width: 768px)" srcset="${movie.poster}">
            <img src="${movie.backdrop || movie.poster}" alt="${movie.title}" class="card-poster">
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
}

function renderWatchlistHomeShelf() {
  const shelf = document.getElementById("watchlistHomeShelf");
  const track = document.getElementById("watchlistHomeTrack");
  if (!shelf || !track) return;

  // Only show for signed-in users with saved titles
  if (!state.user || state.favorites.length === 0) {
    shelf.classList.add("hidden");
    return;
  }

  const favMovies = MOVIES.filter((m) => state.favorites.includes(m.id));
  if (favMovies.length === 0) {
    shelf.classList.add("hidden");
    return;
  }

  if (state.activeView === "home") {
    shelf.classList.remove("hidden");
  }
  track.innerHTML = favMovies.map((movie) => {
    const fav = isFavorite(movie.id);
    const displayType = movie.type || (movie.seasons ? "TV Show" : "Movie");
    return `
      <div class="movie-card continue-card" data-id="${movie.id}" style="cursor:pointer;">
        <div class="card-poster-wrap continue-poster-wrap">
          <img src="${movie.backdrop || movie.poster}" alt="${movie.title}" class="card-poster">
          <div class="card-overlay">

            <div class="card-details">
              <h4 class="card-title notranslate" translate="no">${movie.title}</h4>
              <div class="card-meta">
                <span>${movie.type}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Click opens details modal
  track.querySelectorAll(".movie-card").forEach((card) => {
    card.onclick = () => openDetailsModal(card.dataset.id);
  });
}

function renderWatchlist() {
  const grid = document.getElementById("watchlistGrid");
  const emptyState = document.getElementById("emptyWatchlist");
  const countText = document.getElementById("watchlistCountText");

  const favMovies = MOVIES.filter((m) => state.favorites.includes(m.id));
  if (countText) {
    countText.textContent = `${favMovies.length} saved ${favMovies.length === 1 ? "title" : "titles"}`;
  }

  if (favMovies.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  grid.innerHTML = favMovies.map(m => createMovieCardHTML(m)).join("");
}

function renderContinueWatchingPage() {
  const grid = document.getElementById("continueGrid");
  const emptyState = document.getElementById("emptyContinue");
  const countText = document.getElementById("continueCountText");
  const emptyTitle = document.getElementById("emptyContinueTitle");
  const emptyText = document.getElementById("emptyContinueText");
  const exploreBtn = document.getElementById("exploreContinueBtn");

  if (!grid || !emptyState) return;

  // Prompt unauthenticated users
  if (!state.user) {
    grid.innerHTML = "";
    if (countText) countText.textContent = "Sign in required";
    if (emptyTitle) emptyTitle.textContent = "Sign in to view Continue Watching";
    if (emptyText) emptyText.textContent = "Sign in to track your watch progress across all your devices.";
    if (exploreBtn) {
      exploreBtn.textContent = "Sign In";
      exploreBtn.onclick = () => {
        if (typeof openAuthModal === "function") openAuthModal();
      };
    }
    emptyState.classList.remove("hidden");
    return;
  }

  const items = Object.values(state.continueWatching).sort(
    (a, b) => b.timestamp - a.timestamp
  );

  if (countText) {
    countText.textContent = `${items.length} ${items.length === 1 ? "title" : "titles"} in progress`;
  }

  if (items.length === 0) {
    grid.innerHTML = "";
    if (emptyTitle) emptyTitle.textContent = "No titles in Continue Watching";
    if (emptyText) emptyText.textContent = "Movies and series you start watching will appear here so you can easily pick up where you left off.";
    if (exploreBtn) {
      exploreBtn.textContent = "Explore Movies";
      exploreBtn.onclick = () => switchView("movies");
    }
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  // Update Action Bar UI
  const selectBtn = document.getElementById("cwSelectBtn");
  const removeBtn = document.getElementById("cwRemoveSelectedBtn");
  const cancelBtn = document.getElementById("cwCancelSelectBtn");

  if (selectBtn && removeBtn && cancelBtn) {
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
  }

  grid.innerHTML = items
    .map((item) => {
      const movie = MOVIES.find((m) => m.id === item.movieId);
      if (!movie) return "";

      const isIframe = item.isIframe;
      const percent = isIframe ? 50 : Math.min(100, Math.round((item.currentTime / item.duration) * 100));
      const metaLabel = isIframe
        ? `<span>In Progress</span>`
        : `<span>${Math.max(1, Math.round((item.duration - item.currentTime) / 60))}m left</span><span>${percent}%</span>`;

      const isSelected = state.isCwSelectionMode && state.cwSelectedItems.has(movie.id);
      const selectedClass = isSelected ? 'cw-selected' : '';
      const selectionOverlay = state.isCwSelectionMode ?
        `<div class="cw-selection-overlay ${isSelected ? 'active' : ''}">
           <ion-icon name="checkmark-circle"></ion-icon>
         </div>` : '';

      return `
      <div class="movie-card continue-card ${selectedClass}" data-id="${movie.id}">
        <div class="card-poster-wrap continue-poster-wrap">
          <picture>
            <source media="(max-width: 768px)" srcset="${movie.poster}">
            <img src="${movie.backdrop || movie.poster}" alt="${movie.title}" class="card-poster">
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
    filteredGrid.innerHTML = movieList.map(m => createMovieCardHTML(m)).join("");
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
    grid.innerHTML = pageItems.map(m => createMovieCardHTML(m)).join("");
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
    if (start > 2) pages.push("…");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("…");
    pages.push(totalPages);
  }

  const cookies = document.cookie || '';
  const isCkb = cookies.includes('googtrans=/en/ckb');
  const isAr = cookies.includes('googtrans=/en/ar');
  const prevText = isCkb ? '‹ پێشوو' : (isAr ? '‹ السابق' : '‹ Prev');
  const nextText = isCkb ? 'دواتر ›' : (isAr ? 'التالي ›' : 'Next ›');
  const goText = isCkb ? 'بڕۆ' : (isAr ? 'انتقال' : 'Go');

  let html = `<button class="page-btn prev-btn notranslate" translate="no" ${currentPage === 1 ? "disabled" : ""} data-page="${currentPage - 1}">${prevText}</button>`;
  pages.forEach((p) => {
    if (p === "…") {
      html += `<span class="page-ellipsis notranslate" translate="no">…</span>`;
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
        onPageChange(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
  });

  const jumpInput = document.getElementById(`${paginationId}-jump-input`);
  const jumpBtn = document.getElementById(`${paginationId}-jump-btn`);

  if (jumpInput && jumpBtn) {
    const jumpToPage = () => {
      const p = parseInt(jumpInput.value, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        onPageChange(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
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
  return MOVIES.filter((m) => m.type === "Movie" || (!m.type && !m.seasons));
}

/** Get filtered list for series section */
function getSeriesList() {
  return MOVIES.filter((m) => !m.isAnime && (m.type === "TV Show" || m.type === "Series" || (m.seasons && m.seasons.length > 0)));
}

function getAnimeList() {
  return MOVIES.filter((m) => m.isAnime || m.type === "Anime" || (m.genres && m.genres.includes("Anime")) || (m.genres && m.genres.includes("Animation") && (m.origin_country && (m.origin_country.includes("JP") || m.origin_country.includes("Japan")))));
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
// VIEW SWITCHER
// ==========================================

function switchView(viewName) {
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

  state.activeView = viewName;
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    if (link.dataset.view === viewName) link.classList.add("active");
    else link.classList.remove("active");
  });
  window.dispatchEvent(new Event("scroll"));

  const safetyBannerWrapper = document.getElementById("safetyBannerWrapper");
  const heroBanner = document.getElementById("heroBanner");
  const defaultShelves = document.getElementById("defaultShelves");
  const continueShelf = document.getElementById("continueWatchingShelf");
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
    if (safetyBannerWrapper) safetyBannerWrapper.classList.add("hidden");
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
    if (watchlistHomeShelf) watchlistHomeShelf.classList.add("hidden");
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

  if (viewName === "home") {
    if (safetyBannerWrapper) safetyBannerWrapper.classList.remove("hidden");
    heroBanner.classList.remove("hidden");
    defaultShelves.classList.remove("hidden");
    filteredSection.classList.add("hidden");
    watchlistSection.classList.add("hidden");
    if (continueSection) continueSection.classList.add("hidden");
    moviesSection.classList.add("hidden");
    seriesSection.classList.add("hidden");
    if (animeSection) animeSection.classList.add("hidden");
    if (detailsSection) detailsSection.classList.add("hidden");
    // Explicitly un-hide the shelves before rendering so they re-appear after navigating away
    if (continueShelf) continueShelf.classList.remove("hidden");
    if (watchlistHomeShelf) watchlistHomeShelf.classList.remove("hidden");
    const homeFooter = document.getElementById("homeFooter");
    if (homeFooter) homeFooter.classList.remove("hidden");
    renderContinueWatchingShelf();
    renderWatchlistHomeShelf();
  } else if (viewName === "movies") {
    hideAll();
    moviesSection.classList.remove("hidden");
    // Reset filter & page on fresh nav; keep state if already there
    renderMoviesSection();
  } else if (viewName === "series") {
    hideAll();
    seriesSection.classList.remove("hidden");
    renderSeriesSection();
  } else if (viewName === "anime") {
    hideAll();
    if (animeSection) animeSection.classList.remove("hidden");
    renderAnimeSection();
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
  if (!container) return;

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

    // Render only the avatar icon button in the navbar
    container.innerHTML = `
      <button class="profile-icon-btn" id="profileBadgeToggle" aria-label="My Account">
        ${renderAvatarHTML(userAvatar, "badge-avatar")}
      </button>
    `;

    // Create or reuse the side panel
    let panel = document.getElementById("accountSidePanel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "accountSidePanel";
      panel.className = "account-side-panel";
      document.body.appendChild(panel);
    }

    panel.innerHTML = `
      <div class="account-panel-inner">
        <div class="account-panel-header">
          <span class="account-panel-title">My Account</span>
          <button class="account-panel-close" id="accountPanelClose">&times;</button>
        </div>

        <div class="account-panel-profile">
          <div class="account-panel-avatar">${renderAvatarHTML(userAvatar, "panel-avatar-img")}</div>
          <div class="account-panel-name" id="panelUserName">${userName}</div>
          <div class="account-panel-date"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Member since ${createdAt || "Unknown"}</div>
        </div>

        <div class="account-panel-section-label">⚙ SETTINGS</div>

        <div class="account-panel-actions">
          <label for="panelAvatarInput" class="account-panel-action-btn" id="uploadAvatarBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
            <span class="notranslate" translate="no">${uploadAvatarText}</span>
          </label>
          <input type="file" id="panelAvatarInput" accept="image/*" style="display:none;">

          <button class="account-panel-action-btn" id="editUsernameBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit username
          </button>
          
          <button class="account-panel-action-btn" id="changePasswordPanelBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Change password
          </button>

        </div>

        <button class="account-panel-logout" id="panelLogoutBtn">
          <ion-icon name="log-out-outline"></ion-icon> Logout
        </button>
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
      const currentName = nameEl ? nameEl.textContent.trim() : (state.user.name || "");

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

    // Logout
    document.getElementById("panelLogoutBtn").onclick = () => {
      closePanel();
      if (window.CW_API) window.CW_API.signOut();
      saveUser(null);
      showToast("Signed out successfully");
    };

  } else {
    container.innerHTML = `
      <button class="nav-user-icon-btn" id="headerLoginBtn" title="Sign In">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </button>
    `;
    document.getElementById("headerLoginBtn").onclick = () => openAuthModal();
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
  const loginNotice = isCkb ? 'پێویستە بچیتە ژوورەوە بۆ ناردنی بۆچوون.' : (isAr ? 'يجب تسجيل الدخول لإضافة تعليق.' : 'You must be logged in to post a comment.');
  const loginBtnText = isCkb ? 'چوونەژوورەوە یان دروستکردنی هەژمار' : (isAr ? 'تسجيل الدخول أو إنشاء حساب' : 'Log In or Sign Up');
  const noCommentsText = isCkb ? 'هیچ بۆچوونێک نییە، یەکەم کەس بە!' : (isAr ? 'لا توجد تعليقات بعد. كن أول من يعلق!' : 'No comments yet. Be the first!');
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
      <div style="color: rgba(255,255,255,0.7); margin-bottom: 1rem;">${loginNotice}</div>
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
      document.getElementById("detailsDuration").textContent = movie.duration;
    }
    if (titleEl) {
      titleEl.textContent = movie.title;
      titleEl.classList.add("notranslate");
      titleEl.setAttribute("translate", "no");
    }

    if (document.getElementById("detailsGenres")) {
      document.getElementById("detailsGenres").innerHTML = movie.genres.map(translateGenre).join(" &middot; ");
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
          // Auto-fill the subject line with the current movie/series title
          const subjectInput = document.getElementById("reportSubject");
          if (subjectInput) {
            subjectInput.value = `Issue with: ${movie.title}`;
          }
        }
      };
    }

    // Initialize interactive rating system
    if (typeof initializeRatingSystem === 'function') {
      initializeRatingSystem(movie.id);
    }

    // Render Comments Section
    renderCommentsSection(movie.id);

    // Generate You May Like Section
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
        similarsGrid.innerHTML = limited.map(createMovieCardHTML).join("");
      } else {
        similarsSection.classList.add("hidden");
      }
    }

    // ΓöÇΓöÇ TV Show: show season/episode picker ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
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

      function getEpisodeUrl(ep, seasonData) {
        if (ep.videoUrl) return ep.videoUrl;
        // We return a special template string so openVideoPlayerWithUrl knows it's a TV embed that can be switched
        const mediaId = movie.cinesrcId || movie.videoUrl;
        if (mediaId) {
          const absEp = ep.absoluteEpisode || "";
          const aniId = movie.anilistId || "";
          return `tv_embed:${mediaId}:${seasonData.season}:${ep.episode}:${absEp}:${aniId}`;
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
          return `
        <div class="episode-row ${resolvedUrl ? "" : "episode-unavailable"}" 
             data-video="${resolvedUrl}" 
             data-title="${movie.title} ΓÇö S${seasonData.season}E${ep.episode}: ${ep.title}"
             data-episode="${ep.episode}"
             title="${resolvedUrl ? "Click to watch" : "Not available yet"}">
          <div class="episode-row-thumb">
            ${thumb ? `<img src="${thumb}" alt="${ep.title}" loading="lazy" class="ep-thumb-img">` : ""}
            <div class="ep-thumb-overlay">
              <span class="ep-num-badge">${ep.episode}</span>
              ${resolvedUrl ? '<div class="ep-play-circle">Γû╢</div>' : ""}
            </div>
          </div>
          <div class="episode-row-info">
            <div class="ep-row-top">
              <span class="ep-row-title notranslate" translate="no">${ep.title}</span>
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
          const thumb = card.querySelector('.episode-row-thumb');
          if (thumb) {
            thumb.style.cursor = 'pointer';
            card.style.cursor = 'default';
            thumb.onclick = (e) => {
              e.stopPropagation();
              const videoUrl = card.dataset.video;
              const epTitle = card.dataset.title;
              const epNum = parseInt(card.dataset.episode);
              openVideoPlayerWithUrl(videoUrl, epTitle, movie.id, { season: seasonData.season, episode: epNum });
            };
          }
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
        const seasonData = movie.seasons.find((s) => s.season === parseInt(seasonSelect.value));
        if (!seasonData) return;
        const firstEp = seasonData.episodes[0];
        if (!firstEp) return;
        const epUrl = getEpisodeUrl(firstEp, seasonData);
        if (epUrl) {
          const epTitle = `${movie.title} ΓÇö S${seasonData.season}E${firstEp.episode}: ${firstEp.title}`;
          openVideoPlayerWithUrl(epUrl, epTitle, movie.id);
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

// Open the video player with a direct URL (used for TV episodes)
async function openVideoPlayerWithUrl(videoUrl, displayTitle, parentId = null, epData = null) {
  state.currentPlayingMovie = { id: parentId || "_episode_", title: displayTitle, epData };

  const modal = document.getElementById("videoModal");
  const video = document.getElementById("videoElement");
  const iframe = document.getElementById("iframeElement");
  const controlsBar = document.getElementById("playerControlsBar");
  const centerOverlay = document.getElementById("videoCenterOverlay");
  const title = document.getElementById("playerMovieTitle");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const serverWrap = document.getElementById("serverSelectWrap");

  // ── Populate info area ──
  const parentMovie = parentId ? MOVIES.find(m => m.id === parentId) : null;
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
  if (epsBtn) {
    epsBtn.classList.toggle("hidden", !parentId || !parentMovie || parentMovie.type !== "TV Show");
    epsBtn.onclick = () => {
      closeVideoPlayer();
    };
  }

  // ── Wire Next Episode button ──
  const nextEpBtn = document.getElementById("playerNextEpBtn");
  if (nextEpBtn) {
    nextEpBtn.classList.toggle("hidden", !epData);
  }

  const videoUrlStr = String(videoUrl || "");
  const isNumericId = /^\d+$/.test(videoUrlStr);
  const isTvEmbed = videoUrlStr.startsWith("tv_embed:");
  const isEmbedUrl = isTvEmbed || videoUrlStr.includes("/embed/") || videoUrlStr.includes("moviepire.co") || videoUrlStr.includes("vidapi.ru") || videoUrlStr.includes("vaplayer.ru");

  let streamUrl = null;

  if (isNumericId || isTvEmbed) {
    // Show a loading state on the center icon
    if (centerOverlay) {
      centerOverlay.innerHTML = '<ion-icon name="sync-outline" class="spin"></ion-icon>';
      centerOverlay.style.display = "flex";
      centerOverlay.style.animation = "none";
    }

    // Extract ID and fetch stream
    let fetchId = isNumericId ? videoUrlStr : videoUrlStr.split(":")[1];
    let season = isTvEmbed ? videoUrlStr.split(":")[2] : null;
    let episode = isTvEmbed ? videoUrlStr.split(":")[3] : null;
    let type = isTvEmbed ? "TV Show" : "Movie";

    streamUrl = await fetchRawStream(fetchId, type, season, episode);
  }

  // --- PLAYBACK ROUTING ---

  // 1. We got a raw stream from the API OR it was a direct mp4 to begin with
  if (streamUrl || (!isNumericId && !isEmbedUrl)) {
    const finalUrl = streamUrl || videoUrl;

    if (iframe) { iframe.classList.add("hidden"); iframe.src = ""; }
    document.querySelector(".video-container")?.classList.remove("is-iframe");
    serverWrap.classList.add("hidden");
    video.classList.remove("hidden");
    controlsBar.classList.remove("hidden");


    if (centerOverlay) {
      centerOverlay.innerHTML = '<ion-icon name="play-outline"></ion-icon>';
      centerOverlay.style.display = "";
      centerOverlay.style.animation = "";
    }

    if (Hls.isSupported() && finalUrl.includes(".m3u8")) {
      const hls = new Hls();
      hls.loadSource(finalUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
        playPauseBtn.innerHTML = '<ion-icon name="pause-outline"></ion-icon>';
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl') && finalUrl.includes(".m3u8")) {
      // Native HLS support (Safari)
      video.src = finalUrl;
      video.addEventListener('loadedmetadata', function () {
        video.play();
        playPauseBtn.innerHTML = '<ion-icon name="pause-outline"></ion-icon>';
      });
    } else {
      // Standard mp4
      video.src = finalUrl;
      video.onloadedmetadata = () => {
        video.play();
        playPauseBtn.innerHTML = '<ion-icon name="pause-outline"></ion-icon>';
      };
    }
    setupVideoControls(video);
  }

  // 2. We failed to get a stream, fallback to IFRAME embed
  else {
    video.classList.add("hidden");
    controlsBar.classList.add("hidden");

    if (centerOverlay) {
      centerOverlay.innerHTML = '<ion-icon name="sync-outline" class="spin"></ion-icon>';
      centerOverlay.style.display = "flex";
      centerOverlay.style.animation = "none";
    }
    serverWrap.classList.remove("hidden");
    if (isTvEmbed) {
      const parts = videoUrl.split(":");
      window.currentIframeData = {
        type: "tv",
        id: parts[1],
        season: parts[2],
        episode: parts[3],
        absoluteEpisode: parts[4] || null,
        anilistId: parts[5] || null,
        parentId
      };
    } else if (isNumericId) {
      window.currentIframeData = { type: "movie", id: videoUrl, parentId };
    } else {
      window.currentIframeData = null; // direct unsupported url
      serverWrap.classList.add("hidden");
    }

    if (iframe) {
      iframe.classList.remove("hidden");
      document.querySelector(".video-container")?.classList.add("is-iframe");

      if (window.currentIframeData) {
        updateIframeServer(); // Sets the src based on selected server
      } else {
        iframe.onload = () => {
          if (centerOverlay) centerOverlay.style.display = "none";
        };
        iframe.src = videoUrl;
      }
    }
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  // Hide back-to-top button while player is open
  const bttBtn = document.getElementById("backToTopBtn");
  if (bttBtn) bttBtn.style.display = "none";
}

async function openVideoPlayer(movieId, startAtSec = 0) {
  const movie = MOVIES.find((m) => m.id === movieId);
  if (!movie) return;

  // TV Shows with seasons should immediately start from S1 E1
  if (movie.type === "TV Show" && movie.seasons && movie.seasons.length > 0) {
    const firstSeason = movie.seasons[0];
    const firstEpisode = firstSeason.episodes[0];
    if (firstEpisode) {
      const tmdbId = movie.videoUrl || movie.cinesrcId || movie.id;
      const absEp = firstEpisode.absoluteEpisode || '';
      const aniId = movie.anilistId || '';
      openVideoPlayerWithUrl(
        firstEpisode.videoUrl || `tv_embed:${tmdbId}:${firstSeason.season}:${firstEpisode.episode}:${absEp}:${aniId}`,
        `${movie.title} - S${firstSeason.season} E${firstEpisode.episode}`,
        movieId,
        { ...firstEpisode, season: firstSeason.season }
      );
      return;
    }
  }

  state.currentPlayingMovie = movie;
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("videoElement");
  const iframe = document.getElementById("iframeElement");
  const controlsBar = document.getElementById("playerControlsBar");
  const centerOverlay = document.getElementById("videoCenterOverlay");
  const title = document.getElementById("playerMovieTitle");
  const playPauseBtn = document.getElementById("playPauseBtn");

  // ── Populate info area ──
  const posterEl = document.getElementById("playerShowPoster");
  const metaEl = document.getElementById("playerMeta");
  const overviewEl = document.getElementById("playerEpOverview");

  if (posterEl) {
    if (movie.poster) {
      posterEl.src = movie.poster;
      posterEl.classList.remove("hidden");
    } else {
      posterEl.classList.add("hidden");
    }
  }

  if (metaEl) {
    metaEl.textContent = movie.year ? String(movie.year) : "";
  }

  if (title) title.textContent = movie.title;

  if (overviewEl) {
    const info = getLocalizedOverview(movie);
    setOverviewElement(overviewEl, info);
  }

  // ── Hide TV-only buttons ──
  const epsBtn = document.getElementById("playerEpisodesBtn");
  if (epsBtn) epsBtn.classList.add("hidden");

  const nextEpBtn = document.getElementById("playerNextEpBtn");
  if (nextEpBtn) nextEpBtn.classList.add("hidden");


  // Check if it's an embed ID or URL
  const movieVideoUrlStr = String(movie.videoUrl || "");
  const isNumericId = /^\d+$/.test(movieVideoUrlStr);
  const isEmbedUrl = movieVideoUrlStr.includes("/embed/") || movieVideoUrlStr.includes("moviepire.co") || movieVideoUrlStr.includes("vidapi.ru") || movieVideoUrlStr.includes("vaplayer.ru");
  const serverWrap = document.getElementById("serverSelectWrap");

  let streamUrl = null;

  if (isNumericId) {
    if (centerOverlay) {
      centerOverlay.innerHTML = '<ion-icon name="sync-outline" class="spin"></ion-icon>';
      centerOverlay.style.display = "flex";
      centerOverlay.style.animation = "none";
    }

    streamUrl = await fetchRawStream(movie.videoUrl, "Movie");
  }

  // --- PLAYBACK ROUTING ---

  if (streamUrl || (!isNumericId && !isEmbedUrl)) {
    const finalUrl = streamUrl || movie.videoUrl;

    if (iframe) {
      iframe.classList.add("hidden");
      iframe.src = "";
    }
    document.querySelector(".video-container")?.classList.remove("is-iframe");
    video.classList.remove("hidden");
    controlsBar.classList.remove("hidden");

    if (centerOverlay) centerOverlay.style.display = "";
    video.src = movie.videoUrl;

    // Clear old subtitle tracks
    video.querySelectorAll("track").forEach((t) => t.remove());

    // Load subtitles if a path/url is provided
    if (movie.subtitleUrl) {
      loadSubtitleTrack(video, movie.subtitleUrl);
    }

    // Only resume if startAtSec is explicitly passed (e.g. from Continue Watching shelf)
    const initialTime = startAtSec || 0;

    video.onloadedmetadata = () => {
      if (initialTime > 0) {
        video.currentTime = initialTime;
        showToast(`Resumed at ${formatTime(initialTime)}`);
      }
      video.play();
      playPauseBtn.textContent = "⏸";
    };

    setupVideoControls(video);

  } else {
    // IFRAME FALLBACK
    video.classList.add("hidden");
    controlsBar.classList.add("hidden");

    if (centerOverlay) centerOverlay.style.display = "none";
    serverWrap.classList.remove("hidden");
    if (isNumericId) {
      window.currentIframeData = { type: "movie", id: movie.videoUrl, parentId: movie.id };
    } else {
      window.currentIframeData = null;
      serverWrap.classList.add("hidden");
    }

    if (iframe) {
      iframe.classList.remove("hidden");
      document.querySelector(".video-container")?.classList.add("is-iframe");
      if (window.currentIframeData) {
        updateIframeServer();
      } else {
        iframe.src = movie.videoUrl;
      }
    }
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  // Hide back-to-top button while player is open
  const bttBtn = document.getElementById("backToTopBtn");
  if (bttBtn) bttBtn.style.display = "none";
}

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
  const modal = document.getElementById("authModal");
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  // Reset forms and hide Turnstile widgets
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  if (loginForm) loginForm.reset();
  if (signupForm) signupForm.reset();

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

function closeAuthModal() {
  const modal = document.getElementById("authModal");
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

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
// 5. EVENT BINDINGS & LISTENERS
// ==========================================

function bindEventListeners() {
  // Navigation Links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.onclick = (e) => {
      e.preventDefault();
      const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
      if (mobileMenuOverlay) mobileMenuOverlay.classList.remove("active");
      switchView(link.dataset.view);
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
    }
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

    track.style.cursor = "grab";

    track.addEventListener("mousedown", (e) => {
      isDown = true;
      hasDragged = false;
      track.style.cursor = "grabbing";
      track.style.scrollBehavior = "auto";
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      e.preventDefault();
    });

    track.addEventListener("mouseleave", () => {
      if (!isDown) return;
      isDown = false;
      track.style.cursor = "grab";
      track.style.scrollBehavior = "smooth";
    });

    track.addEventListener("mouseup", () => {
      isDown = false;
      track.style.cursor = "grab";
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
    const card = e.target.closest(".movie-card") || e.target.closest(".browse-card");
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
      if (movie.rating) score += (movie.rating / 10);
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
  if (searchModalBackdrop) searchModalBackdrop.onclick = closeSearchModal;

  // Search Filter Dropdown Logic
  if (searchFilterBtn && searchFilterDropdown) {
    searchFilterBtn.onclick = () => {
      searchFilterDropdown.classList.toggle("hidden");
    };

    searchFilterDropdown.querySelectorAll(".filter-option").forEach(opt => {
      opt.onclick = () => {
        searchFilterDropdown.querySelectorAll(".filter-option").forEach(o => o.classList.remove("active"));
        opt.classList.add("active");
        searchFilterBtn.innerHTML = `<span id="filterBtnText" class="notranslate" translate="no">${opt.textContent}</span> <ion-icon name="chevron-down-outline"></ion-icon>`;
        searchFilterDropdown.classList.add("hidden");

        state.searchFilter = opt.dataset.filter;

        if (searchInput && searchInput.value.trim().length > 0) {
          searchInput.dispatchEvent(new Event('input'));
        }
      };
    });

    document.addEventListener("click", (e) => {
      if (!searchFilterBtn.contains(e.target) && !searchFilterDropdown.contains(e.target)) {
        searchFilterDropdown.classList.add("hidden");
      }
    });
  }

  // Clear Recents
  if (clearRecentBtn) {
    clearRecentBtn.onclick = () => {
      localStorage.removeItem("recentSearches");
      renderRecentSearches();
    };
  }

  // Click on a recent item
  if (searchRecentList) {
    searchRecentList.onclick = (e) => {
      const item = e.target.closest(".search-recent-item");
      if (item) {
        const query = item.dataset.query;
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

  // Live Search
  if (searchInput) {
    searchInput.oninput = (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (query.length > 0) {
        searchClearBtn.classList.remove("hidden");
        searchRecentSection.classList.add("hidden"); // hide recents when typing
        const matches = fuzzySearch(query);
        if (matches.length > 0) {
          searchDropdown.innerHTML = matches
            .slice(0, 15)
            .map(
              (m, i) => `
            <div class="search-item" data-id="${m.id}" style="animation-delay: ${i * 60}ms">
              <img src="${m.poster}" alt="${m.title}" style="animation-delay: ${i * 60 + 80}ms">
              <div class="search-item-info">
                <div class="search-item-title notranslate" translate="no">${m.title}</div>
                <div class="search-item-meta">⭐ ${formatRating(m.rating)} • ${m.year} • ${m.genres.map(translateGenre).join(", ")}</div>
              </div>
            </div>
          `,
            )
            .join("");
          searchDropdown.classList.remove("hidden");
        } else {
          searchDropdown.innerHTML = `<div style="padding: 1rem; text-align: center; color: var(--text-dim); font-size: 0.85rem;">No results found</div>`;
          searchDropdown.classList.remove("hidden");
        }
      } else {
        searchClearBtn.classList.add("hidden");
        searchDropdown.classList.add("hidden");
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
    const detailsSection = document.getElementById("detailsSection");

    detailsSection.style.opacity = "0";

    // Clear the deep link from the URL
    window.history.replaceState(null, '', window.location.pathname);

    setTimeout(() => {
      switchView(state.previousView || "home");

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
}


// ==========================================
// 6. UTILITY FUNCTIONS
// ==========================================

/**
 * Toggle fullscreen for the video container.
 * Works for both the native <video> player and iframe embeds.
 */
function toggleFullscreen() {
  // Use the outermost modal overlay so the Fullscreen API works correctly.
  // Requesting fullscreen on an inner child of a position:fixed element
  // causes browsers to silently reject the request.
  const fsTarget =
    document.getElementById("videoModal") ||
    document.querySelector(".video-container");

  const isFullscreen =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement;

  if (!isFullscreen) {
    if (fsTarget.requestFullscreen) {
      fsTarget.requestFullscreen().catch((err) =>
        console.error("Fullscreen error:", err)
      );
    } else if (fsTarget.webkitRequestFullscreen) {
      fsTarget.webkitRequestFullscreen();
    } else if (fsTarget.msRequestFullscreen) {
      fsTarget.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
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
    fsBtn.innerHTML = `<ion-icon name="${isFs ? "contract-outline" : "expand-outline"}"></ion-icon>`;
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

document.addEventListener("DOMContentLoaded", () => { initApp(); trackVisit(); setupCwSelectionListeners(); });

window.currentIframeData = null;

function updateIframeServer() {
  if (!window.currentIframeData) return;
  const data = window.currentIframeData;
  const iframe = document.getElementById('iframeElement');
  const serverSelectWrap = document.getElementById('serverSelectWrap');
  const serverSelect = document.getElementById('videoServerSelect');

  // Find the parent movie to check isAnime — check parentId OR the item itself
  const parentMovie = data.parentId ? MOVIES.find(m => String(m.id) === String(data.parentId) || String(m.videoUrl) === String(data.parentId)) : null;
  const selfMovie = !parentMovie && data.id ? MOVIES.find(m => String(m.videoUrl) === String(data.id) || String(m.id) === String(data.id)) : null;
  const refMovie = parentMovie || selfMovie;
  const isAnime = !!(refMovie?.isAnime || refMovie?.type === 'Anime');

  let newUrl = '';

  if (isAnime) {
    if (serverSelectWrap && serverSelect) {
      serverSelectWrap.style.display = 'block';
      serverSelectWrap.classList.remove('hidden');

      if (!serverSelect.dataset.animeServersPopulated) {
        serverSelect.innerHTML = `
          <option value="vidsrc-sbs">VidSrc (Reliable / Fast)</option>
          <option value="vidsrc-me">VidSrc ME (Multi-Language)</option>
          <option value="zxcstream">ZXC Stream (Japanese Sub)</option>
        `;
        serverSelect.dataset.animeServersPopulated = "true";
      }

      const selected = serverSelect.value;

      let mappedSeason = data.season;
      let mappedEpisode = data.episode;

      // Fix Bleach episode mapping for TMDB-based servers
      if (String(data.id) === "30984" || String(data.id) === "tt0436992" || String(data.parentId) === "Bleach") {
        const bleachSeasons = [20, 21, 22, 28, 18, 22, 20, 16, 22, 16, 7, 17, 36, 51, 26, 24];
        let ep = parseInt(data.episode) || 1;
        for (let s = 0; s < bleachSeasons.length; s++) {
          if (ep <= bleachSeasons[s]) {
            mappedSeason = s + 1;
            mappedEpisode = ep;
            break;
          }
          ep -= bleachSeasons[s];
        }
      }

      if (selected === 'zxcstream') {
        newUrl = data.type === 'tv' ? `https://player.zxcstream.xyz/embed/tv/${data.id}/${mappedSeason}/${mappedEpisode}` : `https://player.zxcstream.xyz/embed/movie/${data.id}`;
      } else if (selected === 'vidsrc-me') {
        const idParam = String(data.id).startsWith('tt') ? `imdb=${data.id}` : `tmdb=${data.id}`;
        newUrl = data.type === 'tv' ? `https://vidsrc.me/embed/tv?${idParam}&season=${mappedSeason}&episode=${mappedEpisode}` : `https://vidsrc.me/embed/movie?${idParam}`;
      } else {
        newUrl = data.type === 'tv' ? `https://vidsrc.sbs/embed/tv/${data.id}/${mappedSeason}/${mappedEpisode}` : `https://vidsrc.sbs/embed/movie/${data.id}`;
      }
    } else {
      newUrl = data.type === 'tv' ? `https://vidsrc.sbs/embed/tv/${data.id}/${data.season}/${data.episode}` : `https://vidsrc.sbs/embed/movie/${data.id}`;
    }
  } else {
    if (serverSelectWrap) {
      serverSelectWrap.style.display = 'none';
      serverSelectWrap.classList.add('hidden');
      if (serverSelect) serverSelect.dataset.animeServersPopulated = "";
    }
    if (data.type === 'tv') {
      newUrl = `https://vaplayer.ru/embed/tv/${data.id}/${data.season}/${data.episode}?skin=netflix&color=e50914`;
    } else {
      newUrl = `https://vaplayer.ru/embed/movie/${data.id}?skin=netflix&color=e50914`;
    }
  }

  iframe.onload = () => {
    const centerOverlay = document.getElementById('videoCenterOverlay');
    if (centerOverlay) centerOverlay.style.display = 'none';
  };
  iframe.src = newUrl;
}


document.getElementById("videoServerSelect")?.addEventListener("change", updateIframeServer);

// ==========================================
// EPISODE NAVIGATION
// ==========================================
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
      const epTitle = `${movie.title} - S${nextSeason.season}E${nextEp.episode}: ${nextEp.title}`;
      openVideoPlayerWithUrl(epUrl, epTitle, movie.id, { season: nextSeason.season, episode: nextEp.episode });
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

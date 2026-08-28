const fs = require('fs');
const vm = require('vm');

let js = fs.readFileSync('movie.js', 'utf8');

// 1. Insert favorites & continue state helpers before initApp
const helperBlock = `  });
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
`;

js = js.replace(/\s*\}\);\s*if\s*\(state\.activeView === "continue"\)[\s\S]*?\n\}\s*\n\/\/ ==========================================\s*\n\/\/ 3\. UI RENDERERS/m, '\n' + helperBlock + '\n// ==========================================\n// 3. UI RENDERERS');

// 2. Insert clean shelf & page renderers
const shelfAndPageBlock = `function renderContinueWatchingShelf() {
  const shelf = document.getElementById("continueWatchingShelf");
  const track = document.getElementById("continueTrack");
  if (!shelf || !track) return;

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
        ? \`<span class="notranslate" translate="no">\${inProgressText}</span>\`
        : \`<span class="notranslate" translate="no">\${formatNumber(Math.max(1, Math.round(((item.duration || 0) - (item.currentTime || 0)) / 60)))} \${leftText}</span><span class="notranslate" translate="no">\${formatNumber(percent)}%</span>\`;

      return \`
      <div class="movie-card continue-card" data-id="\${movie.id}">
        <div class="card-poster-wrap continue-poster-wrap">
          <picture>
            <source media="(max-width: 768px)" srcset="\${movie.poster}">
            <img src="\${movie.backdrop || movie.poster}" alt="\${movie.title}" class="card-poster" loading="lazy">
          </picture>
          <div class="card-gradient"></div>
          <div class="card-overlay"></div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width: \${percent}%"></div>
          </div>
        </div>
        <div class="card-details">
          <h4 class="card-title notranslate" translate="no">\${movie.title}</h4>
          <div class="card-meta">
            \${metaLabel}
          </div>
        </div>
      </div>
    \`;
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

function renderWatchlistHomeShelf() {
  const shelf = document.getElementById("watchlistHomeShelf");
  const track = document.getElementById("watchlistHomeTrack");
  if (!shelf || !track) return;

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
      removeBtn.textContent = \`Remove Selected (\${state.cwSelectedItems.size})\`;
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
        ? \`<span class="notranslate" translate="no">\${inProgressText}</span>\`
        : \`<span class="notranslate" translate="no">\${formatNumber(Math.max(1, Math.round(((item.duration || 0) - (item.currentTime || 0)) / 60)))} \${leftText}</span><span class="notranslate" translate="no">\${formatNumber(percent)}%</span>\`;

      const isSelected = state.isCwSelectionMode && state.cwSelectedItems.has(movie.id);
      const selectedClass = isSelected ? "cw-selected" : "";
      const selectionOverlay = state.isCwSelectionMode
        ? \`<div class="cw-selection-overlay \${isSelected ? "active" : ""}">
             <ion-icon name="checkmark-circle"></ion-icon>
           </div>\`
        : "";

      return \`
      <div class="movie-card continue-card \${selectedClass}" data-id="\${movie.id}">
        <div class="card-poster-wrap continue-poster-wrap">
          <picture>
            <source media="(max-width: 768px)" srcset="\${movie.poster}">
            <img src="\${movie.backdrop || movie.poster}" alt="\${movie.title}" class="card-poster" loading="lazy">
          </picture>
          <div class="card-gradient"></div>
          \${selectionOverlay}
          <div class="card-overlay"></div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width: \${percent}%"></div>
          </div>
        </div>
        <div class="card-details">
          <h4 class="card-title notranslate" translate="no">\${movie.title}</h4>
          <div class="card-meta">
            \${metaLabel}
          </div>
        </div>
      </div>
    \`;
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
  grid.innerHTML = validFavorites.map((movie) => createMovieCardHTML(movie)).join("");

  grid.querySelectorAll(".movie-card").forEach((card) => {
    card.onclick = () => openDetailsModal(card.dataset.id);
  });
}`;

js = js.replace(/function renderContinueWatchingShelf\(\)\s*\{[\s\S]*?\n\}\s*\nfunction renderFilteredGrid/m, shelfAndPageBlock + '\n\nfunction renderFilteredGrid');

fs.writeFileSync('movie.js', js, 'utf8');
console.log('movie.js patched successfully');

// Check CSS brace depth
const css = fs.readFileSync('movie.css', 'utf8');
let depth = 0;
for (let c of css) {
    if (c === '{') depth++;
    if (c === '}') depth--;
}
if (depth === 0) {
    console.log('movie.css is OK (balanced braces)');
} else {
    console.error('movie.css has unclosed braces! Depth:', depth);
}

function checkFile(filename) {
    try {
        const content = fs.readFileSync(filename, 'utf8');
        new vm.Script(content, { filename });
        console.log(filename + " is OK");
    } catch (e) {
        console.error("Syntax error in " + filename + ":");
        console.error(e.message);
    }
}

checkFile('movies-data.js');
checkFile('movie.js');
checkFile('series-data.js');
checkFile('anime-data.js');

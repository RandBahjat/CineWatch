const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '../index.html');
const movieJsFile = path.join(__dirname, '../movie.js');

let indexContent = fs.readFileSync(indexFile, 'utf8');
let movieJsContent = fs.readFileSync(movieJsFile, 'utf8');

// 1. Replace VIP text in navigation (index.html)
indexContent = indexContent.replace(
  'id="browseCardVip" style="background: rgba(245, 158, 11, 0.08); border-color: rgba(245, 158, 11, 0.25);">\r\n                                    <div class="nav-dropdown-icon" style="color: #fbbf24;"><ion-icon name="sparkles"></ion-icon></div>\r\n                                    <span class="nav-dropdown-label notranslate" translate="no" id="browseLabelVip" style="color: #fbbf24; font-weight: 600;">VIP Club</span>',
  'id="browseCardVip" style="background: rgba(245, 158, 11, 0.08); border-color: rgba(245, 158, 11, 0.25);">\n                                    <div class="nav-dropdown-icon" style="color: #fbbf24;"><ion-icon name="videocam-outline"></ion-icon></div>\n                                    <span class="nav-dropdown-label notranslate" translate="no" id="browseLabelVip" style="color: #fbbf24; font-weight: 600;">4K Ultra HD</span>'
);

indexContent = indexContent.replace(
  '<!-- VIP Membership Button -->\r\n                <button class="nav-vip-btn" id="navVipBtn" title="VIP Membership">\r\n                    <ion-icon name="sparkles" class="vip-icon"></ion-icon>\r\n                    <span class="vip-text notranslate" translate="no">VIP</span>\r\n                </button>',
  '<!-- VIP Membership Button -->\n                <button class="nav-vip-btn" id="navVipBtn" title="4K Ultra HD">\n                    <ion-icon name="videocam-outline" class="vip-icon"></ion-icon>\n                    <span class="vip-text notranslate" translate="no">4K</span>\n                </button>'
);

// Account panel in movie.js
movieJsContent = movieJsContent.replace(
  '<span class="notranslate" translate="no">CineWatch VIP Club</span>',
  '<span class="notranslate" translate="no">4K Ultra HD</span>'
);


// 2. Add 4K section HTML
const fourkSectionHtml = `
        <!-- ===== 4K SECTION ===== -->
        <section class="browse-section hidden" id="fourkSection">
            <div class="browse-section-header">
                <div class="browse-title-row">
                    <h1 class="browse-title"><ion-icon name="videocam-outline"></ion-icon> 4K Ultra HD</h1>
                    <span class="browse-count" id="fourkCount">0 titles</span>
                </div>
                <div class="browse-filter-wrapper" style="display: none;">
                    <div class="browse-filter-bar" id="fourkFilterBar">
                        <button class="browse-filter-btn active" data-genre="all" data-section="fourk">All</button>
                    </div>
                </div>
            </div>
            <div class="browse-results-bar">
                <span id="fourkCountLabel">Showing all titles</span>
            </div>
            <div class="browse-grid" id="fourkGrid"></div>
            <div class="browse-pagination" id="fourkPagination"></div>
        </section>
`;

if (!indexContent.includes('id="fourkSection"')) {
  indexContent = indexContent.replace(
    '        <!-- Category Shelves Container -->',
    fourkSectionHtml + '\n        <!-- Category Shelves Container -->'
  );
}


// 3. Logic for 4K Section rendering and filtering regular sections
// We'll append this to movie.js or replace specific blocks

// First, modify getMoviesList and getSeriesList to exclude 4k movies
movieJsContent = movieJsContent.replace(
  'return !isAnime && !isSeries && (m.type === "Movie" || !m.type);',
  'return !m.is4k && !isAnime && !isSeries && (m.type === "Movie" || !m.type);'
);

movieJsContent = movieJsContent.replace(
  'return !isAnime && (m.type === "TV Show" || m.type === "Series" || (Array.isArray(m.seasons) && m.seasons.length > 0));',
  'return !m.is4k && !isAnime && (m.type === "TV Show" || m.type === "Series" || (Array.isArray(m.seasons) && m.seasons.length > 0));'
);

// Add get4kList function
const get4kListCode = `
function get4kList() {
  return MOVIES.filter((m) => m.is4k);
}
`;
if (!movieJsContent.includes('function get4kList()')) {
  movieJsContent = movieJsContent.replace(
    'function getAnimeList() {',
    get4kListCode + '\nfunction getAnimeList() {'
  );
}

// Add render4kSection function
const render4kSectionCode = `
function render4kSection() {
  const all4k = get4kList();
  const filtered = applyBrowseFilter(all4k, state.fourkFilter || 'all');
  const totalPages = Math.max(1, Math.ceil(filtered.length / BROWSE_PAGE_SIZE));

  if ((state.fourkPage || 1) > totalPages) state.fourkPage = totalPages;
  const currPage = state.fourkPage || 1;

  const countEl = document.getElementById("fourkCount");
  if (countEl) countEl.textContent = \`\${filtered.length} title\${filtered.length !== 1 ? "s" : ""}\`;

  const labelEl = document.getElementById("fourkCountLabel");
  if (labelEl) labelEl.textContent = \`Titles: \${filtered.length}\`;

  renderBrowseGrid(filtered, "fourkGrid", currPage);
  renderBrowsePagination("fourkPagination", currPage, totalPages, (p) => {
    state.fourkPage = p;
    render4kSection();
  });
}
`;
if (!movieJsContent.includes('function render4kSection()')) {
  movieJsContent = movieJsContent.replace(
    'function renderAnimeSection() {',
    render4kSectionCode + '\nfunction renderAnimeSection() {'
  );
}

// 4. Update switchSection logic
movieJsContent = movieJsContent.replace(
  "const isBrowseSubView = (viewName === 'movies' || viewName === 'series' || viewName === 'anime' || viewName === 'continue' || viewName === 'watchlist');",
  "const isBrowseSubView = (viewName === 'movies' || viewName === 'series' || viewName === 'anime' || viewName === 'continue' || viewName === 'watchlist' || viewName === '4k');"
);

movieJsContent = movieJsContent.replace(
  "if (viewName === 'movies' || viewName === 'series' || viewName === 'anime' || viewName === 'continue') {",
  "if (viewName === 'movies' || viewName === 'series' || viewName === 'anime' || viewName === 'continue' || viewName === '4k') {"
);

movieJsContent = movieJsContent.replace(
  "} else if (viewName === \"anime\") {",
  "} else if (viewName === \"4k\") {\n    render4kSection();\n  } else if (viewName === \"anime\") {"
);

movieJsContent = movieJsContent.replace(
  "document.getElementById('animeSection'),",
  "document.getElementById('animeSection'),\n      document.getElementById('fourkSection'),"
);

// 5. Restrict 4K section access in initApp and check4kAccess
const check4kAccessCode = `
window.check4KAccess = function() {
    const tier = window.userVipTier || localStorage.getItem("userVipTier") || "free";
    if (tier === "gold" || tier === "diamond") {
        window.location.href = "index.html?section=4k";
    } else {
        openVipModal();
        if (typeof showToast === "function") showToast("You need Gold or Diamond membership to access 4K Ultra HD.", "warning");
    }
};
`;
if(!movieJsContent.includes('window.check4KAccess = function()')) {
  movieJsContent += '\\n' + check4kAccessCode;
}

// Make the navVipBtn and browseVipBtn call check4KAccess
movieJsContent = movieJsContent.replace(
  'const navVipBtn = document.getElementById("navVipBtn");\n  if (navVipBtn) navVipBtn.onclick = () => openVipModal();',
  'const navVipBtn = document.getElementById("navVipBtn");\n  if (navVipBtn) navVipBtn.onclick = () => check4KAccess();'
);
movieJsContent = movieJsContent.replace(
  'const browseVipBtn = document.getElementById("browseCardVip");\n  if (browseVipBtn) browseVipBtn.onclick = (e) => {\n    e.preventDefault();\n    openVipModal();\n  };',
  'const browseVipBtn = document.getElementById("browseCardVip");\n  if (browseVipBtn) browseVipBtn.onclick = (e) => {\n    e.preventDefault();\n    check4KAccess();\n  };'
);

// Enforce in _performSwitchView if they navigate to ?section=4k directly
const enforceAccessCode = `
  if (viewName === '4k') {
    const tier = window.userVipTier || localStorage.getItem("userVipTier") || "free";
    if (tier !== "gold" && tier !== "diamond") {
      openVipModal();
      if (typeof showToast === "function") showToast("You need Gold or Diamond membership to access 4K Ultra HD.", "warning");
      _performSwitchView('home');
      return;
    }
  }
`;
movieJsContent = movieJsContent.replace(
  'state.activeView = viewName;',
  enforceAccessCode + '\\n  state.activeView = viewName;'
);

// 6. Restrict servers in details modal
// Hide server 2 and 4 for non-4k movies.
// For 4k movies, ONLY show server 2 and 4.
const restrictServersCode = `
  const is4kMovie = !!data.is4k;
  const srv1 = document.querySelector('.details-server-btn[data-server="vidlink"]');
  const srv2 = document.querySelector('.details-server-btn[data-server="mapple"]');
  const srv3 = document.querySelector('.details-server-btn[data-server="vidapi"]');
  const srv4 = document.querySelector('.details-server-btn[data-server="embedmaster"]');
  
  if (is4kMovie) {
    if (srv1) srv1.style.display = 'none';
    if (srv3) srv3.style.display = 'none';
    if (srv2) srv2.style.display = 'inline-flex';
    if (srv4) srv4.style.display = 'inline-flex';
    // Switch to a 4k server if active server is hidden
    if (activeServer === 'vidlink' || activeServer === 'vidapi') {
      const avail = [srv2, srv4].find(s => s && s.style.display !== 'none');
      if(avail) avail.click();
    }
  } else {
    if (srv2) srv2.style.display = 'none';
    if (srv4) srv4.style.display = 'none';
    if (srv1) srv1.style.display = 'inline-flex';
    if (srv3) srv3.style.display = 'inline-flex';
    // Switch to a standard server if active server is hidden
    if (activeServer === 'mapple' || activeServer === 'embedmaster') {
      const avail = [srv1, srv3].find(s => s && s.style.display !== 'none');
      if(avail) avail.click();
    }
  }
`;
movieJsContent = movieJsContent.replace(
  'syncServerPillsUI(activeServer);',
  'syncServerPillsUI(activeServer);\\n' + restrictServersCode
);


fs.writeFileSync(indexFile, indexContent, 'utf8');
fs.writeFileSync(movieJsFile, movieJsContent, 'utf8');
console.log("Done");

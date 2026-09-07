const fs = require("fs");
const path = require("path");

function updateFile(filePath, transforms) {
  if (!fs.existsSync(filePath)) {
    console.log(`[NOT FOUND] ${filePath}`);
    return;
  }
  let rawContent = fs.readFileSync(filePath, "utf8");
  const isCRLF = rawContent.includes("\r\n");
  let content = rawContent.replace(/\r\n/g, "\n");
  let original = content;

  for (const { search, replace } of transforms) {
    if (typeof search === "string") {
      const normSearch = search.replace(/\r\n/g, "\n");
      const normReplace = replace.replace(/\r\n/g, "\n");
      if (!content.includes(normSearch)) {
        console.warn(`[WARN] Search string not found in ${filePath}:\n${normSearch.substring(0, 70)}...`);
      } else {
        content = content.replace(normSearch, normReplace);
      }
    } else {
      content = content.replace(search, replace);
    }
  }

  if (content !== original) {
    const finalContent = isCRLF ? content.replace(/\n/g, "\r\n") : content;
    fs.writeFileSync(filePath, finalContent, "utf8");
    console.log(`[UPDATED] ${filePath}`);
  } else {
    console.log(`[NO CHANGE] ${filePath}`);
  }
}

// 1. movie.js transforms
const jsTransforms = [
  // Yellow star on poster
  {
    search: `<span class="star-icon" style="color: #e50914; margin-right: 3px;">★</span>`,
    replace: `<span class="star-icon" style="color: #ffc107; margin-right: 3px;">★</span>`
  },
  // Mobile browse portal setup so dropdown isn't trapped in absolute/scrolled navbar
  {
    search: `  // Browse Dropdown Controls & Dismissal\n  const browseItem = document.getElementById("navBrowseItem");\n  const browseTriggerBtn = document.getElementById("navBrowseTrigger");`,
    replace: `  // Browse Dropdown Controls & Dismissal\n  const browseItem = document.getElementById("navBrowseItem");\n  const browseTriggerBtn = document.getElementById("navBrowseTrigger");\n  const browseDropdown = document.getElementById("navBrowseDropdown");\n\n  // Move dropdown to body on mobile so it stays fixed to viewport regardless of navbar scroll\n  function syncBrowseDropdownPlacement() {\n    if (!browseDropdown || !browseItem) return;\n    if (window.innerWidth <= 900) {\n      if (browseDropdown.parentElement !== document.body) {\n        document.body.appendChild(browseDropdown);\n      }\n    } else {\n      if (browseDropdown.parentElement !== browseItem) {\n        browseItem.appendChild(browseDropdown);\n      }\n    }\n  }\n  window.addEventListener("resize", syncBrowseDropdownPlacement, { passive: true });\n  syncBrowseDropdownPlacement();`
  },
  // Document click listener handles dropdown inside body
  {
    search: `    document.addEventListener("click", (e) => {\n      if (!browseItem.contains(e.target) && !e.target.closest("#mobileDockBrowse") && !e.target.closest("#browseMobileCloseBtn")) {\n        closeBrowseDropdown();\n      }\n    });`,
    replace: `    document.addEventListener("click", (e) => {\n      const dropdown = document.getElementById("navBrowseDropdown");\n      const isInside = (browseItem && browseItem.contains(e.target)) ||\n                       (dropdown && dropdown.contains(e.target)) ||\n                       e.target.closest("#mobileDockBrowse") ||\n                       e.target.closest("#browseMobileCloseBtn");\n      if (!isInside) {\n        closeBrowseDropdown();\n      }\n    });`
  },
  // mobileDockBrowse click with stopPropagation
  {
    search: `      } else if (btn.id === "mobileDockBrowse") {\n        if (document.body.classList.contains("mobile-browse-open")) {\n          closeBrowseDropdown();\n        } else {\n          document.body.classList.add("mobile-browse-open");\n          openBrowseDropdown();\n        }\n      }`,
    replace: `      } else if (btn.id === "mobileDockBrowse") {\n        e.stopPropagation();\n        if (document.body.classList.contains("mobile-browse-open")) {\n          closeBrowseDropdown();\n        } else {\n          document.body.classList.add("mobile-browse-open");\n          openBrowseDropdown();\n        }\n      }`
  }
];

updateFile("movie.js", jsTransforms);
updateFile(path.join("cinewatch-app", "movie.js"), jsTransforms);

// 2. browse-fix.css transforms: Yellow star
const browseFixTransforms = [
  {
    search: `#moviesGrid .card-rating .star-icon,\n#seriesGrid .card-rating .star-icon,\n#animeGrid .card-rating .star-icon,\n.browse-grid .card-rating .star-icon {\n  color: #e50914 !important;\n}`,
    replace: `#moviesGrid .card-rating .star-icon,\n#seriesGrid .card-rating .star-icon,\n#animeGrid .card-rating .star-icon,\n.browse-grid .card-rating .star-icon {\n  color: #ffc107 !important;\n}`
  }
];

updateFile("browse-fix.css", browseFixTransforms);
updateFile(path.join("cinewatch-app", "browse-fix.css"), browseFixTransforms);

// 3. movie.css transforms:
// - Larger mobile poster sizing
// - Mobile dropdown styling when in body
// - Yellow star rule
const cssTransforms = [
  {
    search: `/* Mobile Screen: Show vertical poster with 2:3 ratio instead of 16:9 backdrop */\n@media (max-width: 768px) {\n  .movie-card:not(.continue-card) .card-poster-wrap,\n  .browse-grid .card-poster-wrap,\n  #moviesGrid .card-poster-wrap,\n  #seriesGrid .card-poster-wrap,\n  #animeGrid .card-poster-wrap,\n  .filtered-grid .card-poster-wrap {\n    aspect-ratio: 2 / 3 !important;\n  }\n}`,
    replace: `/* Mobile Screen: Show vertical poster with 2:3 ratio & larger card sizes */\n@media (max-width: 768px) {\n  .movie-card:not(.continue-card) {\n    flex: 0 0 176px !important;\n    min-width: 160px !important;\n  }\n\n  .movie-card:not(.continue-card) .card-poster-wrap,\n  .browse-grid .card-poster-wrap,\n  #moviesGrid .card-poster-wrap,\n  #seriesGrid .card-poster-wrap,\n  #animeGrid .card-poster-wrap,\n  .filtered-grid .card-poster-wrap {\n    aspect-ratio: 2 / 3 !important;\n    width: 100% !important;\n  }\n}\n\n@media (max-width: 480px) {\n  .movie-card:not(.continue-card) {\n    flex: 0 0 168px !important;\n    min-width: 154px !important;\n  }\n}`
  },
  // Ensure mobile browse dropdown works anywhere in DOM
  {
    search: `  body.mobile-browse-open .nav-browse-dropdown.cineby-dropdown {\n    position: fixed !important;\n    top: auto !important;\n    bottom: calc(env(safe-area-inset-bottom, 0px) + 80px) !important;`,
    replace: `  .nav-browse-dropdown.cineby-dropdown {\n    display: none;\n  }\n\n  body.mobile-browse-open .nav-browse-dropdown.cineby-dropdown {\n    display: block !important;\n    position: fixed !important;\n    top: auto !important;\n    bottom: calc(env(safe-area-inset-bottom, 0px) + 76px) !important;`
  },
  // Add yellow star rule
  {
    search: `.card-rating {\n  color: var(--gold);\n  font-weight: 600;\n}`,
    replace: `.card-rating {\n  color: var(--gold);\n  font-weight: 600;\n}\n\n.card-rating .star-icon {\n  color: #ffc107 !important;\n}`
  }
];

updateFile("movie.css", cssTransforms);
updateFile(path.join("cinewatch-app", "movie.css"), cssTransforms);

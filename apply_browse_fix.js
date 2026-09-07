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

// 1. browse-fix.css: add @media (max-width: 768px) and (max-width: 640px) aspect-ratio: 2 / 3 !important
const browseFixTransforms = [
  {
    search: `/* 16:9 Landscape aspect ratio for backdrops */\n#moviesGrid .card-poster-wrap,\n#seriesGrid .card-poster-wrap,\n#animeGrid .card-poster-wrap,\n.browse-grid .card-poster-wrap {\n  aspect-ratio: 16 / 9 !important;\n  width: 100% !important;\n  height: auto !important;\n  position: relative !important;\n  overflow: hidden !important;\n  border-radius: 8px !important;\n  background: #181818 !important;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45) !important;\n  transition: box-shadow 0.3s ease !important;\n}`,
    replace: `/* 16:9 Landscape aspect ratio for backdrops (Desktop) */\n#moviesGrid .card-poster-wrap,\n#seriesGrid .card-poster-wrap,\n#animeGrid .card-poster-wrap,\n.browse-grid .card-poster-wrap {\n  aspect-ratio: 16 / 9 !important;\n  width: 100% !important;\n  height: auto !important;\n  position: relative !important;\n  overflow: hidden !important;\n  border-radius: 8px !important;\n  background: #181818 !important;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45) !important;\n  transition: box-shadow 0.3s ease !important;\n}\n\n/* Mobile Screen (max-width: 768px): Show vertical posters with 2:3 ratio instead of 16:9 backdrops */\n@media (max-width: 768px) {\n  #moviesGrid .card-poster-wrap,\n  #seriesGrid .card-poster-wrap,\n  #animeGrid .card-poster-wrap,\n  .browse-grid .card-poster-wrap {\n    aspect-ratio: 2 / 3 !important;\n    border-radius: 10px !important;\n  }\n}`
  },
  {
    search: `/* Mobile: 2 columns */\n@media (max-width: 640px) {\n  #moviesGrid,\n  #seriesGrid,\n  #animeGrid,\n  .browse-grid {\n    grid-template-columns: repeat(2, 1fr) !important;\n    gap: 1rem 0.75rem !important;\n  }`,
    replace: `/* Mobile: 2 columns */\n@media (max-width: 640px) {\n  #moviesGrid,\n  #seriesGrid,\n  #animeGrid,\n  .browse-grid {\n    grid-template-columns: repeat(2, 1fr) !important;\n    gap: 1rem 0.75rem !important;\n  }\n\n  #moviesGrid .card-poster-wrap,\n  #seriesGrid .card-poster-wrap,\n  #animeGrid .card-poster-wrap,\n  .browse-grid .card-poster-wrap {\n    aspect-ratio: 2 / 3 !important;\n  }`
  }
];

updateFile("browse-fix.css", browseFixTransforms);
updateFile(path.join("cinewatch-app", "browse-fix.css"), browseFixTransforms);

// 2. movie.js: ensure renderBrowseGrid and renderFilteredSection pass isMobile to force poster on mobile
const jsTransforms = [
  {
    search: `    grid.innerHTML = pageItems.map(m => createMovieCardHTML(m, null, false)).join("");`,
    replace: `    const isMobileGrid = typeof window !== 'undefined' && window.innerWidth <= 768;\n    grid.innerHTML = pageItems.map(m => createMovieCardHTML(m, null, isMobileGrid)).join("");`
  },
  {
    search: `    filteredGrid.innerHTML = movieList.map(m => createMovieCardHTML(m, null, false)).join("");`,
    replace: `    const isMobileFiltered = typeof window !== 'undefined' && window.innerWidth <= 768;\n    filteredGrid.innerHTML = movieList.map(m => createMovieCardHTML(m, null, isMobileFiltered)).join("");`
  },
  {
    search: `  const imgSrc = forcePoster ? (movie.poster || movie.backdrop) : (movie.backdrop || movie.poster);\n  // On mobile screen, always show poster instead of backdrop\n  const sourceTag = \`<source media="(max-width: 768px)" srcset="\${movie.poster || movie.backdrop}">\`;`,
    replace: `  const isMobileScreen = typeof window !== 'undefined' && window.innerWidth <= 768;\n  const usePoster = forcePoster || isMobileScreen;\n  const imgSrc = usePoster ? (movie.poster || movie.backdrop) : (movie.backdrop || movie.poster);\n  // On mobile screen, always show poster instead of backdrop\n  const sourceTag = \`<source media="(max-width: 768px)" srcset="\${movie.poster || movie.backdrop}">\`;`
  }
];

updateFile("movie.js", jsTransforms);
updateFile(path.join("cinewatch-app", "movie.js"), jsTransforms);

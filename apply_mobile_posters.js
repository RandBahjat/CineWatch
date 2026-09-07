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

// 1. JS: In createMovieCardHTML, always show poster on mobile screens (max-width: 768px)
const jsTransforms = [
  {
    search: `  const imgSrc = forcePoster ? (movie.poster || movie.backdrop) : (movie.backdrop || movie.poster);\n  const sourceTag = forcePoster ? "" : \`<source media="(max-width: 768px)" srcset="\${movie.backdrop || movie.poster}">\`;`,
    replace: `  const imgSrc = forcePoster ? (movie.poster || movie.backdrop) : (movie.backdrop || movie.poster);\n  // On mobile screen, always show poster instead of backdrop\n  const sourceTag = \`<source media="(max-width: 768px)" srcset="\${movie.poster || movie.backdrop}">\`;`
  },
  {
    search: `      detailsBg.style.backgroundImage = \`url('\${movie.backdrop || movie.poster}')\`;`,
    replace: `      const isMobileDetails = window.innerWidth <= 768;\n      const detailsHeroImg = (isMobileDetails && movie.poster) ? movie.poster : (movie.backdrop || movie.poster);\n      detailsBg.style.backgroundImage = \`url('\${detailsHeroImg}')\`;`
  }
];

updateFile("movie.js", jsTransforms);
updateFile(path.join("cinewatch-app", "movie.js"), jsTransforms);

// 2. CSS: On mobile screen (max-width: 768px), set 2/3 aspect ratio for cards so posters look proper
const cssTransforms = [
  {
    search: `.browse-grid .card-poster-wrap,\n#moviesGrid .card-poster-wrap,\n#seriesGrid .card-poster-wrap,\n#animeGrid .card-poster-wrap {\n  aspect-ratio: 16 / 9 !important;\n  width: 100% !important;\n}`,
    replace: `.browse-grid .card-poster-wrap,\n#moviesGrid .card-poster-wrap,\n#seriesGrid .card-poster-wrap,\n#animeGrid .card-poster-wrap {\n  aspect-ratio: 16 / 9 !important;\n  width: 100% !important;\n}\n\n/* Mobile Screen: Show vertical poster with 2:3 ratio instead of 16:9 backdrop */\n@media (max-width: 768px) {\n  .movie-card:not(.continue-card) .card-poster-wrap,\n  .browse-grid .card-poster-wrap,\n  #moviesGrid .card-poster-wrap,\n  #seriesGrid .card-poster-wrap,\n  #animeGrid .card-poster-wrap,\n  .filtered-grid .card-poster-wrap {\n    aspect-ratio: 2 / 3 !important;\n  }\n}`
  }
];

updateFile("movie.css", cssTransforms);
updateFile(path.join("cinewatch-app", "movie.css"), cssTransforms);

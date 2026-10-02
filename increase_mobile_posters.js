const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const appDir = path.join(rootDir, 'cinewatch-app');

function updateMovieCss(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. In @media (max-width: 768px) older section around line 4853
  content = content.replace(
    /\.movie-card\s*\{\s*flex:\s*0\s*0\s*160px;\s*\}/g,
    `.movie-card {\n    flex: 0 0 195px;\n  }`
  );
  content = content.replace(
    /\.movie-card\s*\{\s*min-width:\s*130px;\s*\}/g,
    `.movie-card {\n    min-width: 180px;\n  }`
  );
  content = content.replace(
    /\.continue-card\s*\{\s*flex:\s*0\s*0\s*240px;\s*\}/g,
    `.continue-card {\n    flex: 0 0 270px;\n  }`
  );

  // 2. In @media (max-width: 480px) older section around line 5452
  content = content.replace(
    /\.movie-card\s*\{\s*flex:\s*0\s*0\s*130px;\s*\}/g,
    `.movie-card {\n    flex: 0 0 172px;\n  }`
  );
  content = content.replace(
    /\.continue-card\s*\{\s*flex:\s*0\s*0\s*200px;\s*\}/g,
    `.continue-card {\n    flex: 0 0 240px;\n  }`
  );

  // 3. Top 10 mobile sizing around line 9068
  content = content.replace(
    /\.top10-track\s*\.movie-card\s*\{\s*flex:\s*0\s*0\s*130px;\s*\}/g,
    `.top10-track .movie-card {\n    flex: 0 0 170px !important;\n    width: 170px !important;\n    min-width: 160px !important;\n  }`
  );

  // 4. In @media (max-width: 768px) carousel rules around line 10541
  const old768Carousel = `  .carousel-track .movie-card,
  .carousel-track:not(.top10-track) .movie-card,
  #becauseYouWatchedTrack .movie-card,
  #continueTrack .movie-card,
  .movie-card:not(.continue-card) {
    flex: 0 0 160px !important;
    width: 160px !important;
    min-width: 140px !important;
    max-width: 175px !important;
  }`;

  const new768Carousel = `  .carousel-track .movie-card,
  .carousel-track:not(.top10-track) .movie-card,
  #becauseYouWatchedTrack .movie-card,
  .movie-card:not(.continue-card) {
    flex: 0 0 195px !important;
    width: 195px !important;
    min-width: 180px !important;
    max-width: 220px !important;
  }

  #continueTrack .movie-card,
  .continue-card {
    flex: 0 0 270px !important;
    width: 270px !important;
    min-width: 250px !important;
    max-width: 290px !important;
  }

  .top10-track .movie-card {
    flex: 0 0 185px !important;
    width: 185px !important;
    min-width: 175px !important;
  }`;

  if (content.includes(old768Carousel)) {
    content = content.replace(old768Carousel, new768Carousel);
  }

  // 5. In @media (max-width: 480px) carousel rules around line 10596
  const old480Carousel = `  .carousel-track .movie-card,
  .carousel-track:not(.top10-track) .movie-card,
  #becauseYouWatchedTrack .movie-card,
  #continueTrack .movie-card,
  .movie-card:not(.continue-card) {
    flex: 0 0 142px !important;
    width: 142px !important;
    min-width: 130px !important;
    max-width: 155px !important;
  }`;

  const new480Carousel = `  .carousel-track .movie-card,
  .carousel-track:not(.top10-track) .movie-card,
  #becauseYouWatchedTrack .movie-card,
  .movie-card:not(.continue-card) {
    flex: 0 0 172px !important;
    width: 172px !important;
    min-width: 162px !important;
    max-width: 185px !important;
  }

  #continueTrack .movie-card,
  .continue-card {
    flex: 0 0 240px !important;
    width: 240px !important;
    min-width: 220px !important;
    max-width: 260px !important;
  }

  .top10-track .movie-card {
    flex: 0 0 165px !important;
    width: 165px !important;
    min-width: 155px !important;
  }`;

  if (content.includes(old480Carousel)) {
    content = content.replace(old480Carousel, new480Carousel);
  }

  // 6. Append dedicated Mobile Poster Enhancements section at bottom
  const mobilePosterSection = `
/* =======================================================
   CINEMATIC MOBILE POSTER SIZING ENHANCEMENT (Bigger & Richer)
   ======================================================= */
@media (max-width: 768px) {
  .carousel-track:not(.top10-track) .movie-card,
  #trendingMoviesTrack .movie-card,
  #trendingSeriesTrack .movie-card,
  #popularMoviesTrack .movie-card,
  #popularSeriesTrack .movie-card,
  #upcomingMoviesTrack .movie-card,
  #becauseYouWatchedTrack .movie-card,
  #watchlistHomeTrack .movie-card {
    flex: 0 0 195px !important;
    width: 195px !important;
    min-width: 180px !important;
    max-width: 215px !important;
  }

  .card-title {
    font-size: 0.96rem !important;
    font-weight: 600 !important;
    letter-spacing: -0.01em !important;
  }

  .card-meta {
    font-size: 0.82rem !important;
  }
}

@media (max-width: 480px) {
  .carousel-track:not(.top10-track) .movie-card,
  #trendingMoviesTrack .movie-card,
  #trendingSeriesTrack .movie-card,
  #popularMoviesTrack .movie-card,
  #popularSeriesTrack .movie-card,
  #upcomingMoviesTrack .movie-card,
  #becauseYouWatchedTrack .movie-card,
  #watchlistHomeTrack .movie-card {
    flex: 0 0 172px !important;
    width: 172px !important;
    min-width: 162px !important;
    max-width: 185px !important;
  }

  .top10-track .movie-card {
    flex: 0 0 165px !important;
    width: 165px !important;
    min-width: 155px !important;
  }

  .card-title {
    font-size: 0.92rem !important;
    font-weight: 600 !important;
  }

  .card-meta {
    font-size: 0.78rem !important;
  }

  .top10-rank-num {
    font-size: 1.45rem !important;
  }
}
`;

  if (!content.includes('CINEMATIC MOBILE POSTER SIZING ENHANCEMENT')) {
    content += mobilePosterSection;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated mobile poster sizes in: ${filePath}`);
}

function updateIndexHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/movie\.css\?v=[^"'\s>]+/g, 'movie.css?v=20261002_bigger_posters');
  content = content.replace(/movie\.js\?v=[^"'\s>]+/g, 'movie.js?v=20261002_bigger_posters');
  content = content.replace(/browse-fix\.css\?v=[^"'\s>]+/g, 'browse-fix.css?v=20261002_bigger_posters');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated cache busters in: ${filePath}`);
}

updateMovieCss(path.join(rootDir, 'movie.css'));
updateMovieCss(path.join(appDir, 'movie.css'));

updateIndexHtml(path.join(rootDir, 'index.html'));
updateIndexHtml(path.join(appDir, 'index.html'));

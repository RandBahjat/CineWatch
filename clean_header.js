const fs = require('fs');
let code = fs.readFileSync('movie.js', 'utf8');

const firstIdx = code.indexOf('function translateGenre(genre) {');
if (firstIdx !== -1) {
  const header = `// Capture recovery hash immediately before Supabase clears it
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

`;
  code = header + code.substring(firstIdx);
  fs.writeFileSync('movie.js', code, 'utf8');
  console.log('Cleaned header in movie.js');
}

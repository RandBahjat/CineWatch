const fs = require('fs');

global.window = {};
const movJs = fs.readFileSync('movies-data.js', 'utf8');
eval(movJs);
const MOVIES = window._MOVIES_DATA;

// Auto-assign IDs like movie.js does
MOVIES.forEach(m => {
  if (!m.id) {
    m.id = m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + (m.year ? '-' + m.year : '');
  }
});

function searchCatalogForQuery(queryText) {
  if (!MOVIES || !queryText) return [];
  const q = queryText.toLowerCase().trim();
  const stopWords = new Set([
    "show", "all", "me", "movie", "movies", "series", "the", "in", "site", "film", "films",
    "with", "from", "recommend", "of", "a", "an", "for", "list", "give", "can", "you", "tell",
    "about", "please", "what", "are", "best", "top", "watch", "streaming", "catalog", "is",
    "were", "was", "any", "good", "new", "old", "some"
  ]);

  const tokens = q.split(/[^a-zA-Z0-9]+/).filter((t) => t.length > 1 && !stopWords.has(t));

  const matches = MOVIES.filter((m) => {
    const title = (m.title || "").toLowerCase();
    const cast = Array.isArray(m.cast) ? m.cast.join(" ").toLowerCase() : (m.cast || "").toLowerCase();
    const director = (m.director || "").toLowerCase();
    const genres = Array.isArray(m.genres) ? m.genres.join(" ").toLowerCase() : (m.genres || "").toLowerCase();
    const hay = `${title} ${cast} ${director} ${genres}`;

    if (q.length > 2 && (title.includes(q) || cast.includes(q) || director.includes(q))) {
      return true;
    }
    if (tokens.length > 0 && tokens.every((tok) => hay.includes(tok))) {
      return true;
    }
    return false;
  });

  return Array.from(new Set(matches)).slice(0, 50);
}

function getCatalogContext(currentQuery = "") {
  const matched = currentQuery ? searchCatalogForQuery(currentQuery) : [];
  let matchSection = "";
  if (matched.length > 0) {
    matchSection = `\n\n*** MATCHING CINEWATCH CATALOG TITLES FOUND FOR THIS QUERY (${matched.length} titles found in site database) ***\n` +
      matched.map((m) => {
        const castStr = Array.isArray(m.cast) ? m.cast.slice(0, 6).join(", ") : (m.cast || "");
        const dirStr = m.director ? ` | Dir: ${m.director}` : "";
        const genresStr = Array.isArray(m.genres) ? m.genres.slice(0, 3).join(", ") : (m.genres || "");
        return `• "${m.title}" (${m.year}) | ID: ${m.id} | Rating: ${m.rating} | Type: ${m.type || (m.seasons ? "TV Show" : "Movie")} | Genres: ${genresStr}${dirStr} | Cast: ${castStr}`;
      }).join("\n") +
      `\n\nCRITICAL INSTRUCTION: When the user asks to see or list movies/shows for this query (e.g. Tom Cruise), you MUST list ALL of these matched CineWatch titles in your response and append their exact [[MOVIE_CARD: <id>]] tags.`;
  }
  return matchSection;
}

const userQuery = "show me all tom cruise movie in the site";
const sys = `You are CineWatch AI, a friendly movie assistant on CineWatch streaming platform.
1. When recommending or listing movies/series, ALWAYS embed a card tag on its own line:
   [[MOVIE_CARD: <id>]]
2. If asked for an actor, list ALL matching CineWatch titles found.

${getCatalogContext(userQuery)}
`;

const apiKey = "AQ.Ab8RN6JsqKWFNQOYBdJtcu69XZaGpchEQI7qBAJZkChPwxL7AA";
const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=" + apiKey;

console.log("Sending query to Gemini 3.7-flash...");

fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    system_instruction: { parts: [{ text: sys }] },
    contents: [{ role: "user", parts: [{ text: userQuery }] }],
    generationConfig: { temperature: 0.4, maxOutputTokens: 1600 }
  })
}).then(r => r.json()).then(d => {
  console.log("--- Response ---");
  console.log(d?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(d));
}).catch(e => console.error("Error:", e));

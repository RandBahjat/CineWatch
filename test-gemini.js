const fs = require('fs');

global.window = {};
const movJs = fs.readFileSync('movies-data.js', 'utf8');
eval(movJs);
const MOVIES = window._MOVIES_DATA;

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
    "about", "please", "what", "are", "best", "top", "watch", "streaming", "catalog", "is"
  ]);

  const tokens = q.split(/[^a-zA-Z0-9]+/).filter((t) => t.length > 1 && !stopWords.has(t));

  const matches = MOVIES.filter((m) => {
    const title = (m.title || "").toLowerCase();
    const cast = Array.isArray(m.cast) ? m.cast.join(" ").toLowerCase() : (m.cast || "").toLowerCase();
    const director = (m.director || "").toLowerCase();
    const genres = Array.isArray(m.genres) ? m.genres.join(" ").toLowerCase() : (m.genres || "").toLowerCase();
    const hay = `${title} ${cast} ${director} ${genres}`;

    if (q.length > 2 && (title.includes(q) || cast.includes(q) || director.includes(q))) return true;
    if (tokens.length > 0 && tokens.every((tok) => hay.includes(tok))) return true;
    return false;
  });

  return Array.from(new Set(matches)).slice(0, 30);
}

function getCatalogContext(currentQuery = "") {
  const matched = currentQuery ? searchCatalogForQuery(currentQuery) : [];
  if (matched.length === 0) return "No specific query matches found.";

  const lines = matched.map((m) => {
    const castStr = Array.isArray(m.cast) ? m.cast.slice(0, 4).join(", ") : (m.cast || "");
    return `- Title: "${m.title}" (${m.year}) | ID: ${m.id} | Rating: ${m.rating} | Cast: ${castStr}`;
  });

  return `\n\n[CINEWATCH DATABASE MATCHES FOR THIS QUERY (${matched.length} TITLES)]:\n${lines.join("\n")}\n\nINSTRUCTION: The user is asking for these. List and introduce ALL of these ${matched.length} CineWatch titles with their exact [[MOVIE_CARD: <id>]] tags so the user can click and view each one.`;
}

const userQuery = "show me all tom cruise movie in the site";
const sys = `You are CineWatch AI assistant on CineWatch.
Format responses cleanly with bold titles and bullet points.
For each title available in CineWatch, put its card tag on its own line: [[MOVIE_CARD: <id>]]
${getCatalogContext(userQuery)}
`;

const apiKey = "AQ.Ab8RN6JsqKWFNQOYBdJtcu69XZaGpchEQI7qBAJZkChPwxL7AA";
const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=" + apiKey;

const start = Date.now();
fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    system_instruction: { parts: [{ text: sys }] },
    contents: [{ role: "user", parts: [{ text: userQuery }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 1500 }
  })
}).then(r => r.json()).then(d => {
  console.log("Time taken:", (Date.now() - start), "ms");
  console.log("Reply:\n", d?.candidates?.[0]?.content?.parts?.[0]?.text);
}).catch(e => console.error("Error:", e));

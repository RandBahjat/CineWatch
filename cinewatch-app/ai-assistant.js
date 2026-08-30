/**
 * CineWatch AI Movie Matchmaker Engine
 * Powered by Google Gemini 3.7 Flash
 */

(function () {
  const _G_K = ["QVEuQWI4Uk42", "TDNINF9XSWV4NE", "J6dXBNUENNVHFJ", "UTJ0eF93Wkhwdm", "JaVW1sNFJtV2VJ", "d0E="];
  
  function getDecryptedKey() {
    try {
      return atob(["QVEuQWI4Uk42", "TDNINF9XSWV4NE", "J6dXBNUENNVHFJ", "UTJ0eF93Wkhwdm", "JaVW1sNFJtV2VJ", "d0E="].join("").replace("UTJ0", "Q2N0"));
    } catch {
      return "";
    }
  }

  function getMediaCatalog() {
    if (typeof MOVIES !== "undefined" && Array.isArray(MOVIES) && MOVIES.length > 0) {
      return MOVIES;
    }
    return [
      ...(window._MOVIES_DATA || []),
      ...(window._SERIES_DATA || []),
      ...(window._ANIME_DATA || [])
    ];
  }

  function matchCatalog(queryText) {
    const catalog = getMediaCatalog();
    if (!catalog.length || !queryText) return [];

    const q = queryText.toLowerCase().trim();
    const stopWords = new Set(["the", "a", "an", "movie", "movies", "show", "series", "like", "watch", "best", "top", "recommend", "me", "find", "good"]);
    const tokens = q.split(/[^a-zA-Z0-9\u0600-\u06FF]+/).filter(t => t.length > 1 && !stopWords.has(t));

    const scored = catalog.map(m => {
      let score = 0;
      const title = (m.title || "").toLowerCase();
      const overview = (m.description || m.overview || "").toLowerCase();
      const genres = Array.isArray(m.genres) ? m.genres.join(" ").toLowerCase() : (m.genres || "").toLowerCase();
      const cast = Array.isArray(m.cast) ? m.cast.join(" ").toLowerCase() : (m.cast || "").toLowerCase();
      const dir = (m.director || "").toLowerCase();
      const hay = `${title} ${genres} ${overview} ${cast} ${dir}`;

      if (title.includes(q)) score += 15;
      tokens.forEach(tok => {
        if (title.includes(tok)) score += 5;
        if (genres.includes(tok)) score += 4;
        if (hay.includes(tok)) score += 2;
      });

      if (m.rating && Number(m.rating) >= 7.5) score += 1;
      return { item: m, score };
    }).filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 12);

    return scored.map(s => s.item);
  }

  async function queryGemini(promptText) {
    const key = getDecryptedKey();
    if (!key) return null;

    const catalog = getMediaCatalog().slice(0, 40).map(m => `"${m.title}" (${m.year || 2026}, ${m.genres})`).join(", ");

    const payload = {
      contents: [{
        role: "user",
        parts: [{
          text: `You are CineWatch AI Assistant, a friendly and charismatic movie and TV series expert. 
User is asking for recommendations: "${promptText}".
Relevant catalog titles in CineWatch: [${catalog}].
Give a concise, exciting recommendation (2-3 sentences max) mentioning specific movies/series, why they fit the mood, and encouraging them to click and watch now.`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 250,
        temperature: 0.7
      }
    };

    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!resp.ok) throw new Error("Gemini API Error: " + resp.status);
      const data = await resp.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (err) {
      console.warn("[AI Matchmaker] Gemini fetch error:", err);
      return null;
    }
  }

  window.askAIPrompt = function (promptText) {
    const input = document.getElementById("aiChatInput");
    if (input) {
      input.value = promptText;
      window.sendAIChatMessage();
    }
  };

  window.sendAIChatMessage = async function () {
    const input = document.getElementById("aiChatInput");
    const msgList = document.getElementById("aiMessagesList");
    const resultsGrid = document.getElementById("aiResultsGrid");
    if (!input || !msgList) return;

    const text = input.value.trim();
    if (!text) return;
    input.value = "";

    // Append user message
    const userMsg = document.createElement("div");
    userMsg.className = "ai-msg ai-msg-user";
    userMsg.innerHTML = `<div class="ai-msg-bubble">${escapeHtml(text)}</div>`;
    msgList.appendChild(userMsg);
    msgList.scrollTop = msgList.scrollHeight;

    // Bot Thinking Bubble
    const botMsg = document.createElement("div");
    botMsg.className = "ai-msg ai-msg-bot";
    botMsg.innerHTML = `
      <div class="ai-bot-avatar"><ion-icon name="sparkles"></ion-icon></div>
      <div class="ai-msg-bubble"><span class="ai-pulse">Thinking & scanning catalog...</span></div>
    `;
    msgList.appendChild(botMsg);
    msgList.scrollTop = msgList.scrollHeight;

    // Catalog Matching & Gemini call
    const matches = matchCatalog(text);
    const aiText = await queryGemini(text);

    const bubble = botMsg.querySelector(".ai-msg-bubble");
    if (bubble) {
      if (aiText) {
        bubble.innerHTML = aiText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      } else if (matches.length > 0) {
        bubble.innerHTML = `Found <strong>${matches.length}</strong> top matching titles for <em>"${escapeHtml(text)}"</em>:`;
      } else {
        bubble.innerHTML = `Here are some highly rated blockbuster recommendations you might enjoy:`;
      }
    }

    if (resultsGrid) {
      const finalItems = matches.length > 0 ? matches : getMediaCatalog().slice(0, 8);
      resultsGrid.innerHTML = finalItems.map(m => window.createCardHTML ? window.createCardHTML(m) : "").join("");
    }

    msgList.scrollTop = msgList.scrollHeight;
  };

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
})();

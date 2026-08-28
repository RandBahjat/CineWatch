/**
 * CineWatch AI Movie Assistant
 * Powered by Google Gemini 3.7 Flash
 */

(function () {
  const GEMINI_API_KEY = "AQ.Ab8RN6JsqKWFNQOYBdJtcu69XZaGpchEQI7qBAJZkChPwxL7AA";
  const PRIMARY_MODEL = "gemini-3.7-flash";
  const FALLBACK_MODEL = "gemini-3.6-flash";

  function getApiEndpoint(model) {
    return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  }

  // In-memory conversation history
  let conversationHistory = [];

  // Helper to get active site language
  function getActiveLang() {
    const cookies = document.cookie || "";
    if (cookies.includes("googtrans=/en/ckb")) return "ckb";
    if (cookies.includes("googtrans=/en/ar")) return "ar";
    return "en";
  }

  // Search catalog for relevant titles based on user query (actors, directors, genres, keywords)
  function searchCatalogForQuery(queryText) {
    if (typeof MOVIES === "undefined" || !Array.isArray(MOVIES) || !queryText) return [];
    const q = queryText.toLowerCase().trim();
    const stopWords = new Set([
      "show", "all", "me", "movie", "movies", "series", "the", "in", "site", "film", "films",
      "with", "from", "recommend", "of", "a", "an", "for", "list", "give", "can", "you", "tell",
      "about", "please", "what", "are", "best", "top", "watch", "streaming", "catalog", "is",
      "were", "was", "any", "good", "new", "old", "some"
    ]);

    const tokens = q.split(/[^a-zA-Z0-9\u0600-\u06FF]+/).filter((t) => t.length > 1 && !stopWords.has(t));

    const matches = MOVIES.filter((m) => {
      const title = (m.title || "").toLowerCase();
      const cast = Array.isArray(m.cast) ? m.cast.join(" ").toLowerCase() : (m.cast || "").toLowerCase();
      const director = (m.director || "").toLowerCase();
      const genres = Array.isArray(m.genres) ? m.genres.join(" ").toLowerCase() : (m.genres || "").toLowerCase();
      const hay = `${title} ${cast} ${director} ${genres}`;

      // Full phrase match in title, cast, or director
      if (q.length > 2 && (title.includes(q) || cast.includes(q) || director.includes(q))) {
        return true;
      }
      // Multi-token match across all fields
      if (tokens.length > 0 && tokens.every((tok) => hay.includes(tok))) {
        return true;
      }
      return false;
    });

    return Array.from(new Set(matches)).slice(0, 50);
  }

  // Get concise catalog summary for Gemini system instruction
  function getCatalogContext(currentQuery = "") {
    if (typeof MOVIES === "undefined" || !Array.isArray(MOVIES)) return "";

    // 1. If there's an active query, get specific relevant matches first
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
        `\n\nCRITICAL INSTRUCTION FOR QUERY MATCHES: When the user asks to see or list movies/shows for this query (e.g., an actor like Tom Cruise, director, franchise, or genre), you MUST include and list ALL of these matched CineWatch titles in your response and append their exact [[MOVIE_CARD: <id>]] tags so the user sees cards for every single one of them. Do not omit any.`;
    }

    // 2. High-level general catalog snapshot
    const generalSnapshot = MOVIES.slice(0, 400).map((m) => {
      const castStr = Array.isArray(m.cast) ? m.cast.slice(0, 3).join(", ") : (m.cast || "");
      const dirStr = m.director ? ` | Dir: ${m.director}` : "";
      return `[ID: ${m.id}] ${m.title} (${m.year}) - ${m.type || (m.seasons ? "TV Show" : "Movie")} - ${m.rating}★ - Cast: ${castStr}${dirStr}`;
    }).join("\n");

    return `\nGeneral CineWatch Catalog Sample:\n${generalSnapshot}${matchSection}`;
  }

  function getUserAccountName() {
    let fullName = null;
    if (typeof state !== "undefined" && state?.user?.name) {
      fullName = state.user.name.trim();
    } else if (typeof state !== "undefined" && state?.user?.username) {
      fullName = state.user.username.trim();
    } else if (typeof state !== "undefined" && state?.user?.email) {
      fullName = state.user.email.split('@')[0];
    }
    if (fullName) {
      // Extract only the first name (e.g., "Rand" from "Rand Bahjat" or "Rand_Bahjat")
      const cleaned = fullName.replace(/[_\-.]+/g, ' ').trim();
      const firstName = cleaned.split(/\s+/)[0];
      return firstName.charAt(0).toUpperCase() + firstName.slice(1);
    }
    return null;
  }

  function getSystemInstruction(currentQuery = "") {
    const lang = getActiveLang();
    const catalogData = getCatalogContext(currentQuery);
    const userName = getUserAccountName();

    return `You are CineWatch AI, a friendly, ultra-knowledgeable, and modern movie, TV series, and anime assistant on the streaming and movie tracking site CineWatch.
${userName ? `The current logged-in user's first name is "${userName}". Address and greet them warmly by their first name (${userName}) when appropriate.` : ""}

Your capabilities:
1. Provide personalized movie, series, and anime recommendations based on user mood, plot tropes, genres, actors, directors, or similar titles.
2. If recommending or listing movies/series that exist in CineWatch's catalog, ALWAYS embed a special card tag on its own line for every title:
   [[MOVIE_CARD: <id>]]
   where <id> matches the exact CineWatch ID provided in the catalog context.
3. Accuracy: When the user asks to see all movies from a specific actor (e.g., Tom Cruise, Leonardo DiCaprio, Keanu Reeves), director (e.g., Christopher Nolan), or franchise, consult the MATCHING CINEWATCH CATALOG TITLES list and list ALL of them.
4. Keep responses concise, formatted with clean bullet points and bold titles. Avoid excessive or unnecessary emojis.
5. Language instruction:
   - If the user writes in Kurdish (سۆرانی) or current language is 'ckb', respond naturally in Kurdish Sorani.
   - If the user writes in Arabic or current language is 'ar', respond in fluent Arabic.
   - If the user writes in English, respond in friendly English.
   - Always match the user's conversational language.
6. Do NOT make up fake URLs. Only use the [[MOVIE_CARD: <id>]] format for site titles.

${catalogData}
`;
  }

  function openAiModal() {
    const modal = document.getElementById("aiModal");
    if (!modal) return;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    // Auto focus input
    setTimeout(() => {
      const input = document.getElementById("aiChatInput");
      if (input) input.focus();
    }, 150);

    // Localize UI labels if needed
    localizeAiUI();
  }

  function closeAiModal() {
    const modal = document.getElementById("aiModal");
    if (modal) {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  function clearAiHistory() {
    conversationHistory = [];
    const list = document.getElementById("aiMessagesList");
    if (list) list.innerHTML = "";
    const welcome = document.getElementById("aiWelcomeMsg");
    if (welcome) welcome.classList.remove("hidden");
    const chips = document.getElementById("aiQuickChips");
    if (chips) chips.classList.remove("hidden");
    localizeAiUI();
  }

  function localizeAiUI() {
    const lang = getActiveLang();
    const input = document.getElementById("aiChatInput");
    const welcomeTitle = document.getElementById("aiWelcomeTitle");
    const welcomeDesc = document.getElementById("aiWelcomeDesc");
    const onlineText = document.getElementById("aiOnlineText");
    const userName = getUserAccountName();

    if (lang === "ckb") {
      if (input) input.placeholder = "پرسیار بکە... بۆ نموونە فیلمێکی وروژێنەرم بۆ پێشنیار بکە";
      if (welcomeTitle) {
        welcomeTitle.textContent = userName
          ? `چۆن دەتوانین یارمەتیت بدەین، ${userName}؟`
          : "چۆن دەتوانین یارمەتیت بدەین لە سەیرکردنی فیلم و زنجیرەکان؟";
      }
      if (welcomeDesc)
        welcomeDesc.textContent =
          "داوای پێشنیار بکە بەپێی کەش، ئەکتەر، چیرۆک یان دۆزینەوەی فیلمە نایابەکان لە کەتەلۆگەکەمان.";
      if (onlineText) onlineText.textContent = "یاریدەدەری زیرەکی سینەما";
    } else if (lang === "ar") {
      if (input) input.placeholder = "اسأل أي شيء... مثلاً اقترح لي فيلم إثارة وتشويق";
      if (welcomeTitle) {
        welcomeTitle.textContent = userName
          ? `كيف يمكننا مساعدتك يا ${userName}؟`
          : "كيف يمكننا مساعدتك اليوم؟";
      }
      if (welcomeDesc)
        welcomeDesc.textContent =
          "اطلب ترشيحات حسب مزاجك، الممثلين المفضلين، أو استكشف أفضل الأفلام والمسلسلات في مكتبتنا.";
      if (onlineText) onlineText.textContent = "مساعد السينما الذكي";
    } else {
      if (input) input.placeholder = "Ask anything... e.g. Recommend a psychological thriller";
      if (welcomeTitle) {
        welcomeTitle.textContent = userName
          ? `How can we help you, ${userName}?`
          : "How can we help you today?";
      }
      if (welcomeDesc)
        welcomeDesc.textContent =
          "Ask for recommendations by mood, favorite actors, plot twists, or find hidden gems from our streaming catalog.";
      if (onlineText) onlineText.textContent = "Smart Movie Assistant";
    }
  }

  // Format AI text into safe HTML with markdown support and movie cards
  function formatAiResponse(rawText) {
    if (!rawText) return "";

    // Extract [[MOVIE_CARD: <id>]]
    const movieCardRegex = /\[\[MOVIE_CARD:\s*([a-zA-Z0-9_\-]+)\]\]/g;
    let text = rawText.replace(movieCardRegex, (match, movieId) => {
      const movie = typeof MOVIES !== "undefined" ? MOVIES.find((m) => m.id === movieId) : null;
      if (!movie) return "";
      const rating = movie.rating ? `★ ${movie.rating}` : "";
      const year = movie.year || "";
      const type = movie.type || (movie.seasons ? "TV Show" : "Movie");
      const poster = movie.poster || movie.backdrop || "";

      return `
        <div class="ai-movie-card" onclick="window.openDetailsFromAi('${movie.id}')">
          <img src="${poster}" alt="${movie.title}" class="ai-movie-poster" loading="lazy">
          <div class="ai-movie-info">
            <div class="ai-movie-title notranslate" translate="no">${movie.title}</div>
            <div class="ai-movie-meta notranslate" translate="no">
              <span>${year}</span>
              <span>${type}</span>
              <span>${rating}</span>
            </div>
            <button class="ai-movie-watch-btn"><ion-icon name="play-circle"></ion-icon> View & Watch</button>
          </div>
        </div>
      `;
    });

    // Basic markdown parsing
    text = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n/g, "<br>");

    return text;
  }

  function appendMessage(role, content) {
    const list = document.getElementById("aiMessagesList");
    const welcome = document.getElementById("aiWelcomeMsg");
    const chips = document.getElementById("aiQuickChips");
    if (welcome) welcome.classList.add("hidden");
    if (chips) chips.classList.add("hidden");

    const isUser = role === "user";
    const msgDiv = document.createElement("div");
    msgDiv.className = `ai-chat-bubble ${isUser ? "user-bubble" : "ai-bubble"}`;

    if (!isUser) {
      msgDiv.innerHTML = `
        <div class="ai-bubble-avatar"><ion-icon name="chatbubbles"></ion-icon></div>
        <div class="ai-bubble-content">${formatAiResponse(content)}</div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="user-bubble-content">${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
      `;
    }

    list.appendChild(msgDiv);
    const body = document.getElementById("aiChatBody");
    if (body) body.scrollTo({ top: body.scrollHeight, behavior: "smooth" });
  }

  function showTypingIndicator() {
    const list = document.getElementById("aiMessagesList");
    const indicator = document.createElement("div");
    indicator.id = "aiTypingIndicator";
    indicator.className = "ai-chat-bubble ai-bubble typing-bubble";
    indicator.innerHTML = `
      <div class="ai-bubble-avatar"><ion-icon name="chatbubbles"></ion-icon></div>
      <div class="ai-bubble-content typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    list.appendChild(indicator);
    const body = document.getElementById("aiChatBody");
    if (body) body.scrollTo({ top: body.scrollHeight, behavior: "smooth" });
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById("aiTypingIndicator");
    if (indicator) indicator.remove();
  }

  window.openDetailsFromAi = function (movieId) {
    closeAiModal();
    if (typeof openDetailsModal === "function") {
      openDetailsModal(movieId);
    }
  };

  window.sendAiChatMessage = async function (overrideText = null) {
    const input = document.getElementById("aiChatInput");
    const sendBtn = document.getElementById("aiSendBtn");
    const text = (overrideText || (input ? input.value : "")).trim();

    if (!text) return;

    if (input && !overrideText) input.value = "";
    if (sendBtn) sendBtn.disabled = true;

    // Render user message
    appendMessage("user", text);
    conversationHistory.push({ role: "user", parts: [{ text }] });

    // Show typing
    showTypingIndicator();

    const requestPayload = {
      system_instruction: {
        parts: [{ text: getSystemInstruction(text) }],
      },
      contents: conversationHistory,
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        maxOutputTokens: 1600,
      },
    };

    async function callGemini(model) {
      const response = await fetch(getApiEndpoint(model), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });
      if (!response.ok) {
        throw new Error(`API Error ${response.status} on model ${model}`);
      }
      return await response.json();
    }

    try {
      let data;
      try {
        data = await callGemini(PRIMARY_MODEL);
      } catch (primaryErr) {
        console.warn("Primary 3.7-flash failed or busy, trying 3.6-flash fallback...", primaryErr);
        data = await callGemini(FALLBACK_MODEL);
      }

      removeTypingIndicator();

      const aiReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I couldn't generate a response at this moment. Please try again.";

      // Append reply to UI & history
      appendMessage("model", aiReply);
      conversationHistory.push({ role: "model", parts: [{ text: aiReply }] });
    } catch (err) {
      removeTypingIndicator();
      appendMessage(
        "model",
        "Sorry, I encountered an issue connecting to the AI service. Please try asking again in a moment.",
      );
      console.error("Gemini API Error:", err);
    } finally {
      if (sendBtn) sendBtn.disabled = false;
      if (input) input.focus();
    }
  };

  // Setup Event Listeners on DOM Ready
  function initAiAssistant() {
    const navAiBtn = document.getElementById("navAiBtn");
    const mobileAiBtn = document.getElementById("mobileAiBtn");
    const floatingAiBtn = document.getElementById("floatingAiBtn");
    const closeBtn = document.getElementById("closeAiModalBtn");
    const clearBtn = document.getElementById("aiClearHistoryBtn");
    const promptCards = document.querySelectorAll(".ai-prompt-card, .ai-chip");

    if (navAiBtn) navAiBtn.onclick = openAiModal;
    if (mobileAiBtn) {
      mobileAiBtn.onclick = (e) => {
        e.preventDefault();
        const mobileMenu = document.getElementById("mobileMenuOverlay");
        if (mobileMenu) mobileMenu.classList.remove("active");
        openAiModal();
      };
    }
    if (floatingAiBtn) floatingAiBtn.onclick = openAiModal;
    if (closeBtn) closeBtn.onclick = closeAiModal;
    if (clearBtn) clearBtn.onclick = clearAiHistory;

    promptCards.forEach((card) => {
      card.onclick = () => {
        const prompt = card.dataset.prompt;
        if (prompt) window.sendAiChatMessage(prompt);
      };
    });

    // Close on escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const modal = document.getElementById("aiModal");
        if (modal && !modal.classList.contains("hidden")) {
          closeAiModal();
        }
      }
    });

    // Close on backdrop click
    const modal = document.getElementById("aiModal");
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) closeAiModal();
      };
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAiAssistant);
  } else {
    initAiAssistant();
  }
})();

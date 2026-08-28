/**
 * CineWatch AI Movie Assistant
 * Powered by Google Gemini 3.6 Flash
 */

(function () {
  const GEMINI_API_KEY = "AQ.Ab8RN6JsqKWFNQOYBdJtcu69XZaGpchEQI7qBAJZkChPwxL7AA";
  const GEMINI_MODEL = "gemini-3.6-flash";
  const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  // In-memory conversation history
  let conversationHistory = [];

  // Helper to get active site language
  function getActiveLang() {
    const cookies = document.cookie || "";
    if (cookies.includes("googtrans=/en/ckb")) return "ckb";
    if (cookies.includes("googtrans=/en/ar")) return "ar";
    return "en";
  }

  // Get concise catalog summary for Gemini system instruction
  function getCatalogContext() {
    if (typeof MOVIES === "undefined" || !Array.isArray(MOVIES)) return [];
    // Return titles with IDs, rating, genres, type for accurate matching
    return MOVIES.slice(0, 1500).map((m) => ({
      id: m.id,
      title: m.title,
      type: m.type || (m.seasons ? "TV Show" : "Movie"),
      year: m.year,
      rating: m.rating,
      genres: m.genres,
    }));
  }

  function getSystemInstruction() {
    const lang = getActiveLang();
    const catalog = getCatalogContext();

    return `You are CineWatch AI, a friendly, ultra-knowledgeable, and modern movie, TV series, and anime assistant on the streaming and movie tracking site CineWatch.

Your capabilities:
1. Provide personalized movie, series, and anime recommendations based on user mood, plot tropes, genres, actors, directors, or similar titles.
2. If recommending movies or series that exist in CineWatch's catalog, embed a special card tag on its own line:
   [[MOVIE_CARD: <id>]]
   where <id> matches the exact CineWatch ID.
3. Keep responses concise, formatted with clean bullet points and bold titles.
4. Language instruction:
   - If the user writes in Kurdish (سۆرانی) or current language is 'ckb', respond naturally in Kurdish Sorani.
   - If the user writes in Arabic or current language is 'ar', respond in fluent Arabic.
   - If the user writes in English, respond in friendly English.
   - Always match the user's conversational language.
5. Do NOT make up fake URLs. Only use the [[MOVIE_CARD: <id>]] format for site titles.

CineWatch Top Catalog Reference (ID | Title | Type | Year | Rating | Genres):
${JSON.stringify(catalog.slice(0, 400))}
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
  }

  function localizeAiUI() {
    const lang = getActiveLang();
    const input = document.getElementById("aiChatInput");
    const welcomeTitle = document.getElementById("aiWelcomeTitle");
    const welcomeDesc = document.getElementById("aiWelcomeDesc");
    const onlineText = document.getElementById("aiOnlineText");

    if (lang === "ckb") {
      if (input) input.placeholder = "پرسیار بکە... بۆ نموونە فیلمێکی وروژێنەرم بۆ پێشنیار بکە";
      if (welcomeTitle) welcomeTitle.textContent = "پرسیار لە زیرەکی دەستکردی CineWatch بکە";
      if (welcomeDesc)
        welcomeDesc.textContent =
          "دەتوانم فیلم و زنجیرەکان بەپێی کەشوهەوا، جۆر، یان ئەکتەر لە کەتەلۆگی CineWatch پێشنیار بکەم!";
      if (onlineText) onlineText.textContent = "یاریدەدەری زیرەکی سینەما";
    } else if (lang === "ar") {
      if (input) input.placeholder = "اسأل أي شيء... مثلاً اقترح لي فيلم إثارة وتشويق";
      if (welcomeTitle) welcomeTitle.textContent = "اسأل مساعد CineWatch الذكي";
      if (welcomeDesc)
        welcomeDesc.textContent =
          "يمكنني اقتراح أفضل الأفلام والمسلسلات والأنمي من مكتبة CineWatch حسب مزاجك وتفضيلاتك!";
      if (onlineText) onlineText.textContent = "مساعد السينما الذكي";
    } else {
      if (input) input.placeholder = "Ask anything... e.g. Recommend a psychological thriller";
      if (welcomeTitle) welcomeTitle.textContent = "Ask CineWatch AI";
      if (welcomeDesc)
        welcomeDesc.textContent =
          "I can find movies & series by mood, genre, actor, or plot from our catalog. Tell me what you'd like to watch!";
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
      const rating = movie.rating ? `⭐ ${movie.rating}` : "";
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
        <div class="ai-bubble-avatar">✨</div>
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
      <div class="ai-bubble-avatar">✨</div>
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

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: getSystemInstruction() }],
          },
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
        }),
      });

      removeTypingIndicator();

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
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

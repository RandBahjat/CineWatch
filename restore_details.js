const fs = require('fs');
let code = fs.readFileSync('movie.js', 'utf8');

const targetRegex = /window\.submitComment = async function \(movieId\) \{[\s\S]*?setOverviewElement\(document\.getElementById\("detailsOverview"\), getLocalizedOverview\(movie\)\);/;

const replacement = `window.submitComment = async function (movieId) {
  const textInput = document.getElementById('newCommentText');
  const postBtn = document.getElementById('postCommentBtn');
  const content = textInput ? textInput.value.trim() : '';

  if (!content) return;

  const cookies = document.cookie || '';
  const isCkb = cookies.includes('googtrans=/en/ckb');
  const isAr = cookies.includes('googtrans=/en/ar');
  const postingText = isCkb ? '...ناردن' : (isAr ? '...جارٍ الإرسال' : 'Posting...');
  const postBtnText = isCkb ? 'ناردنی بۆچوون' : (isAr ? 'إرسال التعليق' : 'Post Comment');

  if (postBtn) {
    postBtn.disabled = true;
    postBtn.innerHTML = postingText;
  }

  const { success, error } = await window.CW_API.postComment(movieId, content);

  if (success) {
    if (textInput) textInput.value = '';
    await renderCommentsSection(movieId);
  } else {
    alert((isCkb ? 'ناردن سەرکەوتوو نەبوو: ' : (isAr ? 'فشل النشر: ' : 'Failed to post comment: ')) + (error || 'Unknown error'));
  }

  if (postBtn) {
    postBtn.disabled = false;
    postBtn.innerHTML = postBtnText;
  }
};

function openDetailsModal(movieId) {
  const movie = MOVIES.find((m) => m.id === movieId);
  if (!movie) return;

  if (state.activeView !== "details") {
    state.previousView = state.activeView;
  }

  window.history.replaceState(null, '', '?v=' + movieId);

  const mainContent = document.getElementById("mainContent");
  const heroBanner = document.getElementById("heroBanner");
  const detailsSection = document.getElementById("detailsSection");

  const toFadeOut = [];
  if (state.activeView === "details") {
    toFadeOut.push(detailsSection);
  } else {
    if (mainContent) toFadeOut.push(mainContent);
    if (heroBanner && !heroBanner.classList.contains("hidden")) toFadeOut.push(heroBanner);
  }

  toFadeOut.forEach(el => {
    el.style.transition = "opacity 0.3s ease-in-out";
    el.style.opacity = "0";
  });

  setTimeout(() => {
    window.scrollTo(0, 0);
    if (detailsSection) detailsSection.scrollTo(0, 0);
    document.getElementById("detailsBg").style.backgroundImage = \`url('\${movie.backdrop || movie.poster}')\`;
    const titleEl = document.getElementById("detailsTitle");
    const ratingEl = document.getElementById("detailsRating");
    if (ratingEl) {
      ratingEl.textContent = formatRating(movie.rating);
      ratingEl.classList.add("notranslate");
      ratingEl.setAttribute("translate", "no");
    }
    const yearEl = document.getElementById("detailsYear");
    if (yearEl) {
      yearEl.textContent = formatNumber(movie.year);
      yearEl.classList.add("notranslate");
      yearEl.setAttribute("translate", "no");
    }
    const isCkb = (document.cookie || '').includes('googtrans=/en/ckb');
    const isAr = (document.cookie || '').includes('googtrans=/en/ar');
    if (movie.type === "TV Show" && movie.seasons && movie.seasons.length > 0) {
      const sCount = formatNumber(movie.seasons.length);
      document.getElementById("detailsDuration").textContent = isCkb ? \`\${sCount} وەرز\` : (isAr ? \`\${movie.seasons.length} مواسم\` : \`\${movie.seasons.length} Season\${movie.seasons.length > 1 ? 's' : ''}\`);
    } else {
      document.getElementById("detailsDuration").textContent = movie.duration;
    }
    if (titleEl) {
      titleEl.textContent = movie.title;
      titleEl.classList.add("notranslate");
      titleEl.setAttribute("translate", "no");
    }

    if (document.getElementById("detailsGenres")) {
      document.getElementById("detailsGenres").innerHTML = movie.genres.map(translateGenre).join(" &middot; ");
    }

    setOverviewElement(document.getElementById("detailsOverview"), getLocalizedOverview(movie));`;

code = code.replace(targetRegex, replacement);
fs.writeFileSync('movie.js', code, 'utf8');
console.log('Regex replace success');

const fs = require('fs');
let code = fs.readFileSync('movie.js', 'utf8');

const target = `  if (items.length === 0) {
        ? \`<span>In Progress</span>\`
        : \`<span>\${Math.max(1, Math.round((item.duration - item.currentTime) / 60))}m left</span><span>\${percent}%</span>\`;`;

const replacement = `  if (items.length === 0) {
    grid.innerHTML = "";
    if (emptyTitle) emptyTitle.textContent = "No titles in Continue Watching";
    if (emptyText) emptyText.textContent = "Movies and series you start watching will appear here so you can easily pick up where you left off.";
    if (exploreBtn) {
      exploreBtn.textContent = "Explore Movies";
      exploreBtn.onclick = () => switchView("movies");
    }
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  // Update Action Bar UI
  const selectBtn = document.getElementById("cwSelectBtn");
  const removeBtn = document.getElementById("cwRemoveSelectedBtn");
  const cancelBtn = document.getElementById("cwCancelSelectBtn");

  if (selectBtn && removeBtn && cancelBtn) {
    if (state.isCwSelectionMode) {
      selectBtn.classList.add("hidden");
      removeBtn.classList.remove("hidden");
      cancelBtn.classList.remove("hidden");
      removeBtn.textContent = \`Remove Selected (\${state.cwSelectedItems.size})\`;
    } else {
      selectBtn.classList.remove("hidden");
      removeBtn.classList.add("hidden");
      cancelBtn.classList.add("hidden");
    }
  }

  grid.innerHTML = items
    .map((item) => {
      const movie = MOVIES.find((m) => m.id === item.movieId);
      if (!movie) return "";

      const isIframe = item.isIframe;
      const percent = isIframe ? 50 : Math.min(100, Math.round((item.currentTime / item.duration) * 100));
      const cookies = document.cookie || '';
      const isCkb = cookies.includes('googtrans=/en/ckb');
      const isAr = cookies.includes('googtrans=/en/ar');
      const inProgressText = isCkb ? 'بەردەوام بە' : (isAr ? 'قيد المشاهدة' : 'In Progress');
      const leftText = isCkb ? 'خولەک ماوە' : (isAr ? 'دقيقة متبقية' : 'm left');
      const metaLabel = isIframe
        ? \`<span class="notranslate" translate="no">\${inProgressText}</span>\`
        : \`<span class="notranslate" translate="no">\${formatNumber(Math.max(1, Math.round((item.duration - item.currentTime) / 60)))} \${leftText}</span><span class="notranslate" translate="no">\${formatNumber(percent)}%</span>\`;`;

code = code.replace(target, replacement);
fs.writeFileSync('movie.js', code, 'utf8');
console.log('Fixed renderContinueWatchingGrid');

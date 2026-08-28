const fs = require('fs');
const vm = require('vm');

let js = fs.readFileSync('movie.js', 'utf8');

const targetBrokenBlock = `    const reportBtn = document.getElementById("detailsReportBtn");
    if (reportBtn) {
      reportBtn.onclick = () => {
    if (similarsGrid && similarsSection) {`;

const fixedBlock = `    const reportBtn = document.getElementById("detailsReportBtn");
    if (reportBtn) {
      reportBtn.onclick = () => {
        const reportModal = document.getElementById("reportModal");
        if (reportModal) {
          reportModal.classList.remove("hidden");
          const subjectInput = document.getElementById("reportSubject");
          if (subjectInput) {
            subjectInput.value = \`Issue with: \${movie.title}\`;
          }
        }
      };
    }

    if (typeof initializeRatingSystem === 'function') {
      initializeRatingSystem(movie.id);
    }

    renderCommentsSection(movie.id);

    const similarsGrid = document.getElementById("detailsSimilarsGrid");
    const similarsSection = document.getElementById("detailsSimilarsSection");
    if (similarsGrid && similarsSection) {
      let similarMovies = MOVIES.filter(m => m.id !== movie.id)
        .map(m => {
          const matchScore = m.genres.filter(g => movie.genres.includes(g)).length;
          return { movie: m, matchScore };
        })
        .filter(m => m.matchScore > 0)
        .sort((a, b) => b.matchScore !== a.matchScore ? b.matchScore - a.matchScore : 0.5 - Math.random())
        .map(m => m.movie);

      const limited = similarMovies.slice(0, 12);
      if (limited.length > 0) {
        similarsSection.classList.remove("hidden");
        similarsGrid.innerHTML = limited.map((m) => createMovieCardHTML(m)).join("");
        similarsGrid.querySelectorAll(".movie-card").forEach((card) => {
          card.onclick = () => openDetailsModal(card.dataset.id);
        });
      } else {
        similarsSection.classList.add("hidden");
      }
    }`;

if (js.includes(targetBrokenBlock)) {
  const startIdx = js.indexOf(targetBrokenBlock);
  const endIdx = js.indexOf('// ── TV Show: show season/episode picker', startIdx);
  if (startIdx !== -1 && endIdx !== -1) {
    js = js.slice(0, startIdx) + fixedBlock + '\n\n    ' + js.slice(endIdx);
    fs.writeFileSync('movie.js', js, 'utf8');
    console.log('movie.js details section fixed successfully');
  }
}

function checkFile(filename) {
    try {
        const content = fs.readFileSync(filename, 'utf8');
        new vm.Script(content, { filename });
        console.log(filename + " is OK");
    } catch (e) {
        console.error("Syntax error in " + filename + ":");
        console.error(e.message);
    }
}

checkFile('movies-data.js');
checkFile('movie.js');
checkFile('series-data.js');
checkFile('anime-data.js');

const fs = require('fs');
const vm = require('vm');

let js = fs.readFileSync('movie.js', 'utf8');

const targetBefore = `    if (document.getElementById("detailsGenres")) {
      document.getElementById("detailsGenres").innerHTML = movie.genres.map(translateGenre).join(" &middot; ");
    }`;

const fixedCompleteBlock = `    if (document.getElementById("detailsGenres")) {
      document.getElementById("detailsGenres").innerHTML = movie.genres.map(translateGenre).join(" &middot; ");
    }

    setOverviewElement(document.getElementById("detailsOverview"), getLocalizedOverview(movie));

    const castContainer = document.getElementById("detailsCastContainer");
    const castText = document.getElementById("detailsCastText");
    const dirContainer = document.getElementById("detailsDirectorContainer");
    const dirText = document.getElementById("detailsDirectorText");

    if (dirContainer && dirText) {
      if (movie.director) {
        dirText.textContent = movie.director;
        dirContainer.classList.remove("hidden");
      } else {
        dirContainer.classList.add("hidden");
      }
    }

    if (castContainer && castText) {
      if (movie.cast && movie.cast.length > 0) {
        castText.textContent = movie.cast.join(", ");
        castContainer.classList.remove("hidden");
      } else {
        castContainer.classList.add("hidden");
      }
    }

    const favCheckbox = document.getElementById("detailsFavCheckbox");
    const favBtn = document.getElementById("detailsFavBtn");
    const fav = isFavorite(movie.id);

    // Sync checkbox state with actual favorites state
    favCheckbox.checked = fav;

    favBtn.onclick = (e) => {
      e.preventDefault(); // Prevent default label click behavior
      const isNowFav = toggleFavorite(movie.id);
      favCheckbox.checked = isNowFav;
    };

    const reportBtn = document.getElementById("detailsReportBtn");
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

const startIdx = js.indexOf(targetBefore);
const endIdx = js.indexOf('const tvSection = document.getElementById("tvShowSection");');

if (startIdx !== -1 && endIdx !== -1) {
  js = js.slice(0, startIdx) + fixedCompleteBlock + '\n\n    // ── TV Show: show season/episode picker ──\n    ' + js.slice(endIdx);
  fs.writeFileSync('movie.js', js, 'utf8');
  console.log('movie.js details section replaced successfully');
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

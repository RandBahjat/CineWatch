const fs = require('fs');
const vm = require('vm');

let js = fs.readFileSync('movie.js', 'utf8');
const startIdx = js.indexOf('// Search Type Switcher (Segmented Control)');
const endIdx = js.indexOf('// Clear Recents');
if (startIdx !== -1 && endIdx !== -1) {
    const cleanSegment = `// Search Type Switcher (Segmented Control)
  const searchTypeSwitcher = document.getElementById("searchTypeSwitcher");
  if (searchTypeSwitcher) {
    searchTypeSwitcher.querySelectorAll(".type-switch-btn").forEach(btn => {
      btn.onclick = () => {
        searchTypeSwitcher.querySelectorAll(".type-switch-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.searchFilter = btn.dataset.filter || "all";

        if (searchInput && searchInput.value.trim().length > 0) {
          searchInput.dispatchEvent(new Event('input'));
        }
      };
    });
  }

  if (searchModalBackdrop) searchModalBackdrop.onclick = closeSearchModal;

  `;
    js = js.slice(0, startIdx) + cleanSegment + js.slice(endIdx);
    fs.writeFileSync('movie.js', js, 'utf8');
    console.log('movie.js cleaned successfully');
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

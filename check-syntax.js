const fs = require('fs');
const vm = require('vm');

let css = fs.readFileSync('movie.css', 'utf8');
const searchClearTarget = `.modal-search-clear:hover {
  background: rgba(229, 9, 20, 0.3);`;

const cleanHeaderCss = `.modal-search-clear:hover {
  background: rgba(229, 9, 20, 0.3);
  color: #fff;
}

.search-header-right {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

/* Segmented Type Switcher */
.search-type-switcher {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3px;
  border-radius: 10px;
  gap: 2px;
}

.type-switch-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.65);
  padding: 0.35rem 0.75rem;
  border-radius: 7px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.type-switch-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.type-switch-btn.active {
  background: var(--primary);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 2px 10px rgba(229, 9, 20, 0.4);
}`;

css = css.replace(/\.modal-search-clear:hover\s*\{\s*background:\s*rgba\(229,\s*9,\s*20,\s*0\.3\);/g, cleanHeaderCss);
fs.writeFileSync('movie.css', css, 'utf8');
console.log('movie.css header styles updated successfully');

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

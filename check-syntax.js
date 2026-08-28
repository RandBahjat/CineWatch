const fs = require('fs');
const vm = require('vm');

let css = fs.readFileSync('movie.css', 'utf8');
const searchChipHoverTarget = `.search-tag-chip:hover {
  background: rgba(229, 9, 20, 0.15);
  border-color: rgba(229, 9, 20, 0.4);
  color: #fff;
  transform: translateY(-1px);
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.82rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
}`;

const cleanSearchChipBlock = `.search-tag-chip:hover {
  background: rgba(229, 9, 20, 0.15);
  border-color: rgba(229, 9, 20, 0.4);
  color: #fff;
  transform: translateY(-1px);
}

/* Recent Searches List */
.search-recent-section.hidden {
  display: none;
}

.search-recent-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.search-recent-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.82rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
}`;

if (css.includes(searchChipHoverTarget)) {
    css = css.replace(searchChipHoverTarget, cleanSearchChipBlock);
    fs.writeFileSync('movie.css', css, 'utf8');
    console.log('movie.css search recent section fixed successfully');
} else {
    // regex fallback
    css = css.replace(/\.search-tag-chip:hover\s*\{[\s\S]*?transition:\s*all\s*0\.2s\s*ease;\s*\}/, cleanSearchChipBlock);
    fs.writeFileSync('movie.css', css, 'utf8');
    console.log('movie.css regex fallback executed');
}

// Check CSS brace depth
let depth = 0;
for (let c of css) {
    if (c === '{') depth++;
    if (c === '}') depth--;
}
console.log('CSS brace depth:', depth);

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

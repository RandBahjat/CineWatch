const fs = require('fs');
const vm = require('vm');

let css = fs.readFileSync('movie.css', 'utf8');
const lines = css.split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('.search-tag-chip {')) {
        let j = i;
        while (j < lines.length && !lines[j].includes('transform: translateY(-1px);')) {
            j++;
        }
        if (j < lines.length && lines[j+1] && lines[j+1].trim() === '}') {
            j++;
        }
        lines.splice(i, j - i + 1, 
`.search-tag-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
  padding: 0.65rem 0.9rem;
  border-radius: 12px;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.search-tag-chip:hover {
  background: rgba(229, 9, 20, 0.15);
  border-color: rgba(229, 9, 20, 0.4);
  color: #fff;
  transform: translateY(-1px);
}`);
        break;
    }
}
fs.writeFileSync('movie.css', lines.join('\r\n'), 'utf8');
console.log('movie.css updated successfully');

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

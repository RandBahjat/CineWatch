const fs = require('fs');
const vm = require('vm');

let css = fs.readFileSync('movie.css', 'utf8');
if (!css.includes('.search-modal-close {')) {
    const closeBtnCss = `
.search-modal-close {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.75);
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
}

.search-modal-close:hover {
  background: rgba(229, 9, 20, 0.25);
  color: #ff334b;
  border-color: rgba(229, 9, 20, 0.4);
}
`;
    css = css.replace('.type-switch-btn.active {\r\n  background: var(--primary);\r\n  color: #fff;\r\n  font-weight: 700;\r\n  box-shadow: 0 2px 10px rgba(229, 9, 20, 0.4);\r\n', '.type-switch-btn.active {\r\n  background: var(--primary);\r\n  color: #fff;\r\n  font-weight: 700;\r\n  box-shadow: 0 2px 10px rgba(229, 9, 20, 0.4);\r\n}\r\n' + closeBtnCss);
    if (!css.includes('.search-modal-close {')) {
        css = css.replace('.type-switch-btn.active {\n  background: var(--primary);\n  color: #fff;\n  font-weight: 700;\n  box-shadow: 0 2px 10px rgba(229, 9, 20, 0.4);\n', '.type-switch-btn.active {\n  background: var(--primary);\n  color: #fff;\n  font-weight: 700;\n  box-shadow: 0 2px 10px rgba(229, 9, 20, 0.4);\n}\n' + closeBtnCss);
    }
    fs.writeFileSync('movie.css', css, 'utf8');
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

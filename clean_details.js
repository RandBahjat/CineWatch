const fs = require('fs');
let code = fs.readFileSync('movie.js', 'utf8');

const startMarker = '    if (titleEl) {\n      titleEl.textContent = titleInfo.text;\n      if (titleInfo.isKurdish) {\n        titleEl.classList.add("notranslate");\n        titleEl.setAttribute("translate", "no");\n      } else {\n        titleEl.classList.remove("notranslate");\n        titleEl.removeAttribute("translate");\n      }\n    }';

const targetBlock = `    if (titleEl) {
      titleEl.textContent = titleInfo.text;
      if (titleInfo.isKurdish) {
        titleEl.classList.add("notranslate");
        titleEl.setAttribute("translate", "no");
      } else {
        titleEl.classList.remove("notranslate");
        titleEl.removeAttribute("translate");
      }
    }
      document.getElementById("detailsDuration").textContent = \`\${movie.seasons.length} Season\${movie.seasons.length > 1 ? 's' : ''}\`;
    } else {
      document.getElementById("detailsDuration").textContent = movie.duration;
    }`;

const cleanBlock = `    if (titleEl) {
      titleEl.textContent = titleInfo.text;
      if (titleInfo.isKurdish) {
        titleEl.classList.add("notranslate");
        titleEl.setAttribute("translate", "no");
      } else {
        titleEl.classList.remove("notranslate");
        titleEl.removeAttribute("translate");
      }
    }`;

if (code.includes(targetBlock)) {
  code = code.replace(targetBlock, cleanBlock);
  fs.writeFileSync('movie.js', code, 'utf8');
  console.log('Successfully cleaned movie.js');
} else {
  console.log('targetBlock not found, trying regex');
  code = code.replace(/    if \(titleEl\) \{[\s\S]*?document\.getElementById\("detailsDuration"\)\.textContent = movie\.duration;\s*\}/, cleanBlock);
  fs.writeFileSync('movie.js', code, 'utf8');
  console.log('Regex applied');
}

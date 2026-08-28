const fs = require('fs');
const vm = require('vm');

// Fix movie.css
let css = fs.readFileSync('movie.css', 'utf8');
const badCssRules = `.floating-ai-btn.hidden,
body:not(.view-home) .floating-ai-btn,
body:has(#detailsSection:not(.hidden)) .floating-ai-btn,
body:has(#videoModal:not(.hidden)) .floating-ai-btn {
  display: none !important;
}`;

const cleanCssRules = `.floating-ai-btn.hidden {
  display: none !important;
}`;

if (css.includes(badCssRules)) {
  css = css.replace(badCssRules, cleanCssRules);
  fs.writeFileSync('movie.css', css, 'utf8');
  console.log('movie.css cleaned up');
}

// In movie.js, ensure initApp also properly sets the floating button visibility on load
let js = fs.readFileSync('movie.js', 'utf8');
if (!js.includes('// Initial AI button state\n    const initAiBtn = document.getElementById("floatingAiBtn");')) {
  js = js.replace('dismissLoader();', `dismissLoader();

    // Initial AI button state (show on home, hide if deep linking to details)
    const initAiBtn = document.getElementById("floatingAiBtn");
    if (initAiBtn) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('v')) {
        initAiBtn.classList.add("hidden");
      } else {
        initAiBtn.classList.remove("hidden");
      }
    }`);
  fs.writeFileSync('movie.js', js, 'utf8');
  console.log('movie.js initApp updated');
}

// Check CSS brace depth
let depth = 0;
for (let c of css) {
    if (c === '{') depth++;
    if (c === '}') depth--;
}
if (depth === 0) {
    console.log('movie.css is OK (balanced braces)');
} else {
    console.error('movie.css has unclosed braces! Depth:', depth);
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

const fs = require('fs');
const vm = require('vm');

// 1. index.html body class
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('<body class="view-home">')) {
  html = html.replace('<body>', '<body class="view-home">');
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('index.html updated with view-home body class');
}

// 2. movie.css strict hiding rules
let css = fs.readFileSync('movie.css', 'utf8');
const oldCssRules = `.floating-ai-btn.hidden {
  display: none !important;
}`;

const newCssRules = `.floating-ai-btn.hidden,
body:not(.view-home) .floating-ai-btn,
body:has(#detailsSection:not(.hidden)) .floating-ai-btn,
body:has(#videoModal:not(.hidden)) .floating-ai-btn {
  display: none !important;
}`;

if (css.includes(oldCssRules)) {
  css = css.replace(oldCssRules, newCssRules);
  fs.writeFileSync('movie.css', css, 'utf8');
  console.log('movie.css updated with strict CSS hide rules');
}

// 3. movie.js body class and visibility sync
let js = fs.readFileSync('movie.js', 'utf8');

// In switchView
const oldSwitchViewBody = `  state.activeView = viewName;
  const navLinks = document.querySelectorAll(".nav-link");`;

const newSwitchViewBody = `  state.activeView = viewName;
  document.body.className = document.body.className.replace(/\\bview-\\w+\\b/g, "").trim() + " view-" + viewName;
  const floatingAiBtnEl = document.getElementById("floatingAiBtn");
  if (floatingAiBtnEl) {
    if (viewName === "home") {
      floatingAiBtnEl.classList.remove("hidden");
      floatingAiBtnEl.style.display = "";
    } else {
      floatingAiBtnEl.classList.add("hidden");
      floatingAiBtnEl.style.display = "none";
    }
  }
  const navLinks = document.querySelectorAll(".nav-link");`;

if (js.includes(oldSwitchViewBody)) {
  js = js.replace(oldSwitchViewBody, newSwitchViewBody);
}

// In openDetailsModal
const oldOpenDetails = `  if (state.activeView !== "details") {
    state.previousView = state.activeView;
  }`;

const newOpenDetails = `  if (state.activeView !== "details") {
    state.previousView = state.activeView;
  }
  document.body.classList.remove("view-home");
  document.body.classList.add("view-details");
  const detailsAiBtn = document.getElementById("floatingAiBtn");
  if (detailsAiBtn) {
    detailsAiBtn.classList.add("hidden");
    detailsAiBtn.style.display = "none";
  }`;

if (js.includes(oldOpenDetails)) {
  js = js.replace(oldOpenDetails, newOpenDetails);
}

fs.writeFileSync('movie.js', js, 'utf8');
console.log('movie.js updated successfully');

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

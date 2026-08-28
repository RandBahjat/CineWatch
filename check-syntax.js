const fs = require('fs');
const vm = require('vm');

let js = fs.readFileSync('movie.js', 'utf8');

// 1. In switchView, ensure floatingAiBtn is only visible on 'home'
const oldSwitchNavbar = `  const navbar = document.getElementById("navbar");
  if (navbar) {
    if (viewName === "details") {
      navbar.classList.add("hidden");
    } else {
      navbar.classList.remove("hidden");
    }
  }`;

const newSwitchNavbar = `  const navbar = document.getElementById("navbar");
  if (navbar) {
    if (viewName === "details") {
      navbar.classList.add("hidden");
    } else {
      navbar.classList.remove("hidden");
    }
  }

  const floatingAiBtn = document.getElementById("floatingAiBtn");
  if (floatingAiBtn) {
    if (viewName === "home") {
      floatingAiBtn.classList.remove("hidden");
    } else {
      floatingAiBtn.classList.add("hidden");
    }
  }`;

if (js.includes(oldSwitchNavbar) && !js.includes('const floatingAiBtn = document.getElementById("floatingAiBtn");\n  if (floatingAiBtn) {\n    if (viewName === "home")')) {
  js = js.replace(oldSwitchNavbar, newSwitchNavbar);
}

// 2. Hide floatingAiBtn during video playback
if (!js.includes('const floatingAiBtn = document.getElementById("floatingAiBtn");\n  if (floatingAiBtn) floatingAiBtn.classList.add("hidden");\n  const bttBtn = document.getElementById("backToTopBtn");')) {
  js = js.replace('const bttBtn = document.getElementById("backToTopBtn");\n  if (bttBtn) bttBtn.style.display = "none";', 'const floatingAiBtn = document.getElementById("floatingAiBtn");\n  if (floatingAiBtn) floatingAiBtn.classList.add("hidden");\n  const bttBtn = document.getElementById("backToTopBtn");\n  if (bttBtn) bttBtn.style.display = "none";');
}

fs.writeFileSync('movie.js', js, 'utf8');

// 3. Update movie.css to ensure .floating-ai-btn.hidden is display: none !important
let css = fs.readFileSync('movie.css', 'utf8');
if (!css.includes('.floating-ai-btn.hidden')) {
  css = css.replace('.floating-ai-btn {', '.floating-ai-btn.hidden {\n  display: none !important;\n}\n\n.floating-ai-btn {');
  fs.writeFileSync('movie.css', css, 'utf8');
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

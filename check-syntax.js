const fs = require('fs');
const vm = require('vm');

let css = fs.readFileSync('movie.css', 'utf8');

const targetBefore = `.ai-btn-text {
  background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.85) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  letter-spacing: 0.3px;
}`;

const targetAfter = `@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}`;

const cleanReplacement = `.ai-btn-text {
  background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.85) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  letter-spacing: 0.3px;
}

/* Floating AI Button */
.floating-ai-btn.hidden {
  display: none !important;
}

.floating-ai-btn {
  position: fixed;
  bottom: 24px;
  left: 24px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), #00bcd4);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1500;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 188, 212, 0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.floating-ai-btn:hover {
  transform: scale(1.12) translateY(-3px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 229, 255, 0.7);
}

body.rtl-layout .floating-ai-btn {
  left: auto;
  right: 24px;
}

/* AI Modal Overlay & Card */
.ai-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 7, 12, 0.78);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.2rem;
  animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}`;

const startIdx = css.indexOf(targetBefore);
const endIdx = css.indexOf(targetAfter, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  css = css.slice(0, startIdx) + cleanReplacement + css.slice(endIdx + targetAfter.length);
  fs.writeFileSync('movie.css', css, 'utf8');
  console.log('movie.css clean replacement applied successfully');
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

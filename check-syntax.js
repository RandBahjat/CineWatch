const fs = require('fs');
const vm = require('vm');

let css = fs.readFileSync('movie.css', 'utf8');

// 1. Update back-to-top
const oldBtt = `.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1500;

  width: 52px;
  height: 52px;`;

const newBtt = `.back-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1490;

  width: 48px;
  height: 48px;`;

if (css.includes(oldBtt)) {
  css = css.replace(oldBtt, newBtt);
}

// 2. Update floating-ai-btn
const oldAiBtn = `.floating-ai-btn {
  position: fixed;
  bottom: 85px;
  right: 28px;
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
  z-index: 998;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 188, 212, 0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.floating-ai-btn:hover {
  transform: scale(1.12) translateY(-3px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 229, 255, 0.7);
}

body.rtl-layout .floating-ai-btn {
  right: auto;
  left: 28px;
}`;

const newAiBtn = `.floating-ai-btn {
  position: fixed;
  bottom: 86px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), #00bcd4);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1500;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 188, 212, 0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.floating-ai-btn:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 229, 255, 0.7);
}

body.rtl-layout .floating-ai-btn {
  right: auto;
  left: 24px;
}`;

if (css.includes(oldAiBtn)) {
  css = css.replace(oldAiBtn, newAiBtn);
}

// 3. Mobile media query for floating-ai-btn
const oldMobileAi = `  .floating-ai-btn {
    bottom: 75px;
    right: 18px;
    width: 44px;
    height: 44px;
    font-size: 1.2rem;
  }
  body.rtl-layout .floating-ai-btn {
    left: 18px;
    right: auto;
  }`;

const newMobileAi = `  .floating-ai-btn {
    bottom: 72px;
    right: 18px;
    width: 42px;
    height: 42px;
    font-size: 1.15rem;
  }
  body.rtl-layout .floating-ai-btn {
    left: 18px;
    right: auto;
  }`;

if (css.includes(oldMobileAi)) {
  css = css.replace(oldMobileAi, newMobileAi);
}

fs.writeFileSync('movie.css', css, 'utf8');
console.log('movie.css button alignment updated');

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

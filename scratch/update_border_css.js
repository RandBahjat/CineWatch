const fs = require('fs');
const path = require('path');

function updateCss(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  const oldBorderBlockRegex = /\.card-tier\.card-free \{[\s\S]*?@keyframes rotate-card-border \{[\s\S]*?\}/;

  const newBorderBlock = `.card-tier.card-free {
  --primary: hsl(0, 0%, 75%);
  --grad1: hsl(0, 0%, 26%);
  --grad2: hsl(0, 0%, 36%);
  --grad3: hsl(0, 0%, 13%);
  --border-glow: #e4e4e7;
}

.card-tier.card-bronze {
  --primary: hsl(30, 85%, 55%);
  --grad1: hsl(30, 80%, 26%);
  --grad2: hsl(30, 70%, 36%);
  --grad3: hsl(30, 90%, 13%);
  --border-glow: #fb923c;
}

.card-tier.card-gold {
  --primary: hsl(45, 95%, 55%);
  --grad1: hsl(45, 90%, 26%);
  --grad2: hsl(45, 90%, 36%);
  --grad3: hsl(45, 90%, 13%);
  --border-glow: #facc15;
}

.card-tier.card-diamond {
  --primary: hsl(189, 95%, 58%);
  --grad1: hsl(189, 99%, 26%);
  --grad2: hsl(189, 97%, 36%);
  --grad3: hsl(188, 94%, 13%);
  --border-glow: #00f0ff;
}

.card-tier .card__border {
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  z-index: -2;
  inset: -3px;
  border-radius: calc(1rem + 3px);
  background: rgba(255, 255, 255, 0.05);
}

.card-tier .card__border::before {
  content: "";
  pointer-events: none;
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  width: 900px;
  height: 900px;
  transform: translate(-50%, -50%) rotate(0deg);
  background: conic-gradient(
    from 0deg at 50% 50%,
    transparent 0deg,
    transparent 180deg,
    var(--border-glow) 260deg,
    #ffffff 345deg,
    var(--border-glow) 355deg,
    transparent 360deg
  );
  filter: drop-shadow(0 0 10px var(--border-glow));
  animation: rotate-card-border 4.5s linear infinite;
}

@keyframes rotate-card-border {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}`;

  if (oldBorderBlockRegex.test(content)) {
    content = content.replace(oldBorderBlockRegex, newBorderBlock);
    
    // Also enhance .card-tier box-shadow with subtle ambient border glow
    content = content.replace(
      /box-shadow: 0px -16px 24px 0px rgba\(255, 255, 255, 0\.1\) inset;/,
      'box-shadow: 0px -16px 24px 0px rgba(255, 255, 255, 0.08) inset, 0 0 20px -8px var(--border-glow);'
    );
    content = content.replace(
      /\.card-tier:hover \{\s*transform: translateY\(-5px\);\s*\}/,
      '.card-tier:hover {\n  transform: translateY(-5px);\n  box-shadow: 0px -16px 24px 0px rgba(255, 255, 255, 0.12) inset, 0 0 28px -4px var(--border-glow);\n}'
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully updated:', filePath);
  } else {
    console.log('Regex did not match for:', filePath);
  }
}

updateCss(path.join(__dirname, '..', 'movie.css'));
updateCss(path.join(__dirname, '..', 'cinewatch-app', 'movie.css'));

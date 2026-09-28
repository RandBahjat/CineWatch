const fs = require('fs');
let text = fs.readFileSync('index.html', 'utf8');

text = text.replace(/<span class="lang-name">[^<]+<\/span>\s*<span class="lang-sub">[^<]+<\/span>/g, '<span class="lang-name">کوردی (سۆرانی)</span>\n                                <span class="lang-sub">Sorani</span>');

fs.writeFileSync('index.html', text, 'utf8');
console.log('Fixed kurdish language option!');

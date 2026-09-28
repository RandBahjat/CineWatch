const fs = require('fs');
let text = fs.readFileSync('index.html', 'utf8');

const regex = /(<div class="lang-option" data-value="ckb" id="langOptCkb">[\s\S]*?<div class="lang-meta">\s*)<span class="lang-name">[^<]+<\/span>\s*<span class="lang-sub">[^<]+<\/span>/;
text = text.replace(regex, '$1<span class="lang-name">کوردی (سۆرانی)</span>\n                                <span class="lang-sub">Sorani</span>');

fs.writeFileSync('index.html', text, 'utf8');
console.log('Fixed kurdish language option!');

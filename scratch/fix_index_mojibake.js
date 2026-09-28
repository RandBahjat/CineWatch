const fs = require('fs');
let text = fs.readFileSync('index.html', 'utf8');

// The sequence Ã¢â‚¬Â¢ corresponds to •
text = text.replace(/Ã¢â‚¬Â¢/g, '•');

// The sequence Ã¢â‚¬â€  corresponds to —
text = text.replace(/Ã¢â‚¬â€ /g, '—');

// The sequence Ã¢â‚¬â„¢ corresponds to ’
text = text.replace(/Ã¢â‚¬â„¢/g, '’');

// Fix the language name for Sorani
const regex = /(<div class="lang-option" data-value="ckb" id="langOptCkb">[\s\S]*?<div class="lang-meta">\s*)<span class="lang-name">[^<]+<\/span>\s*<span class="lang-sub">[^<]+<\/span>/;
text = text.replace(regex, '$1<span class="lang-name">کوردی (سۆرانی)</span>\n                                <span class="lang-sub">Sorani</span>');

// Replace any remaining weird characters in placeholders
text = text.replace(/placeholder="[^"]*3[^"]*3[^"]*"/g, 'placeholder="••••••••"');

fs.writeFileSync('index.html', text, 'utf8');
console.log('Fixed index.html mojibake!');

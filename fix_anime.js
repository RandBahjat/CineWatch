const fs = require('fs');
let content = fs.readFileSync('anime-data.js', 'utf8');

// Fix any string literals followed on the next line by a property key without a comma
let fixed = content.replace(/(:\s*(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'))(\r?\n\s*[a-zA-Z0-9_$]+:)/g, '$1,$2');

fs.writeFileSync('anime-data.js', fixed, 'utf8');
console.log('Fixed anime-data.js syntax');

const fs = require('fs');
let text = fs.readFileSync('movie.js', 'utf8');
let idx = text.indexOf('document.addEventListener("DOMContentLoaded"');
if (idx === -1) idx = text.indexOf("document.addEventListener('DOMContentLoaded'");
console.log(text.substring(idx - 100, idx + 1000));

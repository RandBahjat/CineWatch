const fs = require('fs');
const util = require('util');

let content = fs.readFileSync('series-data.js', 'utf8');

// Strip the prefix to get valid eval-able code
const prefix = 'window._SERIES_DATA = ';
const prefixIdx = content.indexOf(prefix);
if (prefixIdx === -1) {
  console.error("Prefix not found");
  process.exit(1);
}

let arrayContent = content.substring(prefixIdx + prefix.length).trim();
if (arrayContent.endsWith(';')) arrayContent = arrayContent.slice(0, -1);

// Parse it
let data;
try {
  data = new Function('return ' + arrayContent)();
} catch(e) {
  console.error("Error parsing", e);
  process.exit(1);
}

// Find The Simpsons
const idx = data.findIndex(x => x.title === "The Simpsons");
if (idx !== -1) {
  const simpsons = data.splice(idx, 1)[0];
  data.push(simpsons); // Move to end
}

// Format exactly like the user wants (unquoted keys, clean formatting)
const formatted = util.inspect(data, {
  depth: null,
  maxArrayLength: null,
  maxStringLength: null,
  breakLength: 120, // keep arrays reasonably compact where possible
  compact: false
});

const output = `// CineWatch — Series Data\n// Edit this file to add, remove, or reorder TV shows and series.\n// Push to GitHub (or save — auto-sync will handle it) for changes to go live.\n\nwindow._SERIES_DATA = ${formatted};\n`;

fs.writeFileSync('series-data.js', output, 'utf8');
console.log('Fixed and moved to end.');

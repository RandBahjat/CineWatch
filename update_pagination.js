const fs = require('fs');
let code = fs.readFileSync('movie.js', 'utf8');

const target = `  // Add jump to page input
  html += \`
    <div class="page-jump">
      <button class="page-btn page-jump-btn" id="\${paginationId}-jump-btn">Go</button>
    </div>
  \`;`;

const rep = `  // Add jump to page input
  html += \`
    <div class="page-jump">
      <input type="number" class="page-jump-input notranslate" translate="no" id="\${paginationId}-jump-input" min="1" max="\${totalPages}" placeholder="\${goText}" title="Jump to page">
      <button class="page-btn page-jump-btn notranslate" translate="no" id="\${paginationId}-jump-btn">\${goText}</button>
    </div>
  \`;`;

if (code.includes(target)) {
  code = code.replace(target, rep);
  fs.writeFileSync('movie.js', code, 'utf8');
  console.log('Successfully updated pagination jump input');
} else {
  console.log('Target string not found');
}

const fs = require('fs');
let code = fs.readFileSync('movie.js', 'utf8');

code = code.replace(
  /\/\/\s*Add jump to page input[\s\S]*?container\.innerHTML\s*=\s*html;/,
  `// Add jump to page input
  html += \`
    <div class="page-jump">
      <input type="number" class="page-jump-input notranslate" translate="no" id="\${paginationId}-jump-input" min="1" max="\${totalPages}" placeholder="\${goText}" title="Jump to page">
      <button class="page-btn page-jump-btn notranslate" translate="no" id="\${paginationId}-jump-btn">\${goText}</button>
    </div>
  \`;

  container.innerHTML = html;`
);

fs.writeFileSync('movie.js', code, 'utf8');
console.log('Regex replace complete');

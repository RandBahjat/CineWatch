const fs = require('fs');
const path = require('path');

const cssFiles = [
  path.join(__dirname, '..', 'movie.css'),
  path.join(__dirname, '..', 'cinewatch-app', 'movie.css')
];

cssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('.input-with-prefix:focus-within')) {
      content += `
.input-with-prefix:focus-within {
  border-color: #38bdf8 !important;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.18) !important;
}
`;
      fs.writeFileSync(file, content, 'utf8');
      console.log('Appended focus-within rule to:', file);
    }
  }
});

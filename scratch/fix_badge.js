const fs = require('fs');

['index.html', 'cinewatch-app/index.html'].forEach(p => {
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace(/CineWatch VIP Club/g, 'CineWatch Membership');
    c = c.replace(/<ion-icon name="sparkles"><\/ion-icon>/g, '<ion-icon name="diamond-outline"></ion-icon>');
    fs.writeFileSync(p, c);
  }
});

['movie.css', 'cinewatch-app/movie.css'].forEach(p => {
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace(/background: rgba\(245, 158, 11, 0\.15\);/g, 'background: rgba(255, 255, 255, 0.08);\n  backdrop-filter: blur(10px);\n  -webkit-backdrop-filter: blur(10px);');
    c = c.replace(/border: 1px solid rgba\(245, 158, 11, 0\.35\);/g, 'border: 1px solid rgba(255, 255, 255, 0.2);');
    c = c.replace(/color: #fbbf24;/g, 'color: #f8fafc;');
    c = c.replace(/box-shadow: 0 0 20px rgba\(245, 158, 11, 0\.15\);/g, 'box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);');
    fs.writeFileSync(p, c);
  }
});

console.log('Done!');

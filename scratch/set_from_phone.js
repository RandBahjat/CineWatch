const fs = require('fs');

['admin.html', 'cinewatch-app/admin.html'].forEach(f => {
  if (fs.existsSync(f)) {
    let text = fs.readFileSync(f, 'utf8');
    text = text.replace(
      "const from = localStorage.getItem('tw_from_phone') || '';",
      "const from = localStorage.getItem('tw_from_phone') || '+17372508034';"
    );
    fs.writeFileSync(f, text, 'utf8');
    console.log('Updated default sender phone in ' + f);
  }
});

const fs = require('fs');

['admin.html', 'cinewatch-app/admin.html'].forEach(f => {
  if (fs.existsSync(f)) {
    let text = fs.readFileSync(f, 'utf8');
    text = text.replace(
      "const sid = localStorage.getItem('tw_account_sid') || '';",
      "const sid = localStorage.getItem('tw_account_sid') || 'AC6df9f65f988b401630fe3807e6aa8d46';"
    );
    fs.writeFileSync(f, text, 'utf8');
    console.log('Updated default SID in ' + f);
  }
});

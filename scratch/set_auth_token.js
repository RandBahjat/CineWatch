const fs = require('fs');

['admin.html', 'cinewatch-app/admin.html'].forEach(f => {
  if (fs.existsSync(f)) {
    let text = fs.readFileSync(f, 'utf8');
    text = text.replace(
      "const token = localStorage.getItem('tw_auth_token') || '';",
      "const token = localStorage.getItem('tw_auth_token') || '6c4772223874fd181d4e9ee2773c89c3';"
    );
    fs.writeFileSync(f, text, 'utf8');
    console.log('Updated default Auth Token in ' + f);
  }
});

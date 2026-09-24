const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'zaincash.iq',
  path: '/',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  }
};

https.get(options, (res) => {
  console.log('Zain status:', res.statusCode);
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    fs.writeFileSync('scratch/zaincash.html', html);
    const urls = html.match(/https?:\/\/[^"'\s]+(?:logo|icon)[^"'\s]*/gi) || [];
    console.log('Found URLs:', urls.slice(0, 10));
  });
}).on('error', e => console.error(e));

const https = require('https');

https.get('https://docs.zaincash.iq', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const m = data.match(/https?:\/\/[^"'\s]+(?:logo|icon|zain)[^"'\s]*/gi);
    console.log('Matches:', m ? m.slice(0, 5) : 'none');
  });
}).on('error', e => console.error(e));

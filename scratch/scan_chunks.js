const fs = require('fs');

const chunks = [
  '05vidqxrd-0i9.js',
  '02uvagg6gzt4g.js',
  '0n1oxlisdf_gh.js',
  '0en6d9iogvsky.js',
  '159x~zdefzrtz.js',
  '0wp5y9zhf_frd.js',
  '0lg3~weljhyv4.js',
  '06f.6gkjke5l7.js',
  '0gccld-.c5ylw.js',
  '0z_nfbh71_3uj.js',
  '0k8fbae4_jy2i.js',
  '0xnk7lql5xxak.js',
  '0xxq~lgv-yv5h.js',
  '0_m4yep~fi_6a.js'
];

async function scan() {
  for (const c of chunks) {
    const url = `https://cineby.rip/_next/static/chunks/${c}`;
    try {
      const res = await fetch(url);
      const text = await res.text();
      
      // Look for urls
      const urls = text.match(/https?:\/\/[a-zA-Z0-9.\-_:\/]+/g) || [];
      const interestingUrls = urls.filter(u => !u.includes('w3.org') && !u.includes('schema.org') && !u.includes('react'));
      
      // Look for keywords
      const found = [];
      const keywords = ['player', 'server', 'source', 'stream', 'embed', 'vidsrc', 'vidplay', 'mycloud', 'filemoon', 'autoembed', '2embed', 'superembed', 'videasy', 'smashystream', 'multiembed', 'warezcdn', 'vidlink', 'primewire', 'rive', 'flick', 'provider', 'iframe'];
      keywords.forEach(k => {
        if (text.toLowerCase().includes(k)) found.push(k);
      });

      console.log(`\n=== Chunk ${c} (${text.length} bytes) ===`);
      console.log('Keywords found:', found.join(', '));
      if (interestingUrls.length) {
        console.log('URLs:', [...new Set(interestingUrls)].slice(0, 10));
      }

      // If keywords like vidsrc, vidplay, server, embed found, print context
      ['vidsrc', 'vidplay', 'mycloud', 'filemoon', 'autoembed', 'vidlink', 'embed', 'server'].forEach(target => {
        let pos = 0;
        while ((pos = text.toLowerCase().indexOf(target, pos)) !== -1) {
          const snippet = text.substring(Math.max(0, pos - 40), Math.min(text.length, pos + 100));
          console.log(`  [snippet for ${target}]:`, snippet);
          pos += target.length + 50;
          if (pos > text.length) break;
        }
      });

    } catch (e) {
      console.log(`Error on ${c}:`, e.message);
    }
  }
}

scan();

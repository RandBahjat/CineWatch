async function test() {
  const url1 = 'https://mapple.fun/watch/tv/108978-1-1?autoPlay=true&title=true&poster=true&nextButton=true&theme=E74C3C';
  const url2 = 'https://mapple.fun/watch/tv/108978-1-1';
  const url3 = 'https://mappletv.uk/watch/tv/108978-1-1';
  const url4 = 'https://mapple.uk/watch/tv/108978-1-1';

  for (const u of [url1, url2, url3, url4]) {
    try {
      console.log('--- Testing:', u);
      const res = await fetch(u, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        }
      });
      console.log('Status:', res.status, 'Final URL:', res.url);
      const text = await res.text();
      console.log('Length:', text.length);
      const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
      console.log('Title:', titleMatch ? titleMatch[1] : 'none');
      const iframes = text.match(/<iframe[^>]+src=["'][^"']+["']/gi);
      console.log('Iframes:', iframes);
      console.log('Includes Back & Server:', text.includes('Server') && text.includes('Party'));
    } catch(e) {
      console.error('Error for', u, e.message);
    }
  }
}
test();

async function run() {
  const urls = [
    'https://mapple.fun/player',
    'https://player.mapple.fun',
    'https://mapple.fun/embed',
    'https://mapple.fun/api',
    'https://mapple.fun/docs'
  ];
  for (const u of urls) {
    try {
      const res = await fetch(u);
      console.log(u, res.status);
      if (res.ok) {
        const text = await res.text();
        const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
        console.log('Title:', titleMatch ? titleMatch[1] : 'none');
      }
    } catch(e) {
      console.log(u, 'error:', e.message);
    }
  }
}
run();

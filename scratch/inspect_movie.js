async function inspectMoviePage() {
  const res = await fetch('https://cineby.rip/movie/550', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  console.log('HTML size:', html.length);

  // Search for iframe, embed, vidsrc, player, servers, api
  const matches = html.match(/(https?:\/\/[^\s"'>]+)/g) || [];
  const uniqueDomains = new Set();
  matches.forEach(url => {
    try {
      uniqueDomains.add(new URL(url).hostname);
    } catch (e) {}
  });
  console.log('Domains found in HTML:', [...uniqueDomains]);

  // Search for keywords like player, server, iframe, stream, embed
  const keywords = ['iframe', 'embed', 'player', 'server', 'vidsrc', 'vidlink', 'autoembed', 'superembed', 'videasy', '2embed', 'multiembed'];
  keywords.forEach(kw => {
    const idx = html.toLowerCase().indexOf(kw);
    if (idx !== -1) {
      console.log(`Keyword "${kw}" found around:`, html.substring(Math.max(0, idx - 40), Math.min(html.length, idx + 100)));
    }
  });

  // Check script chunks
  const scriptChunks = html.match(/src="(\/_next\/static\/chunks\/[^"]+)"/g) || [];
  console.log('Script chunks count:', scriptChunks.length);
  console.log('Sample script chunks:', scriptChunks.slice(0, 5));
}

inspectMoviePage();

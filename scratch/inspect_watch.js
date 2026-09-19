async function inspectWatch() {
  const res = await fetch('https://cineby.rip/watch/movie/550', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  console.log('watch/movie/550 status:', res.status, 'size:', html.length);

  const matches = html.match(/(https?:\/\/[^\s"'><,\\]+)/g) || [];
  const domains = new Set();
  matches.forEach(u => {
    try { domains.add(new URL(u).hostname); } catch(e){}
  });
  console.log('Domains in watch/movie/550:', [...domains]);

  const scriptChunks = html.match(/src="(\/_next\/static\/chunks\/[^"]+)"/g) || [];
  console.log('Script chunks count:', scriptChunks.length);
  console.log('Script chunks:', scriptChunks);
}

inspectWatch();

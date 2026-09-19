async function run() {
  try {
    const res = await fetch('https://cineby.rip');
    const html = await res.text();
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    console.log('Sample links:', hrefs.filter(h => !h.startsWith('#') && !h.startsWith('/genre') && h.length > 2).slice(0, 15));
    
    // Pick first movie or series
    const contentLink = hrefs.find(h => h.startsWith('/series') || h.startsWith('/tv') || h.startsWith('/watch') || h.startsWith('/movie'));
    if (contentLink) {
      const fullUrl = 'https://cineby.rip' + contentLink;
      console.log('Fetching detail/watch page:', fullUrl);
      const cRes = await fetch(fullUrl);
      const cHtml = await cRes.text();
      console.log('Detail page length:', cHtml.length);
      const detailHrefs = [...cHtml.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
      console.log('Detail page links:', detailHrefs.slice(0, 15));
      
      // Look for iframes or player layout
      const iframes = cHtml.match(/<iframe[^>]*>/gi);
      console.log('Iframes on detail page:', iframes);
    }
  } catch(e) {
    console.error(e);
  }
}
run();

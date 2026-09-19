async function run() {
  try {
    const res = await fetch('https://cineby.rip');
    const html = await res.text();
    console.log('Homepage length:', html.length);
    // Find some tv links
    const tvLinks = [...html.matchAll(/\/watch-tv\/[^"']+/g)].map(m => m[0]);
    console.log('Found tv links:', tvLinks.slice(0, 5));
    
    if (tvLinks.length > 0) {
      const tvUrl = 'https://cineby.rip' + tvLinks[0];
      console.log('Fetching:', tvUrl);
      const tvRes = await fetch(tvUrl);
      const tvHtml = await tvRes.text();
      console.log('TV page length:', tvHtml.length);
      
      // Look for iframes or player layout
      const iframes = tvHtml.match(/<iframe[^>]*>/gi);
      console.log('Iframes:', iframes);
      
      // Look for mapple in scripts
      const mapple = [...tvHtml.matchAll(/mapple[^\s"']*/gi)].map(m => m[0]);
      console.log('Mapple references:', mapple.slice(0, 5));
      
      // Look for episode selectors or layout
      const epBlocks = [...tvHtml.matchAll(/class="[^"]*episode[^"]*"/gi)].map(m => m[0]);
      console.log('Episode classes:', [...new Set(epBlocks)].slice(0, 10));
    }
  } catch(e) {
    console.error(e);
  }
}
run();

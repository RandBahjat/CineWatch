async function run() {
  try {
    const res = await fetch('https://cineby.rip/series/tt1190634'); // The Boys or similar
    const html = await res.text();
    console.log('Series page length:', html.length);
    // Find watch link or episode link
    const links = [...html.matchAll(/\/watch[^\s"']*/gi)].map(m => m[0]);
    console.log('Watch links found:', links.slice(0, 10));
    
    if (links.length > 0) {
      const wUrl = 'https://cineby.rip' + links[0];
      const wRes = await fetch(wUrl);
      const wHtml = await wRes.text();
      console.log('Watch page URL:', wUrl, 'length:', wHtml.length);
      // Check structure: is player in a page layout or a modal?
      console.log('Has iframe:', wHtml.includes('<iframe'));
      console.log('Has server:', wHtml.includes('server') || wHtml.includes('Server'));
      console.log('Has season:', wHtml.includes('Season') || wHtml.includes('season'));
    }
  } catch(e) {
    console.error(e);
  }
}
run();

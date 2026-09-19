async function run() {
  try {
    const res = await fetch('https://mapple.fun/watch/tv/83867-1-1?autoPlay=true&title=true&poster=true&nextButton=true&theme=E74C3C');
    const html = await res.text();
    console.log('LENGTH:', html.length);
    console.log(html.slice(0, 1000));
    
    // Check if nextButton is rendered
    console.log('Contains nextButton in html:', html.includes('nextButton') || html.includes('next'));
    // Check for episode buttons
    console.log('Contains episode:', html.includes('episode'));
  } catch(e) {
    console.error(e);
  }
}
run();

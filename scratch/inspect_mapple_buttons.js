async function run() {
  try {
    const res = await fetch('https://mapple.fun/watch/tv/83867-1-1?autoPlay=true&title=true&poster=true&nextButton=true&theme=E74C3C');
    const html = await res.text();
    // find buttons or text
    const buttons = [...html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi)].map(m => m[0]);
    console.log('Buttons count:', buttons.length);
    buttons.forEach((b, i) => console.log(i, b.replace(/\s+/g, ' ').slice(0, 150)));
  } catch(e) {
    console.error(e);
  }
}
run();

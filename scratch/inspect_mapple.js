const fs = require('fs');

async function run() {
  const res = await fetch('https://mapple.fun/watch/tv/108978-1-1');
  const html = await res.text();
  fs.writeFileSync('scratch/mapple_page.html', html);
  console.log('Saved html, length:', html.length);
  
  // Find script tags
  const scripts = [...html.matchAll(/<script\s+[^>]*src=["']([^"']+)["']/gi)].map(m => m[1]);
  console.log('Scripts found:', scripts);

  // Check for frame busting or iframe detection
  console.log('Mentions window.top:', /window\.top|window\.parent|top\s*!==\s*self|self\s*!==\s*top|inIframe/i.test(html));

  // Check for embed vs direct
  console.log('Mentions embed:', /embed|iframe/i.test(html));
}
run();

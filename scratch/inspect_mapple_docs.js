async function run() {
  try {
    const res = await fetch('https://mapple.fun');
    const html = await res.text();
    // Search for parameters, docs, episode, tv
    const matches = [...html.matchAll(/(?:parameter|query|options|episode|season|nextButton|title|poster|autoPlay)[^<]{0,100}/gi)].map(m => m[0]);
    console.log('Matches found on mapple.fun:');
    console.log([...new Set(matches)].slice(0, 30));
  } catch(e) {
    console.error(e);
  }
}
run();

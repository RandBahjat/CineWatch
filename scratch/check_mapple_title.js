async function run() {
  try {
    const res = await fetch('https://mapple.fun');
    const html = await res.text();
    // Search for "The 4K video"
    const idx = html.indexOf('The 4K video');
    if (idx !== -1) {
      console.log('Found:', html.slice(idx - 100, idx + 200));
    } else {
      console.log('Not found on homepage');
    }
  } catch (e) {
    console.error(e);
  }
}
run();

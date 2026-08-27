const fs = require('fs');

async function run() {
  const showRes = await fetch('https://api.tvmaze.com/search/shows?q=dragon%20ball');
  const shows = await showRes.json();
  shows.forEach(s => console.log(s.show.name));
}
run().catch(console.error);

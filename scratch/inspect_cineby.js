const fs = require('fs');

async function checkCineby() {
  // Check routes or fetch Fight Club (550) or a popular movie
  const urls = [
    'https://cineby.rip/movie/550',
    'https://cineby.rip/watch/550',
    'https://cineby.rip/en/movie/550',
    'https://cineby.rip/tv/1396',
    'https://cineby.rip/api'
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(u, '-> Status:', res.status, 'Content-Type:', res.headers.get('content-type'));
    } catch (e) {
      console.log(u, '-> Error:', e.message);
    }
  }
}

checkCineby();

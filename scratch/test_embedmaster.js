async function testEmbedMaster() {
  try {
    const res = await fetch('https://embedmaster.link/movie/550', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    console.log('Status:', res.status);
    const html = await res.text();
    console.log('HTML size:', html.length);
    console.log('Sample content:\n', html.substring(0, 1500));

    // Check for ad scripts, popups, or trackers
    const adKeywords = ['ad', 'pop', 'propeller', 'monetag', 'click', 'track', 'histats', 'banner'];
    const foundAds = [];
    adKeywords.forEach(k => {
      if (html.toLowerCase().includes(k)) foundAds.push(k);
    });
    console.log('Ad keywords detected:', foundAds);

    // Check player engine
    const players = ['plyr', 'videojs', 'artplayer', 'vidstack', 'jwplayer', 'clappr', 'hls'];
    const foundPlayers = [];
    players.forEach(p => {
      if (html.toLowerCase().includes(p)) foundPlayers.push(p);
    });
    console.log('Player engines detected:', foundPlayers);

  } catch (e) {
    console.log('Error:', e.message);
  }
}

testEmbedMaster();

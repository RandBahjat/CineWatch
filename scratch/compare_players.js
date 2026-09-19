async function compare() {
  const mappleRes = await fetch('https://mappletv.uk/watch/movie/550', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const mappleHtml = await mappleRes.text();

  const vaplayerRes = await fetch('https://vaplayer.ru/embed/movie/550?skin=netflix', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const vaplayerHtml = await vaplayerRes.text();

  const vidlinkRes = await fetch('https://vidlink.pro/movie/550', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const vidlinkHtml = await vidlinkRes.text();

  console.log('Mapple length:', mappleHtml.length);
  console.log('VaPlayer length:', vaplayerHtml.length);
  console.log('VidLink length:', vidlinkHtml.length);

  // Check if player has custom controls or subtitles
  console.log('Mapple mentions subs/tracks:', /subtitle|track|caption/i.test(mappleHtml));
  console.log('VaPlayer mentions subs/tracks:', /subtitle|track|caption/i.test(vaplayerHtml));
  console.log('VidLink mentions subs/tracks:', /subtitle|track|caption/i.test(vidlinkHtml));
}

compare();

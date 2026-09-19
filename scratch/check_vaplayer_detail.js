async function checkVaPlayer() {
  const res = await fetch('https://vaplayer.ru/embed/tv/108978/1/1?skin=netflix');
  const text = await res.text();
  console.log('VaPlayer has 54:03:', text.includes('54:03'));
  // Find player name or library
  console.log('Mentions ArtPlayer:', text.includes('artplayer'));
  console.log('Mentions Plyr:', text.includes('plyr'));
  console.log('Mentions DPlayer:', text.includes('dplayer'));
  console.log('Mentions Videojs:', text.includes('video.js'));
  console.log('Mentions jwplayer:', text.includes('jwplayer'));
  console.log('Mentions clappr:', text.includes('clappr'));
}
checkVaPlayer();

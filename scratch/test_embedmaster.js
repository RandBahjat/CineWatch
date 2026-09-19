async function run() {
  try {
    const res = await fetch('https://embedmaster.link/movie/575265?welcome_page=off&autoplay=on');
    const html = await res.text();
    console.log('Status:', res.status, 'HTML length:', html.length);
    
    // Check for player script or video sources
    const hasVideo = html.includes('<video') || html.includes('video-js') || html.includes('.m3u8') || html.includes('blob:');
    console.log('Video references found:', hasVideo);
    
    // Look for keywords
    console.log('Includes cf-turnstile:', html.includes('cf-turnstile'));
    console.log('Includes dtc_sbx (sandbox check):', html.includes('dtc_sbx'));
    console.log('Includes ad scripts (llvpn):', html.includes('llvpn.com'));
    
    // Let's see what happens on standard URL: https://embedmaster.link/movie/575265
    const resDefault = await fetch('https://embedmaster.link/movie/575265');
    const htmlDefault = await resDefault.text();
    console.log('\nDefault URL:');
    console.log('Status:', resDefault.status, 'HTML length:', htmlDefault.length);
    console.log('Has welcome form:', htmlDefault.includes('welcome-play-form'));
    console.log('Has turnstile widget:', htmlDefault.includes('cf-turnstile-widget'));
  } catch (err) {
    console.error(err);
  }
}
run();

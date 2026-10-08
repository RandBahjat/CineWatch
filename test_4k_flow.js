const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => {
    const txt = msg.text();
    if (txt.includes('VIP') || txt.includes('4k') || txt.includes('4K')) {
      console.log('PAGE LOG:', txt);
    }
  });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // 1. Initial State
  const init = await page.evaluate(() => ({
    user: window.state ? window.state.user : null,
    isVip: typeof isUserVip === 'function' ? isUserVip() : null,
    activeView: window.state ? window.state.activeView : null
  }));
  console.log('1. Init:', init);

  // 2. Click 4k browse button
  await page.evaluate(() => {
    const el = document.getElementById('browseCardVip');
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const afterNav = await page.evaluate(() => {
    const vm = document.getElementById('vipModal');
    const fv = document.getElementById('fourkSection');
    return {
      activeView: window.state ? window.state.activeView : null,
      vipOpen: vm && !vm.classList.contains('hidden') && vm.style.display !== 'none',
      fourkOpen: fv && !fv.classList.contains('hidden') && fv.style.display !== 'none',
      cardsCount: document.querySelectorAll('#fourkGrid .movie-card').length
    };
  });
  console.log('2. After 4K Nav Click:', afterNav);

  // 3. Click first card
  const clickedCard = await page.evaluate(() => {
    const card = document.querySelector('#fourkGrid .movie-card');
    if (card) {
      card.click();
      return card.querySelector('.movie-title') ? card.querySelector('.movie-title').textContent : 'card clicked';
    }
    return null;
  });
  console.log('3. Clicked card:', clickedCard);
  await new Promise(r => setTimeout(r, 600));

  const afterCard = await page.evaluate(() => {
    const vm = document.getElementById('vipModal');
    const dm = document.getElementById('detailsModal');
    return {
      vipOpen: vm && !vm.classList.contains('hidden') && vm.style.display !== 'none',
      detailsOpen: dm && !dm.classList.contains('hidden') && dm.style.display !== 'none',
      title: document.getElementById('modalTitle') ? document.getElementById('modalTitle').textContent : null
    };
  });
  console.log('4. After Card Click:', afterCard);

  // 4. Click Play button
  await page.evaluate(() => {
    const btn = document.getElementById('modalPlayBtn');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const afterPlay = await page.evaluate(() => {
    const vm = document.getElementById('vipModal');
    const pm = document.getElementById('playerModal');
    return {
      vipOpen: vm && !vm.classList.contains('hidden') && vm.style.display !== 'none',
      playerOpen: pm && !pm.classList.contains('hidden') && pm.style.display !== 'none'
    };
  });
  console.log('5. After Play Click:', afterPlay);

  await browser.close();
})();

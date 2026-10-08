const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER PAGEERROR:', err.message, err.stack));

  console.log('Navigating to http://127.0.0.1:5500/?section=4k ...');
  await page.goto('http://127.0.0.1:5500/?section=4k', { waitUntil: 'networkidle2' });

  const initialDiag = await page.evaluate(() => {
    return {
      activeView: window.state ? window.state.activeView : null,
      heroBannerClasses: document.getElementById('heroBanner')?.className,
      heroTrackLength: document.getElementById('heroTrack')?.children.length,
      fourkSectionClasses: document.getElementById('fourkSection')?.className,
      defaultShelvesClasses: document.getElementById('defaultShelves')?.className,
      mainContentDisplay: window.getComputedStyle(document.getElementById('mainContent')).display
    };
  });
  console.log('Initial diag on ?section=4k:', JSON.stringify(initialDiag, null, 2));

  console.log('Evaluating navHomeBtn and switching view...');
  const navHomeInfo = await page.evaluate(() => {
    const btn = document.getElementById('navHomeBtn');
    const rect = btn?.getBoundingClientRect();
    const elAtPoint = rect ? document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2) : null;
    return {
      exists: !!btn,
      visible: btn?.offsetParent !== null,
      rect,
      elAtPointTag: elAtPoint?.tagName,
      elAtPointId: elAtPoint?.id,
      elAtPointClass: elAtPoint?.className
    };
  });
  console.log('navHomeInfo:', navHomeInfo);

  await page.evaluate(() => {
    if (typeof switchView === 'function') {
      switchView('home', true);
    }
  });
  await new Promise(r => setTimeout(r, 2000));

  const afterHomeDiag = await page.evaluate(() => {
    const hero = document.getElementById('heroBanner');
    const shelves = document.getElementById('defaultShelves');
    const fourk = document.getElementById('fourkSection');
    const main = document.getElementById('mainContent');
    const track = document.getElementById('heroTrack');
    return {
      activeView: window.state ? window.state.activeView : null,
      heroBannerClasses: hero?.className,
      heroBannerOffsetHeight: hero?.offsetHeight,
      heroBannerComputedDisplay: hero ? window.getComputedStyle(hero).display : null,
      heroTrackHTML: track?.innerHTML.substring(0, 200),
      heroTrackChildren: track?.children.length,
      fourkSectionClasses: fourk?.className,
      fourkSectionOffsetHeight: fourk?.offsetHeight,
      defaultShelvesClasses: shelves?.className,
      defaultShelvesOffsetHeight: shelves?.offsetHeight,
      defaultShelvesComputedDisplay: shelves ? window.getComputedStyle(shelves).display : null,
      mainContentClasses: main?.className,
      mainContentOffsetHeight: main?.offsetHeight,
      mainContentComputedDisplay: main ? window.getComputedStyle(main).display : null,
      top10TrackCards: document.querySelectorAll('#top10Track .movie-card').length,
      featuredTitles: window.FEATURED_TITLES
    };
  });
  console.log('After clicking Home diag:', JSON.stringify(afterHomeDiag, null, 2));

  await browser.close();
})();

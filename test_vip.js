const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    await page.goto('file:///c:/Users/Click IT/OneDrive/Documents/Web Design/movie & Series/index.html', {waitUntil: 'networkidle0'});
    console.log('Page loaded. Clicking navVipBtn...');
    await page.click('#navVipBtn');
    await page.waitForTimeout(1000);
    const modalDisplay = await page.evaluate(() => {
        const m = document.getElementById('vipModal');
        return m ? { display: window.getComputedStyle(m).display, opacity: window.getComputedStyle(m).opacity } : null;
    });
    console.log('Modal state:', modalDisplay);
    await page.screenshot({path: 'vip-test-puppet.png'});
    await browser.close();
})();

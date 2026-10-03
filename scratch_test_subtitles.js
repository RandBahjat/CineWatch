const puppeteer = require('puppeteer');

(async () => {
    console.log('Launching browser to test Kurdish subtitle sync and anti-stuck engine...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
    const page = await browser.newPage();

    // Catch page console errors
    page.on('console', msg => {
        if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
    });

    await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 30000 });
    console.log('Page loaded successfully.');

    const result = await page.evaluate(async () => {
        const tests = [];

        // 1. Verify UI elements exist
        const playPauseBtn = document.getElementById('kurdishSubPlayPauseBtn');
        const liveTimeBtn = document.getElementById('kurdishSubLiveTime');
        const dialogBtn = document.getElementById('kurdishSubDialogBtn');
        const toastEl = document.getElementById('kurdishSubToast');
        const modalEl = document.getElementById('kurdishSubDialogModal');
        const overlayEl = document.getElementById('customSubtitleOverlay');

        tests.push({
            name: 'UI Elements Exist',
            pass: !!(playPauseBtn && liveTimeBtn && dialogBtn && toastEl && modalEl && overlayEl),
            details: { playPauseBtn: !!playPauseBtn, liveTimeBtn: !!liveTimeBtn, dialogBtn: !!dialogBtn, toastEl: !!toastEl, modalEl: !!modalEl, overlayEl: !!overlayEl }
        });

        // 2. Initialize and load Kurdish subtitles for Interstellar
        loadCustomSubtitles('Interstellar', 'movie');
        const toggleBtn = document.getElementById('kurdishSubToggleBtn');
        await toggleBtn.onclick(); // Turn ON Kurdish CC

        tests.push({
            name: 'Kurdish Subtitles Loaded',
            pass: currentParsedSubs.length > 500,
            cueCount: currentParsedSubs.length
        });

        // 3. Test Anti-Stuck Duration Capping
        let maxDuration = 0;
        let anyStuckCues = false;
        let cue1Duration = 0;

        if (currentParsedSubs.length > 0) {
            cue1Duration = currentParsedSubs[0].end - currentParsedSubs[0].start;
            currentParsedSubs.forEach(c => {
                const dur = c.end - c.start;
                if (dur > maxDuration) maxDuration = dur;
                if (dur > 5.1) anyStuckCues = true;
            });
        }

        tests.push({
            name: 'Duration Capping (Anti-Stuck)',
            pass: !anyStuckCues && maxDuration <= 5.0 && cue1Duration <= 3.51,
            maxDuration: maxDuration.toFixed(2) + 's',
            cue1Duration: cue1Duration.toFixed(2) + 's (originally 48s)'
        });

        // 4. Test SubClock Sync without lag
        subClock.jumpTo(50.0);
        subClock.sync(60.0); // True video reported 60.0
        const diffAfterSync = Math.abs(subClock.currentTime - 60.0);

        tests.push({
            name: 'SubClock Instant Sync (No Lag)',
            pass: diffAfterSync < 0.001,
            currentTime: subClock.currentTime
        });

        // 5. Test Subtitle Rendering & Natural Clearing
        // Test within cue 3: Interstellar cue 3 starts at ~74.7 and ends at ~77.1
        const cue3 = currentParsedSubs.find(c => c.text.includes('جوتیار'));
        let cue3Appeared = false;
        let cue3Cleared = false;

        if (cue3) {
            // Set time right in the middle of cue 3
            subClock.jumpTo(cue3.start + 0.5);
            subtitleTimeOffset = 0;
            renderSubtitlesNow();
            cue3Appeared = overlayEl.innerHTML.includes('جوتیار') && overlayEl.style.display !== 'none';

            // Advance time past cue 3 end
            subClock.jumpTo(cue3.end + 0.5);
            renderSubtitlesNow();
            cue3Cleared = (overlayEl.innerHTML === '' || overlayEl.style.display === 'none');
        }

        tests.push({
            name: 'Subtitle Natural Appearance and Clearing',
            pass: cue3Appeared && cue3Cleared,
            cue3Appeared,
            cue3Cleared
        });

        // 6. Test Dialogue Modal Sync Clicking
        openSubtitleDialogueModal();
        const dialogList = document.getElementById('kurdishSubDialogList');
        const rows = dialogList.querySelectorAll('.sub-cue-row');
        let clickSyncPassed = false;

        if (rows.length > 5) {
            const targetRow = rows[4];
            const targetStart = parseFloat(targetRow.dataset.start);
            targetRow.click();
            clickSyncPassed = Math.abs(subClock.currentTime - targetStart) < 0.05 && modalEl.style.display === 'none';
        }

        tests.push({
            name: 'Dialogue Modal 1-Click Sync',
            pass: clickSyncPassed,
            dialogRowsCount: rows.length
        });

        // 7. Test Toast Notification does NOT hijack Subtitle Overlay
        showSubtitleToast('Test Notification Message');
        const toastShowsMsg = toastEl.innerHTML.includes('Test Notification Message') && toastEl.style.display === 'block';
        const overlayNotPolluted = !overlayEl.innerHTML.includes('Test Notification Message');

        tests.push({
            name: 'Toast Separation from Subtitle Overlay',
            pass: toastShowsMsg && overlayNotPolluted,
            toastShowsMsg,
            overlayNotPolluted
        });

        return tests;
    });

    console.log('\n===== TEST RESULTS =====');
    let allPassed = true;
    result.forEach((t, i) => {
        const mark = t.pass ? '✓ PASS' : '✗ FAIL';
        if (!t.pass) allPassed = false;
        console.log(`[${i+1}] ${mark}: ${t.name}`);
        console.log('    Details:', JSON.stringify(t));
    });
    console.log('========================\n');

    await browser.close();
    process.exit(allPassed ? 0 : 1);
})();

const fs = require('fs');

let mainHtml = fs.readFileSync('index.html', 'utf8');
let appHtml = fs.readFileSync('cinewatch-app/index.html', 'utf8');

// Copy the video-header and customSubtitleOverlay section from index.html to cinewatch-app/index.html
const startMarker = '<!-- Video Header (Hover Zone) -->';
const endMarker = '<!-- HTML5 Video Player -->';

const mainPart = mainHtml.substring(mainHtml.indexOf(startMarker), mainHtml.indexOf(endMarker));

const appStart = appHtml.indexOf(startMarker);
const appEnd = appHtml.indexOf(endMarker, appStart);

if (appStart !== -1 && appEnd !== -1 && mainPart) {
    appHtml = appHtml.substring(0, appStart) + mainPart + appHtml.substring(appEnd);
    fs.writeFileSync('cinewatch-app/index.html', appHtml, 'utf8');
    console.log('Successfully synced video-header section into cinewatch-app/index.html');
} else {
    console.error('Markers not found', { appStart, appEnd, mainPartLen: mainPart?.length });
}

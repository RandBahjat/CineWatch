const fs = require('fs');
const seriesDataPath = 'series-data.js';
const beautyDataPath = 'beauty.txt';

let seriesData = fs.readFileSync(seriesDataPath, 'utf8');
const beautyData = fs.readFileSync(beautyDataPath, 'utf8');

if (!seriesData.includes('title: "Beauty in Black"')) {
    const replacement = 'window._SERIES_DATA = [\n' + beautyData + ',\n';
    seriesData = seriesData.replace('window._SERIES_DATA = [', replacement);
    fs.writeFileSync(seriesDataPath, seriesData);
    console.log('Injected successfully');
} else {
    console.log('Already exists');
}

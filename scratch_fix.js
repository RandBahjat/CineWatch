const fs = require('fs');
const oldContent = fs.readFileSync('old_movie.js', 'utf8');

const startMarker = 'function openDetailsModal(movieId) {';
const endMarker = '// ==========================================\n// API SCRAPING FOR RAW STREAMS';

const startIdx = oldContent.indexOf(startMarker);
const endIdx = oldContent.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  let modalCode = oldContent.substring(startIdx, endIdx);
  modalCode = modalCode.replace(
    'const similarsBtn = document.getElementById("detailsSimilarsBtn");',
    `const similarsBtn = document.getElementById("detailsSimilarsBtn");
    const similarsText = document.getElementById("detailsSimilarsText");
    if (similarsText) {
      const isCkb = document.cookie.includes("googtrans=/en/ckb");
      const isAr = document.cookie.includes("googtrans=/en/ar");
      similarsText.textContent = isCkb ? "هاوشێوە" : (isAr ? "أعمال مشابهة" : "Similars");
    }`
  );

  let currentMovie = fs.readFileSync('movie.js', 'utf8');
  const curStart = currentMovie.indexOf(startMarker);
  const curEnd = currentMovie.indexOf(endMarker);
  if (curStart !== -1 && curEnd !== -1) {
    currentMovie = currentMovie.substring(0, curStart) + modalCode + currentMovie.substring(curEnd);
    fs.writeFileSync('movie.js', currentMovie, 'utf8');
    console.log('Successfully updated movie.js');
  } else {
    console.error('Markers not found in movie.js');
  }
} else {
  console.error('Markers not found in old_movie.js');
}

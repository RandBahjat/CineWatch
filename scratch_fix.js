const fs = require('fs');
const buf = fs.readFileSync('old_movie.js');
const oldContent = (buf[0] === 0xFF && buf[1] === 0xFE) ? buf.toString('utf16le') : buf.toString('utf8');

const startMarker = 'function openDetailsModal(movieId)';
const endMarker = 'async function fetchRawStream(';

const startIdx = oldContent.indexOf(startMarker);
const endIdx = oldContent.indexOf(endMarker);

console.log('startIdx:', startIdx, 'endIdx:', endIdx);

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
  console.log('curStart:', curStart, 'curEnd:', curEnd);
  if (curStart !== -1 && curEnd !== -1) {
    currentMovie = currentMovie.substring(0, curStart) + modalCode + currentMovie.substring(curEnd);
    fs.writeFileSync('movie.js', currentMovie, 'utf8');
    console.log('Successfully updated movie.js');
  }
}

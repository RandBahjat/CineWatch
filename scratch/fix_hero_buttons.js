const fs = require('fs');
let text = fs.readFileSync('movie.js', 'utf8');

// The original corrupted strings in movie.js
const corruptedKurdishPlay = 'Ø³Û•ÛŒØ±Ú©Ø±Ø¯Ù†';
const correctedKurdishPlay = 'سەیرکردن';

const corruptedArabicPlay = 'ØªØ´ØºÙŠÙ„';
const correctedArabicPlay = 'تشغيل';

const corruptedKurdishMore = 'Ø²ÛŒØ§ØªØ± Ø¨Ø¨ÛŒÙ†Û•';
const correctedKurdishMore = 'زیاتر ببینە';

const corruptedArabicMore = 'Ø¹Ø±Ø¶ Ø§Ù„Ù…Ø²ÙŠØ¯';
const correctedArabicMore = 'عرض المزيد';

// Since the file has them as UTF-8 encoded versions of the Windows-1252 characters, 
// they might be slightly different in bytes. It is safer to replace them by finding the JS line directly.

// Look for: const playText = isSorani ? '...' : (isArabic ? '...' : 'Play');
const playRegex = /const playText = isSorani \? '[^']+' : \(isArabic \? '[^']+' : 'Play'\);/g;
text = text.replace(playRegex, "const playText = isSorani ? 'سەیرکردن' : (isArabic ? 'تشغيل' : 'Play');");

// Look for: const moreText = isSorani ? '...' : (isArabic ? '...' : 'See More');
const moreRegex = /const moreText = isSorani \? '[^']+' : \(isArabic \? '[^']+' : 'See More'\);/g;
text = text.replace(moreRegex, "const moreText = isSorani ? 'زیاتر ببینە' : (isArabic ? 'عرض المزيد' : 'See More');");

fs.writeFileSync('movie.js', text, 'utf8');
console.log('Fixed button translations in movie.js');

const fs = require('fs');
const content = fs.readFileSync('anime-data.js', 'utf8');
console.log("File length:", content.length);
console.log("Includes Tokyo Ghoul:", content.includes("Tokyo Ghoul"));

// Let's count how many Tokyo Ghoul strings exist
let count = 0;
let pos = content.indexOf("Tokyo Ghoul");
while (pos !== -1) {
    count++;
    pos = content.indexOf("Tokyo Ghoul", pos + 1);
}
console.log("Tokyo Ghoul count:", count);

if (count > 0) {
    const firstPos = content.indexOf("Tokyo Ghoul");
    console.log("First occurrence surrounding 50 chars:", content.substring(firstPos - 25, firstPos + 25));
}

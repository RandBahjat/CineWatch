const fs = require('fs');
const filePath = 'anime-data.js';
const dbzPath = 'dbz.txt';

let content = fs.readFileSync(filePath, 'utf8');
const newDbz = fs.readFileSync(dbzPath, 'utf8');

const startIdx = content.indexOf('title: "Dragon Ball Z Kai"');

if (startIdx !== -1) {
    // Find the opening brace before this title
    let openBrace = content.lastIndexOf('{', startIdx);
    
    // Find the end of this object. We can look for the next anime Slug or title
    let nextTitle = content.indexOf('title: "', startIdx + 20);
    
    if (nextTitle !== -1) {
        let closeBrace = content.lastIndexOf('}', nextTitle);
        // Replace from openBrace to closeBrace + 1
        let toReplace = content.substring(openBrace, closeBrace + 1) + ',';
        // newDbz might already have a comma at the end, let's just use it
        content = content.replace(toReplace, newDbz.trim());
        fs.writeFileSync(filePath, content);
        console.log("Replaced existing DBZ Kai");
    } else {
        // Last object in the array
        let closeBrace = content.lastIndexOf(']');
        // actually we can just look backwards from the last ] to find the end of the object
        let lastCloseBrace = content.lastIndexOf('}', closeBrace);
        let toReplace = content.substring(openBrace, lastCloseBrace + 1);
        
        let repl = newDbz.trim();
        if (repl.endsWith(',')) repl = repl.slice(0, -1);
        
        content = content.replace(toReplace, repl);
        fs.writeFileSync(filePath, content);
        console.log("Replaced existing DBZ Kai at the end");
    }
} else {
    // Inject at the beginning
    content = content.replace('window._ANIME_DATA = [', 'window._ANIME_DATA = [\n' + newDbz);
    fs.writeFileSync(filePath, content);
    console.log("Injected DBZ Kai");
}

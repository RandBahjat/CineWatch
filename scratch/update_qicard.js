const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'cinewatch-app', 'index.html')
];

const newCcForm = `<div id="ccFormBox" style="display: none; flex-direction: column; gap: 12px; margin-bottom: 16px;">
        <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px; padding: 16px; text-align: left; backdrop-filter: blur(10px);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 13px; color: #a0a0a0; font-weight: 500;">Qi Card / Mastercard Transfer</span>
            <span style="font-size: 11px; background: rgba(229, 9, 20, 0.2); color: #ff6b6b; padding: 2px 8px; border-radius: 12px; font-weight: 600;">IRAQ</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0, 0, 0, 0.4); padding: 12px 14px; border-radius: 8px; border: 1px dashed rgba(255, 255, 255, 0.2);">
            <span style="font-family: monospace; font-size: 17px; font-weight: bold; letter-spacing: 2px; color: #ffffff;" id="qiCardDisplay">9101 1792 5305</span>
            <button type="button" id="copyQiBtn" style="background: #e50914; border: none; color: white; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s ease;">Copy</button>
          </div>
          <div style="margin-top: 10px; font-size: 12px; color: #888; display: flex; justify-content: space-between;">
            <span>Recipient: <strong style="color: #ddd;">CineWatch VIP</strong></span>
            <span>App: <strong style="color: #ddd;">Qi Services (خدمات كي)</strong></span>
          </div>
        </div>
        <div>
          <label style="display: block; font-size: 12px; color: #aaa; margin-bottom: 6px; text-align: left;">Sender Phone Number / Transfer Reference #</label>
          <input type="text" id="qiRefInput" placeholder="e.g. 0770xxxxxxx or Transaction #" style="width: 100%; box-sizing: border-box; padding: 11px 14px; background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; color: white; font-size: 14px; outline: none;">
        </div>
      </div>`;

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    // Replace the old ccFormBox
    const regex = /<div id="ccFormBox"[\s\S]*?<\/div>\s*<\/div>\s*(?=<div id="cryptoFormBox")/i;
    if (regex.test(content)) {
      content = content.replace(regex, newCcForm + '\n      ');
      fs.writeFileSync(f, content, 'utf8');
      console.log('Successfully updated ccFormBox in:', f);
    } else {
      // Try alternate match
      const simpleRegex = /<div id="ccFormBox"[\s\S]*?<\/div>\s*(?=<div id="cryptoFormBox")/i;
      if (simpleRegex.test(content)) {
        content = content.replace(simpleRegex, newCcForm + '\n      ');
        fs.writeFileSync(f, content, 'utf8');
        console.log('Successfully updated (simpleRegex) in:', f);
      } else {
        console.log('Could not find ccFormBox in:', f);
      }
    }
  }
});

const fs = require('fs');
let content = fs.readFileSync('anime-data.js', 'utf8');
let parts = content.split('{\n  "id": "Bleach",');
if (parts.length === 1) {
  parts = content.split('{\n  id: "Bleach",'); // maybe the user's manual change already removed the quotes around 'id'?
}

let bleachIndex = content.indexOf('"id": "Bleach"');
if (bleachIndex === -1) {
  bleachIndex = content.indexOf('id: "Bleach"');
}

if (bleachIndex !== -1) {
  // Find the start of the Bleach object
  const startIdx = content.lastIndexOf('{', bleachIndex);
  let before = content.substring(0, startIdx);
  let bleachPart = content.substring(startIdx);
  
  // Replace quotes around keys
  let fixedBleach = bleachPart.replace(/"([a-zA-Z0-9_]+)":/g, '$1:');
  
  fs.writeFileSync('anime-data.js', before + fixedBleach);
  console.log('Formatting fixed');
} else {
  console.log('Could not find Bleach part');
}

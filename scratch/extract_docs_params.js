const fs = require('fs');
const html = fs.readFileSync('scratch/mappletv_docs.html', 'utf8');

const params = ['autoPlay', 'startAt', 'theme', 'title', 'poster', 'nextButton', 'autoNext', 'watchParty', 'partyId'];
params.forEach(p => {
  const idx = html.indexOf(`"${p}"`);
  if (idx !== -1) {
    console.log(`Param ${p}:`, html.substring(idx, idx + 400).replace(/\\/g, '').replace(/"/g, ' '));
  }
});

const fs = require('fs');

const html = fs.readFileSync('scratch/mapple_page.html', 'utf8');
const nextData = html.match(/<script id="__NEXT_DATA__"[^>]*>([^<]+)<\/script>/);
if (nextData) {
  console.log('Next data found!');
  const data = JSON.parse(nextData[1]);
  console.log('Page props:', JSON.stringify(data.props, null, 2).substring(0, 500));
  console.log('Query:', data.query);
} else {
  console.log('No NEXT_DATA');
}

// Let's find any text about player or servers in the HTML
const textMatches = html.match(/(?:Reacher|Player|Server|VidAPI|Stream|Provider)[^<]{0,50}/gi);
console.log('Text matches sample:', textMatches ? textMatches.slice(0, 15) : 'none');

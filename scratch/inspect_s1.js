const fs = require('fs');

const html = fs.readFileSync('scratch/tmdb_gl_s1.html', 'utf8');

// Find episode title patterns
const matches = html.match(/class="episode_title"[\s\S]*?<\/a>/g) || html.match(/<h4><a[^>]*>([^<]+)<\/a><\/h4>/g) || html.match(/<h3[^>]*><a[^>]*>([^<]+)<\/a><\/h3>/g);
console.log('Matches:', matches ? matches.slice(0, 5) : 'none');

// Let's search for "Beware My Power"
const idx = html.indexOf('Beware My Power');
if (idx !== -1) {
  console.log('Context around Beware My Power:\n', html.slice(idx - 100, idx + 400));
}

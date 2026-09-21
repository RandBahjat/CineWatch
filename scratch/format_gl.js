const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('scratch/green_lantern_entry.json', 'utf8'));

function formatShow(show) {
  const lines = [];
  lines.push('  {');
  lines.push(`    "title": ${JSON.stringify(show.title)},`);
  lines.push(`    "type": ${JSON.stringify(show.type)},`);
  lines.push(`    "year": ${show.year},`);
  lines.push(`    "rating": ${JSON.stringify(show.rating)},`);
  lines.push(`    "age": ${JSON.stringify(show.age)},`);
  lines.push(`    "duration": ${JSON.stringify(show.duration)},`);
  lines.push('    "genres": [');
  show.genres.forEach((g, i) => {
    lines.push(`      ${JSON.stringify(g)}${i < show.genres.length - 1 ? ',' : ''}`);
  });
  lines.push('    ],');
  lines.push(`    "poster": ${JSON.stringify(show.poster)},`);
  lines.push(`    "backdrop": ${JSON.stringify(show.backdrop)},`);
  lines.push(`    "videoUrl": ${JSON.stringify(show.videoUrl)},`);
  lines.push(`    "trailerUrl": ${JSON.stringify(show.trailerUrl)},`);
  lines.push(`    "overview": ${JSON.stringify(show.overview)},`);
  lines.push(`    "overviewKurdish": ${JSON.stringify(show.overviewKurdish)},`);
  lines.push(`    "director": ${JSON.stringify(show.director)},`);
  lines.push('    "cast": [');
  show.cast.forEach((c, i) => {
    lines.push(`      ${JSON.stringify(c)}${i < show.cast.length - 1 ? ',' : ''}`);
  });
  lines.push('    ],');
  lines.push(`    "trending": ${show.trending},`);
  lines.push(`    "featured": ${show.featured},`);
  lines.push(`    "is4k": ${show.is4k},`);
  lines.push('    "seasons": [');
  show.seasons.forEach((season, sIdx) => {
    lines.push('      {');
    lines.push(`        "season": ${season.season},`);
    lines.push('        "episodes": [');
    season.episodes.forEach((ep, eIdx) => {
      const epStr = `          { "episode": ${ep.episode}, "title": ${JSON.stringify(ep.title)}, "airDate": ${JSON.stringify(ep.airDate)}, "rating": ${ep.rating} }${eIdx < season.episodes.length - 1 ? ',' : ''}`;
      lines.push(epStr);
    });
    lines.push('        ]');
    lines.push(`      }${sIdx < show.seasons.length - 1 ? ',' : ''}`);
  });
  lines.push('    ]');
  lines.push('  },');
  return lines.join('\n');
}

const formatted = formatShow(raw);
fs.writeFileSync('scratch/formatted_gl.txt', formatted, 'utf8');
console.log('Formatted snippet generated!');
console.log(formatted.slice(0, 400));
console.log('...');
console.log(formatted.slice(formatted.length - 300));

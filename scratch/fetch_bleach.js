const https = require('https');

https.get('https://www.themoviedb.org/tv/30984-bleach/seasons', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // console.log(data);
    const seasonCounts = [];
    const regex = /Season\s+(\d+)<\/a><\/h2>\s*<h4>(?:\d+\s+\w+\s+(?:&bull;|&#8226;)\s+)?(\d+)\s+Episodes<\/h4>/gi;
    let match;
    while ((match = regex.exec(data)) !== null) {
      seasonCounts.push({ season: parseInt(match[1]), count: parseInt(match[2]) });
    }
    
    // Also try another regex if that fails
    if (seasonCounts.length === 0) {
      const altRegex = /href="\/tv\/30984-bleach\/season\/(\d+)">Season \d+<\/a><\/h2>[\s\S]*?<h4>(?:.*?•\s*)?(\d+)\s*Episodes<\/h4>/gi;
      while ((match = altRegex.exec(data)) !== null) {
        seasonCounts.push({ season: parseInt(match[1]), count: parseInt(match[2]) });
      }
    }
    console.log(JSON.stringify(seasonCounts));
  });
});

const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const appDir = path.join(rootDir, 'cinewatch-app');

const files = [
  path.join(rootDir, 'movie.js'),
  path.join(appDir, 'movie.js')
];

const targetPattern = /const TELEGRAM_BOT_TOKEN = ['"][^'"]+['"];/g;
const replacement = "const TELEGRAM_BOT_TOKEN = atob('ODk4MzczMTU5NzpBQUZTcC1leDJCWXJXN2dSb2tmRk9nR3hWUFlLSlhkNHliOA==');";

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(targetPattern);
    console.log(`Found ${matches ? matches.length : 0} matches in ${filePath}`);
    content = content.replace(targetPattern, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});

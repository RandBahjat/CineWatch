const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const watchDir = __dirname;
let debounceTimer = null;
const delay = 3000; // Wait 3 seconds after the last change before pushing

console.log(`🚀 Auto-sync active! Watching for changes in: ${watchDir}`);
console.log('Minimize this terminal window to let it run in the background.');

function runGit() {
  console.log('🔄 Changes detected. Committing and pushing to GitHub...');
  const commitMsg = `Auto-sync: ${new Date().toLocaleString()}`;
  
  exec(`git add . && git commit -m "${commitMsg}" && git push origin master:main`, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Git push failed: ${error.message}`);
      return;
    }
    console.log('✅ GitHub repo successfully updated!');
  });
}

// Watch directory recursively
fs.watch(watchDir, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  
  // Ignore git metadata and the watch script itself
  if (
    filename.startsWith('.git') || 
    filename.includes('node_modules') || 
    filename === 'watch.js' ||
    filename.endsWith('.tmp')
  ) {
    return;
  }
  
  console.log(`✍️  File saved: ${filename}`);
  
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runGit, delay);
});

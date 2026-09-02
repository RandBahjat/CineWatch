const asar = require('./cinewatch-app/node_modules/@electron/asar');
const path = require('path');
const fs = require('fs');

const appDir = 'C:\\Users\\Click IT\\AppData\\Local\\Programs\\cinewatch-app\\resources';
const asarPath = path.join(appDir, 'app.asar');
const tempDir = path.join(appDir, 'temp_app');

async function run() {
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir);
  asar.extractAll(asarPath, tempDir);

  let html = fs.readFileSync(path.join(tempDir, 'index.html'), 'utf8');
  console.log('Had query params in index.html:', html.includes('?v='));
  
  html = html.replace(/\?v=[^"'\s>]+/g, '');
  fs.writeFileSync(path.join(tempDir, 'index.html'), html, 'utf8');

  if (!fs.existsSync(path.join(appDir, 'app.asar.bak'))) {
    fs.copyFileSync(asarPath, path.join(appDir, 'app.asar.bak'));
  }

  await asar.createPackage(tempDir, asarPath);
  console.log('Repacked app.asar successfully!');
  fs.rmSync(tempDir, { recursive: true, force: true });
}

run().catch(console.error);

const asar = require('./cinewatch-app/node_modules/@electron/asar');
const path = require('path');
const fs = require('fs');

const resourcesDir = 'C:\\Users\\Click IT\\AppData\\Local\\Programs\\cinewatch-app\\resources';
const appDir = path.join(resourcesDir, 'app');

if (!fs.existsSync(appDir)) {
  const asarSource = fs.existsSync(path.join(resourcesDir, 'app.asar.bak')) 
    ? path.join(resourcesDir, 'app.asar.bak') 
    : path.join(resourcesDir, 'app.asar');
  asar.extractAll(asarSource, appDir);
  console.log('Extracted app.asar to resources/app');
}

if (fs.existsSync(path.join(resourcesDir, 'app.asar'))) {
  fs.renameSync(path.join(resourcesDir, 'app.asar'), path.join(resourcesDir, 'app.asar.disabled'));
}

let mainJs = fs.readFileSync(path.join(appDir, 'main.js'), 'utf8');
const logFile = path.join(resourcesDir, 'debug.log').replace(/\\/g, '/');

if (!mainJs.includes('debug.log')) {
  const header = `
const fs = require('fs');
const debugLog = '${logFile}';
fs.writeFileSync(debugLog, 'STARTING ELECTRON\\n');
process.on('uncaughtException', (err) => {
  fs.appendFileSync(debugLog, '[UNCAUGHT EXCEPTION] ' + err.stack + '\\n');
});
process.on('unhandledRejection', (err) => {
  fs.appendFileSync(debugLog, '[UNHANDLED REJECTION] ' + (err && err.stack ? err.stack : err) + '\\n');
});
`;
  mainJs = header + mainJs;

  mainJs = mainJs.replace(
    "mainWindow.loadFile(path.join(__dirname, 'index.html'));",
    `
  mainWindow.webContents.on('console-message', (e, level, msg, line, src) => {
    fs.appendFileSync(debugLog, '[RENDERER ' + level + '] ' + msg + ' (' + src + ':' + line + ')\\n');
  });
  mainWindow.webContents.on('did-fail-load', (e, code, desc, url) => {
    fs.appendFileSync(debugLog, '[FAIL LOAD ' + code + '] ' + desc + ' (' + url + ')\\n');
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
    `
  );

  mainJs = mainJs.replace(
    "autoUpdater.checkForUpdates();",
    `
  autoUpdater.on('error', (err) => {
    fs.appendFileSync(debugLog, '[UPDATER ERROR] ' + err.message + '\\n');
  });
  try {
    autoUpdater.checkForUpdates();
  } catch(e) {
    fs.appendFileSync(debugLog, '[UPDATER CATCH] ' + e.message + '\\n');
  }
    `
  );

  fs.writeFileSync(path.join(appDir, 'main.js'), mainJs);
  console.log('Hooked logging into main.js');
}

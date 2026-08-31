const { app, BrowserWindow, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 420,
    minHeight: 640,
    backgroundColor: '#06070a',
    title: 'CineWatch App',
    icon: path.join(__dirname, 'icon.ico'),
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  // Window control IPC listeners
  ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });
  ipcMain.on('window-maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) mainWindow.unmaximize();
      else mainWindow.maximize();
    }
  });
  ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close();
  });

  // Handle fullscreen toggle via IPC or F11 (optional, HTML5 fullscreen works automatically)

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  
  // Disable automatic downloading — the user must choose to update
  autoUpdater.autoDownload = false;

  // Check for updates shortly after startup
  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 2000);
});

// Auto Updater Events
autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
    type: 'question',
    buttons: ['Download Update', 'Cancel'],
    defaultId: 0,
    title: 'Update Available',
    message: `A new version of CineWatch (v${info.version}) is available. Would you like to download it now?`
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'question',
    buttons: ['Install and Relaunch', 'Later'],
    defaultId: 0,
    title: 'Update Ready',
    message: 'The new update has been downloaded. Restart the application to apply the updates.'
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

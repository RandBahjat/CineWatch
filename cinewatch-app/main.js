const { app, BrowserWindow, shell, dialog, ipcMain, session } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

// Enable high-performance hardware acceleration & GPU rasterization for smooth 60+ FPS
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('enable-accelerated-video-decode');
app.commandLine.appendSwitch('enable-accelerated-2d-canvas');
app.commandLine.appendSwitch('disable-gpu-process-crash-limit');

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
  ipcMain.on('window-minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
    if (win) win.minimize();
  });
  let lastMaxTime = 0;
  ipcMain.on('window-maximize', (event) => {
    const now = Date.now();
    if (now - lastMaxTime < 250) return; // Debounce duplicate event triggers
    lastMaxTime = now;

    const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
    if (win) {
      if (win.isMaximized() || win.isFullScreen()) {
        if (win.isFullScreen()) win.setFullScreen(false);
        win.unmaximize();
      } else {
        win.maximize();
      }
    }
  });
  ipcMain.on('window-close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
    if (win) win.close();
  });
  ipcMain.on('window-toggle-fullscreen', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
    if (win) {
      win.setFullScreen(!win.isFullScreen());
    }
  });

  mainWindow.on('maximize', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window-state-changed', { isMaximized: true });
    }
  });
  mainWindow.on('unmaximize', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window-state-changed', { isMaximized: false });
    }
  });
  mainWindow.on('enter-full-screen', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window-state-changed', { isMaximized: true });
    }
  });
  mainWindow.on('leave-full-screen', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window-state-changed', { isMaximized: mainWindow.isMaximized() });
    }
  });

  // Enable F12 and Ctrl+Shift+I to toggle DevTools
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' || (input.control && input.shift && input.key.toLowerCase() === 'i')) {
      mainWindow.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

  // Strip any query strings on local file:// URLs so asar archive lookup never fails with ERR_FILE_NOT_FOUND
  mainWindow.webContents.session.webRequest.onBeforeRequest((details, callback) => {
    if (details.url.startsWith('file://') && details.url.includes('?')) {
      const cleanUrl = details.url.split('?')[0];
      return callback({ redirectURL: cleanUrl });
    }
    callback({});
  });

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

// Global exception guards to prevent unexpected app termination
process.on('uncaughtException', (err) => {
  console.error('CineWatch Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('CineWatch Unhandled Rejection:', reason);
});

app.whenReady().then(async () => {
  try {
    if (session && session.defaultSession) {
      await session.defaultSession.clearStorageData({
        storages: ['serviceworkers', 'cachestorage']
      });
    }
  } catch (e) {}

  createWindow();
  
  // Disable automatic downloading — the user must choose to update
  autoUpdater.autoDownload = false;

  // Safe update check with error handler to prevent crashing
  autoUpdater.on('error', (err) => {
    console.log('Update check error (safe ignored):', err ? err.message : err);
  });

  setTimeout(() => {
    try {
      autoUpdater.checkForUpdates().catch(() => {});
    } catch (e) {}
  }, 3000);
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

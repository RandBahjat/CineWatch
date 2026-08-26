const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: path.join(__dirname, 'icon.png'),
    autoHideMenuBar: true, // Hides the top menu bar for a native app feel
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the live website
  win.loadURL('https://cinewatch.watch');

  // Remove the default application menu
  Menu.setApplicationMenu(null);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

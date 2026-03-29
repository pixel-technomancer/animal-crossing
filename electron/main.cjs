const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 480,
    minHeight: 600,
    title: "Pixel's Guide",
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    backgroundColor: '#FFF8E7',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  // Open external links in default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadURL('https://pixel-technomancer.github.io/animal-crossing/');

    // Fall back to bundled files if offline
    win.webContents.on('did-fail-load', () => {
      const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
      if (fs.existsSync(indexPath)) {
        win.loadFile(indexPath);
      }
    });
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

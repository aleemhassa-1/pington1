const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    resizable: false, // Prevents resizing so your game canvas layout does not warp
    webPreferences: {
      nodeIntegration: false, 
      contextIsolation: true
    }
  });

  win.setMenuBarVisibility(false); // Gives your game a clean, arcade look
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
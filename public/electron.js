const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const fs = require('fs');
const crypto = require('crypto');


function getFingerprint(certificate, inputEncoding = "utf8", outputEncoding="base64", hash="sha1") {
  const content =  certificate.toString().split("\n").filter(line => !line.includes("-----"))
          .map(line => line.trim() )
          .join("");
  const shasum = crypto.createHash(hash);
  shasum.update(content, inputEncoding);

  return shasum.digest(outputEncoding);
};

ipcMain.on('send-file-name', (event, args) => {
  //execute tasks on behalf of renderer process 
  const body = JSON.parse(args);
  const key = fs.readFileSync(body.key, 'utf8');
  const cert = fs.readFileSync(body.cert, 'utf8');
  const fingerprint = getFingerprint(cert, 'base64', 'hex', 'sha1');

  event.reply('get-file-content', JSON.stringify({key: key, cert: cert, fingerprint: fingerprint}))
})

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule:true,
      contextIsolation: false
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
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
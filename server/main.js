const {ipcMain } = require('electron');
const fs = require('fs');
const {getFingerprint} = require('./utility/crypto');

ipcMain.on('send-file-name', (event, args) => {
  //execute tasks on behalf of renderer process 
  const body = JSON.parse(args);
  const key = fs.readFileSync(body.key, 'utf8');
  const cert = fs.readFileSync(body.cert, 'utf8');
  const fingerprint = getFingerprint(cert, 'base64', 'hex', 'sha1');

  event.reply('get-file-content', JSON.stringify({key: key, cert: cert, fingerprint: fingerprint}))
})
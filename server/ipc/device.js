const {ipcMain } = require('electron');
const fs = require('fs');
const {getFingerprint} = require('./utility/crypto');
const {
  CONNECTED,
  CONNECTION_ON_FAIL,
  CONNECTION_ON_SUCCESS,
  CONNECT,
  DISCONNECTION_ON_SUCCESS,
  DISCONNECTION_ON_FAIL,
  DISCONNECT,
  DISCONNECTED,
  CERT_ADDED,
  CERT_ACTIVATED,
  CERT_NOT_ACTIVATED,
  REBOOTING,
  READY_TO_CONNECT,
  GET_FINGERPRINT,
  GET_FINGERPRINT_ON_SUCCESS,
  GET_FINGERPRINT_ON_FAIL,
  ADD_CER_KEY,
  ADD_CERT_KEY_ON_SUCCESS,
  ADD_CERT_KEY_ON_FAIL,
  ACTIVATE_CERT,
  ACTIVATE_CERT_ON_SUCCESS,
  ACTIVATE_CERT_ON_FAIL,
  GET_STATUS,
  LIST_CERTS,
  INIT
} = require('../constants');
const {Device} = require('../xapi'); 
const DEVICES = {};

ipcMain.on('send-file-name', (event, args) => {
  //execute tasks on behalf of renderer process 
  const body = JSON.parse(args);
  const key = fs.readFileSync(body.key, 'utf8');
  const cert = fs.readFileSync(body.cert, 'utf8');
  const fingerprint = getFingerprint(cert, 'base64', 'hex', 'sha1');

  event.reply('get-file-content', JSON.stringify({key: key, cert: cert, fingerprint: fingerprint}))
});

ipcMain.on(INIT, (event, args) => {
  const body = JSON.parse(args);

  DEVICES[body.address] = new Device(body.address, body.username, body.password, body.keyPath, body.certPath);
});

ipcMain.on(CONNECT, (event, args) => {
  const {address, username, password} = JSON.parse(args);


});
import {
  ACTIVATE_CERT, 
  ACTIVATE_CERT_ON_FAIL, 
  ACTIVATE_CERT_ON_SUCCESS,
  CONNECT,
  CONNECTION_ON_FAIL,
  CONNECTION_ON_SUCCESS, 
  CONNECTED,
  DISCONNECT,
  DISCONNECTION_ON_SUCCESS,
  DISCONNECTION_ON_FAIL, 
  GET_FINGERPRINT,
  GET_FINGERPRINT_ON_SUCCESS,
  GET_FINGERPRINT_ON_FAIL,
  GET_STATUS,
  ADD_CERT_KEY,
  ADD_CERT_KEY_ON_SUCCESS,
  ADD_CERT_KEY_ON_FAIL,
  LIST_CERTS,
  DISCONNECTED, 
  CERT_ADDED, 
  CERT_ACTIVATED, 
  CERT_NOT_ACTIVATED, 
  REBOOTING, 
  READY_TO_CONNECT,
  INIT } from '../constants';
const { ipcRenderer } = window.require("electron");

export default class ClientIPCDevice {
  constructor(address, username, password, keyPath, certPath) {
    ipcRenderer.send(INIT, JSON.stringify({address, username, password, keyPath, certPath}));
    this.address= address;
    this.username = username;
    this.password = password;
    this.keyPath = keyPath;
    this.certPath = certPath;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      ipcRenderer.on(CONNECTION_ON_SUCCESS,resolve);
      ipcRenderer.on(CONNECTION_ON_FAIL, reject);

      ipcRenderer.send(CONNECT, JSON.stringify({address: this.address, username: this.username, password: this.password}));
    });
  }

  async getFingerPrint() {
    return new Promise((resolve, reject) => {
      ipcRenderer.on(GET_FINGERPRINT_ON_SUCCESS, resolve);
      ipcRenderer.on(GET_FINGERPRINT_ON_FAIL, reject);

      ipcRenderer.send(GET_FINGERPRINT, JSON.stringify({certPath: this.certPath, keyPath: this.keyPath}));
    });
  }

  subscribeToStatus(callback) {
    ipcRenderer.on(GET_STATUS, callback);
  }

  addCertKey(onSuccessCallback, onFailCallback) {
    ipcRenderer.on(ADD_CERT_KEY_ON_SUCCESS, onSuccessCallback);
    ipcRenderer.on(ADD_CERT_KEY_ON_FAIL, onFailCallback);

    ipcRenderer.send(ADD_CERT_KEY, JSON.stringify({key: this.keyPath, cert: this.certPath}));
  }

  async listServices(callback) {
    return new Promise((resolve, reject) => {
      ipcRenderer.on(LIST_CERTS)
      ipcRenderer.send(LIST_CERTS);
    })
  }

  async activateCert(purpose) {
    return new Promise((resolve, reject) => {
      ipcRenderer.on(ACTIVATE_CERT_ON_SUCCESS, resolve);
      ipcRenderer.on(ACTIVATE_CERT_ON_FAIL, reject);

      ipcRenderer.send(ACTIVATE_CERT)
    })
  }

  async disconnect() {
    return new Promise((resolve, reject) => {
      ipcRenderer.on(DISCONNECTION_ON_SUCCESS, resolve);
      ipcRenderer.on(DISCONNECTION_ON_FAIL, reject);

      ipcRenderer.send(DISCONNECT, JSON.stringify({address: this.address, username: this.username, password: this.password}));
    })
  }
}
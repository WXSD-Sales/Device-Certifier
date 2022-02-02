import * as CONST from '../constants';
const { ipcRenderer } = require("electron");


  export const activateCertsOnDevices = (devices, cb) => {
    // ipcRenderer.on(CONST.CONNECTION_ON_SUCCESS, cb);
    ipcRenderer.on(CONST.CONNECTION_ON_FAIL, cb);
    // ipcRenderer.on(CONST.ADD_CERT_KEY_ON_SUCCESS, cb);
    ipcRenderer.on(CONST.ADD_CERT_KEY_ON_FAIL, cb);
    // ipcRenderer.on(CONST.ACTIVATE_CERT_ON_SUCCESS, cb);
    ipcRenderer.on(CONST.ACTIVATE_CERT_ON_FAIL, cb);
    ipcRenderer.on(CONST.REBOOTING, cb);
    ipcRenderer.on(CONST.REBOOTED, cb);
    ipcRenderer.on(CONST.JOBS_START, cb);
    ipcRenderer.on(CONST.JOBS_END, cb);
    ipcRenderer.on(CONST.DISCONNECTION_ON_SUCCESS, cb);
    ipcRenderer.on(CONST.DISCONNECTION_ON_FAIL, cb);

    ipcRenderer.send(CONST.ACTIVATE_CERTS, JSON.stringify({devices}))  
  }

  export const abortJobs = (cb) => {
    ipcRenderer.on(CONST.ABORT_JOBS_ON_SUCCESS, cb)
    ipcRenderer.send(CONST.ABORT_JOBS);
  }


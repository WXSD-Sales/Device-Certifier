import * as CONST from '../constants';

  export const activateCertsOnDevices = (devices, cb) => {
    // receive(CONST.CONNECTION_ON_SUCCESS, cb);
    window.electron.receive(CONST.CONNECTION_ON_FAIL, cb);
    // window.electron.receive(CONST.ADD_CERT_KEY_ON_SUCCESS, cb);
    window.electron.receive(CONST.ADD_CERT_KEY_ON_FAIL, cb);
    // window.electron.receive(CONST.ACTIVATE_CERT_ON_SUCCESS, cb);
    window.electron.receive(CONST.ACTIVATE_CERT_ON_FAIL, cb);
    window.electron.receive(CONST.REBOOTING, cb);
    window.electron.receive(CONST.REBOOTED, cb);
    window.electron.receive(CONST.JOBS_START, cb);
    window.electron.receive(CONST.JOBS_END, cb);
    window.electron.receive(CONST.DISCONNECTION_ON_SUCCESS, cb);
    window.electron.receive(CONST.DISCONNECTION_ON_FAIL, cb);

    window.electron.send(CONST.ACTIVATE_CERTS, JSON.stringify({devices}))  
  }

  export const abortJobs = (cb) => {
    window.electron.receive(CONST.ABORT_JOBS_ON_SUCCESS, cb)
    window.electron.send(CONST.ABORT_JOBS);
  }


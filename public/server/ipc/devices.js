const {ipcMain } = require('electron');
const CONST = require('../constants');
const { fork } = require("child_process");
const qjobs = require('qjobs');
const path = require('path');

const MAX_NUM_PROCESSES = 5;
const queue = new qjobs({maxConcurrency: MAX_NUM_PROCESSES});

const runTheQueue = (devices, cb) => {
  const keys = Object.keys(devices);

  const activateCertJob = function(args,next) {
    const child = fork(path.join(__dirname, '../deviceAgent.js'), [JSON.stringify(args[0])]);
    // const child = fork(path.join(__dirname, ''), [JSON.stringify(args[0])]);

    child.on('message', (data) => {
      const {status, deviceID} = data;

      if(status === CONST.REBOOTED || status === CONST.CONNECTION_ON_FAIL) {
        child.kill();
        next();
      }

      cb(status, {status, deviceID});
    });
  };

  for(const key of keys) {
    queue.add(activateCertJob, [devices[key]]);
  }

  queue.on('start',function() {cb(CONST.JOBS_START, {status: CONST.JOBS_START})});
  queue.on('end',function() {cb(CONST.JOBS_END, {status: CONST.JOBS_END})});
  queue.on('jobStart',function(args) {});
  queue.on('jobEnd',function(args) {});

  queue.run();
}

ipcMain.on(CONST.ACTIVATE_CERTS, async (event, args) => {
  const body = JSON.parse(args);
  const {devices} = body;

  runTheQueue(devices, event.reply);
});

ipcMain.on(CONST.ABORT_JOBS, (event, args) => {
  if(queue.jobsDone) {
    queue.abort();
    event.reply(CONST.ABORT_JOB_ON_SUCCESS);
  }
});

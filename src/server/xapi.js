const jsxapi = require('jsxapi');
const fs = require('fs');
const {getFingerprint} = require('./utility/crypto');

class Device {
  constructor(address, username, password, key, cert, purposes) {
    this.address= address;
    this.username = username;
    this.password = password;
    this.key = key;
    this.cert = cert;
    this.status = 'inactive';
    this.fingerprint = null;
    this.isConnected = false;
    this.purposes = purposes;
    this.api = null;
    this.isRebooting = false;
  }

  connect(callback) {
    jsxapi.connect(`wssaå://${this.address}`, {
      username: this.username,
      password: this.password
    })
    .on('error', (error) => {
      this.isConnected = false;

      if(error === "WebSocket closed unexpectedly") {
        callback();
      }
    }).on('ready', (xapi) => {
      this.api = xapi;
      this.isConnected = true;
      callback();
    })
  }

  addCertAndKey() {
    return new Promise(async (resolve, reject) => {
      try{
        const keyFile = fs.readFileSync(this.key, 'utf8');
        const certFile = fs.readFileSync(this.cert, 'utf8');
        
        await this.api.Command.Security.Certificates.Services.Add(`${certFile}${keyFile}`);
        this.fingerprint = getFingerprint(certFile, 'base64', 'hex', 'sha1');
        resolve();
      } catch(e) {
        console.error(e)
      }
    });
  } 
  
  activateCert() {
    return new Promise(async (resolve, reject) => {
      try {
        for(const purpose of this.purposes) {
          await this.api.Command.Security.Certificates.Services.Activate(
            { Fingerprint: this.fingerprint, purpose: purpose });
            resolve();
        }
      } catch (e) {
        console.error(e)
      }
    });
  }

  reboot() {
    return new Promise(async(resolve, reject) => {
      try {
        await this.api.Command.SystemUnit.Boot();
        this.isRebooting = true;
        resolve();
      } catch(e) {
        console.error(e)
      }
    })
  }

  disconnect() {
    this.api.close();
    this.isConnected = false;
  }
}

module.exports = {
  Device
};
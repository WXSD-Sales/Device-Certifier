
const { ipcRenderer } = window.require("electron");

export default class Device {
  constructor(address, username, password, keyPath, certPath) {
    this.address= address;
    this.username = username;
    this.password = password;
    this.keyPath = keyPath;
    this.certPath = certPath;
    this.status = 'inactive';
    this.fingerprint = null;
    this.isConnected = false;
    this.purposes = [];
    this.api = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      window.jsxapi.connect(`ssh://${this.address}`, {
        username: this.username,
        password: this.password
      })
      .on('error', (error) => {
        this.isConnected = false;
        reject(error);
      })
      .on('ready', (xapi) => {
        this.api = xapi;
        this.isConnected = true;
        resolve();
      })
    });
  }

  getCredentials(callback) {
    ipcRenderer.on('get-file-content', callback);

    ipcRenderer.send('send-file-name', JSON.stringify({key: this.keyPath, cert: this.certPath}));
  }

  async addCertAndKey() {
    return new Promise((resolve, reject) => {
      this.getCredentials(async (event, args) => {
        const {key, cert, fingerprint} = JSON.parse(args);
        try {
          await this.api.Command.Security.Certificates.Services.Add(`${cert}${key}`);
          this.fingerprint = fingerprint;
          resolve();
        } catch (e) {
          reject(e)
        }
      });
    });
  } 
  
  async listServices() {
    return this.api.Command.Security.Certificates.Services.Show();
  }

  async enableCert(purpose) {
    try {
      this.api.Command.Security.Certificates.Services.Activate(
        { Fingerprint: this.fingerprint, Purpose: purpose });
    } catch (e) {
      console.log(e)
    }
  }
}
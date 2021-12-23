
const { ipcRenderer } = window.require("electron");


export default class xAPI {
  constructor(address, username, password, keyPath, certPath) {
    this.address= address;
    this.username = username;
    this.password = password;
    this.keyPath = keyPath;
    this.certPath = certPath;
    this.api = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      window.jsxapi.connect(`ws://${this.address}`, {
        username: this.username,
        password: this.password
      })
      .on('error', reject)
      .on('ready', (xapi) => {
        this.api = xapi;

        resolve();
      })
    });
  }

  getCredentials(callback) {
    ipcRenderer.on('get-file-content', callback);

    ipcRenderer.send('send-file-name', JSON.stringify({key: this.keyPath, cert: this.certPath}));
  }

  async addCertAndKey() {
    this.getCredentials(async (event, args) => {
      const {key, cert} = JSON.parse(args);

      return this.api.Command.Security.Certificates.Services.Add(`${cert}${key}`);
    });
  } 
  
  async listServices() {
    return this.api.Command.Security.Certificates.Services.Show();
  }

  async disconnect() {}
}
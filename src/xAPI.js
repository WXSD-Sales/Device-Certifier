
const {
  contextBridge,
  ipcRenderer
} = require("electron");
export default class xAPI {
  constructor(address, username, password) {
    this.address= address;
    this.username = username;
    this.password = password;
  }

  connect() {
    const x = `ws://${this.address}`;
    console.log(x)
    window.jsxapi.connect(`ws://${this.address}`, {
      username: this.username,
      password: this.password
    })
    .on('error', console.error)
    .on('ready', async (xapi) => {
      console.log(xapi);
      try {

        const reader = new FileReader();
        reader.onload = (event) => {

        }
        // const privateKey = fs.readFileSync('/Users/akoushke/key.pem');
        // const certificate = fs.readFileSync('/Users/akoushke/certificate.pem');
        // console.log(privateKey, certificate)
        // const key = await reader.getText('/Users/akoushke/key.pem');
        // const cert = await reader.getText('/Users/akoushke/certificate.pem');

        // console.log(key, cert);
        await xapi.Command.Security.Certificates.Services.Add();
      } catch(error) {
        console.log(error);
      }
    })
  }

  async disconnect() {}
}
const {Device} = require('./xapi');
const CONST = require('./constants');
const ping = require('ping');

const main = async (endpoint) => {
  const device = new Device(endpoint.address, endpoint.username, endpoint.password, endpoint.key, endpoint.cert, endpoint.purposes);
  console.info('Created Device Object successfully', JSON.stringify(device));
  
  try {
    device.connect(async () => {
      if(device.isConnected) {
        process.send({status: CONST.CONNECTION_ON_SUCCESS, deviceID: device.address});
        console.info(`Connected to the device ${device.address}`);

        await device.addCertAndKey();
        process.send({status: CONST.ADD_CERT_KEY_ON_SUCCESS, deviceID: device.address});
        console.info(`Added cert and key successfully to the device ${device.address}, ${device.key}, ${device.cert}`);
        
        await device.activateCert();
        process.send({status: CONST.ACTIVATE_CERT_ON_SUCCESS, deviceID: device.address});
        console.info(`Activated cert successfully for  ${device.address}`);
        
        await device.reboot();
        process.send({status: CONST.REBOOTING, deviceID: device.address});
        console.info(`Requested to reboot the device ${device.address} successfully`);
        
      } else if(device.isRebooting) {
        let isPingable = false;
        const intervalID = setInterval(() => {
          ping.sys.probe(device.address,async (isAlive) => {
            console.info(`${device.address} is rebooting....`);

            if(!isAlive) {
              isPingable = true;
            } else if(isAlive && isPingable) {
              clearInterval(intervalID);
              process.send({status: CONST.REBOOTED, deviceID: device.address});
              console.info(`${device.address} has finished rebooting successfully`);
            }
          });
        }, 1000);
      } else {
        process.send({status: CONST.CONNECTION_ON_FAIL, deviceID: device.address});
      }
    })
  } catch (e) {
    process.send({status: CONST.CONNECTION_ON_FAIL, deviceID: device.address});
  }
};

(async function() {
    await main(JSON.parse(process.argv[2]));
    console.info(`Run the script for endpoint ${process.argv[2]}`);
})();

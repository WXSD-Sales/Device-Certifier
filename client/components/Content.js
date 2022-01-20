import { useMemo, useState, useEffect } from 'react';
import Table, { SelectColumnFilter, StatusPill } from './Table';
import Button from './Button';
import Modal from './Modal';
import Device from './Device';
import ClientIPCDevice  from '../ipc/device';
import './Content.css';
import getData from './Data';

const Content = function () {
  const [csvFile, setCsvFile] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [purposes, setPurposes] = useState([]);
  const [showEnable, setShowEnable] = useState(false);
  const [disableConnect, setDisableConnect] = useState(false);
  const [disableShowEnable, setDisableShowEnable] = useState(false);
  const columns = useMemo(
    () => [
      {
        Header: 'Address',
        accessor: 'address',
      },
      {
        Header: 'Username',
        accessor: 'username',
      },
      {
        Header: 'Password',
        accessor: 'password',
      },
      {
        Header: 'Key File Path',
        accessor: 'keyPath',
      },
      {
        Header: 'Cert File Path',
        accessor: 'certPath',
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: StatusPill, // new
      },
    ],
    [],
  );

  useEffect(() => {
    if(!showModal) setPurposes([])

  },[showModal]);

  const data = useMemo(() => getData(), []);
  const uploadCSV = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      processCSV(text);
    };

    setCsvFile(file);
    reader.readAsText(file);
  };

  const processCSV = (str, delim = ',') => {
    let headers = str.slice(0, str.indexOf('\n')).split(delim);
    const rows = str.slice(str.indexOf('\n') + 1).split('\n');

    // Trim the last element
    headers[headers.length - 1] = headers[headers.length - 1].trim();

    // Lowercase the property keys
    headers = headers.map((header) => header.toLowerCase());

    // Array of CSV data
    const newArray = rows.map((row) => {
      const values = row.split(delim);
      const eachObject = headers.reduce((obj, header, i) => {
        obj[header] = values[i].trim();
        return obj;
      }, {});

      return new ClientIPCDevice(eachObject.address, eachObject.username, eachObject.password, eachObject.key, eachObject.cert);
    });

    setDevices(newArray);
  };

  const uploadCertsAndKeys = async () => {
    const newArray = [];
    setShowEnable(true);

    for(let device of devices) {
      try {
        await device.addCertAndKey();

        device.status = 'added';

      } catch (error) {
        device.status = 'failed'
      }
      
      newArray.push(device);
    }
    
    setDevices(newArray)
  };

  const enableCerts = async () => {
    const newDevices = [];
    setDisableShowEnable(true);

    for(let device of devices) {
      for (let purpose of purposes) {
        try {
          await device.enableCert(purpose);
          device.purposes.push(purpose);
          device.status = 'active';
        } catch(e) {
          device.status = 'failed';
          console.log(e);
        }
      };

      newDevices.push(device);
    }

    setDevices(newDevices);
  };

  const connect = async () => {
    const newArray = [];
    setDisableConnect(true);

    for(let device of devices){
      try {
        await device.connect();
        device.status = 'connected';
        newArray.push(device);
      }
      catch(e) {
        console.log(e)
      }
    };

    setDevices(newArray);
  }

  const button = showEnable ? 
                <Button
                  children="Enable Certs"
                  disabled={disableShowEnable}
                  pill="rounded-full"
                  onClick={() => {setShowModal(true)}}
              /> : <Button
                    children="Upload Certs"
                    disabled={disableShowEnable}
                    pill="rounded-full"
                    onClick={() => { uploadCertsAndKeys(); }}
               />;

  return (
    <div className="absolute z-1">
      {csvFile
        ? (
          <>
          <div className="h-[46rem] bg-gray-100 text-gray-900">
            <main className="w-[75rem] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
               <div >
                <Table columns={columns} data={devices} setSelectedRows={setSelectedRows}/>
                <Modal 
                  open={showModal} 
                  setOpen={setShowModal} 
                  selectedRows={selectedRows} 
                  enableCerts={enableCerts} 
                  purposes={purposes} 
                  setPurposes={setPurposes}
                />
              </div>
            </main>
            </div>
            <div className="flex justify-end mt-5">
              <Button
                children="Remove CSV File"
                pill="rounded-full"
                variant="danger"
                onClick={() => {setCsvFile(null); setDevices([]); setDisableConnect(false)}}
                />
              <Button
                children="Connect"
                disabled={disableConnect}
                pill="rounded-full"
                onClick={() => {connect()}}
                />
              {button}
            </div>
          </>
      ) :  
          <div className="flex justify-center">
            <div className="mb-3 w-96">
              <label htmlFor="formFile" className="form-label inline-block mb-2 text-gray-700">Choose a CSV File</label>
              <input className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding
                border border-solid border-gray-300 rounded transition ease-in-out m-0
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" 
                type="file" 
                accept=".csv"
                onChange={(event) => {
                  uploadCSV(event.target.files[0]);
                }} />
            </div>
          </div>    
      }
    </div>
  );
};

export default Content;


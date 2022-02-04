import { useMemo, useState, useEffect } from 'react';
import Table, { SelectColumnFilter, StatusPill } from './Table';
import Button from './Button';
import Modal from './Modal';
import * as CONST from '../constants';
import {activateCertsOnDevices, abortJobs}  from '../ipc/devices';
import './Content.css';
import getData from './Data';

const useColumns = () => {
  return useMemo(
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
        accessor: 'key',
      },
      {
        Header: 'Cert File Path',
        accessor: 'cert',
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: StatusPill, // new
      },
    ],
    [],
  );
};


const Content = function () {
  const [csvFile, setCsvFile] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [purposes, setPurposes] = useState([]);
  const [disableButtons, setDisableButtons] = useState(false);
  const columns = useColumns();

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

      eachObject.status = "ready";
      return eachObject;
    });

    setDevices(newArray);
  };

  const changeStatus = (event, args) => {
    const {status, deviceID} = args;

    const device = devices.filter((device) => device.address === deviceID)[0];
    const deviceIndex = devices.findIndex(device => device.address === deviceID);

    switch(status) {
      case CONST.CONNECTION_ON_SUCCESS:
        device.status = "connected";
        devices[deviceIndex] = device;
        break;
      case CONST.CONNECTION_ON_FAIL:
        device.status = "failed";
        devices[deviceIndex] = device;
        break;
      case CONST.ADD_CERT_KEY_ON_SUCCESS:
        device.status = "added";
        devices[deviceIndex] = device;
        break;
      case CONST.ADD_CERT_KEY_ON_FAIL:
        device.status = "failed";
        devices[deviceIndex] = device;
        break;
      case CONST.ACTIVATE_CERT_ON_SUCCESS:
        device.status = "activated";
        devices[deviceIndex] = device;
        break;
      case CONST.ACTIVATE_CERT_ON_FAIL:
        device.status = "inactive";
        devices[deviceIndex] = device;
        break;
      case CONST.REBOOTING:
        device.status = "rebooting";
        devices[deviceIndex] = device;
        break;
      case CONST.REBOOTED:
        device.status = "rebooted";
        devices[deviceIndex] = device;
        break;
      case CONST.DISCONNECTION_ON_SUCCESS:
        break;
      case CONST.DISCONNECTION_ON_FAIL:
        device.status = "failed";
        devices[deviceIndex] = device;
        break;
      case CONST.JOBS_START:
        setDisableButtons(true);
        break;
      case CONST.JOBS_END:
        setDisableButtons(false);
        break;
      default:
        break;
    }

    setDevices([...devices]);
  }

  const enableCerts = () => {
    setShowModal(true);
    
    if(showModal) {
      const endpoints = {};

      for(let endpoint of devices){
        endpoint.purposes = purposes;
        endpoints[endpoint.address] = endpoint;
        endpoint.status = "waiting"
      }

      setDevices([...devices])
      activateCertsOnDevices(endpoints, changeStatus);
    }
  };

  const cancelJob = () => {
    if(disableButtons) {
      abortJobs(() => {
        setDisableButtons(false);
      })
    } else {
      setCsvFile(null); 
      setDevices([]);
    }
  };

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
                disabled={disableButtons}
                pill="rounded-full"
                variant="danger"
                onClick={() => {cancelJob()}}
                />
              <Button
                  children="Activate Certs"
                  disabled={disableButtons}
                  pill="rounded-full"
                  onClick={() => { enableCerts(); }}
               />
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


import { useMemo, useState } from 'react';
import Table, { SelectColumnFilter } from './Table';
import xAPI from './xAPI';
import './Content.css';
import getData from './Data';

const Content = function () {
  const [csvFile, setCsvFile] = useState();
  const [csvArray, setCsvArray] = useState([]);

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
        accessor: 'key',
      },
      {
        Header: 'Cert File Path',
        accessor: 'cert',
      },
      // {
      //   Header: "Role",
      //   accessor: 'role',
      //   Filter: SelectColumnFilter,  // new
      //   filter: 'includes',  // new
      // },
    ],
    [],
  );

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
        obj[header] = values[i];
        return obj;
      }, {});

      return eachObject;
    });

    setCsvArray(newArray);
  };

  const uploadCertsAndKeys = () => {
    const xapi = new xAPI('192.168.254.37', 'admin', 'adminadmin');
    console.log(xapi)
    xapi.connect();
  };

  return (
    <div className="absolute z-1">
      <div>
        <input
          type="file"
          accept=".csv"
          onChange={(event) => {
            uploadCSV(event.target.files[0]);
          }}
        />
      </div>
      <div>
        <pre>
          <code>{JSON.stringify(csvFile, null, 2)}</code>
        </pre>
      </div>
      {true
        && (
        <div>
          <Table columns={columns} data={csvArray} />
          <button onClick={() => { uploadCertsAndKeys(); }} >Upload Certs </button>
        </div>
        )}
    </div>
  );
};

export default Content;

import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { server } from "../../server";
import { read, utils } from "xlsx";

const BulkImport = () => {
  const [importStatus, setImportStatus] = useState(null);
  const [importData, setImportData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [excelRows, setExcelRows] = useState([]);

  useEffect(() => {
    const fetchImportData = async () => {
      try {
        const response = await axios.get(`${server}/importData/import-data`, {
          withCredentials: true,
        });
        setImportData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching import data:", error);
        setIsLoading(false);
      }
    };

    fetchImportData();
  }, []);

  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = utils.sheet_to_json(worksheet);
        setExcelRows(json);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleImport = async (e) => {
    e.preventDefault(); // Prevent form submission
    // console.log(excelRows)
    try {
      const response = await axios.post(
        `${server}/importData/import-products`,
        excelRows,
        { withCredentials: true }
      );
      setImportStatus(response.data.message);
      window.location.reload();
    } catch (error) {
      setImportStatus("Error occurred during import.");
    }
  };

  const columns = [
    { field: "id", headerName: "Id", minWidth: 150, flex: 0.7, hide: true }, // Hide the "Id" column
    { field: "status", headerName: "Status", minWidth: 150, flex: 0.7 },
    { field: "by", headerName: "By", minWidth: 180, flex: 1.4 },
    { field: "type", headerName: "Type", minWidth: 100, flex: 0.6 },
    {
      field: "date",
      headerName: "Date",
      minWidth: 120,
      flex: 0.8,
      type: "date",
    },
    {
      field: "count",
      headerName: "Count",
      minWidth: 120,
      flex: 0.8,
      type: "number",
    },
  ];

  const row = [];

  importData &&
    importData.forEach((item) => {
      row.push({
        id: item._id,
        status: item.status,
        by: item.by,
        type: item.type,
        count: item.count,
        date: item.date,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white"> Bulk Import</span>
            </div>
          </div>
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
          {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-11/12 md:w-2/5 bg-white rounded-lg shadow-xl p-8 overflow-hidden">
                <div className="flex justify-end">
                  <RxCross1
                    size={30}
                    className="cursor-pointer text-gray-600 hover:text-gray-800"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h5 className="text-3xl font-semibold text-center mb-6 text-gray-800">
                  Bulk Import
                </h5>
                {/* Bulk Import code for import use excel file to import product data */}
                <input
                  type="file"
                  onChange={readUploadFile}
                  className="mb-6 border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleImport}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg mr-2 focus:outline-none"
                >
                  Import
                </button>
                {importStatus && (
                  <p className="text-green-500 text-sm mt-2">{importStatus}</p>
                )}
                {/* Add button to download sample file */}
                <a
                  href="/frontend/samplefile/EshopProduct.csv"
                  download="EshopProduct.csv"
                  className="text-blue-500 hover:text-blue-600 underline block mt-4 text-center"
                >
                  Download Sample File
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default BulkImport;

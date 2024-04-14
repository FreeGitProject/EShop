import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState ,useMemo} from "react";
import { useSelector } from "react-redux";
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
  const [excelRows, setExcelRows] = useState(null);
  const { seller } = useSelector((state) => state.seller);
  useEffect(() => {
    const fetchImportData = async () => {
      try {
        const response = await axios.get(
          `${server}/importData/import-data/${seller._id}`,
          {
            withCredentials: true,
          }
        );
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
        `${server}/importData/import-products/${seller._id}`,
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
                    onClick={() => {
                      setOpen(false);
                      setExcelRows(null);
                    }}
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
              <ExcelViewer excelRows={excelRows} />
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
                  href="/samplefile/EshopProduct.csv"
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
// Assuming EXCELPAGE_SIZE is the number of rows to display per page
const EXCELPAGE_SIZE = 5;

const ExcelViewer = ({ excelRows }) => {
  const [excurrentPage, setExCurrentPage] = useState(0);

  const extotalPages = Math.ceil(excelRows?.length / EXCELPAGE_SIZE);

  const paginatedRows = useMemo(() => {
    const startIndex = excurrentPage * EXCELPAGE_SIZE;
    const endIndex = startIndex + EXCELPAGE_SIZE;
    return excelRows?.slice(startIndex, endIndex);
  }, [excelRows, excurrentPage]);

  const handleNextPage = () => {
    if (excurrentPage < extotalPages - 1) {
      setExCurrentPage(excurrentPage + 1);
    }
  };

  return (
    <div className="viewer">
      {excelRows ? (
        <div className="table-responsive">
          <table className="table w-full border-collapse border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-400">S.No</th> {/* Add the S.No column here */}
                {Object.keys(paginatedRows?.[0]).map((key) => (
                  <th key={key} className="border border-gray-400">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRows?.map((individualexcelRows, index) => (
                <tr key={index}>
                  <td className="border border-gray-400">{index + 1 + (excurrentPage * EXCELPAGE_SIZE)}</td> {/* Updated index calculation */}
                  {Object.keys(individualexcelRows).map((key) => (
                    <td key={key} className="border border-gray-400">{individualexcelRows[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination controls */}
          <div>
            <button onClick={() => setExCurrentPage(excurrentPage - 1)} disabled={excurrentPage === 0}>Previous</button>
            <span> Page {excurrentPage + 1} of {extotalPages} </span>
            <button onClick={handleNextPage} disabled={excurrentPage === extotalPages - 1}>Next</button>
          </div>
        </div>
      ) : (
        <div>No File is uploaded yet!</div>
      )}
    </div>
  );
};
export default BulkImport;

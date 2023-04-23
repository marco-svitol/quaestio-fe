import React, { useState, useEffect } from "react";
import "./App.css";
import PageSelector from "./PageSelector";
import Modal from "./Modal";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

function ReactGrid({ data, error }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedInventionTitle, setSelectedInventionTitle] = useState(null);
  const [selectedInventionAbstract, setSelectedInventionAbstract] =
    useState(null);
  const [selectedOpsLink, setSelectedOpsLink] = useState(null);
  const [updatedRows, setUpdatedRows] = useState([]);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    const filteredData = data.filter((row) => row.doc_num);
    setUpdatedRows(filteredData);
  }, [data]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const openDoc = async (uid, doc_num) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://quaestio-be.azurewebsites.net/api/v1/opendoc`,
        {
          params: { uid, doc_num },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        return response.data.url;
      } else {
        console.error("Error while fetching OPS document link");
        return null;
      }
    } catch (error) {
      console.error("Error while fetching OPS document link:", error);
      return null;
    }
  };

  const handleClick = async (
    inventionTitle,
    inventionAbstract,
    opsLink,
    uid,
    docNum
  ) => {
    setSelectedInventionTitle(inventionTitle);
    setSelectedInventionAbstract(inventionAbstract);

    const updatedOpsLink = await openDoc(uid, docNum);
    setSelectedOpsLink(updatedOpsLink || opsLink);

    setShowPopUp(true);

    setUpdatedRows((prevRows) =>
      prevRows.map((row) =>
        row.doc_num === docNum ? { ...row, read_history: "read" } : row
      )
    );
  };

  const handleClose = () => {
    setShowPopUp(false);
  };

  const columns = [
    { field: "invention_title", headerName: "Titolo", width: 375 },
    { field: "doc_num", headerName: "Numero", width: 150 },
    { field: "inventor_name", headerName: "Autore", width: 200 },
    { field: "date", headerName: "Data", width: 100 },
    {
      field: "read_status",
      headerName: "Stato",
      width: 80,
      renderCell: (params) => {
        const status = params.row.read_history;
        if (status === "new") {
          return <span className="text-primary font-weight-bold">Nuovo</span>;
        } else if (status === "listed") {
          return <span className="text-warning">Non letto</span>;
        } else {
          return <span className="text-success">Letto</span>;
        }
      },
    },
  ];

  const getRowClassName = (params) => {
    const status = params.row.read_history;
    if (status === "new") {
      return "row-new";
    } else if (status === "listed") {
      return "row-listed";
    } else {
      return "row-read";
    }
  };

  return (
    <div className="results-table-grid-container">
      <div>
        <PageSelector
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
        />
      </div>
      <DataGrid
        className="main-table no-vertical-lines"
        autoHeight
        disableColumnMenu
        disableSelectionOnClick
        disableExtendRowFullWidth
        rows={updatedRows}
        columns={columns}
        getRowId={(row, index) => row.doc_num || `row-${index}`}
        pagination
        pageSize={itemsPerPage}
        page={currentPage - 1}
        onPageChange={(params) => handlePageChange(params.page + 1)}
        hideFooterPagination
        onCellClick={(params, event) => {
          handleClick(
            params.row.invention_title,
            params.row.abstract,
            params.row.ops_link,
            sessionStorage.getItem("uid"),
            params.row.doc_num
          );
        }}
        getRowClassName={getRowClassName}
      />
      {showPopUp && (
        <Modal
          selectedInventionTitle={selectedInventionTitle}
          selectedInventionAbstract={selectedInventionAbstract}
          selectedOpsLink={selectedOpsLink}
          handleClose={handleClose}
        />
      )}
    </div>
  );
}
export default ReactGrid;

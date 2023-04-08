import React, { useState } from "react";
import "./App.css";
import PageSelector from "./PageSelector";
import Modal from "./Modal";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";

function ReactGrid({ data, error }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedInventionTitle, setSelectedInventionTitle] = useState(null);
  const [selectedInventionAbstract, setSelectedInventionAbstract] =
    useState(null);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleClick = (inventionTitle, inventionAbstract) => {
    setSelectedInventionTitle(inventionTitle);
    setSelectedInventionAbstract(inventionAbstract);
    setShowPopUp(true);
  };

  const handleClose = () => {
    setShowPopUp(false);
  };

  const columns = [
    { field: "invention_title", headerName: "Titolo", width: 200 },
    { field: "doc_num", headerName: "Numero", width: 200 },
    { field: "inventor_name", headerName: "Autore", width: 200 },
    { field: "date", headerName: "Data", width: 200 },
    { field: "ops_link", headerName: "LinkOPS", width: 200 },
  ];

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
        rows={data}
        columns={columns}
        getRowId={(row) => row.doc_num}
        pagination
        pageSize={itemsPerPage}
        page={currentPage - 1}
        onPageChange={(params) => handlePageChange(params.page + 1)}
        hideFooterPagination
        onRowClick={(params) => handleClick(params.row.invention_title, params.row.abstract)}
      />
      {showPopUp && (
        <Modal
          selectedInventionTitle={selectedInventionTitle}
          selectedInventionAbstract={selectedInventionAbstract}
          handleClose={handleClose}
        />
      )}
    </div>
  );
}
export default ReactGrid;

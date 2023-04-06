import React, { useState } from "react";
import "./App.css";
import PageSelector from "./PageSelector";
import Modal from "./Modal";

function ReactGrid({ data, error }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedInventionTitle, setSelectedInventionTitle] = useState(null);
  const [selectedInventionAbstract, setSelectedInventionAbstract] =
    useState(null);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

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

  const emptyRows = itemsPerPage - currentData.length;

  return (
    <div className="results-table-grid-container">
      <table className="main-table">
        <thead className="header-cell">
          <tr>
            <th>Titolo</th>
            <th>Numero</th>
            <th>Autore</th>
            <th>Data</th>
            <th>LinkOPS</th>
          </tr>
        </thead>
        <tbody>
          {error ? (
            <tr>
              <td colSpan={5}>Error: {error}</td>
            </tr>
          ) : (
            <>
              {currentData.map((item, index) => (
                <tr className="table-cell" key={index}>
                  <td
                    style={{ wordWrap: "break-word" }}
                    onClick={() =>
                      handleClick(item.invention_title, item.abstract)
                    }
                  >
                    {item.invention_title}
                  </td>
                  <td
                    style={{ wordWrap: "break-word" }}
                    onClick={() =>
                      handleClick(item.invention_title, item.abstract)
                    }
                  >
                    {item.doc_num}
                  </td>
                  <td
                    style={{ wordWrap: "break-word" }}
                    onClick={() =>
                      handleClick(item.invention_title, item.abstract)
                    }
                  >
                    {item.inventor_name}
                  </td>
                  <td
                    style={{ wordWrap: "break-word" }}
                    onClick={() =>
                      handleClick(item.invention_title, item.abstract)
                    }
                  >
                    {item.date}
                  </td>
                  <td>
                    <a
                      style={{ wordWrap: "break-word" }}
                      href={item.ops_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.ops_link}
                    </a>
                  </td>
                </tr>
              ))}
              {emptyRows > 0 &&
                Array.from({ length: emptyRows }, (_, index) => (
                  <tr className="table-cell" key={currentData.length + index}>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                  </tr>
                ))}
            </>
          )}
        </tbody>
      </table>
      {showPopUp && (
        <Modal
          selectedInventionTitle={selectedInventionTitle}
          selectedInventionAbstract={selectedInventionAbstract}
          handleClose={handleClose}
        />
      )}
      <div>
        <PageSelector
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}
export default ReactGrid;

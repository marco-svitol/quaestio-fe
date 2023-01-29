import React from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

function PageSelector({ currentPage, totalPages, handlePageChange }) {
  const handleArrowClick = (direction) => {
    if (direction === "left" && currentPage > 1) {
      handlePageChange(currentPage - 1);
    } else if (direction === "right" && currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="page-selector-container">
      <div className="page-selector d-flex flex-column">
        <div className="arrows d-flex justify-content-between">
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="arrow"
            onClick={() => handleArrowClick("left")}
            disabled={currentPage === 1}
          />
        </div>
        <div className="numbers d-flex justify-content-between">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <div
              className={`number ${page === currentPage ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </div>
          ))}
        </div>
        <div className="arrows d-flex justify-content-between">
          <FontAwesomeIcon
            icon={faArrowRight}
            className="arrow"
            onClick={() => handleArrowClick("right")}
            disabled={currentPage === totalPages}
          />
        </div>
      </div>
    </div>
  );
}

export default PageSelector;

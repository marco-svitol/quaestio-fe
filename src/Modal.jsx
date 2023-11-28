import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { API_BASE_URL } from "./constants";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Modal = ({
  selectedInventionTitle,
  selectedInventionAbstract,
  selectedOpsLink,
  selectedImageLinks,
  handleClose,
}) => {
  const [showModal, setShowModal] = useState(true);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    const USER_ID = sessionStorage.getItem("uid");

    const firstPageClipping =
      selectedImageLinks.find((image) => image.desc === "FirstPageClipping") ||
      selectedImageLinks[0];

    if (firstPageClipping) {
      fetch(
        `${API_BASE_URL}/api/v2/firstpageClipping?uid=${USER_ID}&fpcImage=${firstPageClipping.link}&fpcImageFormat=${firstPageClipping.format}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.blob();
        })
        .then((blob) => {
          let imgURL = URL.createObjectURL(blob);
          setImageData({ url: imgURL, type: blob.type });
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedImageLinks]);

  const handleClickOutside = (event) => {
    if (event.target.className === "modal-overlay") {
      setShowModal(false);
      handleClose();
    }
  };

  return (
    <div>
      {showModal && (
        <div className="modal-overlay" onClick={handleClickOutside}>
          <div className="pop-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <h3>Abstract</h3>
              <p>{selectedInventionTitle}</p>
              <p>{selectedInventionAbstract}</p>
              <a
                href={selectedOpsLink}
                target="_blank"
                rel="noreferrer"
                className="ops-link"
              >
                Link OPS
              </a>
              <div
                className="pdf-container"
                style={{ maxWidth: "100%", maxHeight: "100%", height: "auto" }}
              >
                {imageData ? (
                  imageData.type === "application/pdf" ? (
                    <Document file={imageData.url}>
                      <Page pageNumber={1} width={400} />
                    </Document>
                  ) : (
                    <img
                      src={imageData.url}
                      alt="document"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        height: "auto",
                      }}
                    />
                  )
                ) : (
                  <img
                    src="https://via.placeholder.com/150"
                    alt="placeholder"
                  />
                )}
              </div>
            </div>

            <button
              className="modal-button"
              onClick={() => {
                setShowModal(false);
                handleClose();
              }}
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;

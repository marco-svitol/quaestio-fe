import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "./constants";

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

    if (selectedImageLinks && selectedImageLinks.length > 0) {
      fetch(
        `${API_BASE_URL}/firstpageClipping?uid=${USER_ID}&fpcImage=${selectedImageLinks[0].link}&fpcImageFormat=${selectedImageLinks[0].format}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      )
        .then((response) => {
          console.log(response.type);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.blob();
        })
        .then((images) => {
          let imgURL = images;
          setImageData(imgURL);
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
              {imageData ? (
                <img src={imageData} alt="document" />
              ) : (
                <img src="https://via.placeholder.com/150" alt="placeholder" />
              )}
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

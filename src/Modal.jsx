import React, { useState } from "react";

const Modal = ({
  selectedInventionTitle,
  selectedInventionAbstract,
  selectedOpsLink,
  handleClose,
}) => {
  const [showModal, setShowModal] = useState(true);

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

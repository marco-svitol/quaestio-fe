import React, { useState } from "react";

const Modal = ({
  selectedInventionTitle,
  selectedInventionAbstract,
  handleClose,
}) => {
  const [showModal, setShowModal] = useState(true);

  const handleClickOutside = (event) => {
    if (event.target.className === "modal-overlay") {
      setShowModal(false);
    }
  };

  return (
    <div>
      {showModal && (
        <div className="modal-overlay" onClick={handleClickOutside}>
          <div className="modal-content">
            <h3>Abstract</h3>
            <p>{selectedInventionTitle}</p>
            <p>{selectedInventionAbstract}</p>
          </div>
            <button className="modal-button" onClick={handleClose}>Chiudi</button>
        </div>
      )}
    </div>
  );
};

export default Modal;

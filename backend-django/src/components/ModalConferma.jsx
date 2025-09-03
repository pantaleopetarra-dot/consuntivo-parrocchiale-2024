// src/components/ModalConferma.jsx
import React from 'react';

const ModalConferma = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{title}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Annulla</button>
            <button className="btn btn-primary" onClick={onConfirm}>Conferma</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConferma;
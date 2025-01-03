import React from 'react';
import './Dialog.css';

const Dialog = ({ message, buttonText, onClose }) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <p>{message}</p>
        <button onClick={onClose}>{buttonText}</button>
      </div>
    </div>
  );
};

export default Dialog;

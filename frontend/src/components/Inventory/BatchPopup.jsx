import React from 'react';
import '@styles/InventoryCSS/BatchPopup.css';

const BatchPopup = ({ show, setShow, children }) => {
  if (!show) return null;

  return (
    <div className="batch-bg">
      <div className="batch-popup">
        <button className="batch-close" onClick={() => setShow(false)}>X</button>
        <div className="batch-form">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BatchPopup;
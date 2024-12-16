import React from 'react';
import '@styles/InventoryCSS/ItemPopup.css';

const ItemPopup = ({ show, setShow, children }) => {
  if (!show) return null;

  return (
    <div className="item-bg">
      <div className="item-popup">
        <button className="item-close" onClick={() => setShow(false)}>X</button>
        <div className="item-form">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ItemPopup;
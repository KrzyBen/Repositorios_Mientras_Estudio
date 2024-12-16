import React, { useState } from 'react';
import '@styles/InventoryCSS/ItemForm.css';

const ItemForm = ({ onSubmit }) => {
  const [itemType, setItemType] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    type: '',
    quantity: 1,
    expirationDate: '',
    estate: '',
  });

  const getEstateOptions = () => {
    if (newItem.type === 'comida') {
      return ['vigente', 'caducado'];
    }
    if (['utensilio', 'equipamiento', 'herramienta'].includes(newItem.type)) {
      return ['nuevo', 'usado', 'dañado'];
    }
    return [];
  };

  const handleTypeSelection = (type) => {
    setItemType(type);
    setNewItem({
      name: '',
      type,
      quantity: 1,
      expirationDate: type === 'comida' ? '' : undefined,
      estate: '',
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let updatedExpirationDate = newItem.expirationDate;

    if (newItem.type === 'comida' && newItem.expirationDate) {
      const date = new Date(newItem.expirationDate);
      date.setDate(date.getDate() + 1);
      updatedExpirationDate = date.toISOString().split('T')[0];
    }

    onSubmit({ ...newItem, expirationDate: updatedExpirationDate });
  };

  return (
    <div>
      {itemType === null ? (
        <div className="item-selection-container">
          <h1>Selecciona el tipo de ítem:</h1>
          <button onClick={() => handleTypeSelection('comida')} className="item-button">
            Comida
          </button>
          <button onClick={() => handleTypeSelection('utensilio')} className="item-button">
            Utensilio
          </button>
          <button onClick={() => handleTypeSelection('equipamiento')} className="item-button">
            Equipamiento
          </button>
          <button onClick={() => handleTypeSelection('herramienta')} className="item-button">
            Herramienta
          </button>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="item-form">
          <label className="item-label">
            Nombre del Ítem:
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="item-input"
            />
          </label>
          <label className="item-label">
            Cantidad:
            <input
              type="number"
              min="1"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: parseInt(e.target.value, 10) })
              }
              className="item-input"
            />
          </label>
          {newItem.type === 'comida' && (
            <label className="item-label">
              Fecha de Expiración:
              <input
                type="date"
                value={newItem.expirationDate}
                onChange={(e) =>
                  setNewItem({ ...newItem, expirationDate: e.target.value })
                }
                className="item-input"
              />
            </label>
          )}
          <label className="item-label">
            Estado:
            <select
              value={newItem.estate}
              onChange={(e) =>
                setNewItem({ ...newItem, estate: e.target.value })
              }
              className="item-select"
            >
              <option value="">Selecciona un estado</option>
              {getEstateOptions().map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="item-submit-button">
            Crear Ítem
          </button>
        </form>
      )}
    </div>
  );
};

export default ItemForm;
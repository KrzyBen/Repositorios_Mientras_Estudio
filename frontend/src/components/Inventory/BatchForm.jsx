import React, { useState } from 'react';

const BatchForm = ({ onSubmit }) => {
  const [newBatch, setNewBatch] = useState({
    acquisitionDate: '', // Fecha en formato crudo (YYYY-MM-DD)
    totalItems: 1,
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Convertir la fecha seleccionada a un objeto Date
    const date = new Date(newBatch.acquisitionDate);
    
    // Sumar un día a la fecha
    date.setDate(date.getDate() + 1);

    // Convertir la nueva fecha a formato YYYY-MM-DD
    const updatedDate = date.toISOString().split("T")[0];

    // Enviar la fecha ajustada al backend
    onSubmit({ ...newBatch, acquisitionDate: updatedDate });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <label>
        Fecha de Adquisición:
        <input
          type="date"
          value={newBatch.acquisitionDate}
          onChange={(e) =>
            setNewBatch({ ...newBatch, acquisitionDate: e.target.value })
          }
        />
      </label>
      <label>
        Total de Ítems:
        <input
          type="number"
          min="1"
          max="1000"
          value={newBatch.totalItems}
          onChange={(e) =>
            setNewBatch({ ...newBatch, totalItems: parseInt(e.target.value, 10) })
          }
        />
      </label>
      <button type="submit">Crear Lote</button>
    </form>
  );
};

export default BatchForm;
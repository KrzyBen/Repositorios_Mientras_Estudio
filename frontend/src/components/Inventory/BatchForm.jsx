import React, { useState, useEffect } from 'react';
import '@styles/InventoryCSS/BatchForm.css';

const BatchForm = ({ batchToEdit, onSubmit }) => {
  const [batch, setBatch] = useState({
    acquisitionDate: '',
    expirationDate: '',
    totalItems: 0,
    originPurchase: '',
    status: 'pending',
    description: '',
  });

  useEffect(() => {
    if (batchToEdit) {
      setBatch({
        acquisitionDate: batchToEdit.acquisitionDate,
        expirationDate: batchToEdit.expirationDate,
        totalItems: batchToEdit.totalItems,
        originPurchase: batchToEdit.originPurchase || '',
        status: batchToEdit.status || 'pending',
        description: batchToEdit.description || '',
      });
    }
  }, [batchToEdit]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    // Manipula la fecha de adquisición si es necesario
    const acquisitionDate = new Date(batch.acquisitionDate);
    acquisitionDate.setDate(acquisitionDate.getDate() + 1); // Ajuste si es necesario
    const updatedAcquisitionDate = acquisitionDate.toISOString().split('T')[0];
  
    // Manipula la fecha de vencimiento si es necesario (asegúrate de no restar un día)
    const expirationDate = new Date(batch.expirationDate);
    expirationDate.setDate(expirationDate.getDate() + 1); // Ajuste si es necesario
    const updatedExpirationDate = expirationDate.toISOString().split('T')[0];
  
    if (batchToEdit) {
      // Si estamos editando, enviamos el id junto con los datos
      onSubmit(batchToEdit.id, { ...batch, acquisitionDate: updatedAcquisitionDate, expirationDate: updatedExpirationDate });
    } else {
      // Si estamos creando un nuevo lote
      onSubmit({ ...batch, acquisitionDate: updatedAcquisitionDate, expirationDate: updatedExpirationDate });
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <label>
        Fecha de Adquisición:
        <input
          type="date"
          value={batch.acquisitionDate}
          onChange={(e) =>
            setBatch({ ...batch, acquisitionDate: e.target.value })
          }
        />
      </label>

      <label>
        Fecha de Expiración:
        <input
          type="date"
          value={batch.expirationDate}
          onChange={(e) =>
            setBatch({ ...batch, expirationDate: e.target.value })
          }
        />
      </label>

      <label>
        Total de Ítems:
        <input
          type="number"
          min="0"
          value={batch.totalItems}
          onChange={(e) =>
            setBatch({ ...batch, totalItems: parseInt(e.target.value, 10) })
          }
        />
      </label>

      <label>
        Origen de la Compra:
        <input
          type="text"
          maxLength="50"
          value={batch.originPurchase}
          onChange={(e) =>
            setBatch({ ...batch, originPurchase: e.target.value })
          }
        />
      </label>

      <label>
        Estado:
        <select
          value={batch.status}
          onChange={(e) =>
            setBatch({ ...batch, status: e.target.value })
          }
        >
          <option value="pending">Pendiente</option>
          <option value="in_stock">En stock</option>
          <option value="expired">Expirado</option>
          <option value="out_stock">Fuera de stock</option>
        </select>
      </label>

      <label>
        Descripción:
        <input
          type="text"
          maxLength="255"
          value={batch.description}
          onChange={(e) =>
            setBatch({ ...batch, description: e.target.value })
          }
        />
      </label>

      <button type="submit">
        {batchToEdit ? 'Actualizar Lote' : 'Crear Lote'}
      </button>
    </form>
  );
};

export default BatchForm;
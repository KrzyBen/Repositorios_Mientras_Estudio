import React, { useState, useEffect } from 'react';
import '@styles/InventoryCSS/BatchForm.css';

const BatchForm = ({ batchToEdit, onSubmit }) => {
  const [batch, setBatch] = useState({
    batchName: '',
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
        batchName: batchToEdit.batchName || '',
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
  
    if (!batch.batchName) {
      alert('El nombre del lote es obligatorio');
      return; // Evita el envío si el nombre del lote está vacío
    }
  
    // Manipula las fechas de adquisición y expiración...
    const acquisitionDate = new Date(batch.acquisitionDate);
    acquisitionDate.setDate(acquisitionDate.getDate() + 1);
    const updatedAcquisitionDate = acquisitionDate.toISOString().split('T')[0];
  
    const expirationDate = new Date(batch.expirationDate);
    expirationDate.setDate(expirationDate.getDate() + 1);
    const updatedExpirationDate = expirationDate.toISOString().split('T')[0];
  
    if (batchToEdit) {
      onSubmit(batchToEdit.id, { ...batch, acquisitionDate: updatedAcquisitionDate, expirationDate: updatedExpirationDate });
    } else {
      onSubmit({ ...batch, acquisitionDate: updatedAcquisitionDate, expirationDate: updatedExpirationDate });
    }
  };  

  return (
    <form onSubmit={handleFormSubmit}>
      <label>
        Nombre del Lote:
        <input
          type="text"
          value={batch.batchName}
          onChange={(e) => setBatch({ ...batch, batchName: e.target.value })}
        />
      </label>

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
import React from 'react';
import '@styles/InventoryCSS/BatchTable.css';

const statusLabels = {
  pending: 'Pendiente',
  in_stock: 'En stock',
  expired: 'Expirado',
  out_stock: 'Fuera de stock',
};

const BatchesTable = ({ batches, onFilterChange, filterValue, onEdit, onDelete, onCreate }) => {
  const user = JSON.parse(sessionStorage.getItem('usuario')) || null;
  const userRole = user?.rol;
  const showActions = userRole === 'administrador';

  const handleDelete = (batchId) => {
    onDelete(batchId);
  };

  return (
    <div className="batches-table-container">
      <div className="batches-table-header">
        <input
          type="text"
          value={filterValue}
          onChange={onFilterChange}
          placeholder="Filtrar por nombre o ID de lote"
          className="batches-filter-input"
        />
        {showActions && (
          <button onClick={onCreate} className="batches-create-button">
            Crear Lote
          </button>
        )}
      </div>
      <table className="batches-table">
        <thead>
          <tr>
            <th>ID del Lote</th>
            <th>Nombre del Lote</th>
            <th>Fecha de Adquisición</th>
            <th>Fecha de Expiración</th>
            <th>Total de Ítems</th>
            <th>Origen de la Compra</th>
            <th>Estado</th>
            <th>Descripción</th>
            {showActions && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {batches.length > 0 ? (
            batches.map((batch) => (
              <tr key={batch.id}>
                <td>{batch.id}</td>
                <td>{batch.batchName}</td>
                <td>{batch.acquisitionDate}</td>
                <td>{batch.expirationDate}</td>
                <td>{batch.totalItems}</td>
                <td>{batch.originPurchase}</td>
                <td>{statusLabels[batch.status] || batch.status}</td>
                <td>{batch.description}</td>
                {showActions && (
                  <td>
                    <button onClick={() => onEdit(batch)} className="batches-create-button">
                      Modificar
                    </button>
                    <button onClick={() => handleDelete(batch.id)} className="batches-create-button">
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={showActions ? '9' : '8'}>No hay lotes disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BatchesTable;
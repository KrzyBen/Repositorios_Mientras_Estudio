import React from 'react';
import '@styles/InventoryCSS/BatchTable.css'

const BatchesTable = ({
  batches,
  onFilterChange,
  filterValue,
  onEdit,
  onDelete,
  onEditItems,
  onCreate,
}) => {
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
          placeholder="Filtrar por ID de lote"
          className="batches-filter-input"
        />
        {showActions && (
          <button
            onClick={onCreate}
            className="batches-create-button"
          >
            Crear Lote
          </button>
        )}
      </div>
      <table className="batches-table">
        <thead>
          <tr>
            <th>ID del Lote</th>
            <th>Fecha de Adquisición</th>
            <th>Total de Ítems</th>
            <th>Origen de la Compra</th>
            {showActions && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {batches.length > 0 ? (
            batches.map((batch) => (
              <tr key={batch.id}>
                <td>{batch.id}</td>
                <td>{batch.acquisitionDate}</td>
                <td>{batch.totalItems}</td>
                <td>{batch.originPurchase}</td>
                {showActions && (
                  <td>
                    <button
                      onClick={() => onEdit(batch)}
                      className="batches-edit-button"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(batch.id)}
                      className="batches-delete-button"
                    >
                      🗑️
                    </button>
                    <button
                      onClick={() => onEditItems(batch.id)}
                      className="batches-items-button"
                    >
                      📜
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={showActions ? '5' : '4'}>No hay lotes disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BatchesTable;
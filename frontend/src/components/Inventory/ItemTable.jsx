import React from 'react';
import '@styles/InventoryCSS/ItemTable.css';

const ItemTable = ({
  items,
  filterValue,
  onSelectionChange,
  onEdit,
  onDelete,
  onCreate,
}) => {
  const user = JSON.parse(sessionStorage.getItem('usuario')) || null;
  const userRole = user?.rol;
  const showActions = userRole === 'administrador';

  const handleDelete = (itemId) => {
    console.log(`ID del ítem a eliminar: ${itemId}`);
    onDelete(itemId);
  };

  return (
    <div className="item-table-container">
      <div className="item-table-header">
        <input
          type="text"
          value={filterValue}
          onChange={(e) => onSelectionChange?.(e.target.value)}
          placeholder="Filtrar por ID del ítem"
          className="item-filter-input"
        />
        {showActions && (
          <button onClick={onCreate} className="item-create-button">
            Crear Ítem
          </button>
        )}
      </div>
      <table className="item-table">
        <thead>
          <tr>
            <th>ID del Ítem</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Fecha de Vencimiento</th>
            {showActions && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.type}</td>
                <td>{item.estate}</td>
                <td>{item.expirationDate}</td>
                {showActions && (
                  <td>
                    <button onClick={() => onEdit(item)} className="item-edit-button">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="item-delete-button">
                      🗑️
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={showActions ? '7' : '6'}>No hay ítems disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;

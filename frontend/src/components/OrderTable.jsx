import React from 'react';

const OrderTable = ({ orders, onEdit, onDelete, showActions }) => {
  const user = JSON.parse(sessionStorage.getItem('usuario')) || null;
  const userRole = user?.rol;

  return (
    <table className="order-table">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Producto</th>
          <th>Estado</th>
          {showActions && <th>Acciones</th>} {/* Mostrar columna de "Acciones" solo si es un administrador */}
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <tr key={order.id}>
              <td>{order.clientName}</td>
              <td>{order.product}</td>
              <td>{order.status}</td>
              {showActions && (
                <td>
                  {/* El administrador puede editar todos los pedidos, el usuario solo puede editar los suyos */}
                  <button 
                    onClick={() => onEdit(order)} 
                    className="edit-button"
                    disabled={order.clientId !== user.id && userRole !== 'administrador'} // Deshabilitar si no es el dueño de la orden
                  >
                    ✏️ {/* Emoji de lápiz */}
                  </button>

                  {/* El administrador puede eliminar todos los pedidos, el usuario solo puede eliminar los suyos */}
                  <button 
                    onClick={() => onDelete(order.id)} 
                    className="delete-button"
                    disabled={order.clientId !== user.id && userRole !== 'administrador'} // Deshabilitar si no es el dueño de la orden
                  >
                    🗑️ {/* Emoji de papelera */}
                  </button>
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={showActions ? "4" : "3"}>No hay órdenes disponibles.</td> {/* Ajustar el colspan */}
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default OrderTable;

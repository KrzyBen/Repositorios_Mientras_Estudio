import React from 'react';
import Swal from 'sweetalert2'; // Importando SweetAlert2 para la confirmación

const OrderTable = ({ orders, onEdit, onDelete, onChangeStatus }) => {
  const user = JSON.parse(sessionStorage.getItem('usuario')) || null;
  const userRole = user?.rol;

  // Verificar si el usuario tiene permiso para ver la columna de "Acciones"
  const showActions = userRole === 'administrador' || userRole === 'mesero';

  // Función para mostrar una confirmación antes de cambiar el estado de la orden
  const handleStatusChange = (order, newStatus) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Cambiar el estado a "${newStatus}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        onChangeStatus(order, newStatus); // Si confirma, cambiar el estado
        Swal.fire({
          title: `¡Orden marcada como "${newStatus}"!`,
          text: `La orden ahora está en estado: ${newStatus}.`,
          icon: 'success',
        });
      }
    });
  };

  return (
    <table className="order-table">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Producto</th>
          <th>Estado</th>
          {showActions && <th>Acciones</th>} {/* Mostrar columna de "Acciones" solo para administradores y meseros */}
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <tr key={order.id}>
              <td>{order.clientName}</td>
              <td>{order.product}</td>
              <td>
                {order.status}
                {userRole === 'cocinero' && (
                  <div>
                    <button
                      onClick={() => handleStatusChange(order, 'En Preparación')}
                      className="status-button"
                    >
                      ⏳
                    </button>
                    <button
                      onClick={() => handleStatusChange(order, 'Completado')}
                      className="status-button"
                    >
                      ✅
                    </button>
                  </div>
                )}
              </td>
              {showActions && (
                <td>
                  <button 
                    onClick={() => onEdit(order)} 
                    className="edit-button"
                    disabled={order.clientId !== user.id && userRole !== 'administrador' && userRole !== 'mesero'}
                  >
                    ✏️ {/* Emoji de lápiz */}
                  </button>

                  <button 
                    onClick={() => onDelete(order.id)} 
                    className="delete-button"
                    disabled={order.clientId !== user.id && userRole !== 'administrador' && userRole !== 'mesero'}
                  >
                    🗑️ {/* Emoji de papelera */}
                  </button>
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={showActions ? "4" : "3"}>No hay órdenes disponibles.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default OrderTable;

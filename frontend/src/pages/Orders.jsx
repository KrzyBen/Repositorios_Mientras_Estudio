import React, { useState, useEffect } from 'react';
import OrderTable from '@components/OrderTable';
import OrderForm from '@components/OrderForm';
import OrderModal from '@components/OrderModal';
import { addOrder, deleteOrder, updateOrder, getOrders } from '@services/orders.service';
import '@styles/orders.css';
import Swal from 'sweetalert2';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState('');

  const user = JSON.parse(sessionStorage.getItem('usuario')) || null;
  const userRole = user?.rol;
  const userId = user?.id;

  const fetchOrders = async () => {
    try {
      const ordersData = await getOrders();
      // Filtrar las órdenes según el rol del usuario
      if (userRole === 'administrador') {
        setOrders(ordersData); // Administradores ven todas las órdenes
      } else if (userRole === 'usuario') {
        const userOrders = ordersData.filter((order) => order.clientId === userId);
        setOrders(userOrders); // Solo las órdenes del usuario
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userRole, userId]);

  const handleAddOrder = async (orderData) => {
    try {
      const newOrderData = {
        ...orderData,
        clientId: userRole === 'administrador' ? orderData.clientId : userId,
      };
      const { data: newOrder } = await addOrder(newOrderData);
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  const handleEditOrder = async (updatedData) => {
    try {
      const { data: updatedOrder } = await updateOrder(updatedData.id, updatedData);
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
      );
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      // Confirmación con SweetAlert
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        await deleteOrder(orderId); // Llama al servicio para eliminar la orden
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId)); // Actualiza la lista de órdenes

        Swal.fire('Eliminado', 'La orden ha sido eliminada con éxito', 'success'); // Notificación de éxito
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      Swal.fire('Error', 'No se pudo eliminar la orden', 'error'); // Notificación de error
    }
  };

  return (
    <div className="main-container">
      <h1>Gestión de Órdenes</h1>

      <OrderTable
        orders={orders}
        onEdit={(order) => {
          if (userRole === 'administrador' || order.clientId === userId) {
            setSelectedOrder(order);
            setActionType('editar');
          }
        }}
        onDelete={(order) => {
          if (userRole === 'administrador' || order.clientId === userId) {
            handleDeleteOrder(order.id); // Llama directamente a la función de eliminación
          }
        }}
        showActions={userRole === 'administrador'}
      />

      <OrderForm
        orderData={selectedOrder}
        onSubmit={selectedOrder ? handleEditOrder : handleAddOrder}
      />

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleDeleteOrder(selectedOrder?.id)}
        action={actionType}
      />
    </div>
  );
};

export default Orders;

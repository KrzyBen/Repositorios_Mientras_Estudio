import React, { useState, useEffect } from 'react';
import OrderTable from '@components/OrderTable';
import OrderForm from '@components/OrderForm';
import { addOrder, deleteOrder, updateOrder, getOrders } from '@services/orders.service';
import '@styles/orders.css';
import Chatbot from '@components/Chatbot'; // Importando el Chatbot
import Swal from 'sweetalert2';  // Importando SweetAlert2

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState('');
  const [chatbotOpen, setChatbotOpen] = useState(false); // Estado para controlar el chatbot
  const user = JSON.parse(sessionStorage.getItem('usuario')) || null;
  const userRole = user?.rol;
  const userId = user?.id;

  const handleAddOrder = async (orderData) => {
    try {
      const newOrderData = {
        ...orderData,
        clientId: userRole === 'administrador' || userRole === 'mesero' ? orderData.clientId : userId,
      };
  
      const { data: newOrder } = await addOrder(newOrderData);
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };
  
  const handleEditOrder = async (updatedData) => {
    try {
      console.log(updatedData.id);
      const { data: updatedOrder } = await updateOrder(updatedData.id, updatedData);
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
      );
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };
  
  const handleDeleteOrder = async (orderId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
  
    if (result.isConfirmed) {
      console.log(orderId);
      await deleteOrder(orderId);
      setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
      Swal.fire('Eliminado', 'La orden ha sido eliminada con éxito', 'success');
    }
  };

  // Cambiar el estado de la orden (solo para cocineros)
  const handleChangeOrderStatus = async (order, newStatus) => {
    try {
      const updatedOrder = { ...order, status: newStatus };
      const { data } = await updateOrder(order.id, updatedOrder);
      setOrders((prevOrders) => prevOrders.map(o => o.id === order.id ? data : o));

      // Notificar al usuario si la orden está lista
      if (newStatus === '') {
        Swal.fire({
          title: '¡Orden lista!',
          text: 'Tu orden ya está lista para ser retirada.',
          icon: 'success',
        });
      }
    } catch (error) {
      console.error('Error al cambiar el estado de la orden:', error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getOrders();
        if (userRole === 'administrador' || userRole === 'mesero' || userRole === 'cocinero') {
          setOrders(ordersData);
        } else if (userRole === 'usuario') {
          const userOrders = ordersData.filter(order => order.clientId === userId);
          setOrders(userOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, [userRole, userId]);

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
            handleDeleteOrder(order);
          }
        }}
        onChangeStatus={handleChangeOrderStatus}
      />

      <OrderForm
        orderData={selectedOrder}
        onSubmit={selectedOrder ? handleEditOrder : handleAddOrder}
      />

      {/* Chatbot */}
      <div className="chatbot-container">
        <div className="chatbot-icon" onClick={() => setChatbotOpen((prev) => !prev)}>
          <img
            src="https://media.giphy.com/media/VTwDfhNOmMxZMm2iYf/giphy.gif"
            alt="Chatbot Icon"
            width="60"
            height="60"
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Integrar el Chatbot */}
      <Chatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
    </div>
  );
};

export default Orders;

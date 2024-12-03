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
      console.log(updatedData.id);
      const { data: updatedOrder } = await updateOrder(updatedData.id, updatedData);
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
      );
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  // Eliminación con confirmación de SweetAlert
  const handleDeleteOrder = async (orderId) => {
    // Confirmación de eliminación
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
      // Llamada al servicio para eliminar la orden
      await deleteOrder(orderId);
      setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
      Swal.fire('Eliminado', 'La orden ha sido eliminada con éxito', 'success');
    }
  };
  const toggleChatbot = () => {
    setChatbotOpen((prevState) => !prevState); // Alternar el estado del chatbot
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getOrders();
        // Filtrar las órdenes según el rol del usuario
        if (userRole === 'administrador') {
          setOrders(ordersData); // Administradores ven todas las órdenes
        } else if (userRole === 'usuario') {
          const userOrders = ordersData.filter(order => order.clientId === userId);
          setOrders(userOrders); // Solo las órdenes del usuario
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

      {/* Mostrar tabla con las órdenes filtradas por usuario */}
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
            console.log(order);
            handleDeleteOrder(order); // Llamamos directamente a la eliminación
          }
        }}
        showActions={userRole === 'administrador'}
      />

      <OrderForm
        orderData={selectedOrder}
        onSubmit={selectedOrder ? handleEditOrder : handleAddOrder}
      />

      {/* Ícono del chatbot flotante */}
      <div className="chatbot-container">
        <div className="chatbot-icon" onClick={toggleChatbot}>
          <img
            src="https://media.giphy.com/media/VTwDfhNOmMxZMm2iYf/giphy.gif"
            alt="Chatbot Icon"
            width="60"
            height="60"
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className="chatbot-bubble">
          <span></span>
        </div>
      </div>

      {/* Integrar el Chatbot */}
      <Chatbot isOpen={chatbotOpen} onClose={toggleChatbot} />
    </div>
  );
};

export default Orders;

import axios from './root.service';

// Obtener todas las órdenes
export const getOrders = async () => {
  try {
    const { data } = await axios.get('/orders/get');
    return data.data;
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    throw error;
  }
};

// Crear una nueva orden
export const addOrder = async (orderData) => {
  try {
    const response = await axios.post('/orders/create', orderData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la orden:', error);
    throw error;
  }
};

// Actualizar una orden
export const updateOrder = async (orderId, updatedData) => {
  try {
    const response = await axios.put(`/orders/${orderId}/status`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando la orden:', error);
    throw error;
  }
};

// Eliminar una orden
export const deleteOrder = async (orderId) => {
  if (!orderId) {
    console.error('ID de la orden no válido');
    return;
  }

  try {
    console.log('Eliminando orden con ID:', orderId);

    // Llamada DELETE al backend
    const response = await axios.delete(`/orders/${orderId}`);
    console.log('Orden eliminada:', response.data); // Confirmación en consola

    return response.data; // Retornar datos del backend si son necesarios
  } catch (error) {
    console.error('Error al eliminar la orden:', error.response?.data || error.message);
    throw error; // Lanzar el error para que el frontend lo maneje
  }
};

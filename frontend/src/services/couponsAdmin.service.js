import axios from './root.service.js';

export const obtenerVecinos = async () => {
  try {
    const response = await axios.get('/cupon/admin/vecinos');
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Error al obtener vecinos" };
  }
};

export const obtenerCuponesPorVecino = async (vecinoId) => {
  try {
    const response = await axios.get(`/cupon/admin/vecino/${vecinoId}/cupones`);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Error al obtener cupones del vecino" };
  }
};

export const generarCuponesAnuales = async (data) => {
  try {
    console.log("Datos para generar cupones anuales:", data);
    const response = await axios.post('/cupon/admin/generar_mensual', data);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Error al generar cupones anuales" };
  }
};

export const crearCupon = async (data) => {
  try {
    const response = await axios.post('/cupon/admin/generar', data);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Error al crear el cupón" };
  }
};

export const editarCupon = async (cuponId, data) => {
  try {
    console.log("los datos a editar:", data);
    const response = await axios.patch(`/cupon/admin/${cuponId}/patch`, data);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Error al editar el cupón" };
  }
};

export const eliminarCupon = async (cuponId) => {
  try {
    console.log("URL de eliminación:", `/cupon/admin/${cuponId}/delete`);
    const response = await axios.delete(`/cupon/admin/${cuponId}/delete`);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Error al eliminar el cupón" };
  }
};
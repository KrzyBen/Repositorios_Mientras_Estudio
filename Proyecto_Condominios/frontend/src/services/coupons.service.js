import axios from './root.service.js';

export const getCuponesVecino = async () => {
  try {
    const response = await axios.get("/cupon/vecino/lista");
    return response.data;
  } catch (error) {
    return error.response?.data || { error: 'Error al obtener los cupones' };
  }
};

export const iniciarPagoCupon = async (cuponId) => {
  try {
    const response = await axios.post(`/cupon/vecino/${cuponId}/webpay/iniciar`);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: 'Error al iniciar el pago' };
  }
};

export const descargarPdf = async (cuponId) => {
  try {
    const response = await axios.get(`/cupon/${cuponId}/pdf/download`, {
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `cupon-${cuponId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error al descargar PDF:", error);
  }
};

export const revertirPagoCupon = async (cuponId) => {
  try {
    const response = await axios.post(`/cupon/webpay/revertir/${cuponId}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Error al revertir el cupón" };
  }
};

export const comprometerPagoCupon = async (cuponId, fechaCompromiso) => {
  try {
    const response = await axios.patch(`/cupon/vecino/comprometer/${cuponId}`, {
      fechaCompromiso
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Error al comprometer el cupón" };
  }
};

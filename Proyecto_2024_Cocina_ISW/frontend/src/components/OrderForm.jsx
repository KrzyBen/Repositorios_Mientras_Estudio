import React, { useState, useEffect } from 'react';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';  // Importa las alertas

const OrderForm = ({ orderData, onSubmit }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    product: '',
    status: 'pendiente',  // Valor por defecto
  });

  const user = JSON.parse(sessionStorage.getItem('usuario')) || null;  // Obtener el usuario desde el sessionStorage
  const userRole = user?.rol;

  // Cargar los datos de la orden cuando se edite
  useEffect(() => {
    if (orderData) {
      setFormData(orderData); // Si hay datos de la orden, se cargan en el formulario
    }
  }, [orderData]);

  // Si el usuario es cocinero, no se debe mostrar el formulario
  if (userRole === 'cocinero') {
    return null; // No renderiza nada si el rol es "cocinero"
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Llamamos al método onSubmit (puede ser para crear o editar)
      await onSubmit(formData);

      // Mostrar alerta de éxito después de la creación o actualización
      showSuccessAlert('Orden Guardada', 'La orden ha sido guardada correctamente.');
    } catch (error) {
      // Mostrar alerta de error si algo falla
      console.error("Error al guardar la orden:", error);
      showErrorAlert('Error al Guardar la Orden', 'Hubo un error al guardar la orden.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nombre del Cliente</label>
      <input
        type="text"
        name="clientName"
        value={formData.clientName}
        onChange={handleChange}
        required
      />

      <label>Producto</label>
      <input
        type="text"
        name="product"
        value={formData.product}
        onChange={handleChange}
        required
      />

      {/* Mostrar el campo de estado para administradores y meseros */}
      {(userRole === 'administrador' || userRole === 'mesero') && (
        <>
          <label>Estado</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en preparación">En preparación</option>
            <option value="completado">Completado</option>
          </select>
        </>
      )}

      <button type="submit">{orderData ? 'Actualizar' : 'Crear'} Orden</button>
    </form>
  );
};

export default OrderForm;

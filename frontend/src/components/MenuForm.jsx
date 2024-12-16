import React, { useState, useEffect } from 'react';
import { createMenuItem, updateMenuItem } from '../services/menu.service';
import { showSuccessAlert, showErrorAlert } from '../helpers/sweetAlert';

const MenuForm = ({ menuItemToEdit, onSave }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');

    // Establecer los valores cuando se edite un plato
    useEffect(() => {
        if (menuItemToEdit) {
            setNombre(menuItemToEdit.nombre);
            setDescripcion(menuItemToEdit.descripcion);
            setPrecio(menuItemToEdit.precio);
        }
    }, [menuItemToEdit]);

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convertir el precio a número, permitiendo decimales
        const precioNumber = parseFloat(precio);

        // Asegurarse de que el precio es un número válido
        if (isNaN(precioNumber)) {
            alert("Por favor ingrese un precio válido.");
            return;
        }

        // Verificar que el precio esté dentro del rango aceptado por el backend
        if (precioNumber < 990 || precioNumber > 999999) {
            alert("El precio debe estar entre $990 y $999,999.");
            return;
        }

        const newMenuItem = { nombre, descripcion, precio: precioNumber };

        try {
            if (menuItemToEdit) {
                // Actualizar un plato
                await updateMenuItem(menuItemToEdit.id, newMenuItem);
                showSuccessAlert('¡Actualizado!', 'El plato ha sido actualizado con éxito.');
            } else {
                // Agregar un nuevo plato
                await createMenuItem(newMenuItem);
                showSuccessAlert('¡Agregado!', 'El plato ha sido agregado con éxito.');
            }
            
            onSave(newMenuItem); // Pasar el nuevo plato a la función de callback para actualizar la lista
            clearForm();
        } catch (error) {
            console.error('Error saving menu item:', error);
            showErrorAlert('Error', 'Hubo un problema al guardar el plato.');
        }
    };

    // Limpiar el formulario después de guardar
    const clearForm = () => {
        setNombre('');
        setDescripcion('');
        setPrecio('');
    };

    return (
        <form onSubmit={handleSubmit} className="menu-form">
            <div>
                <label>NOMBRE:</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>DESCRIPCIÓN:</label>
                <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>PRECIO:</label>
                <input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                    step="0.01"
                />
            </div>
            <button type="submit">{menuItemToEdit ? 'Actualizar' : 'Agregar'} Plato</button>
        </form>
    );
};

export default MenuForm;

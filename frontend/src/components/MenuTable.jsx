import React, { useState, useEffect } from 'react';
import { getMenuItems, deleteMenuItem } from '@services/menu.service';
import { deleteDataAlert, showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';
import Swal from 'sweetalert2';  // Importando SweetAlert2

const MenuTable = ({ onEdit, onAddOrUpdate, userRole }) => {
    const [menuItems, setMenuItems] = useState([]);

    // Cargar los elementos del menú al montar el componente
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const data = await getMenuItems();
                setMenuItems(data.data); // Asumimos que la respuesta tiene una propiedad 'data'
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };
        fetchMenu();
    }, []);

    // Manejar eliminación de un item
    const handleDelete = async (id) => {
        if (userRole !== 'administrador') {
            // Mostrar alerta si no es administrador
            Swal.fire({
                title: 'No tienes permisos',
                text: 'Solo los administradores pueden eliminar ítems del menú.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return; // Bloquea la acción de eliminar
        }

        // Muestra la alerta de confirmación antes de eliminar
        const result = await deleteDataAlert();

        if (result.isConfirmed) {
            try {
                await deleteMenuItem(id); // Eliminar ítem del backend
                setMenuItems(menuItems.filter(item => item.id !== id)); // Eliminar del estado local
                showSuccessAlert('¡Eliminado!', 'El plato ha sido eliminado con éxito.');
            } catch (error) {
                console.error('Error deleting menu item:', error);
                showErrorAlert('Error', 'Hubo un problema al eliminar el plato.');
            }
        }
    };

    // Manejar la adición o actualización de un item
    const handleAddOrUpdate = (newItem) => {
        setMenuItems((prevItems) => {
            // Si estamos actualizando, sustituimos el plato
            const existingIndex = prevItems.findIndex(item => item.id === newItem.id);
            if (existingIndex > -1) {
                prevItems[existingIndex] = newItem;
                return [...prevItems]; // Retorna la lista con el plato actualizado
            }
            // Si estamos agregando, añadimos el nuevo plato
            return [...prevItems, newItem];
        });
    };

    return (
        <div>
            <h3 className="title-table">Menú</h3>
            <table className="menu-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        {/* Renderizar columna de acciones solo si es administrador */}
                        {userRole === 'administrador' && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {menuItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.nombre}</td>
                            <td>{item.descripcion}</td>
                            <td>{item.precio}</td>
                            {/* Renderizar celda de acciones solo si es administrador */}
                            {userRole === 'administrador' && (
                                <td>
                                    {/* Emoji para Editar */}
                                    <button onClick={() => onEdit(item)}>
                                        ✏️
                                    </button>

                                    {/* Emoji para Eliminar */}
                                    <button onClick={() => handleDelete(item.id)}>
                                        🗑️
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MenuTable;

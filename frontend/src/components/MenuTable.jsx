import React, { useState, useEffect } from 'react';
import { getMenuItems, deleteMenuItem } from '@services/menu.service';
import { deleteDataAlert, showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';
import Swal from 'sweetalert2';

const MenuTable = ({ onEdit, onAddOrUpdate, userRole }) => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await getMenuItems();
                if (response && Array.isArray(response.data)) {
                    setMenuItems(response.data); // Accedemos a la propiedad data
                } else {
                    console.error('La respuesta no contiene un arreglo en la propiedad "data"', response);
                }
            } catch (error) {
                console.error('Error al obtener los elementos del menú:', error);
            }
        };

        fetchMenuItems();
    }, []);

    const handleDelete = async (id) => {
        const result = await deleteDataAlert(id);
        if (result.isConfirmed) {
            try {
                await deleteMenuItem(id);
                setMenuItems(menuItems.filter((item) => item.id !== id));
                showSuccessAlert('Elemento eliminado correctamente');
            } catch (error) {
                console.error('Error al eliminar el menú:', error);
                showErrorAlert('No se pudo eliminar el menú');
            }
        }
    };

    return (
        <div className="table-container">
            <table className="menu-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Disponibilidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {menuItems.length > 0 ? (
                        menuItems.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{item.price}</td>
                                <td>{item.isAvailable ? 'Disponible' : 'No disponible'}</td>
                                <td>
                                    <button 
                                        className="edit-btn" 
                                        onClick={() => onEdit(item)} >
                                        Editar
                                    </button>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => handleDelete(item.id)} >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay elementos en el menú.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MenuTable;
import React, { useState, useEffect } from 'react';
import MenuTable from '@components/MenuTable';
import MenuForm from '@components/MenuForm';
import MenuModal from '@components/MenuModal';
import { deleteMenuItem, getMenuItems, createMenuItem } from '../services/menu.service';
import Swal from 'sweetalert2';
import '@styles/menu.css';
import Chatbot from '@components/Chatbot';

const Menu = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuItemToEdit, setMenuItemToEdit] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [menuItemToDelete, setMenuItemToDelete] = useState(null);
    const [chatbotOpen, setChatbotOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const user = JSON.parse(sessionStorage.getItem('usuario')) || null;
    const userRole = user?.rol;

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await getMenuItems();
                setMenuItems(response);
            } catch (error) {
                console.error('Error al obtener los elementos del menú:', error);
            }
        };

        fetchMenuItems();
    }, []);

    const handleCreateMenuItem = async (menuData) => {
        if (userRole !== 'administrador' && userRole !== 'cocinero') {
            Swal.fire({
                title: 'No tienes permisos',
                text: 'Solo los administradores y cocineros pueden agregar ítems al menú.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;
        }

        try {
            const newMenuItem = await createMenuItem(menuData);
            setMenuItems([...menuItems, newMenuItem]);
        } catch (error) {
            console.error('Error al crear un elemento del menú:', error);
        }
    };

    const handleEditMenuItem = (menuItem) => {
        if (userRole !== 'administrador') {
            Swal.fire({
                title: 'No tienes permisos',
                text: 'Solo los administradores pueden editar el menú.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;
        }
        setMenuItemToEdit(menuItem);
    };

    const handleDeleteMenuItem = async () => {
        if (userRole !== 'administrador') {
            Swal.fire({
                title: 'No tienes permisos',
                text: 'Solo los administradores pueden eliminar ítems del menú.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;
        }

        if (menuItemToDelete) {
            try {
                await deleteMenuItem(menuItemToDelete.id);
                setMenuItems(menuItems.filter(item => item.id !== menuItemToDelete.id));
                setIsModalOpen(false);
                setMenuItemToDelete(null);
            } catch (error) {
                console.error('Error al eliminar el elemento del menú:', error);
            }
        }
    };

    const handleDeleteClick = (menuItem) => {
        if (userRole !== 'administrador') {
            Swal.fire({
                title: 'No tienes permisos',
                text: 'Solo los administradores pueden eliminar ítems del menú.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;
        }
        setMenuItemToDelete(menuItem);
        setIsModalOpen(true);
    };

    const toggleChatbot = () => {
        setChatbotOpen(prevState => !prevState);
    };

    const toggleFormVisibility = () => {
        setIsFormOpen(!isFormOpen);
    };

    return (
        <div className="main-container">
            {(userRole === 'administrador' || userRole === 'cocinero') && (
                <h2 className="title-table">Gestión de Menú</h2>
            )}

            {(userRole === 'administrador' || userRole === 'cocinero') && (
                <button onClick={toggleFormVisibility} className="toggle-form-btn">
                    {isFormOpen ? 'Cerrar Formulario' : 'Agregar Menú'}
                </button>
            )}

            {isFormOpen && (
                <MenuForm menuItemToEdit={menuItemToEdit} onSave={handleCreateMenuItem} />
            )}

            <MenuTable 
                menuItems={menuItems} 
                onEdit={handleEditMenuItem} 
                onDelete={handleDeleteClick} 
                userRole={userRole} 
            />
            
            <MenuModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onConfirm={handleDeleteMenuItem} 
            />

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

            <Chatbot isOpen={chatbotOpen} onClose={toggleChatbot} />
        </div>
    );
};

export default Menu;
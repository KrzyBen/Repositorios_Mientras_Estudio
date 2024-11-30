// src/services/menu.service.js
import axios from './root.service.js';

const API_URL = '/menu';  // Base URL for the menu API

export const getMenuItems = async () => {
    try {
        const response = await axios.get(`${API_URL}/get`); // Fetch menu items from backend
        return response.data;
    } catch (error) {
        console.error('Error fetching menu items:', error);
        throw error;
    }
};

export const createMenuItem = async (menuData) => {
    try {
        const response = await axios.post(`${API_URL}/create`, menuData); // Send new menu item to backend
        if (response && response.data) {
            return response.data; // Return the newly created menu item data
        } else {
            throw new Error('No valid response received from the server');
        }
    } catch (error) {
        console.error('Error creating menu item:', error);
        throw error; // Propagate error to be handled in the calling component
    }
};

export const updateMenuItem = async (id, menuData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, menuData); // Update menu item
        return response.data; // Return the updated menu item data
    } catch (error) {
        console.error('Error updating menu item:', error);
        throw error;
    }
};

export const deleteMenuItem = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`); // Delete menu item by ID
        return response.data;
    } catch (error) {
        console.error('Error deleting menu item:', error);
        throw error;
    }
};

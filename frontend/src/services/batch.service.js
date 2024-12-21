// src/services/batch.service.js
import axios from './root.service.js';

// Maneja los errores de forma más detallada
function handleError(error) {
    if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error('Respuesta del servidor:', error.response.data);
        throw new Error(`Error: ${error.response.data.message || error.response.data.error}`);
    } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error('Sin respuesta del servidor:', error.request);
        throw new Error('No se recibió respuesta del servidor.');
    } else {
        // Algo ocurrió al configurar la solicitud
        console.error('Error al configurar la solicitud:', error.message);
        throw new Error('Error al realizar la solicitud.');
    }
}

export async function getAllBatches() {
    try {
        const { data } = await axios.get('/batches/'); // Ruta para obtener todos los lotes
        return data.data;
    } catch (error) {
        handleError(error); // Usar la función de manejo de errores
    }
}

export async function getBatch(batchId) {
    try {
        const { data } = await axios.get(`/batches/${batchId}`); // Ruta para obtener un lote por ID
        return data.data;
    } catch (error) {
        handleError(error); // Usar la función de manejo de errores
    }
}

export async function createBatch(batchData) {
    try {
        const response = await axios.post('/batches/', batchData); // Ruta para crear un lote
        console.log('Lote creado con éxito:', response.data);
        return response.data;
    } catch (error) {
        handleError(error); // Usar la función de manejo de errores
    }
}

export async function updateBatch(id, batchData) {
    console.log("URL del backend:", `/batches/${id}`);
    console.log("Datos enviados al backend:", batchData);

    try {
        const response = await axios.put(`/batches/${id}`, batchData); // Ruta para actualizar un lote por ID
        console.log('Lote actualizado con éxito:', response.data);
        return response.data;
    } catch (error) {
        handleError(error); // Usar la función de manejo de errores
    }
}

export async function deleteBatch(id) {
    try {
        const response = await axios.delete(`/batches/${id}`); // Ruta para eliminar un lote por ID
        console.log('Lote eliminado con éxito:', response.data);
        return response.data;
    } catch (error) {
        handleError(error); // Usar la función de manejo de errores
    }
}
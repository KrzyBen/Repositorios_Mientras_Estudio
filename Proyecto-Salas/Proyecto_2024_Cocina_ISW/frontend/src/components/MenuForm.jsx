import React, { useState, useEffect } from 'react';
import { getAllBatches } from '@services/batch.service.js';

const MenuForm = ({ menuItemToEdit, onSave }) => {
    const [menuItem, setMenuItem] = useState(menuItemToEdit || {});
    const [batchItems, setBatchItems] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [batchQuantity, setBatchQuantity] = useState(0);
    const [batchList, setBatchList] = useState([]); // Para almacenar los lotes y sus cantidades

    useEffect(() => {
        const fetchBatchItems = async () => {
            try {
                const response = await getAllBatches();
                console.log('Lotes cargados:', response);  // Log para ver los lotes obtenidos
                setBatchItems(response);
            } catch (error) {
                console.error('Error al obtener los lotes:', error);
            }
        };
        fetchBatchItems();
    }, []);

    const handleAddBatch = () => {
        if (!selectedBatch || batchQuantity <= 0) return;

        const selectedBatchData = batchItems.find(batch => batch.id === selectedBatch);
        const newBatch = {
            id: selectedBatch,  // Usamos el ID del lote seleccionado
            name: selectedBatchData?.batchName, // Asegúrate de obtener el nombre del lote correctamente
            quantity: batchQuantity
        };

        // Añadir el lote a la lista
        setBatchList([...batchList, newBatch]);

        // Log para ver cómo queda la lista de lotes después de añadir
        console.log('Lotes añadidos al menú:', [...batchList, newBatch]);

        // Limpiar los campos después de agregar el lote
        setSelectedBatch('');
        setBatchQuantity(0);
    };

    const handleRemoveBatch = (batchId) => {
        const updatedBatchList = batchList.filter(batch => batch.id !== batchId);
        setBatchList(updatedBatchList);

        // Log para ver la lista actualizada después de eliminar un lote
        console.log('Lotes actualizados (eliminado):', updatedBatchList);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (batchList.length === 0) {
            alert("Debe añadir al menos un lote al menú.");
            return;
        }

        const formData = {
            ...menuItem,
            batchItems: batchList // Incluimos los lotes y sus cantidades
        };

        // Log para revisar los datos antes de enviarlos
        console.log('Datos a guardar:', formData);

        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Nombre</label>
                <input 
                    type="text" 
                    value={menuItem.name || ''} 
                    onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })} 
                />
            </div>
            <div className="form-group">
                <label>Descripción</label>
                <input 
                    type="text" 
                    value={menuItem.description || ''} 
                    onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })} 
                />
            </div>
            <div className="form-group">
                <label>Precio</label>
                <input 
                    type="number" 
                    value={menuItem.price || ''} 
                    onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })} 
                />
            </div>

            <div className="form-group">
                <label>Lote</label>
                <select 
                    value={selectedBatch} 
                    onChange={(e) => setSelectedBatch(e.target.value)} 
                >
                    <option value="">Seleccione un lote</option>
                    {batchItems.map((batch) => (
                        <option key={batch.id} value={batch.id}>
                            {batch.batchName} {/* Mostrar el nombre del lote */}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Cantidad del Lote</label>
                <input 
                    type="number" 
                    value={batchQuantity} 
                    onChange={(e) => setBatchQuantity(e.target.value)} 
                />
            </div>

            <button type="button" onClick={handleAddBatch}>Añadir lote</button>

            <div>
                <h4>Lotes añadidos al menú:</h4>
                <ul>
                    {batchList.map((batch, index) => (
                        <li key={index}>
                            Ingrediente lote: {batch.id}, 
                            Cantidad: {batch.quantity}
                            <button type="button" onClick={() => handleRemoveBatch(batch.id)}>
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <button type="submit">Guardar</button>
        </form>
    );
};

export default MenuForm;
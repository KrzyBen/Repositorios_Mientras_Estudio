import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// Componentes
import ItemTable from '@components/Inventory/ItemTable';
import ItemForm from '@components/Inventory/ItemForm';
import ItemFormUpt from '@components/Inventory/ItemFormUpt';
import ItemPopup from '@components/Inventory/ItemPopup';
// Hooks
import { useCreateItem } from '@hooks/inventory/items/useCreateItems';
import { useUpdateItem } from '@hooks/inventory/items/useUpdateItem';
import { useDeleteItem } from '@hooks/inventory/items/useDeleteItem';
import { useFetchBatchItems } from '@hooks/inventory/items/useFetchBatchItems';
import { useFetchBatch } from '@hooks/inventory/batch/useFetchBatch';
// Estilos
import '@styles/InventoryCSS/ItemsPage.css';

const ItemsPage = () => {
  const { batchId } = useParams();
  const [filterId, setFilterId] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState('create');
  const [itemToEdit, setItemToEdit] = useState(null);
  const [maxItems, setMaxItems] = useState(0);

  const { items, loading, fetchBatchItems } = useFetchBatchItems(batchId);
  const { handleDelete } = useDeleteItem(fetchBatchItems);
  const { handleCreate } = useCreateItem(fetchBatchItems);
  const { handleUpdate } = useUpdateItem(fetchBatchItems);
  const { batch } = useFetchBatch(batchId);

  useEffect(() => {
    if (batch) {
      setMaxItems(batch.totalItems);
    }
  }, [batch]);

  const handleCreateItem = async (item) => {
    if (items.length >= maxItems) {
      alert(`No se pueden agregar más de ${maxItems} ítems al lote.`);
      return;
    }
    try {
      await handleCreate(batchId, item);
      setShowPopup(false);
    } catch (error) {
      console.error('Error al crear el ítem:', error);
    }
  };

  const handleUpdateItem = async (id, item) => {
    try {
      if (item.type !== 'comida') {
        delete item.expirationDate;
      }
      
      console.log('Item editado:', item, " id de item ", item.id);
      await handleUpdate(batchId, id, item);
      setShowPopup(false);
    } catch (error) {
      console.error('Error al actualizar el ítem:', error);
    }
  };
  

  const handleDeleteItem = async (itemId) => {
    try {
      await handleDelete(batchId, itemId);
      setItemToEdit(null);
    } catch (error) {
      console.error('Error al eliminar el ítem:', error);
    }
  };

  return (
    <div className="items-page-container">
      <div className="items-table-container">
          <h1 className="items-title-table">Ítems del Lote {batchId}</h1>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <ItemTable
            items={items.filter((item) =>
              item.id.toString().includes(filterId)
            )}
            filterValue={filterId}
            onSelectionChange={(value) => setFilterId(value)}
            onEdit={(item) => {
              console.log('Item a editar:', item); 
              setPopupMode('update');
              setItemToEdit(item);
              setShowPopup(true);
            }}
            onDelete={handleDeleteItem}
            onCreate={() => {
              setPopupMode('create');
              setShowPopup(true);
            }}
          />
        )}
      </div>
      <ItemPopup show={showPopup} setShow={setShowPopup} className={showPopup ? 'items-show-popup' : ''}>
        {popupMode === 'create' ? (
          <ItemForm batchId={batchId} onSubmit={handleCreateItem} />
        ) : (
          <ItemFormUpt batchId={batchId} itemToEdit={itemToEdit} onSubmit={handleUpdateItem} />
        )}
      </ItemPopup>
    </div>
  );
};

export default ItemsPage;
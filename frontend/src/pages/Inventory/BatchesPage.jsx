import React, { useState } from 'react';
import BatchesTable from '@components/Inventory/BatchTable';
import BatchForm from '@components/Inventory/BatchForm';
import BatchFormUpt from '@components/Inventory/BatchFormUpt';
import BatchPopup from '@components/Inventory/BatchPopup';
import { useNavigate } from 'react-router-dom';

// Hooks
import { useFetchAllBatches } from '@hooks/inventory/batch/useFetchAllBatches';
import { useCreateBatch } from '@hooks/inventory/batch/useCreateBatch';
import { useUpdateBatch } from '@hooks/inventory/batch/useUpdateBatch';
import { useDeleteBatch } from '@hooks/inventory/batch/useDeleteBatch';
import { useFetchBatchItems } from '@hooks/inventory/items/useFetchBatchItems';
import { useDeleteItem } from '@hooks/inventory/items/useDeleteItem';

// Estilos
import '@styles/InventoryCSS/BatchPages.css';

const BatchesPage = () => {
  const navigate = useNavigate();
  const [filterId, setFilterId] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState('create');
  const [batchToEdit, setBatchToEdit] = useState(null);

  const { batches, loading, fetchBatches } = useFetchAllBatches();
  const { items, fetchBatchItems } = useFetchBatchItems(batchToEdit?.id);
  const { handleCreate } = useCreateBatch(fetchBatches);
  const { handleUpdate } = useUpdateBatch(fetchBatches, setShowPopup, setBatchToEdit);
  const { handleDelete } = useDeleteBatch(fetchBatches);
  const { handleDelete: deleteItem } = useDeleteItem(fetchBatchItems);

  const handleCreateBatch = (batch) => {
    handleCreate(batch);
    setShowPopup(false);
  };

  const handleUpdateBatch = async (id, updatedBatch) => {
    try {
      const previousTotalItems = items.length;
      const newTotalItems = updatedBatch.totalItems;

      if (newTotalItems < previousTotalItems) {
        const itemsToRemoveCount = previousTotalItems - newTotalItems;
        let removedCount = 0;
        const sortedItems = [...items].sort((a, b) => b.id - a.id);
        for (const item of sortedItems) {
          if (removedCount >= itemsToRemoveCount) break;
          await deleteItem(batchToEdit.id, item.id);
          removedCount++;
        }
      }

      await handleUpdate(id, updatedBatch);
      setShowPopup(false);
      setBatchToEdit({ ...batchToEdit, totalItems: newTotalItems });
    } catch (error) {
      console.error('Error al actualizar el lote:', error);
    }
  };

  const handleDeleteBatch = (batchId) => {
    handleDelete(batchId);
    setBatchToEdit(null);
  };  

  const handleEditItems = (batchId) => {
    navigate(`/batchesItems/${batchId}/items`);
  };

  return (
    <div className="batch-main-container">
      <div className="batch-table-container">
        <h1 className="batch-title-table">Lotes de Inventario</h1>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <BatchesTable
            batches={batches.filter((batch) =>
              batch.id.toString().includes(filterId)
            )}
            filterValue={filterId}
            onFilterChange={(e) => setFilterId(e.target.value)}
            onEdit={(batch) => {
              setPopupMode('update');
              setBatchToEdit(batch);
              setShowPopup(true);
            }}
            onDelete={handleDeleteBatch}
            onEditItems={handleEditItems}
            onCreate={() => {
              setPopupMode('create');
              setShowPopup(true);
            }}
          />
        )}
      </div>
      <BatchPopup show={showPopup} setShow={setShowPopup}>
        {popupMode === 'create' ? (
          <BatchForm onSubmit={handleCreateBatch} />
        ) : (
          <BatchFormUpt batchToEdit={batchToEdit} onSubmit={handleUpdateBatch} />
        )}
      </BatchPopup>
    </div>
  );
};

export default BatchesPage;
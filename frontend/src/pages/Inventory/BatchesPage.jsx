import React, { useState } from 'react';
import BatchesTable from '@components/Inventory/BatchTable';
import BatchForm from '@components/Inventory/BatchForm';
import BatchPopup from '@components/Inventory/BatchPopup';
// Hooks
import { useFetchAllBatches } from '@hooks/inventory/batch/useFetchAllBatches';
import { useCreateBatch } from '@hooks/inventory/batch/useCreateBatch';
import { useUpdateBatch } from '@hooks/inventory/batch/useUpdateBatch';
import { useDeleteBatch } from '@hooks/inventory/batch/useDeleteBatch';

// Estilos
import '@styles/InventoryCSS/BatchPages.css';

const BatchesPage = () => {
  const [filterId, setFilterId] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState('create');
  const [batchToEdit, setBatchToEdit] = useState(null);

  const { batches, loading, fetchBatches } = useFetchAllBatches();
  const { handleCreate } = useCreateBatch(fetchBatches);
  const { handleUpdate } = useUpdateBatch(fetchBatches, setShowPopup, setBatchToEdit);
  const { handleDelete } = useDeleteBatch(fetchBatches);

  const handleCreateBatch = (batch) => {
    handleCreate(batch);
    setShowPopup(false);
  };

  const handleUpdateBatch = async (id, updatedBatch) => {
    try {
      await handleUpdate(id, updatedBatch);
      setShowPopup(false);
      setBatchToEdit(null); // Limpiar el lote a editar
    } catch (error) {
      console.error('Error al actualizar el lote:', error);
    }
  };

  const handleDeleteBatch = (batchId) => {
    handleDelete(batchId);
    setBatchToEdit(null); // Limpiar el lote a editar después de eliminar
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
          <BatchForm batchToEdit={batchToEdit} onSubmit={handleUpdateBatch} />
        )}
      </BatchPopup>
    </div>
  );
};

export default BatchesPage;
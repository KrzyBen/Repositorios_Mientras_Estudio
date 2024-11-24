import React, { useState, useCallback } from 'react';
// Componentes
import Table from '@components/Table';
import BatchForm from '@components/Inventory/BatchForm'; // Formulario para crear
import BatchFormUpt from '@components/Inventory/BatchFormUpt'; // Formulario para actualizar
import BatchPopup from '@components/Inventory/BatchPopup';
import Search from '@components/Search';
// Hooks
import { useFetchAllBatches } from '@hooks/inventory/batch/useFetchAllBatches';
import { useCreateBatch } from '@hooks/inventory/batch/useCreateBatch';
import { useUpdateBatch } from '@hooks/inventory/batch/useUpdateBatch';
import { useDeleteBatch } from '@hooks/inventory/batch/useDeleteBatch';
// assets
import DeleteIcon from '@assets/deleteIcon.svg';
import UpdateIcon from '@assets/updateIcon.svg';
import UpdateIconDisable from '@assets/updateIconDisabled.svg';
import DeleteIconDisable from '@assets/deleteIconDisabled.svg';
// otros
import '@styles/BatchesPage.css';
import { useNavigate } from 'react-router-dom';

const BatchesPage = () => {
  const navigate = useNavigate(); // Hook para redirigir
  const [filterId, setFilterId] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState('create'); // 'create' o 'update'
  const [batchToEdit, setBatchToEdit] = useState(null);

  const { batches, loading, fetchBatches } = useFetchAllBatches();
  const { handleCreate } = useCreateBatch(fetchBatches);
  const { handleUpdate } = useUpdateBatch(fetchBatches, setShowPopup, setBatchToEdit);
  const { handleDelete } = useDeleteBatch(fetchBatches);

  const handleIdFilterChange = (e) => {
    setFilterId(e.target.value);
  };

  const handleCreateBatch = (batch) => {
    handleCreate(batch);
    setShowPopup(false);
  };

  const handleUpdateBatch = (id, batch) => {
    handleUpdate(id, batch);
    setShowPopup(false);
  };

  const handleDeleteBatch = () => {
    if (batchToEdit) {
      handleDelete(batchToEdit.id);
      setBatchToEdit(null);
    }
  };

  const handleEditItems = (batchId) => {
    navigate(`/batchesItems/${batchId}/items`);
  };


  const columns = [
    { title: 'ID del Lote', field: 'id', width: 200, responsive: 2 },
    { title: 'Fecha de Adquisición', field: 'acquisitionDate', width: 500, responsive: 2 },
    { title: 'Total de Ítems', field: 'totalItems', width: 250, responsive: 3 }
  ];

  const handleSelectionChange = useCallback((selectedRows) => {
    if (selectedRows.length > 0) {
      setBatchToEdit(selectedRows[0]);
    } else {
      setBatchToEdit(null);
    }
  }, []);

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Lotes de Inventario</h1>
          <div className="filter-actions">
            <Search
              value={filterId}
              onChange={handleIdFilterChange}
              placeholder="Filtrar por ID de lote"
              style={{ width: '150px' }}
            />
            <button
              onClick={() => {
                setPopupMode('create');
                setShowPopup(true);
              }}
              style={{ marginRight: '10px' }}
            >
              <span>Crear Lote</span>
            </button>
            <button
              onClick={() => {
                setPopupMode('update');
                setShowPopup(true);
              }}
              disabled={!batchToEdit}
              style={{ marginRight: '10px' }}
            >
              <img src={batchToEdit ? UpdateIcon : UpdateIconDisable} alt="update" />
            </button>
            <button
              onClick={handleDeleteBatch}
              disabled={!batchToEdit}
              style={{ marginRight: '10px' }}
            >
              <img src={batchToEdit ? DeleteIcon : DeleteIconDisable} alt="delete" />
            </button>
              <button
                onClick={() => handleEditItems(batchToEdit.id)}
                className="btn btn-secondary"
                style={{marginRight:'70px'}}
              >
              Editar Ítems
            </button>
          </div>
        </div>
        {loading ? <p>Cargando...</p> : null}
        <Table
          data={batches}
          columns={columns}
          filter={filterId}
          dataToFilter="id"
          onSelectionChange={handleSelectionChange}
        />
      </div>
      <BatchPopup show={showPopup} setShow={setShowPopup} className={showPopup ? 'show' : ''}>
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
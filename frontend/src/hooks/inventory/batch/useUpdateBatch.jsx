import { updateBatch } from '@services/batch.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetalert';

const useUpdateBatch = (fetchBatches, setShowPopup, setBatchToEdit) => {
  const handleUpdate = async (id, batchData) => {
    try {
      await updateBatch(id, batchData);
      fetchBatches(); // Actualizar la lista de lotes
      showSuccessAlert('Lote actualizado con éxito');
      setShowPopup(false); // Cerrar el popup
      setBatchToEdit(null); // Limpiar la selección del lote
    } catch (error) {
      console.error('Error al actualizar el lote:', error);
      showErrorAlert('Error', 'No se pudo actualizar el lote');
    }
  };

  return { handleUpdate };
};

export { useUpdateBatch };
import BatchPurchaseSchema from "../entity/batchPurchase.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Crear lote
export async function createBatchService(data) {
  try {
    const { acquisitionDate, expirationDate, totalItems, originPurchase, status, description } = data;

    if (!acquisitionDate || !expirationDate || !originPurchase || !status) {
      return [null, "Todos los campos obligatorios deben estar presentes."];
    }
  

    if (totalItems <= 0 || totalItems > 50) {
      return [null, "La cantidad total de ítems debe estar entre 1 y 50."];
    }

    if (new Date(expirationDate) <= new Date(acquisitionDate)) {
      return [null, "La fecha de vencimiento debe ser posterior a la fecha de adquisición."];
    }

    const batchRepository = AppDataSource.getRepository(BatchPurchaseSchema);

    // Verificar el número total de lotes
    const batchCount = await batchRepository.count();
    if (batchCount >= 100) {
      throw new Error("No se pueden crear más de 100 lotes.");
    }

    const newBatch = batchRepository.create({
      acquisitionDate,
      expirationDate,
      totalItems,
      originPurchase,
      status,
      description,
    });

    const savedBatch = await batchRepository.save(newBatch);
    return [savedBatch, null];
  } catch (error) {
    return [null, error.message];
  }
}

// Obtener todos los lotes
export async function getAllBatchesService() {
  try {
    const batchRepository = AppDataSource.getRepository(BatchPurchaseSchema);
    const batches = await batchRepository.find();
    return [batches, null];
  } catch (error) {
    return [null, error.message];
  }
}

// Obtener un lote por su ID
export async function getBatchService(id) {
  try {
    const batchRepository = AppDataSource.getRepository(BatchPurchaseSchema);
    const batch = await batchRepository.findOneBy({ id });

    if (!batch) throw new Error("Lote no encontrado");

    return [batch, null];
  } catch (error) {
    return [null, error.message];
  }
}

// Actualizar un lote
export async function updateBatchService(id, batchData) {
  try {
    const batchRepository = AppDataSource.getRepository(BatchPurchaseSchema);

    // Buscar el lote por ID
    const batch = await batchRepository.findOneBy({ id });
    if (!batch) throw new Error("Lote no encontrado");

    const {
      acquisitionDate = batch.acquisitionDate,
      expirationDate = batch.expirationDate,
      totalItems = batch.totalItems,
      originPurchase = batch.originPurchase,
      status = batch.status,
      description = batch.description,
    } = batchData;

    if (new Date(expirationDate) <= new Date(acquisitionDate)) {
      throw new Error("La fecha de vencimiento debe ser posterior a la fecha de adquisición.");
    }

    // Actualizar las propiedades
    Object.assign(batch, {
      acquisitionDate,
      expirationDate,
      totalItems,
      originPurchase,
      status,
      description,
    });

    const updatedBatch = await batchRepository.save(batch);
    return [updatedBatch, null];
  } catch (error) {
    return [null, error.message];
  }
}

// Eliminar un lote
export async function deleteBatchService(id) {
  try {
    const batchRepository = AppDataSource.getRepository(BatchPurchaseSchema);

    const batch = await batchRepository.findOneBy({ id });
    if (!batch) throw new Error("Lote no encontrado");

    const result = await batchRepository.remove(batch);
    return [result, null];
  } catch (error) {
    return [null, error.message];
  }
}
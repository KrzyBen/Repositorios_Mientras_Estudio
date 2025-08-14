"use strict";
import Menu from "../entity/menu.entity.js";
import MenuBatchItemSchema from "../entity/menuBatchItem.entity.js";
import PurchaseBatchSchema from "../entity/batchPurchase.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Crear ítem de menú
// createMenuItemService
export async function createMenuItemService(menuData) {
  try {
    const menuRepository = AppDataSource.getRepository(Menu);
    const batchRepository = AppDataSource.getRepository(PurchaseBatchSchema);
    const menuBatchItemRepository = AppDataSource.getRepository(MenuBatchItemSchema);

    const menu = menuRepository.create({
      name: menuData.name,
      description: menuData.description,
      price: menuData.price,
      status: "disponible",
    });
    await menuRepository.save(menu);

    for (const batchItem of menuData.batchItems) {
      const batch = await batchRepository.findOne({ where: { id: batchItem.batchId } });
      if (!batch) throw new Error(`El lote con ID ${batchItem.batchId} no existe.`);

      const menuBatchItem = menuBatchItemRepository.create({
        menu,
        batchItem: batch,
        quantity: batchItem.quantity,
      });
      await menuBatchItemRepository.save(menuBatchItem);
    }

    return [menu, null];
  } catch (error) {
    console.error("Error al crear el menú:", error.message);
    return [null, error.message];
  }
}

// Obtener todos los ítems de menú
export async function getAllMenuItemsService() {
  try {
    const menuRepository = AppDataSource.getRepository(Menu);
    const menus = await menuRepository.find({
      relations: ["menuBatchItems", "menuBatchItems.batchItem"], // Asegúrate de incluir ambas relaciones
    });

    return [menus, null];
  } catch (error) {
    console.error("Error al obtener los menús:", error.message);
    return [null, "Error interno del servidor"];
  }
}

// Obtener un menú por ID
export async function getMenuItemService(id) {
  try {
    const menuRepository = AppDataSource.getRepository(Menu);
    const menuItem = await menuRepository.findOne({
      where: { id },
      relations: ["batchItems"],
    });

    if (!menuItem) return [null, "Menú no encontrado"];
    return [menuItem, null];
  } catch (error) {
    console.error("Error al obtener el menú:", error.message);
    return [null, "Error interno del servidor"];
  }
}

// Actualizar un menú
export async function updateMenuItemService(id, updatedData) {
  try {
    const menuRepository = AppDataSource.getRepository(Menu);
    let menuItem = await menuRepository.findOne({
      where: { id },
      relations: ["menuBatchItems", "menuBatchItems.batchItem"],
    });

    if (!menuItem) return [null, "Menú no encontrado"];

    menuItem = Object.assign(menuItem, updatedData);
    await menuRepository.save(menuItem);
    return [menuItem, null];
  } catch (error) {
    console.error("Error al actualizar el menú:", error.message);
    return [null, "Error interno del servidor"];
  }
}

// Eliminar un menú
export async function deleteMenuItemService(id) {
  try {
    const menuRepository = AppDataSource.getRepository(Menu);
    const menuItem = await menuRepository.findOne({ where: { id } });

    if (!menuItem) {
      return [null, "Menú no encontrado"];
    }

    menuItem.status = "no disponible"; // Desactivar menú
    await menuRepository.save(menuItem);
    return [menuItem, null];
  } catch (error) {
    console.error("Error al eliminar el menú:", error.message);
    return [null, "Error interno del servidor"];
  }
}
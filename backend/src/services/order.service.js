"use strict";
import Order from "../entity/order.entity.js";
import Menu from "../entity/menu.entity.js";
import MenuBatchItemSchema from "../entity/menuBatchItem.entity.js";
import PurchaseBatchSchema from "../entity/batchPurchase.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { In } from "typeorm"; // Importar In para búsquedas masivas

// createOrderService.js
export async function createOrderService(orderData) {
  const orderRepository = AppDataSource.getRepository(Order);
  const menuRepository = AppDataSource.getRepository(Menu);
  const menuBatchItemRepository = AppDataSource.getRepository(MenuBatchItemSchema);
  const purchaseBatchRepository = AppDataSource.getRepository(PurchaseBatchSchema);

  // Buscar el menú y validar
  const menu = await menuRepository.findOne({ 
    where: { id: orderData.menuId },
    relations: ["menuBatchItems", "menuBatchItems.batchItem"]  // Asegurarse de cargar los items de batch asociados al menú
  });
  if (!menu) throw new Error("El menú seleccionado no existe.");

  // Validar disponibilidad de inventario para los ítems del menú
  for (const menuBatchItem of menu.menuBatchItems) {
    const batchItem = menuBatchItem.batchItem;

    if (batchItem.totalItems < menuBatchItem.quantity) {
      throw new Error(`No hay suficiente cantidad en el lote ID ${batchItem.id} para el ítem ${menuBatchItem.quantity}`);
    }

    // Reducir la cantidad en el lote correspondiente
    batchItem.totalItems -= menuBatchItem.quantity;
    await purchaseBatchRepository.save(batchItem);  // Guardar el lote actualizado
  }

  // Crear la orden
  const order = orderRepository.create({ menu, status: "completada", ...orderData });
  await orderRepository.save(order);

  return [order, null];
}

export async function cancelOrderService(id) {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    const menuRepository = AppDataSource.getRepository(Menu);
    const inventoryRepository = AppDataSource.getRepository(PurchaseBatchSchema);

    // Buscar la orden con su menú y los items asociados
    const order = await orderRepository.findOne({ 
      where: { id }, 
      relations: ["menu", "menu.menuBatchItems", "menu.menuBatchItems.batchItem"] // Cargar las relaciones necesarias
    });
    if (!order) return [null, "Pedido no encontrado"];
    if (order.status !== "pendiente" && order.status !== "en preparación") {
      return [null, "El pedido no puede ser cancelado"];
    }

    // Devolver las cantidades al inventario de los batch items
    for (const menuBatchItem of order.menu.menuBatchItems) {
      const batchItem = menuBatchItem.batchItem;
      batchItem.totalItems += menuBatchItem.quantity;
      await inventoryRepository.save(batchItem);  // Guardar el lote actualizado
    }

    // Eliminar la orden
    await orderRepository.remove(order);
    return [order, null];
  } catch (error) {
    console.error("Error cancelando el pedido:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getAllOrdersService() {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    const orders = await orderRepository.find({ relations: ["menu"] });
    return orders;
  } catch (error) {
    console.error("Error obteniendo todas las órdenes:", error);
    return [];
  }
}

export async function updateOrderStatusService(id, status) {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({ where: { id }, relations: ["menu", "menu.menuBatchItems"] });

    if (!order) return [null, "Pedido no encontrado"];
    if (order.status === "completado") return [null, "El pedido ya está completado"];
    if (order.status === "en preparación" && status === "pendiente") {
      return [null, "No se puede regresar el estado a pendiente"];
    }

    // Actualizar el estado de la orden
    order.status = status;
    await orderRepository.save(order);

    return [order, null];
  } catch (error) {
    console.error("Error actualizando estado del pedido:", error);
    return [null, "Error interno del servidor"];
  }
}
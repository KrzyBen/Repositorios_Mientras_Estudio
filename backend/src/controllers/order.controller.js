"use strict";
import {
  createOrderService,
  updateOrderStatusService,
  cancelOrderService,
  getAllOrdersService,
} from "../services/order.service.js";
import { orderBodyValidation } from "../validations/order.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function createOrder(req, res) {
  try {
    const { error } = orderBodyValidation.validate(req.body);
    if (error) return handleErrorClient(res, 400, error.message);

    const [order, errorOrder] = await createOrderService(req.body);
    if (errorOrder) return handleErrorClient(res, 400, errorOrder);

    handleSuccess(res, 201, "Pedido creado exitosamente", order);
  } catch (error) {
    console.error("Error al crear pedido:", error);
    handleErrorServer(res, 500, error.message);
  }
}

export async function cancelOrder(req, res) {
  try {
    const id = req.params.id;
    const [order, errorOrder] = await cancelOrderService(id);
    if (errorOrder) return handleErrorClient(res, 400, errorOrder);

    handleSuccess(res, 200, "Pedido cancelado", order);
  } catch (error) {
    console.error("Error al cancelar pedido:", error);
    handleErrorServer(res, 500, error.message);
  }
}

export async function getAllOrders(req, res) {
  try {
    const orders = await getAllOrdersService();
    handleSuccess(res, 200, "Órdenes obtenidas exitosamente", orders);
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const [order, errorOrder] = await updateOrderStatusService(id, status);
    if (errorOrder) return handleErrorClient(res, 400, errorOrder);

    handleSuccess(res, 200, "Estado de la orden actualizado", order);
  } catch (error) {
    console.error("Error al actualizar el estado de la orden:", error);
    handleErrorServer(res, 500, error.message);
  }
}
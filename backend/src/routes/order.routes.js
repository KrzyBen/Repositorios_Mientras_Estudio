"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js"; 
import {
  createOrder,
  getOrder,
  getOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/order.controller.js";

const router = Router();

// Rutas manejo de pedidos
router
  .post("/create", createOrder) 
  .get("/get", getOrders) 
  .get("/:id", authenticateJwt, getOrder) 
  .put("/:id/status", authenticateJwt, updateOrderStatus) 
  .delete("/:id", authenticateJwt, cancelOrder); 

export default router;

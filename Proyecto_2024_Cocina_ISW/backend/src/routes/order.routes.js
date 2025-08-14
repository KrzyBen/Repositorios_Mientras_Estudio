"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js"; 
import {
  createOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = Router();

// Rutas manejo de pedidos
router
  .post("/create", createOrder)
  .get("/",getAllOrders)
  .put("/:id",updateOrderStatus) 
  .delete("/:id", authenticateJwt, cancelOrder); 

export default router;

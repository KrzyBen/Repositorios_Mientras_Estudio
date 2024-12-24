"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js"; 
import {
  createMenu,
  getMenus,
  updateMenu,
  deleteMenu,
} from "../controllers/menu.controller.js";

const router = Router();

router
  .post("/create", authenticateJwt, createMenu) // Añadir un nuevo plato pero solo admin puede crear menu
  .get("/get", getMenus) // Obtener el menú y puede ser visible para usuarios
  .put("/:id", authenticateJwt,  updateMenu) // Editar un plato existente pero solos los admins pueden hacerlo
  .delete("/:id", authenticateJwt, deleteMenu); // Eliminar un plato solo admins

export default router;

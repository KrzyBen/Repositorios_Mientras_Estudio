import express from "express";
import {
  createBatch,
  getBatches,
  getBatch,
  updateBatch,
  deleteBatch,
} from "../controllers/batch.controller.js";

import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = express.Router();

// Crear un nuevo lote
router.post("/", authenticateJwt, isAdmin, createBatch); // POST /batches

// Obtener todos los lotes
router.get("/", getBatches); // GET /batches

// Obtener un lote por su ID
router.get("/:id", getBatch); // GET /batches/:id

// Modificar un lote por su ID
router.put("/:id", authenticateJwt, isAdmin, updateBatch); // PUT /batches/:id

// Eliminar un lote por su ID
router.delete("/:id", authenticateJwt, isAdmin, deleteBatch); // DELETE /batches/:id

export default router;
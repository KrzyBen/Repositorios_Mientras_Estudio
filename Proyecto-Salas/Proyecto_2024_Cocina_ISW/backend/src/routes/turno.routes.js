import express from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { getShifts, createOrUpdateShift } from "../controllers/turno.controller.js";

const router = express.Router();

// Ruta para obtener todos los turnos
router.get("/get", authenticateJwt, getShifts);

// Ruta para crear o actualizar un turno
router.post("/createOrUpdate", authenticateJwt, createOrUpdateShift);

export default router;

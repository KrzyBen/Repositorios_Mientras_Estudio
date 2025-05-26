"use strict";
import { Router } from "express";

// Controladores generales
import {
  crearCupon,
  generarCuponesMensuales,
  listarCupones,
  actualizarCupon,
  eliminarCupon
} from "../controllers/cuponPago.controller.js";

// Controladores por rol
import {
  listarCuponesVecino,
  comprometerPago
} from "../controllers/cuponPagoVecino.controller.js";

import {
  crearCuponEncargado,
  generarAnualesEncargado,
  actualizarCuponEncargado,
  listarCuponesEncargado
} from "../controllers/cuponPagoEncargado.controller.js";

// Middlewares
import {
  isAdmin,
  isEncargadoPagos,
  isVecino
} from "../middlewares/authCuponPago.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

// ---------------------------------------------
// RUTAS PARA ROL: VECINO
// ---------------------------------------------
router.get("/vecino", authenticateJwt, isVecino, listarCuponesVecino);
router.patch("/vecino/comprometer/:cuponId", authenticateJwt, isVecino, comprometerPago);

// ---------------------------------------------
// RUTAS PARA ROL: ENCARGADO DE PAGOS
// ---------------------------------------------
router.post("/encargado/generar", authenticateJwt, isEncargadoPagos, crearCuponEncargado);
router.post("/encargado/generar-anual", authenticateJwt, isEncargadoPagos, generarAnualesEncargado);
router.patch("/encargado/:cuponId", authenticateJwt, isEncargadoPagos, actualizarCuponEncargado);
router.get("/encargado", authenticateJwt, isEncargadoPagos, listarCuponesEncargado);

// ---------------------------------------------
// RUTAS PARA ROL: ADMINISTRADOR
// ---------------------------------------------
router.post("/", authenticateJwt, isAdmin, crearCupon);
router.post("/mensuales", authenticateJwt, isAdmin, generarCuponesMensuales);
router.get("/", authenticateJwt, isAdmin, listarCupones);
router.patch("/:cuponId", authenticateJwt, isAdmin, actualizarCupon);
router.delete("/:cuponId", authenticateJwt, isAdmin, eliminarCupon);

export default router;
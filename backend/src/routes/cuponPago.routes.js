"use strict";
import { Router } from "express";

// Controladores generales
import {
  crearCupon,
  generarCuponesMensuales,
  listarCupones,
  actualizarCupon,
  eliminarCupon,
  listarVecinos,
  listarCuponesPorVecino
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
router.get("/vecino/lista", authenticateJwt, isVecino, listarCuponesVecino);
router.patch("/vecino/comprometer/:cuponId", authenticateJwt, isVecino, comprometerPago);

// ---------------------------------------------
// RUTAS PARA ROL: ENCARGADO DE PAGOS
// ---------------------------------------------
router.post("/encargado/generar", authenticateJwt, isEncargadoPagos, crearCuponEncargado);
router.post("/encargado/generar_anual", authenticateJwt, isEncargadoPagos, generarAnualesEncargado);
router.patch("/encargado/:cuponId/patch", authenticateJwt, isEncargadoPagos, actualizarCuponEncargado);
router.get("/encargado/lista", authenticateJwt, isEncargadoPagos, listarCuponesEncargado);
router.get("/encargado/vecinos", authenticateJwt, isEncargadoPagos, listarVecinos);
router.get("/encargado/vecino/:vecinoId/cupones", authenticateJwt, isEncargadoPagos, listarCuponesPorVecino);

// ---------------------------------------------
// RUTAS PARA ROL: ADMINISTRADOR
// ---------------------------------------------
router.post("/admin/generar", authenticateJwt, isAdmin, crearCupon);
router.post("/admin/generar_mensual", authenticateJwt, isAdmin, generarCuponesMensuales);
router.get("/admin/lista", authenticateJwt, isAdmin, listarCupones);
router.patch("/admin/:cuponId/patch", authenticateJwt, isAdmin, actualizarCupon);
router.delete("/admin/:cuponId/delete", authenticateJwt, isAdmin, eliminarCupon);
router.get("/admin/vecinos", authenticateJwt, isAdmin, listarVecinos);
router.get("/admin/vecino/:vecinoId/cupones", authenticateJwt, isAdmin, listarCuponesPorVecino);

export default router;
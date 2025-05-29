'use strict'
// avisos.routes.js

import express from "express";

import {
  crearAvisoVecino,
  editarAvisoVecino,
  listarAvisosPublicados,
} from "../controllers/avisos.vecinos.controller.js";

import {
  crearAvisoEncargado,
  //editarAvisoEncargado,
  ocultarAviso,
  validarApropiado,
  //aprobarAviso,
  obtenerAvisosEncargado
} from "../controllers/avisos.encargado.controller.js";

import {
  verificarPropietario,
  verificarTiempoEdicion,
  verificarRolEncargadoOAdmin,
  verificarRolAdmin,
} from "../middlewares/authAvisos.middlewares.js";

const router = express.Router();

// Vecinos
router.post("/vecino", crearAvisoVecino);
router.put("/vecino/:id", verificarPropietario, verificarTiempoEdicion, editarAvisoVecino);
router.get("/vecino", listarAvisosPublicados);

// Encargado y Administrador
router.post("/encargado", verificarRolEncargadoOAdmin, crearAvisoEncargado);
//router.put("/encargado/:id", verificarRolEncargadoOAdmin, editarAvisoEncargado);
router.patch("/encargado/ocultar/:id", verificarRolEncargadoOAdmin, ocultarAviso);
router.patch("/encargado/apropiado/:id", verificarRolEncargadoOAdmin, validarApropiado);
//router.patch("/encargado/aprobar/:id", verificarRolEncargadoOAdmin, aprobarAviso);
router.get("/encargado", verificarRolEncargadoOAdmin, obtenerAvisosEncargado);

export default router;

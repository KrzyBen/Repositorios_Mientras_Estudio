import { Router } from "express";
import * as avisoController from "../controllers/aviso.controller.js";
import { validar } from "../middlewares/authAvisos.middlewares.js";
import { actualizarAvisoSchema, crearAvisoSchema } from "../validations/avisos.validation.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

// Obtener todos los avisos con paginación opcional
router.get("/get", avisoController.obtenerAvisos);

// Obtener aviso por id
router.get("/:id", avisoController.obtenerAvisoPorId);


// Contar avisos
router.get("/count/all", avisoController.contarAvisos);

// Crear un nuevo aviso
router.post(
  "/create",
  authenticateJwt,
  validar(crearAvisoSchema),
  avisoController.crearAviso
);

// Actualizar un aviso existente
router.put(
  "/:id",
  authenticateJwt,
  validar(actualizarAvisoSchema),
  avisoController.actualizarAviso
);

// Cambiar estado de un aviso
router.patch(
  "/:id/estado",
  authenticateJwt,
  avisoController.cambiarEstadoAviso
);

// Eliminar un aviso (solo admin)
router.delete(
  "/:id",
  authenticateJwt,
  isAdmin,
  avisoController.eliminarAviso
);

export default router;

'use strict';
import express from 'express';
import {
  crear,
  editar,
  borrar,
  cambiarEstado,
  listar,
  obtener,
} from '../controllers/reclamos.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';

const router = express.Router();

// Todas las rutas usan solo autenticación; la lógica de roles se maneja en el service
router.post('/', authenticateJwt, crear);
router.put('/:id', authenticateJwt, editar);
router.delete('/:id', authenticateJwt, borrar);
router.patch('/:id/estado', authenticateJwt, cambiarEstado);
router.get('/', authenticateJwt, listar);
router.get('/:id', authenticateJwt, obtener);

export default router;



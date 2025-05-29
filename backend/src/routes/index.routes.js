'use strict';
import { Router } from 'express';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import cuponRoutes from './cuponPago.routes.js';
import reclamosRoutes from './reclamos.routes.js';
import avisosRoutes from './avisos.routes.js';

const router = Router();

router
  .use('/auth', authRoutes)
  .use('/user', userRoutes)
  .use('/cupon', cuponRoutes)
  .use('/reclamos', reclamosRoutes)
  .use('/avisos', avisosRoutes);

export default router;

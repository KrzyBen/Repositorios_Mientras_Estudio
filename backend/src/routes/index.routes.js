"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import empleadoRoutes from "./empleado.routes.js"; // Importar las rutas de empleados
import orderRoutes from "./order.routes.js"; // Importar las rutas de pedidos
import menuRoutes from "./menu.routes.js"; // Rutas de menú
import batchRoutes from "./batch.routes.js"; // Importar las rutas de lotes
import turnoRoutes from "./turno.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/empleados", empleadoRoutes) // Rutas de Jorge Martinez
    .use("/orders", orderRoutes) // Rutas de Valter Lineros
    .use("/menu", menuRoutes) //Ruta de Fernando Flores
    .use("/batches", batchRoutes) // Rutas de lotes Benjamin
    .use("/turnos", turnoRoutes);

export default router;
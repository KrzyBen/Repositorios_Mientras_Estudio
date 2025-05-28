'use strict'
// avisos.validation.js

import Joi from "joi";

export const avisoSchema = Joi.object({
  titulo: Joi.string().min(5).max(100).required(),
  descripcion: Joi.string().min(10).required(),
  tipo: Joi.string().valid("general", "emergencia", "evento").required(),
});

export const validacionApropiadoSchema = Joi.object({
  apropiado: Joi.boolean().required(),
});

export const validacionAprobadoSchema = Joi.object({
  estado: Joi.string().valid("publicado", "rechazado").required(),
});
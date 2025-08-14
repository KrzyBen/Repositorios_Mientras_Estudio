"use strict";
import Joi from "joi";

export const crearReclamoSchema = Joi.object({
  tipo: Joi.string().min(3).max(100).required(),
  observacion: Joi.string().allow('', null),
});

export const editarReclamoSchema = Joi.object({
  tipo: Joi.string().min(3).max(100).required(),
  observacion: Joi.string().allow('', null),
});

export const cambiarEstadoSchema = Joi.object({
  estado: Joi.string().valid("resuelto", "desestimado").required(),
  descripcionResolucion: Joi.string().min(5).required(),
});

export const obtenerReclamoSchema = Joi.object({
  id: Joi.number().integer().required(),
});



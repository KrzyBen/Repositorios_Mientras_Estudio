"use strict";
import Joi from "joi";

export const orderBodyValidation = Joi.object({
  clientName: Joi.string().min(3).max(100).required().messages({
    "string.empty": "El nombre del cliente es obligatorio.",
    "string.min": "El nombre del cliente debe tener al menos 3 caracteres.",
    "string.max": "El nombre del cliente debe tener como máximo 100 caracteres.",
  }),
  menuId: Joi.number().integer().positive().required().messages({
    "number.base": "El ID del menú debe ser un número.",
    "number.integer": "El ID del menú debe ser un número entero.",
    "number.positive": "El ID del menú debe ser un número positivo.",
    "any.required": "El ID del menú es obligatorio.",
  }),
  status: Joi.string().valid("pendiente", "en preparación", "completado").optional(),
});
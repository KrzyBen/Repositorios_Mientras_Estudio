"use strict";
import Joi from "joi";

export const menuValidation = Joi.object({
  nombre: Joi.string()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.pattern.base": "El nombre solo puede contener letras y espacios.",
      "string.empty": "El nombre del plato no puede estar vacío.",
      "any.required": "El nombre del plato es obligatorio.",
      "string.min": "El nombre del plato debe tener al menos 3 caracteres.",
      "string.max": "El nombre del plato debe tener como máximo 100 caracteres.",
    }),

  descripcion: Joi.string()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,]+$/)
    .min(10)
    .max(500)
    .required()
    .messages({
      "string.pattern.base": "La descripción solo puede contener letras, espacios, puntos y comas.",
      "string.empty": "La descripción no puede estar vacía.",
      "any.required": "La descripción es obligatoria.",
      "string.min": "La descripción debe tener al menos 10 caracteres.",
      "string.max": "La descripción debe tener como máximo 500 caracteres.",
    }),

  precio: Joi.number()
    .integer()
    .min(990)
    .max(999999)
    .required()
    .messages({
      "number.base": "El precio debe ser un número entero.",
      "number.min": "El precio debe ser al menos $990.",
      "number.max": "El precio no puede exceder los $999.999.",
      "any.required": "El precio es obligatorio.",
    }),
}).unknown(false);

"use strict";
import Joi from "joi";

export const menuValidation = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.pattern.base": "El nombre solo puede contener letras y espacios.",
      "string.empty": "El nombre no puede estar vacío.",
      "any.required": "El nombre es obligatorio.",
      "string.min": "El nombre debe tener al menos 3 caracteres.",
      "string.max": "El nombre debe tener como máximo 100 caracteres.",
    }),

  description: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      "string.empty": "La descripción no puede estar vacía.",
      "any.required": "La descripción es obligatoria.",
      "string.min": "La descripción debe tener al menos 10 caracteres.",
      "string.max": "La descripción debe tener como máximo 500 caracteres.",
    }),

  price: Joi.number()
    .precision(2)
    .min(990)
    .max(999999)
    .required()
    .messages({
      "number.base": "El precio debe ser un número.",
      "number.min": "El precio debe ser al menos $990.",
      "number.max": "El precio no puede exceder los $999.999.",
      "any.required": "El precio es obligatorio.",
    }),

  status: Joi.string()
    .valid('disponible', 'no disponible')
    .default('disponible') 
    .messages({
      'any.only': 'El estado debe ser "disponible" o "no disponible".',
      'string.base': 'El estado debe ser una cadena de texto.',
    }),

  batchItems: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required().messages({
          "number.base": "El ID del ítem debe ser un número.",
          "any.required": "El ID del ítem es obligatorio.",
        }),
        quantity: Joi.number().min(1).required().messages({
          "number.min": "La cantidad debe ser al menos 1.",
          "any.required": "La cantidad es obligatoria.",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "Los ítems del menú deben ser un arreglo válido.",
      "array.empty": "Debe haber al menos un ítem en el menú.",
    }),

}).unknown(false);

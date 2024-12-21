import Joi from "joi";

const today = new Date();
const twoWeeksFromNow = new Date(today);
twoWeeksFromNow.setDate(today.getDate() + 14);

export const BatchBodyValidation = Joi.object({
  acquisitionDate: Joi.date()
    .greater(today) // No permite fechas pasadas
    .less(twoWeeksFromNow) // Rango máximo de 2 semanas
    .required()
    .messages({
      "date.base": "La fecha de adquisición debe ser una fecha válida.",
      "date.greater": "La fecha de adquisición no puede ser en el pasado.",
      "date.less": "La fecha de adquisición no puede ser más de 2 semanas desde hoy.",
      "any.required": "La fecha de adquisición es obligatoria.",
    }),

  expirationDate: Joi.date()
    .greater(Joi.ref('acquisitionDate')) // La fecha de vencimiento debe ser después de la fecha de adquisición
    .required()
    .messages({
      "date.base": "La fecha de vencimiento debe ser una fecha válida.",
      "date.greater": "La fecha de vencimiento debe ser posterior a la fecha de adquisición.",
      "any.required": "La fecha de vencimiento es obligatoria.",
    }),

  totalItems: Joi.number()
    .integer()
    .min(0)
    .max(50) // Actualizado para reflejar un lote de 50 ítems
    .required()
    .messages({
      "number.base": "El número de ítems debe ser un número.",
      "number.min": "Debe haber al menos un ítem en el lote.",
      "number.max": "Debe haber un máximo de 50 ítems en el lote.",
      "any.required": "El número de ítems es obligatorio.",
    }),

  originPurchase: Joi.string()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .pattern(/^(?!.*\s{2,}).*$/)
    .min(5)
    .max(50) // Actualizado para coincidir con la entidad
    .required()
    .messages({
      "string.base": "El origen de compra debe ser un texto.",
      "string.empty": "El origen de compra no puede estar vacío.",
      "string.pattern.base": "El origen de compra solo puede contener letras, tildes, ñ y espacios simples.",
      "string.min": "El origen de compra debe tener al menos 5 caracteres.",
      "string.max": "El origen de compra no debe exceder los 50 caracteres.",
      "any.required": "El origen de compra es obligatorio.",
    }),

  status: Joi.string()
    .valid("pending", "in_stock", "expired", "out_stock")
    .default("pending")
    .required()
    .messages({
      "string.base": "El estado debe ser un texto.",
      "any.only": "El estado debe ser uno de los siguientes valores: pending, in_stock, expired, consumed.",
      "any.required": "El estado es obligatorio.",
    }),

    description: Joi.string()
    .max(255)
    .allow("") // Permite una cadena vacía
    .custom((value, helper) => {
      // Si no comienza con "Lote de ", agregarlo automáticamente
      if (!value.startsWith("Lote de ")) {
        value = "Lote de " + value;
      }

      // Validar que la descripción ahora comienza con "Lote de "
      const regex = /^Lote de [a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      if (!regex.test(value)) {
        return helper.message("La descripción debe comenzar con 'Lote de ' seguido de un nombre de producto.");
      }

      return value; // Devuelve el valor modificado (si se cambió)
    })
    .messages({
      "string.base": "La descripción debe ser un texto.",
      "string.max": "La descripción no debe exceder los 255 caracteres.",
    }),
});
import Joi from "joi";

export const crearAvisoSchema = Joi.object({
  titulo: Joi.string().min(3).max(100).required(),
  descripcion: Joi.string().min(10).required(),
  fecha: Joi.date().required(),
  tipo: Joi.string().valid("info", "alerta", "error").required(),
});

export const actualizarAvisoSchema = Joi.object({
  titulo: Joi.string().min(3).max(100),
  contenido: Joi.string().min(10),
  fecha: Joi.date(),
}).min(1); // Al menos un campo requerido para actualizar

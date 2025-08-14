import Joi from "joi";

export const ShiftBodyValidation = Joi.object({
  nombreCompleto: Joi.string().max(255).required(),
  horarioTrabajo: Joi.string().max(100).required(),
  empleadoId: Joi.number().integer().required(),
});

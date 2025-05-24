import Joi from 'joi';

export const crearCuponSchema = Joi.object({
  mes: Joi.number().integer().min(1).max(12).required(),
  año: Joi.number().integer().min(2020).max(2050).required(),
  monto: Joi.number().integer().positive().required(),
  estado: Joi.string().valid("pendiente", "pagado", "comprometido").default("pendiente"),
  tipo: Joi.string().valid("mensual", "renovación", "extraordinario").default("mensual"),
  fechaPago: Joi.date().optional().allow(null),
  fechaCompromiso: Joi.date().optional().allow(null),
  vecinoId: Joi.number().integer().required()
});
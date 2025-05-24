import Joi from 'joi';

const estadoEnum = ["pendiente", "pagado", "comprometido"];
const tipoEnum = ["mensual", "renovación", "extraordinario"];

export const crearCuponSchema = Joi.object({
  mes: Joi.number().integer().min(1).max(12).required(),
  año: Joi.number().integer().min(2020).max(2050).required(),
  monto: Joi.number().integer().min(100).max(100000).default(1000),
  montoDescuento: Joi.number().integer().default(0),
  descripcionPago: Joi.string().max(255).default("Pago de cuota Mensual"),
  estado: Joi.string().valid(...estadoEnum).default("pendiente"),
  tipo: Joi.string().valid(...tipoEnum).default("mensual"),
  fechaPago: Joi.date().optional().allow(null),
  fechaCompromiso: Joi.date().optional().allow(null),
  vecinoId: Joi.number().integer().required()
});

export const generarMensualesSchema = Joi.object({
  monto: Joi.number().integer().min(100).max(100000).default(1000),
  descripcionPago: Joi.string().max(255).default("Pago de cuota mensual"),
  fechaPago: Joi.date().optional().allow(null)
});
import Joi from 'joi';

const estadoEnum = ["pendiente", "pagado", "comprometido"];
const tipoEnum = ["mensual", "renovación", "extraordinario"];
const hoy = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

export const crearCuponSchema = Joi.object({
  mes: Joi.number().integer().min(1).max(12).required(),
  año: Joi.number().integer().min(2020).max(2050).required(),
  monto: Joi.number().integer().min(100).max(100000).default(1000),
  montoDescuento: Joi.number().integer().min(0).default(0)
    .custom((value, helpers) => {
      const { monto } = helpers.state.ancestors[0];
      if (monto !== undefined && value > monto) {
        return helpers.error("any.invalid");
      }
      return value;
    }).messages({
      "any.invalid": "El montoDescuento no puede ser mayor que el monto."
    }),
  descripcionPago: Joi.string().max(255).default("Pago de cuota Mensual"),
  estado: Joi.string().valid(...estadoEnum).default("pendiente"),
  tipo: Joi.string().valid(...tipoEnum).default("mensual"),
  fechaPago: Joi.date().min(hoy).optional().allow(null),
  fechaCompromiso: Joi.date().max(hoy).optional().allow(null)
    .messages({
      "date.max": "La fecha de compromiso no puede ser posterior a hoy."
    }),
  vecinoId: Joi.number().integer().required()
});

export const generarMensualesSchema = Joi.object({
  monto: Joi.number().integer().min(100).max(100000).default(1000),
  descripcionPago: Joi.string().max(255).default("Pago de cuota mensual"),
  fechaPago: Joi.date().min(hoy).optional().allow(null)
});

export const compromisoPagoSchema = Joi.object({
  fechaCompromiso: Joi.date().max(hoy).required()
    .messages({
      "date.max": "La fecha de compromiso no puede ser posterior a hoy.",
      "any.required": "La fecha de compromiso es obligatoria."
    })
});
import Joi from 'joi';

const estadoEnum = ["pendiente", "pagado", "comprometido","oculto"];
const tipoEnum = ["mensual", "renovación", "extraordinario"];
const hoy = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

export const crearCuponSchema = Joi.object({
  mes: Joi.number().integer().min(1).max(12).required(),
  año: Joi.number().integer().min(2020).max(2050).required(),
  monto: Joi.number().integer().min(100).max(1000000).default(1000).multiple(10).required(),
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
  fechaCompromiso: Joi.date().min(hoy).optional().allow(null)
    .messages({
      "date.min": "La fecha de compromiso no puede ser anterior a hoy."
    }),
  vecinoId: Joi.number().integer().required()
});

export const generarMensualesSchema = Joi.object({
  año: Joi.number().integer().min(2020).max(2070).required(),
  monto: Joi.number().integer().min(1000).max(100000).default(1000).multiple(10).required(),
  descripcionPago: Joi.string().max(255).default("Pago de cuota mensual"),
  fechaPago: Joi.date().min(hoy).optional().allow(null)
});


export const compromisoPagoSchema = Joi.object({
  fechaCompromiso: Joi.date().min(hoy).required()
    .messages({
      "date.min": "La fecha de compromiso no puede ser anterior a hoy.",
      "any.required": "La fecha de compromiso es obligatoria."
    })
});

export const actualizarCuponSchema = Joi.object({
  año: Joi.number().integer().optional(),
  mes: Joi.number().integer().min(1).max(12).optional(),
  monto: Joi.number().min(10).optional().multiple(10),
  montoDescuento: Joi.number().min(0).optional().multiple(10),
  descripcionPago: Joi.string().allow('').optional(),
  estado: Joi.string().valid('pendiente', 'pagado', 'comprometido', 'oculto').optional(),
  fechaPago: Joi.date().optional().allow(null),
  fechaCompromiso: Joi.date().optional().allow(null),
  tipo: Joi.string().valid('mensual', 'renovación', 'extraordinario').optional()
}).min(1);  // para que al menos venga 1 campo


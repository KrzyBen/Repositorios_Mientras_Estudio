// src/middlewares/validar.js
export const validar = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        errores: error.details.map((detalle) => detalle.message),
      });
    }
    next();
  };
};

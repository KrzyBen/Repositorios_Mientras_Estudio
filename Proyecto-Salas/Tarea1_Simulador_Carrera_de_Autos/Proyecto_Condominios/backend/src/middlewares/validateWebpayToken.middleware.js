export const validateWebpayToken = (req, res, next) => {
  const token = req.body.token_ws || req.query.token_ws;

  if (!token || typeof token !== "string" || token.length < 30) {
    return res.status(400).send("Token Webpay inválido o ausente.");
  }
  req.token_ws = token;
  next();
};

import { iniciarTransaccionWebpay } from "../services/webpay.service.js";
import { confirmarTransaccionWebpay } from "../services/webpay.service.js";
import { revertirCuponPorFallo } from "../services/webpay.service.js";
import { generarPdfCupon } from "../services/cuponPagoPDF.service.js";

export const iniciarPagoCupon = async (req, res) => {
  try {
    const { cuponId } = req.params;

    const response = await iniciarTransaccionWebpay(cuponId, req.user.id);

    return res.status(200).json({
      url: response.url,
      token: response.token
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const confirmarPagoWebpay = async (req, res) => {
  try {
    const token = req.token_ws;

    const resultado = await confirmarTransaccionWebpay(token);

    if (resultado.response.response_code === 0) {
      await generarPdfCupon(resultado.vecinoId, resultado.cuponId);
      return res.redirect(`${process.env.FRONTEND_URL}/webpay-cierre.html?estado=pagado`);
    } else {
      await revertirCuponPorFallo(resultado.response.buy_order);
      return res.redirect(`${process.env.FRONTEND_URL}/webpay-cierre.html?error=pago-fallido`);
    }
  } catch (error) {
    await revertirCuponPorFallo(req.token_ws);
    return res.redirect(`${process.env.FRONTEND_URL}/webpay-cierre.html?error=error-interno`);
  }
};


export const revertirPagoManual = async (req, res) => {
  try {
    const { cuponId } = req.params;

    if (!cuponId) {
      return res.status(400).json({ error: "Falta el ID del cupón" });
    }

    await revertirCuponPorFallo(parseInt(cuponId));

    return res.status(200).json({ mensaje: "El estado del cupón fue revertido correctamente" });
  } catch (error) {
    console.error("Error al revertir cupón:", error.message);
    return res.status(500).json({ error: "No se pudo revertir el estado del cupón" });
  }
};

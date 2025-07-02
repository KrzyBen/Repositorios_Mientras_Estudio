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
    const token = req.body.token_ws || req.query.token_ws;

    // Si no hay token, el usuario canceló o cerró Webpay
    if (!token) {
      return res.redirect("/cupones?error=pago-fallido");
    }

    const resultado = await confirmarTransaccionWebpay(token);

    if (resultado.response.response_code === 0) {
      const cuponId = resultado.cuponId;
      const vecinoId = resultado.vecinoId;

      await generarPdfCupon(vecinoId, cuponId); // ✅ genera y marca pagado

      return res.redirect("http://localhost:5173/cupones?estado=pagado");
    } else {
      // Si el pago fue rechazado por Webpay
      await revertirCuponPorFallo(resultado.response.buy_order);
      return res.redirect("/cupones?error=pago-fallido");
    }
  } catch (error) {
    if (req.query.token_ws) {
      await revertirCuponPorFallo(req.query.token_ws); // En caso de error con token válido
    }
    return res.redirect("/cupones?error=error-interno");
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

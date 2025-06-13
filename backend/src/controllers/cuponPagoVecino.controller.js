import { handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { obtenerCuponesVecino, actualizarFechaCompromiso } from "../services/cuponPagoVecino.service.js";
import { generarPdfCupon } from "../services/cuponPagoPDF.service.js";
import { compromisoPagoSchema } from "../validations/cuponPago.validation.js";

export async function listarCuponesVecino(req, res) {
  try {
    const cupones = await obtenerCuponesVecino(req.user.id);
    res.status(200).json(cupones);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function comprometerPago(req, res) {
  try {
    const { error } = compromisoPagoSchema.validate(req.body);
    if (error) return handleErrorClient(res, 400, error.details[0].message);

    const { cuponId } = req.params;
    const { fechaCompromiso } = req.body;

    const actualizado = await actualizarFechaCompromiso(req.user.id, cuponId, fechaCompromiso);

    res.status(200).json({ message: "Fecha de compromiso actualizada", cupon: actualizado });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export const generarPdf = async (req, res) => {
  try {
    const { cuponId } = req.params;
    const { path, cupon } = await generarPdfCupon(req.user.id, cuponId);

    res.status(200).json({
      message: "PDF generado con éxito",
      archivo: path,
      cuponId: cupon.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
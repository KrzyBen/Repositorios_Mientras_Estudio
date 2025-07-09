import { handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { obtenerCuponesVecino, actualizarFechaCompromiso } from "../services/cuponPagoVecino.service.js";
import fs from "fs";
import path from "path";
import { generarPdfCupon, obtenerDatosPdfCuponService, descargarPdfCuponService } from "../services/cuponPagoPDF.service.js";
import { compromisoPagoSchema } from "../validations/cuponPago.validation.js";
import { log } from "console";

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
    console.log("Comprometiendo pago para cupon:", cuponId, "con fecha:", fechaCompromiso);
    const actualizado = await actualizarFechaCompromiso(req.user.id, cuponId, fechaCompromiso);

    res.status(200).json({ message: "Fecha de compromiso actualizada", cupon: actualizado });
  } catch (error) {
    console.error("Error comprometerPago:", error);
    handleErrorServer(res, 500, error.message);
  }
}

// Manejo de generación de PDF

export const generarPdf = async (req, res) => {
  try {
    const { cuponId } = req.params;
    const cuponRepo = AppDataSource.getRepository(CuponPagoSchema);

    const cupon = await cuponRepo.findOne({
      where: {
        id: cuponId,
        vecino: { id: req.user.id }
      },
      relations: ["vecino"]
    });

    if (!cupon) {
      return res.status(404).json({ error: "Cupón no encontrado" });
    }

    // Verificar si ya tiene PDF y que el archivo exista físicamente
    if (cupon.archivoPDF && fs.existsSync(cupon.archivoPDF)) {
      return res.status(200).json({
        message: "PDF ya existía",
        archivo: cupon.archivoPDF,
        cuponId: cupon.id
      });
    }

    // Si no existe, generarlo
    const { path: pdfPath } = await generarPdfCupon(req.user.id, cuponId);

    res.status(200).json({
      message: "PDF generado con éxito",
      archivo: pdfPath,
      cuponId: cupon.id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerPdfCupon = async (req, res) => {
  try {
    const { cuponId } = req.params;
    const datos = await obtenerDatosPdfCuponService(cuponId);

    res.status(200).json({
      mensaje: "PDF encontrado",
      ...datos,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const descargarPdfCupon = async (req, res) => {
  try {
    const { cuponId } = req.params;
    const pdfPath = await descargarPdfCuponService(cuponId);

    res.download(pdfPath, `cupon_${cuponId}.pdf`);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
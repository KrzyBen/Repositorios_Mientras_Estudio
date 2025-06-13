import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../config/configDb.js';
import CuponPago from '../entity/cuponPago.entity.js';

const cuponRepo = AppDataSource.getRepository(CuponPago);

export const generarPdfCupon = async (idVecino, cuponId) => {
  const cupon = await cuponRepo.findOne({
    where: { id: cuponId, vecino: { id: idVecino } },
    relations: ["vecino"],
  });

  if (!cupon) throw new Error("Cupón no encontrado");

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();

  const drawText = (text, y) => {
    page.drawText(text, {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
  };

  drawText(`CUPÓN DE PAGO`, height - 40);
  drawText(`Vecino: ${cupon.vecino.nombreCompleto}`, height - 80);
  drawText(`Mes/Año: ${cupon.mes}/${cupon.año}`, height - 100);
  drawText(`Monto: $${cupon.monto}`, height - 120);
  drawText(`Descuento: $${cupon.montoDescuento}`, height - 140);
  drawText(`Descripción: ${cupon.descripcionPago}`, height - 160);
  drawText(`Fecha compromiso: ${cupon.fechaCompromiso || "No definida"}`, height - 180);

  const pdfBytes = await pdfDoc.save();
  const pdfPath = path.join('pdfs', `cupon_${cupon.id}.pdf`);
  fs.writeFileSync(pdfPath, pdfBytes);

  cupon.archivoPDF = pdfPath;
  await cuponRepo.save(cupon);

  return { path: pdfPath, cupon };
};
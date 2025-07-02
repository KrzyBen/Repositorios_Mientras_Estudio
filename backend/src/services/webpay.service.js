import transbank from "transbank-sdk";
import { AppDataSource } from "../config/configDb.js";
import CuponPago from "../entity/cuponPago.entity.js";

// Desestructurar desde el default export
const { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys } = transbank;

const cuponRepo = AppDataSource.getRepository(CuponPago);

// Crear instancia de Webpay con opciones
const webpay = new WebpayPlus.Transaction(
  new Options(
    IntegrationCommerceCodes.WEBPAY_PLUS, // comercio de integración
    IntegrationApiKeys.WEBPAY,            // API Key de integración
    "https://webpay3gint.transbank.cl"       // URL de Webpay en modo integración
  )
);

// Iniciar la transacción Webpay
  export const iniciarTransaccionWebpay = async (cuponId, idVecino) => {
    const cupon = await cuponRepo.findOne({
      where: { id: cuponId, vecino: { id: idVecino } },
      relations: ["vecino"]
    });

    if (!cupon) throw new Error("Cupón no encontrado");

    const montoTotal = cupon.monto - cupon.montoDescuento;
    if (montoTotal <= 0) throw new Error("El monto total a pagar debe ser mayor que 0");

    const buyOrder = `orden_${cuponId}_${Date.now()}`;
    const sessionId = `vecino_${idVecino}`;
    const returnUrlBase = process.env.BASE_URL || "http://localhost:3500";


    const response = await webpay.create(buyOrder, sessionId, montoTotal, `${returnUrlBase}/api/cupon/webpay/confirmar`);

    // Guardar orden y estado
    cupon.estado = "pendiente_p_webpay";
    cupon.ordenWebpay = buyOrder;
    await cuponRepo.save(cupon);

    return response;
  };

// Confirmar transacción Webpay
export const confirmarTransaccionWebpay = async (token) => {
  const response = await webpay.commit(token);

  const buyOrder = response.buy_order;
  const cuponId = parseInt(buyOrder.split("_")[1]); // Extraer ID de cupón desde orden

  const cupon = await cuponRepo.findOne({
    where: { id: cuponId },
    relations: ["vecino"]
  });

  if (!cupon) throw new Error("Cupón no encontrado tras confirmación");

  cupon.estado = "pagado";
  await cuponRepo.save(cupon);

  return {
    response,
    cuponId: cupon.id,
    vecinoId: cupon.vecino.id,
  };
};

export const revertirCuponPorFallo = async (input) => {
  try {
    let cupon;

    if (typeof input === "number" || /^\d+$/.test(input)) {
      // Reversión directa por cuponId
      cupon = await cuponRepo.findOneBy({ id: parseInt(input) });
    } else {
      // Reversión por orden de compra o token
      let buyOrder = input;

      if (input.startsWith("tkn_") || input.length < 10) {
        const response = await webpay.commit(input);
        buyOrder = response.buy_order;
      }

      const cuponId = parseInt(buyOrder.split("_")[1]);

      cupon = await cuponRepo
        .createQueryBuilder("cupon")
        .where("cupon.ordenWebpay LIKE :orden", { orden: `orden_${cuponId}_%` })
        .andWhere("cupon.estado = :estado", { estado: "pendiente_p_webpay" })
        .getOne();
    }

    if (cupon && cupon.estado === "pendiente_p_webpay") {
      cupon.estado = "pendiente";
      cupon.ordenWebpay = null;
      await cuponRepo.save(cupon);
      console.log(" Cupón revertido correctamente");
    } else {
      console.warn(" No se encontró cupón para revertir");
    }
  } catch (error) {
    console.error(" Error al revertir cupón:", error.message);
  }
};
import { AppDataSource } from "../config/configDb.js";
import CuponPago from "../entity/cuponPago.entity.js";
import User from "../entity/user.entity.js";
import { In } from "typeorm";

export async function obtenerCuponesVecino(idVecino) {
  try {
    const cuponRepo = AppDataSource.getRepository(CuponPago);
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOneBy({ id: idVecino });
    if (!user) throw new Error("Usuario no encontrado.");
    if (user.rol !== "vecino") throw new Error("El usuario no tiene rol de vecino.");

    const estadosPermitidos = ["pendiente", "pagado", "comprometido"];

    const cupones = await cuponRepo.find({
      where: {
        vecino: { id: idVecino },
        estado: In(estadosPermitidos)
      },
      relations: ["vecino"],
      order: { año: "ASC", mes: "ASC" }
    });

    return cupones;
  } catch (error) {
    throw new Error(`Error al obtener los cupones del vecino: ${error.message}`);
  }
}

export async function actualizarFechaCompromiso(idVecino, cuponId, fechaCompromiso) {
  try {
    const cuponRepo = AppDataSource.getRepository(CuponPago);
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOneBy({ id: idVecino });
    if (!user) throw new Error("Usuario no encontrado.");
    if (user.rol !== "vecino") throw new Error("El usuario no tiene rol de vecino.");

    const cupon = await cuponRepo.findOne({
      where: { id: cuponId, vecino: { id: idVecino } },
      relations: ["vecino"],
    });
    if (!cupon) throw new Error("Cupón no encontrado o no pertenece al usuario.");

    // Validación de fecha
    const fechaPago = new Date(cupon.fechaPago);
    fechaPago.setHours(0, 0, 0, 0);


    const fecha = new Date(fechaCompromiso);
    fecha.setHours(0, 0, 0, 0);

    if (isNaN(fecha.getTime())) {
      throw new Error("Fecha de compromiso inválida.");
    }

    const fechaMin = fechaPago;
    const fechaMax = new Date(fechaPago);
    fechaMax.setMonth(fechaMax.getMonth() + 2);

    if (fecha < fechaMin) {
      throw new Error("La fecha de compromiso no puede ser anterior a la fecha de pago.");
    }

    if (fecha > fechaMax) {
      throw new Error("La fecha de compromiso no puede ser superior a dos meses desde la fecha de pago.");
    }

    cupon.fechaCompromiso = fecha;

    cupon.estado = "comprometido";

    const cuponActualizado = await cuponRepo.save(cupon);
    return cuponActualizado;
  } catch (error) {
    throw new Error(`Error al actualizar la fecha de compromiso: ${error.message}`);
  }
}

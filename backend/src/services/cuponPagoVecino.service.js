import { AppDataSource } from "../config/configDb.js";
import CuponPago from "../entity/cuponPago.entity.js";
import User from "../entity/user.entity.js";

export async function obtenerCuponesVecino(idVecino) {
  try {
    const cuponRepo = AppDataSource.getRepository(CuponPago);
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: idVecino });

    if (!user || user.rol !== "vecino") {
      throw new Error("Usuario no válido o no tiene rol de vecino.");
    }

    const cupones = await cuponRepo.find({
      where: { vecino: { id: idVecino } },
      relations: ["vecino"],
      order: { año: "DESC", mes: "DESC" },
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

    if (!user || user.rol !== "vecino") {
      throw new Error("Usuario no válido o no tiene rol de vecino.");
    }

    const cupon = await cuponRepo.findOne({
      where: { id: cuponId, vecino: { id: idVecino } },
      relations: ["vecino"],
    });

    if (!cupon) {
      throw new Error("Cupón no encontrado o no pertenece al usuario.");
    }

    // Validación extra
    const hoy = new Date();
    const fecha = new Date(fechaCompromiso);
    if (fecha > hoy) {
      throw new Error("La fecha de compromiso no puede ser posterior a hoy.");
    }

    cupon.fechaCompromiso = fechaCompromiso;

    const cuponActualizado = await cuponRepo.save(cupon);
    return cuponActualizado;
  } catch (error) {
    throw new Error(`Error al actualizar la fecha de compromiso: ${error.message}`);
  }
}

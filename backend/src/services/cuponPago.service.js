// services/cupon.service.js
import CuponPagoSchema from "../entity/cuponPago.entity.js";
import { AppDataSource } from "../config/configDb.js";
import UserSchema from "../entity/user.entity.js";

// Crear cupón y asociarlo a un vecino
export async function crearCuponService(data) {
  try {
    const { vecinoId, ...cuponData } = data;
    const cuponRepository = AppDataSource.getRepository(CuponPagoSchema);
    const userRepository = AppDataSource.getRepository(UserSchema);

    const user = await userRepository.findOneBy({ id: vecinoId });
    if (!user || user.rol !== "vecino") {
      return [null, "El usuario no existe o no tiene rol de vecino"];
    }

    const nuevoCupon = cuponRepository.create({
      ...cuponData,
      vecino: user,
    });

    const cuponGuardado = await cuponRepository.save(nuevoCupon);
    return [cuponGuardado, null];
  } catch (error) {
    return [null, `Error en crearCuponService: ${error.message}`];
  }
}

export async function generarCuponesMensualesParaVecinos(opciones = {}) {
  try {
    const { monto = 1000, fechaPago = null, descripcion = null } = opciones;

    const cuponRepository = AppDataSource.getRepository(CuponPagoSchema);
    const userRepository = AppDataSource.getRepository(UserSchema);

    const vecinos = await userRepository.findBy({ rol: 'vecino' });

    const ahora = new Date();
    const añoActual = ahora.getFullYear();
    const mesActual = ahora.getMonth() + 1;

    const cuponesNuevos = [];

    for (const vecino of vecinos) {
      for (let mes = mesActual; mes <= 12; mes++) {
        const existe = await cuponRepository.findOne({
          where: {
            mes,
            año: añoActual,
            tipo: 'mensual',
            vecino: { id: vecino.id },
          },
          relations: ["vecino"],
        });

        if (!existe) {
          const nuevoCupon = cuponRepository.create({
            mes,
            año: añoActual,
            monto,
            montoDescuento: 0,
            descripcionPago: descripcion || `Pago de cuota mensual correspondiente a ${mes}/${añoActual}`,
            estado: 'pendiente',
            tipo: 'mensual',
            fechaPago: fechaPago || null,
            vecino: vecino,
          });

          cuponesNuevos.push(nuevoCupon);
        }
      }
    }

    if (cuponesNuevos.length === 0) {
      return [[], null];
    }

    const cuponesCreados = await cuponRepository.save(cuponesNuevos);
    return [cuponesCreados, null];
  } catch (error) {
    return [null, `Error en generarCuponesMensualesParaVecinos: ${error.message}`];
  }
}

// Listar cupones por estado
export async function listarCuponesService(estado = null) {
  try {
    const cuponRepository = AppDataSource.getRepository(CuponPagoSchema);
    const estadosValidos = ["pendiente", "pagado", "comprometido"];

    const where = estado && estadosValidos.includes(estado) ? { estado } : {};
    const cupones = await cuponRepository.find({
      where,
      relations: ["vecino"],
      order: { año: "DESC", mes: "DESC" },
    });

    return [cupones, null];
  } catch (error) {
    return [null, `Error en listarCuponesService: ${error.message}`];
  }
}

// Actualizar cupón
export async function actualizarCuponService(id, nuevosDatos) {
  try {
    const cuponRepository = AppDataSource.getRepository(CuponPagoSchema);
    const userRepository = AppDataSource.getRepository(UserSchema);

    const cupon = await cuponRepository.findOne({
      where: { id },
      relations: ["vecino"],
    });

    if (!cupon) return [null, "Cupón no encontrado"];

    if (nuevosDatos.vecinoId) {
      const user = await userRepository.findOneBy({ id: nuevosDatos.vecinoId });
      if (!user || user.rol !== "vecino") {
        return [null, "El nuevo usuario no existe o no tiene rol de vecino"];
      }
      cupon.vecino = user;
    }

    delete nuevosDatos.vecinoId;
    Object.assign(cupon, nuevosDatos);

    const cuponActualizado = await cuponRepository.save(cupon);
    return [cuponActualizado, null];
  } catch (error) {
    return [null, `Error en actualizarCuponService: ${error.message}`];
  }
}

// Eliminar cupón
export async function eliminarCuponService(id) {
  try {
    const cuponRepository = AppDataSource.getRepository(CuponPagoSchema);
    const cupon = await cuponRepository.findOneBy({ id });

    if (!cupon) return [null, "Cupón no encontrado"];

    await cuponRepository.remove(cupon);
    return [cupon, null];
  } catch (error) {
    return [null, `Error en eliminarCuponService: ${error.message}`];
  }
}
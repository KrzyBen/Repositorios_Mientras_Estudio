import CuponPagoSchema from "../entity/cuponPago.entity.js";
import { AppDataSource } from "../config/configDb.js";
import UserSchema from "../entity/user.entity.js";
import { Not } from "typeorm";

// Crear cupón para un vecino (individual)
export async function crearCuponEncargadoService(data) {
  try {
    const { vecinoId, ...cuponData } = data;
    const cuponRepository = AppDataSource.getRepository(CuponPagoSchema);
    const userRepository = AppDataSource.getRepository(UserSchema);

    const user = await userRepository.findOneBy({ id: vecinoId });
    if (!user || user.rol !== "vecino") {
      return [null, "El usuario no existe o no tiene rol de vecino"];
    }

    // Verificar si ya existe un cupón del mismo mes, año y tipo para ese vecino
    const existente = await cuponRepository.findOne({
      where: {
        mes: cuponData.mes,
        año: cuponData.año,
        tipo: cuponData.tipo || "mensual",
        vecino: { id: vecinoId }
      },
      relations: ["vecino"]
    });

    if (existente) {
      return [null, `Ya existe un cupón del mes ${cuponData.mes} del año ${cuponData.año} para este vecino.`];
    }

    const nuevoCupon = cuponRepository.create({
      ...cuponData,
      vecino: user,
      estado: "pendiente"
    });

    const cuponGuardado = await cuponRepository.save(nuevoCupon);
    return [cuponGuardado, null];
  } catch (error) {
    return [null, `Error al crear cupón: ${error.message}`];
  }
}

// Generar 12 cupones anuales sin importar pendientes
export async function generarAnualesEncargadoService(opciones = {}) {
  try {
    const { monto = 1000, descripcion = "", año = new Date().getFullYear() } = opciones;

    const cuponRepository = AppDataSource.getRepository(CuponPagoSchema);
    const userRepository = AppDataSource.getRepository(UserSchema);

    const vecinos = await userRepository.findBy({ rol: 'vecino' });
    const cuponesNuevos = [];

    for (const vecino of vecinos) {
      for (let mes = 1; mes <= 12; mes++) {
        // Validar que no exista ya un cupón del mismo mes/año/tipo para este vecino
        const existente = await cuponRepository.findOne({
          where: {
            mes,
            año,
            tipo: "mensual",
            vecino: { id: vecino.id }
          },
          relations: ["vecino"]
        });

        if (!existente) {
          const fechaPago = new Date(año, mes - 1, mes === 12 ? 20 : 25);
          fechaPago.setHours(0, 0, 0, 0);
          const aplicaDescuento = mes === 3 || mes === 12;

          const nuevo = cuponRepository.create({
            mes,
            año,
            monto: monto,
            montoDescuento: aplicaDescuento ? monto : 0,
            descripcionPago: descripcion || `Pago cuota mensual ${mes}/${año}`,
            estado: "pendiente",
            tipo: "mensual",
            fechaPago,
            vecino
          });

          cuponesNuevos.push(nuevo);
        }
      }
    }

    const guardados = await cuponRepository.save(cuponesNuevos);
    return [guardados, null];
  } catch (error) {
    return [null, `Error al generar cupones anuales: ${error.message}`];
  }
}

// Listar todos los cupones
export async function listarCuponesEncargadoService(estado = null) {
  try {
    const cuponRepository = AppDataSource.getRepository(CuponPagoSchema);

    let where;
    if (estado) {
      where = { estado };
    } else {
      where = {
        estado: Not("oculto"),
      };
    }

    const cupones = await cuponRepository.find({
      where,
      relations: ["vecino"],
      order: { año: "DESC", mes: "DESC" },
    });

    return [cupones, null];
  } catch (error) {
    return [null, `Error al listar cupones: ${error.message}`];
  }
}

// Actualizar descripción, monto o vecino
export async function actualizarCuponEncargadoService(id, nuevosDatos) {
  try {
    const cuponRepository = AppDataSource.getRepository(CuponPagoSchema);
    const userRepository = AppDataSource.getRepository(UserSchema);

    const cupon = await cuponRepository.findOne({
      where: { id },
      relations: ["vecino"],
    });

    if (!cupon) return [null, "Cupón no encontrado"];

    if (nuevosDatos.vecinoId) {
      const nuevoVecino = await userRepository.findOneBy({ id: nuevosDatos.vecinoId });
      if (!nuevoVecino || nuevoVecino.rol !== "vecino") {
        return [null, "El nuevo usuario no existe o no tiene rol de vecino"];
      }
      cupon.vecino = nuevoVecino;
    }

    delete nuevosDatos.vecinoId;
    Object.assign(cupon, nuevosDatos);

    const actualizado = await cuponRepository.save(cupon);
    return [actualizado, null];
  } catch (error) {
    return [null, `Error al actualizar el cupón: ${error.message}`];
  }
}

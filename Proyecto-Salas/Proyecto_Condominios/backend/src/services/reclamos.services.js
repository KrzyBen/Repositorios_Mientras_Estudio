"use strict";
import { AppDataSource } from "../config/configDb.js";
import Reclamo from "../entity/reclamo.entity.js";

// Crear reclamo
export async function crearReclamo(data, user) {
  try {
    const repo = AppDataSource.getRepository(Reclamo);
    const nuevo = repo.create({
      tipo: data.tipo,
      observacion: data.observacion,
      estado: "pendiente",
      fecha: new Date(),
      usuario: { id: user.id },
    });
    await repo.save(nuevo);
    return [nuevo, null];
  } catch (err) {
    console.error(err);
    return [null, "Error al crear el reclamo"];
  }
}

// Editar reclamo
export async function editarReclamo(id, data, user) {
  try {
    const repo = AppDataSource.getRepository(Reclamo);
    const reclamo = await repo.createQueryBuilder("reclamo")
      .leftJoinAndSelect("reclamo.usuario", "usuario")
      .where("reclamo.id = :id", { id })
      .andWhere("usuario.id = :userId", { userId: user.id })
      .getOne();

    if (!reclamo) return [null, "Reclamo no encontrado o no autorizado"];
    if (reclamo.estado !== "pendiente") return [null, "Solo se pueden editar reclamos pendientes"];

    reclamo.tipo = data.tipo || reclamo.tipo;
    reclamo.observacion = data.observacion || reclamo.observacion;

    await repo.save(reclamo);
    return [reclamo, null];
  } catch (err) {
    console.error(err);
    return [null, "Error al editar el reclamo"];
  }
}

// Eliminar reclamo (DELETE)
export async function eliminarReclamo(id, user) {
  try {
    const repo = AppDataSource.getRepository(Reclamo);

    // Primero validar que el reclamo existe y pertenece al usuario
    const reclamo = await repo.createQueryBuilder("reclamo")
      .leftJoin("reclamo.usuario", "usuario")
      .where("reclamo.id = :id", { id })
      .andWhere("usuario.id = :userId", { userId: user.id })
      .getOne();

    if (!reclamo) return [null, "Reclamo no encontrado o no autorizado"];

    await repo.remove(reclamo);
    return [reclamo, null];
  } catch (err) {
    console.error(err);
    return [null, "Error al eliminar el reclamo"];
  }
}

// Cambiar estado (encargado)
export async function cambiarEstadoReclamo(id, nuevoEstado, descripcion, user) {
  try {
    const repo = AppDataSource.getRepository(Reclamo);
    const reclamo = await repo.findOne({ where: { id }, relations: ["usuario"] });

    if (!reclamo) return [null, "Reclamo no encontrado"];
    if (reclamo.estado !== "pendiente") return [null, "Solo reclamos pendientes pueden cambiar de estado"];

    reclamo.estado = nuevoEstado;
    reclamo.descripcionResolucion = descripcion;

    await repo.save(reclamo);
    return [reclamo, null];
  } catch (err) {
    console.error(err);
    return [null, "Error al cambiar estado del reclamo"];
  }
}

// Listar reclamos
export async function listarReclamos(user) {
  try {
    const repo = AppDataSource.getRepository(Reclamo);

    let reclamos;
    if (user.rol === "vecino") {
      reclamos = await repo.createQueryBuilder("reclamo")
        .leftJoinAndSelect("reclamo.usuario", "usuario")
        .where("usuario.id = :userId", { userId: user.id })
        .orWhere("reclamo.estado = :estado", { estado: "resuelto" })
        .getMany();
    } else {
      reclamos = await repo.find({ relations: ["usuario"] });
    }

    return [reclamos, null];
  } catch (err) {
    console.error(err);
    return [null, "Error al listar reclamos"];
  }
}

// Obtener por ID
export async function obtenerReclamo(id, user) {
  try {
    const repo = AppDataSource.getRepository(Reclamo);
    const reclamo = await repo.findOne({ where: { id }, relations: ["usuario"] });

    if (!reclamo) return [null, "Reclamo no encontrado"];

    if (user.rol === "vecino" && reclamo.usuario.id !== user.id && reclamo.estado !== "resuelto") {
      return [null, "Acceso no autorizado"];
    }

    return [reclamo, null];
  } catch (err) {
    console.error(err);
    return [null, "Error al obtener el reclamo"];
  }
}


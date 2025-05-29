"use strict";
// avisos.vecinos.service.js

import { AppDataSource } from "../config/configDb.js";
import Aviso from "../entity/avisos.entity.js";

export async function crearAvisoVecinoService(data) {
  try {
    const avisoRepo = AppDataSource.getRepository(Aviso);
    const aviso = avisoRepo.create({
      ...data,
      estado: "pendiente",
      fechaExpiracion: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });
    await avisoRepo.save(aviso);
    return [aviso, null];
  } catch (error) {
    console.error("Error al crear aviso:", error);
    return [null, "Error interno al crear aviso"];
  }
}

export async function editarAvisoVecinoService(id, data, usuarioId) {
  try {
    const repo = AppDataSource.getRepository(Aviso);
    const aviso = await repo.findOne({ where: { id, usuarioId } });
    if (!aviso) return [null, "Aviso no encontrado o no autorizado"];

    Object.assign(aviso, data);
    await repo.save(aviso);
    return [aviso, null];
  } catch (err) {
    console.error("Error editando aviso vecino:", err);
    return [null, "Error interno editando aviso"];
  }
}

export async function obtenerAvisosPublicadosService() {
  try {
    const repo = AppDataSource.getRepository(Aviso);
    const avisos = await repo.find({ where: { estado: "publicado", visible: true } });
    return [avisos, null];
  } catch (err) {
    return [null, "Error al obtener avisos"];
  }
}
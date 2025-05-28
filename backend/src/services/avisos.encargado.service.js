"use strict";
// avisos.encargado.service.js

import { AppDataSource } from "../config/configDb.js";
import Aviso from "../entity/avisos.entity.js";

export async function crearAvisoEncargado(data) {
  try {
    const repo = AppDataSource.getRepository(Aviso);
    const aviso = repo.create({
      ...data,
      estado: "pendiente_aprobacion",
      fechaExpiracion: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });
    await repo.save(aviso);
    return [aviso, null];
  } catch (err) {
    return [null, "Error interno al crear aviso"];
  }
}

export async function validarAviso(id, apropiado, aprobado) {
  try {
    const repo = AppDataSource.getRepository(Aviso);
    const aviso = await repo.findOne({ where: { id } });
    if (!aviso) return [null, "Aviso no encontrado"];

    aviso.apropiado = apropiado;
    aviso.estado = !apropiado
      ? "desactivado"
      : aprobado
      ? "publicado"
      : "rechazado";

    await repo.save(aviso);
    return [aviso, null];
  } catch (err) {
    return [null, "Error validando aviso"];
  }
}

export async function ocultarAviso(id) {
  try {
    const repo = AppDataSource.getRepository(Aviso);
    const aviso = await repo.findOne({ where: { id } });
    if (!aviso) return [null, "Aviso no encontrado"];
    aviso.visible = false;
    await repo.save(aviso);
    return [aviso, null];
  } catch (err) {
    return [null, "Error ocultando aviso"];
  }
}


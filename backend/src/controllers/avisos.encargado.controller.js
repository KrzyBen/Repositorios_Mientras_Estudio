"use strict";
// avisos.encargado.controller.js

import {
  crearAvisoEncargadoService,
  validarAvisoService,
  ocultarAvisoService
} from "../services/avisos.encargado.service.js";
import { AppDataSource } from "../config/configDb.js";
import Aviso from "../entity/avisos.entity.js";

// Crear aviso por encargado o administrador
export async function crearAvisoEncargado(req, res) {
  try {
  const data = {
    ...req.body,
    creadoPor: req.user.nombre,
    usuarioId: req.user.id,
  };

  const [aviso, error] = await crearAvisoEncargadoService(data);
  if (error) return res.status(400).json({ error });

  return res.status(201).json({
    message: "Aviso creado correctamente",
    aviso,
  });
  } catch (err) {
    console.error("Error en crearAviso:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Validar aviso: definir si es apropiado y si está aprobado
export async function validarApropiado(req, res) {
  try {
    const { id } = req.params;
    const { apropiado, aprobado } = req.body;
    const [aviso, error] = await validarAvisoService(id, apropiado, aprobado);
    if (error) return res.status(404).json({ error });

    const estadoMsg =
      aviso.estado === "publicado"
        ? "Aviso publicado correctamente"
        : aviso.estado === "rechazado"
        ? "Aviso rechazado"
        : "Aviso desactivado por contenido inapropiado";

    return res.status(200).json({ message: estadoMsg, aviso });
  } catch (err) {
    console.error("Error en validar:", err);
    return res.status(500).json({ error: "Error interno al validar aviso" });
  }
}

// Ocultar un aviso (cambiar visible a false)
export async function ocultarAviso(req, res) {
  try {
    const { id } = req.params;
    const [aviso, error] = await ocultarAvisoService(id);
  if (error) return res.status(404).json({ error });

  return res.status(200).json({
    message: "Aviso ocultado correctamente",
    aviso,
  });
  } catch (err) {
    console.error("Error en ocultar:", err);
    return res.status(500).json({ error: "Error interno al ocultar aviso" });
  }
}

// Obtener todos los avisos (opcional, para administración general)
export async function obtenerAvisosEncargado(req, res) {
  try {
    const repo = AppDataSource.getRepository(Aviso);
    const avisos = await repo.find({ order: { fechaCreacion: "DESC" } });
    return res.status(200).json(avisos);
  } catch (err) {
    console.error("Error al obtener avisos:", err);
    return res.status(500).json({ error: "Error interno al obtener avisos" });
  }
}
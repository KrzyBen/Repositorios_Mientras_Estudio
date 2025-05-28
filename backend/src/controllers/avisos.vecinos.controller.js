"use strict";
// controllers/avisos.vecinos.controller.js

import {
  crearAvisoVecino,
  editarAvisoVecino,
  obtenerAvisosPublicados,
} from "../services/avisos.vecinos.service.js";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";

export const crearAviso = async (req, res) => {
  try {
    const data = {
      ...req.body,
      creadoPor: req.user.nombre,
      usuarioId: req.user.id,
    };

    const [aviso, error] = await crearAvisoVecino(data);
    if (error) {
      return handleErrorClient(res, 400, "Error al crear aviso", error);
    }

    return handleSuccess(res, 201, "Aviso enviado para revisión", aviso);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
};

export const editarAviso = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;

    const [aviso, error] = await editarAvisoVecino(id, req.body, usuarioId);
    if (error) {
      return handleErrorClient(res, 403, "No autorizado o error", error);
    }

    return handleSuccess(res, 200, "Aviso editado correctamente", aviso);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno al editar aviso");
  }
};

export const listarAvisosPublicados = async (req, res) => {
  try {
    const [avisos, error] = await obtenerAvisosPublicados();
    if (error) {
      return handleErrorClient(res, 404, "No se pudieron obtener avisos", error);
    }

    return handleSuccess(res, 200, "Avisos publicados encontrados", avisos);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al listar avisos");
  }
};
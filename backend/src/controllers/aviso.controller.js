import * as avisoService from "../services/avisos.service.js";
import { handleSuccess } from "../handlers/responseHandlers.js";

export const crearAviso = async (req, res) => {
  try {
    const aviso = await avisoService.crearAviso(req.body, req.user);
    handleSuccess(res, 201, aviso, "Aviso creado correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el aviso" });
  }
};

export const obtenerAvisos = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const avisos = await avisoService.obtenerAvisos({ page, limit });
    res.status(200).json(avisos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerAvisoPorId = async (req, res) => {
  try {
    const aviso = await avisoService.obtenerAvisoPorId(req.params.id);
    if (!aviso) {
      return res.status(404).json({ message: "Aviso no encontrado" });
    }
    res.status(200).json(aviso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const actualizarAviso = async (req, res) => {
  try {
    const avisoActualizado = await avisoService.actualizarAviso(req.params.id, req.body);
    if (!avisoActualizado) {
      return res.status(404).json({ message: "Aviso no encontrado" });
    }
    res.status(200).json(avisoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cambiarEstadoAviso = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // esperado: 'activo' o 'inactivo'
    const avisoActualizado = await avisoService.cambiarEstadoAviso(id, estado);
    if (!avisoActualizado) {
      return res.status(404).json({ message: "Aviso no encontrado" });
    }
    res.status(200).json(avisoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarAviso = async (req, res) => {
  try {
    const resultado = await avisoService.eliminarAviso(req.params.id);
    if (!resultado) {
      return res.status(404).json({ message: "Aviso no encontrado" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const contarAvisos = async (_req, res) => {
  try {
    const cantidad = await avisoService.contarAvisos();
    res.status(200).json({ cantidad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

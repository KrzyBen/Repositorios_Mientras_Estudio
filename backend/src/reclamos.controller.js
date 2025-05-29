"use strict";
import * as service from "../services/reclamos.service.js";

// Crear reclamo (vecino)
export async function crear(req, res) {
  const [reclamo, error] = await service.crearReclamo(req.body, req.user);
  if (error) return res.status(400).json({ error });
  res.status(201).json({ mensaje: "Reclamo creado con éxito", reclamo });
}

// Editar reclamo (vecino)
export async function editar(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const [reclamo, error] = await service.editarReclamo(id, req.body, req.user);
  if (error) return res.status(400).json({ error });

  res.status(200).json({ mensaje: "Reclamo actualizado con éxito", reclamo });
}

// Borrar reclamo (vecino → eliminar físicamente)
export async function borrar(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const [reclamo, error] = await service.eliminarReclamo(id, req.user);
  if (error) return res.status(400).json({ error });

  res.status(200).json({ mensaje: "Reclamo eliminado con éxito", reclamo });
}

// Cambiar estado (encargado)
export async function cambiarEstado(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const { estado, descripcion } = req.body;
  if (!["resuelto", "desestimado"].includes(estado)) {
    return res.status(400).json({ error: "Estado no válido" });
  }

  const [reclamo, error] = await service.cambiarEstadoReclamo(id, estado, descripcion, req.user);
  if (error) return res.status(400).json({ error });

  res.status(200).json({ mensaje: `Reclamo marcado como ${reclamo.estado}`, reclamo });
}

// Listar reclamos (por rol)
export async function listar(req, res) {
  const [reclamos, error] = await service.listarReclamos(req.user);
  if (error) return res.status(400).json({ error });
  res.status(200).json(reclamos);
}

// Obtener por ID
export async function obtener(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const [reclamo, error] = await service.obtenerReclamo(id, req.user);
  if (error) return res.status(404).json({ error });

  res.status(200).json(reclamo);
}


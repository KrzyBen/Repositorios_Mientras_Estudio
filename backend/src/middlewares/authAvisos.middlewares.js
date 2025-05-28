'use strict'
// avisos.middlewares.js

export function verificarPropietario(req, res, next) {
  const { aviso } = req;
  const { user } = req;
  if (aviso.usuarioId !== user.id) {
    return res.status(403).json({ mensaje: "No tienes permisos sobre este aviso" });
  }
  next();
}

export function verificarTiempoEdicion(req, res, next) {
  const { aviso } = req;
  const diezMinutos = 10 * 60 * 1000;
  const tiempoTranscurrido = new Date() - new Date(aviso.fechaCreacion);
  if (tiempoTranscurrido > diezMinutos) {
    return res.status(403).json({ mensaje: "El tiempo para editar el aviso ha expirado" });
  }
  next();
}

export function verificarRolEncargadoOAdmin(req, res, next) {
  const { user } = req;
  if (!['encargado', 'admin'].includes(user.rol)) {
    return res.status(403).json({ mensaje: "Permiso denegado: requiere rol de encargado o admin" });
  }
  next();
}

export function verificarRolAdmin(req, res, next) {
  const { user } = req;
  if (user.rol !== 'admin') {
    return res.status(403).json({ mensaje: "Permiso denegado: requiere rol de administrador" });
  }
  next();
}
// controllers/cupon.controller.js
'use strict';

import {
  crearCuponService,
  generarCuponesMensualesParaVecinos,
  listarCuponesService,
  actualizarCuponService,
  eliminarCuponService
} from '../services/cupon.service.js';

import {
  crearCuponSchema,
  generarMensualesSchema
} from '../validations/cupon.validation.js';
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer
} from '../handlers/responseHandlers.js';

// Crear cupón
export async function crearCupon(req, res) {
  try {
    const { error, value } = crearCuponSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const mensajes = error.details.map(e => e.message);
      return handleErrorClient(res, 400, mensajes);
    }

    const [cupon, serviceError] = await crearCuponService(value);
    if (serviceError) return handleErrorClient(res, 400, serviceError);

    return handleSuccess(res, 201, 'Cupón creado correctamente', cupon);
  } catch (err) {
    return handleErrorServer(res, 500, 'Error al crear el cupón');
  }
}

// Generar automáticamente cupones mensuales para todos los vecinos
export async function generarCuponesMensuales(req, res) {
  try {
    const { error, value } = generarMensualesSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const mensajes = error.details.map(e => e.message);
      return handleErrorClient(res, 400, mensajes);
    }

    const [cupones, serviceError] = await generarCuponesMensualesParaVecinos(value);
    if (serviceError) return handleErrorServer(res, 500, serviceError);
    return handleSuccess(res, 201, 'Cupones mensuales generados correctamente', cupones);
  } catch (err) {
    return handleErrorServer(res, 500, 'Error al generar cupones mensuales');
  }
}

// Listar cupones
export async function listarCupones(req, res) {
  try {
    const { estado } = req.query;

    const estadosValidos = ["pendiente", "pagado", "comprometido"];
    if (estado && !estadosValidos.includes(estado)) {
      return handleErrorClient(res, 400, "Estado no válido");
    }

    const [cupones, serviceError] = await listarCuponesService(estado);
    if (serviceError) return handleErrorServer(res, 500, serviceError);

    return handleSuccess(res, 200, 'Cupones obtenidos correctamente', cupones);
  } catch (err) {
    return handleErrorServer(res, 500, 'Error al listar los cupones');
  }
}

// Actualizar cupón
export async function actualizarCupon(req, res) {
  try {
    const { id } = req.params;
    const cuponId = Number(id);

    if (isNaN(cuponId)) {
      return handleErrorClient(res, 400, "ID inválido");
    }

    const { error, value } = crearCuponSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const mensajes = error.details.map(e => e.message);
      return handleErrorClient(res, 400, mensajes);
    }

    const [cuponActualizado, serviceError] = await actualizarCuponService(cuponId, value);
    if (serviceError) return handleErrorClient(res, 404, serviceError);

    return handleSuccess(res, 200, 'Cupón actualizado correctamente', cuponActualizado);
  } catch (err) {
    return handleErrorServer(res, 500, 'Error al actualizar el cupón');
  }
}

// Eliminar cupón
export async function eliminarCupon(req, res) {
  try {
    const cuponId = Number(req.params.id);
    if (isNaN(cuponId)) return handleErrorClient(res, 400, "ID inválido");

    const [cuponEliminado, serviceError] = await eliminarCuponService(cuponId);
    if (serviceError) return handleErrorClient(res, 404, serviceError);

    return handleSuccess(res, 200, 'Cupón eliminado correctamente', cuponEliminado);
  } catch (err) {
    return handleErrorServer(res, 500, 'Error al eliminar el cupón');
  }
}
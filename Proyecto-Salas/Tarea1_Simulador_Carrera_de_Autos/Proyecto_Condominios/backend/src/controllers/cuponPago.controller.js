'use strict';

import {
  crearCuponService,
  generarCuponesMensualesParaVecinos,
  listarCuponesService,
  actualizarCuponService,
  eliminarCuponService,
  listarVecinosService,
  listarCuponesVecinoService
} from '../services/cuponPago.service.js';

import {
  crearCuponSchema,
  generarMensualesSchema,
  actualizarCuponSchema
} from '../validations/cuponPago.validation.js';
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
    console.log("Backend: Generando cupones mensuales con datos:", req.body);
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
    const { cuponId } = req.params;
    const id = Number(cuponId);


    if (isNaN(id)) {
      return handleErrorClient(res, 400, "ID inválido");
    }

    const { error, value } = actualizarCuponSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const mensajes = error.details.map(e => e.message);
      return handleErrorClient(res, 400, mensajes);
    }

    const [cuponActualizado, serviceError] = await actualizarCuponService(id, value);
    if (serviceError) return handleErrorClient(res, 404, serviceError);

    return handleSuccess(res, 200, 'Cupón actualizado correctamente', cuponActualizado);
  } catch (err) {
    console.error("Error en actualizarCupon:", err);
    return handleErrorServer(res, 500, 'Error al actualizar el cupón');
  }
}

// Eliminar cupón (solo para administradores)
export async function eliminarCupon(req, res) {
  try {
    const { cuponId } = req.params;

    console.log("Backend: Intentando eliminar cupón ID:", cuponId);

    const [cuponEliminado, error] = await eliminarCuponService(cuponId);
    if (error) return res.status(400).json({ error });

    return res.status(200).json({ message: "Cupón eliminado correctamente", cupon: cuponEliminado });
  } catch (error) {
    return res.status(500).json({ error: `Error en eliminarCupon: ${error.message}` });
  }
}

// Obtener lista de todos los vecinos
export async function listarVecinos(req, res) {
  try {
    const [vecinos, error] = await listarVecinosService();
    if (error) return handleErrorClient(res, 404, error);
    return handleSuccess(res, 200, 'Vecinos obtenidos con éxito', vecinos);
  } catch (err) {
    return handleErrorServer(res, 500, 'Error al obtener vecinos');
  }
}

// Obtener cupones de un vecino
export async function listarCuponesPorVecino(req, res) {
  try {
    const { vecinoId } = req.params;
    const id = Number(vecinoId);

    if (isNaN(id)) return handleErrorClient(res, 400, 'ID inválido');

    const [cupones, error] = await listarCuponesVecinoService(id);
    if (error) return handleErrorClient(res, 404, error);

    return handleSuccess(res, 200, 'Cupones del vecino obtenidos con éxito', cupones);
  } catch (err) {
    return handleErrorServer(res, 500, 'Error al obtener los cupones del vecino');
  }
}
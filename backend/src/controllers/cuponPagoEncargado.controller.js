import {
  crearCuponEncargadoService,
  generarAnualesEncargadoService,
  listarCuponesEncargadoService,
  actualizarCuponEncargadoService
} from "../services/cuponPagoEncargado.service.js";

import { crearCuponSchema } from "../validations/cuponPago.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function crearCuponEncargado(req, res) {
  try {
    const { error, value } = crearCuponSchema.validate(req.body);
    if (error) return handleErrorClient(res, 400, error.details.map(e => e.message));

    const [cupon, err] = await crearCuponEncargadoService(value);
    if (err) return handleErrorClient(res, 400, err);

    return handleSuccess(res, 201, "Cupón creado por encargado", cupon);
  } catch (err) {
    return handleErrorServer(res, 500, "Error al crear el cupón");
  }
}

export async function generarAnualesEncargado(req, res) {
  const opciones = req.body;
  const [cupones, err] = await generarAnualesEncargadoService(opciones);
  if (err) return handleErrorServer(res, 500, err);

  return handleSuccess(res, 201, "Cupones anuales generados", cupones);
}

export async function listarCuponesEncargado(req, res) {
  try {
  const estado = req.query.estado;
  const [cupones, err] = await listarCuponesEncargadoService(estado);
  if (err) return handleErrorServer(res, 500, err);

  return handleSuccess(res, 200, "Listado de cupones", cupones);
  } catch (err) {
    return handleErrorServer(res, 500, "Error al listar los cupones");
  }
}

export async function actualizarCuponEncargado(req, res) {
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
  
      const [cuponActualizado, serviceError] = await actualizarCuponEncargadoService(cuponId, value);
      if (serviceError) return handleErrorClient(res, 404, serviceError);
  
      return handleSuccess(res, 200, 'Cupón actualizado correctamente', cuponActualizado);
    } catch (err) {
      return handleErrorServer(res, 500, 'Error al actualizar el cupón');
    }
}
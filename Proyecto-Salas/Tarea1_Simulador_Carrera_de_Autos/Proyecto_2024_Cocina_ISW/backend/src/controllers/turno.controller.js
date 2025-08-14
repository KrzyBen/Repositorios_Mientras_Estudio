"use strict";
import { getShiftsService, createOrUpdateShiftService } from "../services/turno.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

// Obtener todos los turnos
export async function getShifts(req, res) {
  try {
    const [turnos, error] = await getShiftsService();
    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Turnos encontrados", turnos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Crear o actualizar un turno
export async function createOrUpdateShift(req, res) {
  try {
    const { body } = req;

    // Crear o actualizar el turno
    const [turno, error] = await createOrUpdateShiftService(body);
    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 201, "Turno creado o actualizado correctamente", turno);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

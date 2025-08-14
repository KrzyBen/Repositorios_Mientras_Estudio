"use strict";
import TurnoSchema from "../entity/turno.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Crear o actualizar un turno
export async function createOrUpdateShiftService(data) {
  try {
    const turnoRepository = AppDataSource.getRepository(TurnoSchema);

    // Buscar si ya existe un turno para el empleado
    let turno = await turnoRepository.findOne({ where: { empleado: data.empleadoId } });

    if (turno) {
      // Actualizar turno existente
      turno.nombreCompleto = data.nombreCompleto;
      turno.horarioTrabajo = data.horarioTrabajo;
    } else {
      // Crear un nuevo turno
      turno = turnoRepository.create(data);
    }

    const savedTurno = await turnoRepository.save(turno);
    return [savedTurno, null];
  } catch (error) {
    return [null, error.message];
  }
}

// Obtener todos los turnos
export async function getShiftsService() {
  try {
    const turnoRepository = AppDataSource.getRepository(TurnoSchema);
    const turnos = await turnoRepository.find({ relations: ["empleado"] });
    return [turnos, null];
  } catch (error) {
    return [null, error.message];
  }
}

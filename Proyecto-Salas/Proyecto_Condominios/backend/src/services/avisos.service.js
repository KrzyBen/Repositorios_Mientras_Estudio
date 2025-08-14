import { AppDataSource } from "../config/configDb.js";
import Aviso from "../entity/avisos.entity.js";

const avisoRepo = AppDataSource.getRepository(Aviso);

export const crearAviso = async (data, usuario) => {
  if (!usuario) throw new Error("Usuario no autenticado");

  const aviso = avisoRepo.create({
    ...data,
    creadoPor: usuario.nombreCompleto,
    estado: "activo", // por defecto
  });
  return await avisoRepo.save(aviso);
};

export const obtenerAvisos = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  return await avisoRepo.find({
    skip: skip,
    take: limit,
    order: { fechaCreacion: "DESC" },  // <-- corregido aquí
  });
};

export const obtenerAvisoPorId = async (id) => {
  return await avisoRepo.findOneBy({ id });
};

export const actualizarAviso = async (id, data) => {
  const aviso = await avisoRepo.findOneBy({ id });
  if (!aviso) return null;

  avisoRepo.merge(aviso, data);
  return await avisoRepo.save(aviso);
};

export const cambiarEstadoAviso = async (id, estado) => {
  const aviso = await avisoRepo.findOneBy({ id });
  if (!aviso) return null;

  aviso.estado = estado; // 'activo' o 'inactivo'
  return await avisoRepo.save(aviso);
};

export const eliminarAviso = async (id) => {
  const result = await avisoRepo.delete(id);
  return result.affected > 0;
};

export const contarAvisos = async () => {
  return await avisoRepo.count();
};

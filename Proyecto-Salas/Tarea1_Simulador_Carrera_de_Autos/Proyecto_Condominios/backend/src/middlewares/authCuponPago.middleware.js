import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";

async function checkUser(req, res) {
  const userRepository = AppDataSource.getRepository(User);
  const userFound = await userRepository.findOneBy({ email: req.user.email });

  if (!userFound) {
    handleErrorClient(res, 404, "Usuario no encontrado en la base de datos");
    return null;
  }

  return userFound;
}

export async function isAdmin(req, res, next) {
  try {
    const user = await checkUser(req, res);
    if (!user) return;

    if (user.rol !== "administrador") {
      return handleErrorClient(
        res,
        403,
        "Acceso denegado",
        "Se requiere rol de administrador para esta acción"
      );
    }

    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function isEncargadoPagos(req, res, next) {
  try {
    const user = await checkUser(req, res);
    if (!user) return;

    if (user.rol !== "encargado_P") {
      return handleErrorClient(
        res,
        403,
        "Acceso denegado",
        "Se requiere rol de encargado de pagos para esta acción"
      );
    }

    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function isVecino(req, res, next) {
  try {
    const user = await checkUser(req, res);
    if (!user) return;

    if (user.rol !== "vecino") {
      return handleErrorClient(
        res,
        403,
        "Acceso denegado",
        "Se requiere rol de vecino para esta acción"
      );
    }

    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Para ver o editar cupones: permitido a encargados o administradores
export async function isAdminOrEncargado(req, res, next) {
  try {
    const user = await checkUser(req, res);
    if (!user) return;

    if (user.rol !== "administrador" && user.rol !== "encargado_P") {
      return handleErrorClient(
        res,
        403,
        "Acceso denegado",
        "Se requiere rol de administrador o encargado de pagos para esta acción"
      );
    }

    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Solo para acciones críticas como eliminar cupones antiguos
export async function isAdminOnly(req, res, next) {
  return isAdmin(req, res, next);
}
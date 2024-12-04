import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";

// Middleware para verificar si el usuario es Administrador
export async function isAdmin(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Buscar al usuario por su correo electrónico
    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
      return handleErrorClient(
        res,
        404,
        "Usuario no encontrado en la base de datos"
      );
    }

    const rolUser = userFound.rol;

    if (rolUser !== "administrador") {
      return handleErrorClient(
        res,
        403,
        "Error al acceder al recurso",
        "Se requiere un rol de administrador para realizar esta acción."
      );
    }

    // Si el usuario es administrador, continuar con la ejecución
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Middleware para verificar si el usuario es Cocinero
export async function isCook(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Buscar al usuario por su correo electrónico
    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
      return handleErrorClient(
        res,
        404,
        "Usuario no encontrado en la base de datos"
      );
    }

    const rolUser = userFound.rol;

    if (rolUser !== "cocinero") {
      return handleErrorClient(
        res,
        403,
        "Error al acceder al recurso",
        "Se requiere un rol de cocinero para realizar esta acción."
      );
    }

    // Si el usuario es cocinero, continuar con la ejecución
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Middleware para verificar si el usuario es Mesero
export async function isWaiter(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Buscar al usuario por su correo electrónico
    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
      return handleErrorClient(
        res,
        404,
        "Usuario no encontrado en la base de datos"
      );
    }

    const rolUser = userFound.rol;

    if (rolUser !== "mesero") {
      return handleErrorClient(
        res,
        403,
        "Error al acceder al recurso",
        "Se requiere un rol de mesero para realizar esta acción."
      );
    }

    // Si el usuario es mesero, continuar con la ejecución
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

"use strict";
import {
  createMenuItemService,
  getAllMenuItemsService,
  getMenuItemService,
  updateMenuItemService,
  deleteMenuItemService,
} from "../services/menu.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { menuValidation } from "../validations/menu.validation.js";

// Crear menú
export async function createMenu(req, res) {
  try {
    const { error, value: data } = menuValidation.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map(err => err.message);
      return handleErrorClient(res, 400, errorMessages);
    }

    // Llamar al servicio para crear el menú
    const [menuItem, serviceError] = await createMenuItemService(data);
    if (serviceError) {
      if (serviceError.includes('ítems')) {
        return handleErrorClient(res, 400, serviceError);
      }
      return handleErrorServer(res, 500, serviceError);
    }

    return handleSuccess(res, 201, "Menú creado exitosamente", menuItem);
  } catch (error) {
    return handleErrorServer(res, 500, "Error en el servidor al crear el menú");
  }
}

// Obtener todos los menús
export async function getMenus(req, res) {
  try {
    const [menus, error] = await getAllMenuItemsService();

    if (error) return handleErrorServer(res, 500, error);
    return handleSuccess(res, 200, "Menús obtenidos", menus);
  } catch (error) {
    return handleErrorServer(res, 500, "Error en el servidor al obtener los menús");
  }
}

// Obtener un menú por su ID
export async function getMenu(req, res) {
  try {
    const { id } = req.params;
    const [menuItem, error] = await getMenuItemService(id);

    if (error) return handleErrorClient(res, 404, error);
    return handleSuccess(res, 200, "Menú obtenido", menuItem);
  } catch (error) {
    return handleErrorServer(res, 500, "Error en el servidor al obtener el menú");
  }
}

// Actualizar un menú
export async function updateMenu(req, res) {
  try {
    const { id } = req.params;
    const { error, value: menuData } = menuValidation.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map(err => err.message);
      return handleErrorClient(res, 400, errorMessages);
    }

    // Llamar al servicio para actualizar el menú
    const [updatedMenu, serviceError] = await updateMenuItemService(id, menuData);
    if (serviceError) return handleErrorServer(res, 500, serviceError);

    return handleSuccess(res, 200, "Menú actualizado exitosamente", updatedMenu);
  } catch (error) {
    return handleErrorServer(res, 500, "Error en el servidor al actualizar el menú");
  }
}

// Eliminar un menú
export async function deleteMenu(req, res) {
  try {
    const { id } = req.params;

    const [deletedMenu, error] = await deleteMenuItemService(id);

    if (error) return handleErrorClient(res, 404, error);
    return handleSuccess(res, 200, "Menú eliminado exitosamente", deletedMenu);
  } catch (error) {
    return handleErrorServer(res, 500, "Error en el servidor al eliminar el menú");
  }
}
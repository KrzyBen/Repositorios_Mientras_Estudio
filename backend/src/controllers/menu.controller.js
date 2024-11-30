"use strict";
import {
  addMenuItem,
  getMenu,
  updateMenuItem,
  deleteMenuItem,
} from "../services/menu.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { menuValidation } from "../validations/menu.validation.js";
import { AppDataSource } from "../config/configDb.js";
import Menu from "../entity/menu.entity.js";

// Función para formatear precios
const formatPrecio = (precio) => `$${Number(precio).toLocaleString("es-CL")}`;

export async function createMenuItem(req, res) {
  try {
    const { body } = req;
    const { error } = menuValidation.validate(body);

    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    // Verificar si ya existe un menú con el mismo nombre
    const menuRepository = AppDataSource.getRepository(Menu);
    const existingMenu = await menuRepository.findOne({
      where: { nombre: body.nombre },
    });

    if (existingMenu) {
      return handleErrorClient(
        res,
        400,
        "Error de validación",
        "Ya existe un menú con este nombre."
      );
    }

    const [newMenuItem, errorNewItem] = await addMenuItem(body);

    if (errorNewItem) {
      return handleErrorClient(res, 400, "Error añadiendo el plato", errorNewItem);
    }

    // Formatear el precio antes de enviar la respuesta
    newMenuItem.precio = formatPrecio(newMenuItem.precio);

    handleSuccess(res, 201, "Plato añadido con éxito", newMenuItem);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getAllMenuItems(req, res) {
  try {
    const [menu, error] = await getMenu();

    if (error) {
      return handleErrorClient(res, 404, "No se encontró el menú");
    }

    // Formatear los precios en el menú
    const formattedMenu = menu.map((item) => ({
      ...item,
      precio: formatPrecio(item.precio),
    }));

    handleSuccess(res, 200, "Menú encontrado", formattedMenu);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function editMenuItem(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;
    const { error } = menuValidation.validate(body);

    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    // Verificar si el nuevo nombre ya existe en otro plato
    const menuRepository = AppDataSource.getRepository(Menu);
    const existingMenu = await menuRepository.findOne({
      where: { nombre: body.nombre },
    });

    if (existingMenu && existingMenu.id !== parseInt(id, 10)) {
      return handleErrorClient(
        res,
        400,
        "Error de validación",
        "Ya existe un menú con este nombre."
      );
    }

    const [updatedMenuItem, errorUpdate] = await updateMenuItem(id, body);

    if (errorUpdate) {
      return handleErrorClient(res, 404, "Error al actualizar el plato", errorUpdate);
    }

    // Formatear el precio antes de enviar la respuesta
    updatedMenuItem.precio = formatPrecio(updatedMenuItem.precio);

    handleSuccess(res, 200, "Plato actualizado con éxito", updatedMenuItem);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function removeMenuItem(req, res) {
  try {
    const { id } = req.params;

    const [deletedMenuItem, error] = await deleteMenuItem(id);

    if (error) {
      return handleErrorClient(res, 404, "Error al eliminar el plato", error);
    }

    handleSuccess(res, 200, "Plato eliminado con éxito", deletedMenuItem);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

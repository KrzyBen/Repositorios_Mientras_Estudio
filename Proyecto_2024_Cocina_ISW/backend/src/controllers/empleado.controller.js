"use strict";
import {
  createEmployeesService,
  getEmployeeService,
  getEmployeesService,
  updateEmployeeService,
  deleteEmployeeService,
} from "../services/empleado.service.js";
import {
  EmployeeBodyValidation,
  EmployeeQueryValidation,
} from "../validations/empleado.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

// Crear empleado y asignar horario
export async function createEmployees(req, res) {
  try {
    const { body } = req;

    // Validar el cuerpo de la solicitud
    const { error } = EmployeeBodyValidation.validate(body);
    if (error) return handleErrorClient(res, 400, error.message);

    // Obtener la lista actual de empleados
    const [Employees, errorEmployees] = await getEmployeesService();
    if (errorEmployees) return handleErrorClient(res, 404, errorEmployees);

    // Verificar si ya hay 20 empleados
    if (Employees.length >= 20) {
      return handleErrorClient(res, 400, "No se pueden registrar más de 20 empleados.");
    }

    // Verificar si el empleado ya existe por nombre, RUT o correo
    const existingEmployee = Employees.find(emp => 
      emp.nombre === body.nombre && emp.rut === body.rut && emp.email === body.email
    );

    if (existingEmployee) {
      return handleErrorClient(res, 400, "Ya existe un empleado con el mismo nombre, RUT y correo electrónico.");
    }

    // Crear el nuevo empleado
    const [Employee, EmployeeError] = await createEmployeesService(body);
    if (EmployeeError) return handleErrorClient(res, 400, EmployeeError);

    handleSuccess(res, 201, "Empleado registrado y horario asignado correctamente", Employee);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener todos los empleados (actualizado para filtrar por rol)
export async function getEmployees(req, res) {
  try {
    const { rol, email } = req.user; // Extraer datos del usuario autenticado (desde el token)

    const [Employees, errorEmployees] = await getEmployeesService();
    if (errorEmployees) return handleErrorClient(res, 404, errorEmployees);

    // Filtrar los empleados según el rol
    let filteredEmployees;

    switch (rol) {
      case "administrador":
        filteredEmployees = Employees; // Administrador ve todo
        break;
      case "cocinero":
        filteredEmployees = Employees.filter(emp => emp.rol === "cocinero");
        break;
      case "mesero":
        filteredEmployees = Employees.filter(emp => emp.rol === "mesero");
        break;
      default:
        filteredEmployees = Employees.filter(emp => emp.email === email); // Otros roles ven solo sus datos
        break;
    }

    handleSuccess(res, 200, "Datos obtenidos correctamente", filteredEmployees);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener un solo empleado
export async function getEmployee(req, res) {
  try {
    const { id } = req.params;
    const { error } = EmployeeQueryValidation.validate({ id });
    if (error) return handleErrorClient(res, 400, error.message);

    const [Employee, errorEmployee] = await getEmployeeService(id);
    if (errorEmployee) return handleErrorClient(res, 404, errorEmployee);

    handleSuccess(res, 200, "Empleado encontrado", Employee);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Actualizar empleado
export async function updateEmployee(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;

    const { error: queryError } = EmployeeQueryValidation.validate({ id });
    if (queryError) return handleErrorClient(res, 400, queryError.message);

    const { error: bodyError } = EmployeeBodyValidation.validate(body);
    if (bodyError) return handleErrorClient(res, 400, bodyError.message);

    const [Employee, EmployeeError] = await updateEmployeeService(id, body);
    if (EmployeeError) return handleErrorClient(res, 400, EmployeeError);

    handleSuccess(res, 200, "Empleado actualizado correctamente", Employee);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Eliminar empleado
export async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;
    const { error } = EmployeeQueryValidation.validate({ id });
    if (error) return handleErrorClient(res, 400, error.message);

    const [EmployeeDelete, errorEmployeeDelete] = await deleteEmployeeService(id);
    if (errorEmployeeDelete) return handleErrorClient(res, 404, errorEmployeeDelete);

    handleSuccess(res, 200, "Empleado eliminado correctamente", EmployeeDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

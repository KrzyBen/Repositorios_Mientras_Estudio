import React, { useState, useEffect } from 'react';
import { createEmployee, updateEmployee } from '@services/employee.service';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';
import '@styles/employeeForm.css';

// Función para formatear el RUT mientras se escribe
const formatRut = (rut) => {
    let cleaned = rut.replace(/[^\dKk]/g, ''); // Eliminar caracteres no numéricos
    if (cleaned.length <= 1) return cleaned; // Si solo hay un dígito, no formatear

    // Agregar puntos y guion
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1).toUpperCase();
    const bodyWithDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${bodyWithDots}-${dv}`;
};

// Función para validar el RUT con las nuevas restricciones
const validateRut = (rut) => {
    const cleaned = rut.replace(/[^\dKk]/g, ''); // Eliminar caracteres no numéricos
    if (cleaned.length < 7 || cleaned.length > 9) return false; // El RUT debe tener entre 7 y 9 caracteres
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1).toUpperCase();

    // Validar que el RUT no sea mayor a 30 millones o menor a 1 millón
    if (parseInt(body) < 1000000 || parseInt(body) >= 30000000) return false;

    // Validación del dígito verificador (simplificada)
    let sum = 0;
    let factor = 2;
    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body.charAt(i)) * factor;
        factor = factor === 7 ? 2 : factor + 1;
    }

    const remainder = sum % 11;
    const calculatedDV = remainder === 0 ? '0' : remainder === 1 ? 'K' : (11 - remainder).toString();
    return calculatedDV === dv;
};

const EmployeeForm = ({ employee, onFormSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        rut: '',
        email: '',
        cargo: '',
        password: '',
        fechaIngreso: '',
        horarioTrabajo: { entrada: '', salida: '' },
        estado: 'activo', // Estado por defecto
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (employee) {
            const horario = employee.horarioTrabajo ? employee.horarioTrabajo.split('-') : ['', ''];
            setFormData({
                nombreCompleto: employee.nombreCompleto || '',
                rut: employee.rut || '',
                email: employee.email || '',
                cargo: employee.cargo || '',
                password: '',
                fechaIngreso: employee.fechaIngreso || '',
                horarioTrabajo: { entrada: horario[0] || '', salida: horario[1] || '' },
                estado: employee.estado || 'activo',
            });
        }
    }, [employee]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'rut') {
            // Formatear el RUT mientras se escribe
            const formattedRut = formatRut(value);
            setFormData({ ...formData, [name]: formattedRut });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        setErrors({ ...errors, [name]: '' });
    };

    const handleScheduleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, horarioTrabajo: { ...formData.horarioTrabajo, [name]: value } });
        setErrors({ ...errors, horarioTrabajo: '' });
    };

    const validateForm = () => {
        const validationErrors = {};

        // Validación del nombre completo
        if (!formData.nombreCompleto) {
            validationErrors.nombreCompleto = 'El nombre completo es obligatorio.';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombreCompleto)) {
            validationErrors.nombreCompleto = 'El nombre solo puede contener letras y espacios.';
        } else if (formData.nombreCompleto.trim().length < 3) {
            validationErrors.nombreCompleto = 'El nombre debe tener al menos 3 caracteres.';
        } else if (formData.nombreCompleto.trim().length > 50) {
            validationErrors.nombreCompleto = 'El nombre no debe exceder los 50 caracteres.';
        }

        // Validación del RUT
        if (!formData.rut) {
            validationErrors.rut = 'El RUT es obligatorio.';
        } else if (!/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/.test(formData.rut)) {
            validationErrors.rut = 'El RUT debe tener un formato válido (ej: 12.345.678-9).';
        }

        // Validación del email
        if (!formData.email) {
            validationErrors.email = 'El email es obligatorio.';
        } else if (!/^[\w.-]+@[\w.-]+\.(com|cl)$/.test(formData.email)) {
            validationErrors.email = 'El email debe ser válido y terminar en ".com" o ".cl".';
        }

        // Validación de la contraseña (solo para nuevos empleados)
        if (!formData.password && !employee) {
            validationErrors.password = 'La contraseña es obligatoria para nuevos empleados.';
        } else if (formData.password && formData.password.length < 6) {
            validationErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
        }

        // Validación de la fecha de ingreso
        if (!formData.fechaIngreso) {
            validationErrors.fechaIngreso = 'La fecha de ingreso es obligatoria.';
        } else if (new Date(formData.fechaIngreso) > new Date('2024-12-31')) {
            validationErrors.fechaIngreso = 'La fecha de ingreso no puede exceder el 31 de diciembre de 2024.';
        }

        // Validación del cargo
        if (!formData.cargo) {
            validationErrors.cargo = 'El cargo es obligatorio.';
        }

        return validationErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const horarioTrabajo = `${formData.horarioTrabajo.entrada}-${formData.horarioTrabajo.salida}`;
            const employeeData = { ...formData, horarioTrabajo };
            if (employee && employee.id) {
                await updateEmployee(employee.id, employeeData);
                showSuccessAlert('Empleado actualizado con éxito');
            } else {
                await createEmployee(employeeData);
                showSuccessAlert('Empleado creado con éxito');
            }
            onFormSubmit();
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 404) {
                showErrorAlert('Error 404', 'No se encontró el recurso solicitado');
            } else {
                showErrorAlert('Error', 'No se pudo procesar la solicitud');
            }
        }
    };

    const generateTimeOptions = (isEntrada = true) => {
        const times = [];
        const startHour = isEntrada ? 8 : 12;
        const endHour = isEntrada ? 12 : 24;

        for (let i = startHour; i < endHour; i++) {
            for (let j = 0; j < 60; j += 30) {
                const hour = i % 12 === 0 ? 12 : i % 12;
                const minute = String(j).padStart(2, '0');
                const period = i < 12 ? 'AM' : 'PM';
                const time = `${hour}:${minute} ${period}`;
                times.push(time);
            }
        }

        if (!isEntrada) {
            times.push('00:00 AM');
        }

        return times;
    };

    return (
        <form onSubmit={handleSubmit} className="employee-form">
            <h2>{employee ? 'Editar Empleado' : 'Agregar Empleado'}</h2>
            <div className="form-group">
                <label>Nombre Completo</label>
                <input
                    type="text"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleInputChange}
                    placeholder="Nombre Completo"
                />
                {errors.nombreCompleto && <span className="error">{errors.nombreCompleto}</span>}
            </div>
            <div className="form-group">
                <label>RUT</label>
                <input
                    type="text"
                    name="rut"
                    value={formData.rut}
                    onChange={handleInputChange}
                    placeholder="RUT"
                />
                {errors.rut && <span className="error">{errors.rut}</span>}
            </div>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="form-group">
                <label>Cargo</label>
                <select
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleInputChange}
                >
                    <option value="">Selecciona un cargo</option>
                    <option value="mesero">Mesero</option>
                    <option value="cocinero">Cocinero</option>
                </select>
                {errors.cargo && <span className="error">{errors.cargo}</span>}
            </div>
            <div className="form-group">
                <label>Contraseña</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Contraseña"
                />
                {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <div className="form-group">
                <label>Fecha de Ingreso</label>
                <input
                    type="date"
                    name="fechaIngreso"
                    value={formData.fechaIngreso}
                    onChange={handleInputChange}
                    max="2024-12-31" // Límite máximo: 31 de diciembre de 2024
                />
                {errors.fechaIngreso && <span className="error">{errors.fechaIngreso}</span>}
            </div>
            <div className="form-group">
                <label>Estado</label>
                <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                </select>
            </div>
            <div className="form-group">
                <label>Horario de Entrada</label>
                <select
                    name="entrada"
                    value={formData.horarioTrabajo.entrada}
                    onChange={handleScheduleChange}
                >
                    <option value="">Selecciona un horario</option>
                    {generateTimeOptions(true).map((time) => (
                        <option key={time} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Horario de Salida</label>
                <select
                    name="salida"
                    value={formData.horarioTrabajo.salida}
                    onChange={handleScheduleChange}
                >
                    <option value="">Selecciona un horario</option>
                    {generateTimeOptions(false).map((time) => (
                        <option key={time} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-buttons">
                <button type="submit">{employee ? 'Actualizar' : 'Crear'}</button>
                <button type="button" onClick={onClose}>
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default EmployeeForm;

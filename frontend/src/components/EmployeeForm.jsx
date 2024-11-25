import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createEmployee, updateEmployee } from '@services/employee.service';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';
import '@styles/employeeForm.css';

const EmployeeForm = ({ employee, onFormSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        rut: '',
        email: '',
        rol: '',
        cargo: 'desconocido',
        password: '',
        fechaIngreso: '',
        horarioTrabajo: new Date(),
        estado: 'activo',
    });

    const [errors, setErrors] = useState({});

    // Cargar datos del empleado si es una edición
    useEffect(() => {
        if (employee) {
            setFormData({
                nombreCompleto: employee.nombreCompleto || '',
                rut: employee.rut || '',
                email: employee.email || '',
                rol: employee.rol || '',
                cargo: employee.cargo || 'desconocido',
                password: '', // Mantener la contraseña vacía durante la edición (no cambiarla)
                fechaIngreso: employee.fechaIngreso || '',
                horarioTrabajo: employee.horarioTrabajo ? new Date(employee.horarioTrabajo) : new Date(),
                estado: employee.estado || 'activo',
            });
        }
    }, [employee]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Limpiar error al cambiar
    };

    const handleScheduleChange = (date) => {
        setFormData({ ...formData, horarioTrabajo: date });
        setErrors({ ...errors, horarioTrabajo: '' });
    };

    const validateForm = () => {
        const validationErrors = {};
        if (!formData.nombreCompleto) validationErrors.nombreCompleto = 'El nombre completo es obligatorio.';
        if (!formData.rut) validationErrors.rut = 'El RUT es obligatorio.';
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) validationErrors.email = 'El email debe ser válido.';
        if (!formData.rol) validationErrors.rol = 'El rol es obligatorio.';
        if (!formData.password && !employee) validationErrors.password = 'La contraseña es obligatoria para nuevos empleados.';
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
            const employeeData = { ...formData, horarioTrabajo: formData.horarioTrabajo.toISOString() };
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

    return (
        <form onSubmit={handleSubmit} className="employee-form">
            <h2>{employee ? 'Editar Empleado' : 'Agregar Empleado'}</h2>
            <div className="form-group">
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
                <input
                    type="text"
                    name="rol"
                    value={formData.rol}
                    onChange={handleInputChange}
                    placeholder="Rol"
                />
                {errors.rol && <span className="error">{errors.rol}</span>}
            </div>
            <div className="form-group">
                <input
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleInputChange}
                    placeholder="Cargo"
                />
            </div>
            <div className="form-group">
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
                <input
                    type="date"
                    name="fechaIngreso"
                    value={formData.fechaIngreso}
                    onChange={handleInputChange}
                    placeholder="Fecha de Ingreso"
                />
            </div>
            <div className="form-group">
                <label>Horario de Trabajo</label>
                <DatePicker
                    selected={formData.horarioTrabajo}
                    onChange={handleScheduleChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    dateFormat="Pp"
                    placeholderText="Selecciona el horario de trabajo"
                />
                {errors.horarioTrabajo && <span className="error">{errors.horarioTrabajo}</span>}
            </div>
            <div className="form-group">
                <select name="estado" value={formData.estado} onChange={handleInputChange}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                </select>
            </div>
            <button type="submit" className="submit-button">{employee ? 'Actualizar' : 'Agregar'}</button>
        </form>
    );
};

export default EmployeeForm;

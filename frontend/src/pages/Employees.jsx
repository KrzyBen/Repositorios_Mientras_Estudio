import React, { useState, useEffect } from 'react';
import useEmployees from '@hooks/useEmployees';
import PopupEmployee from '@components/PopupEmployee';
import useDeleteEmployee from '@hooks/useDeleteEmployee';
import Swal from 'sweetalert2';
import '@styles/employees.css';

const Employees = () => {
    const { employees, fetchEmployees } = useEmployees();
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [rutFilter, setRutFilter] = useState('');
    const [attendancePercentage, setAttendancePercentage] = useState({}); // Estado para porcentaje de asistencia
    const { handleDelete } = useDeleteEmployee(fetchEmployees);

    useEffect(() => {
        // Leer el porcentaje de asistencia desde localStorage al cargar
        const storedAttendance = JSON.parse(localStorage.getItem('attendancePercentage')) || {};

        // Si ya hay empleados y no están en localStorage, inicializa en 
        const initialAttendance = employees.reduce((acc, employee) => {
            acc[employee.id] = storedAttendance[employee.id] ?? 100; // Si no existe, empieza en 0%
            return acc;
        }, {});

        setAttendancePercentage(initialAttendance);
    }, [employees]);

    const handleAttendance = (employee, isPresent) => {
        setAttendancePercentage((prev) => {
            const newAttendance = { ...prev };
            const currentPercentage = newAttendance[employee.id] || 0;

            // Actualizamos el porcentaje de asistencia
            newAttendance[employee.id] = isPresent
                ? Math.min(currentPercentage + 5, 100)  // Incrementa en 5%
                : Math.max(currentPercentage - 10, 0); // Decrece en 10%

            // Guardar en localStorage
            localStorage.setItem('attendancePercentage', JSON.stringify(newAttendance));

            // Verificamos si el empleado debe ser inactivo
            if (newAttendance[employee.id] <= 10) {
                Swal.fire({
                    title: '¡Empleado inactivo!',
                    icon: 'warning',
                    text: `${employee.nombreCompleto} Ha alcanzado un porcentaje de asistencia del ${newAttendance[employee.id]}%. Se recomienda actualizar el Estado del empleado a inactivo.`,
                });
            }

            return newAttendance;
        });

        // Mostrar la notificación de asistencia
        Swal.fire({
            title: isPresent ? '¡Empleado presente!' : '¡Empleado ausente!',
            icon: isPresent ? 'success' : 'error',
            text: `${employee.nombreCompleto} está ahora ${isPresent ? 'presente' : 'ausente'}.`,
        });
    };

    const handleAddEmployee = () => {
        setSelectedEmployee(null);
        setIsPopupOpen(true);
    };

    const handleEditEmployee = (employee) => {
        setSelectedEmployee(employee);
        setIsPopupOpen(true);
    };

    const filteredEmployees = employees.filter((employee) =>
        employee.rut.toLowerCase().includes(rutFilter.toLowerCase())
    );

    return (
        <div className="main-container">
            <h1>Gestión de Empleados</h1>
            <div className="filter-container">
                <input
                    type="text"
                    value={rutFilter}
                    onChange={(e) => setRutFilter(e.target.value)}
                    placeholder="Filtrar por RUT"
                    className="rut-filter-input"
                />
            </div>
            <button onClick={handleAddEmployee}>Agregar Empleado</button>

            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Nombre Completo</th>
                        <th>RUT</th>
                        <th>Email</th>
                        <th>Cargo</th>
                        <th>Acciones</th>
                        <th>Asistencia</th>
                        <th>Asistencia Total</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map((employee) => {
                        const currentAttendance = attendancePercentage[employee.id] || 0;

                        return (
                            <tr key={employee.id}>
                                <td>{employee.nombreCompleto}</td>
                                <td>{employee.rut}</td>
                                <td>{employee.email}</td>
                                <td>{employee.cargo}</td>
                                <td>
                                    <button
                                        onClick={() => handleEditEmployee(employee)}
                                        className="edit-button"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(employee.id)}
                                        className="delete-button"
                                    >
                                        🗑️
                                    </button>
                                </td>
                                <td>
                                    <div className="attendance-buttons">
                                        <button
                                            onClick={() => handleAttendance(employee, true)}
                                            className="attendance-button present"
                                            title="Marcar presente"
                                        >
                                            ✅
                                        </button>
                                        <button
                                            onClick={() => handleAttendance(employee, false)}
                                            className="attendance-button absent"
                                            title="Marcar ausente"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                </td>
                                <td>{currentAttendance}%</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {isPopupOpen && (
                <PopupEmployee
                    show={isPopupOpen}
                    setShow={setIsPopupOpen}
                    employee={selectedEmployee}
                    onFormSubmit={fetchEmployees}
                />
            )}
        </div>
    );
};

export default Employees;

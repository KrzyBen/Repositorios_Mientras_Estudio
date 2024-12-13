import React, { useState, useEffect } from 'react';
import useEmployees from '@hooks/useEmployees';
import PopupEmployee from '@components/PopupEmployee';
import useDeleteEmployee from '@hooks/useDeleteEmployee';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@styles/employees.css';

const Employees = () => {
    const { employees, fetchEmployees } = useEmployees();
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [rutFilter, setRutFilter] = useState('');
    const [attendancePercentage, setAttendancePercentage] = useState({});
    const [attendanceData, setAttendanceData] = useState({});
    const [visibleAttendance, setVisibleAttendance] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState({}); // Control visibility of date picker for each employee
    const { handleDelete } = useDeleteEmployee(fetchEmployees);

    useEffect(() => {
        const storedAttendance = JSON.parse(localStorage.getItem('attendancePercentage')) || {};
        const storedAttendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};

        const initialAttendance = employees.reduce((acc, employee) => {
            acc[employee.id] = storedAttendance[employee.id] ?? 100;
            return acc;
        }, {});

        setAttendancePercentage(initialAttendance);
        setAttendanceData(storedAttendanceData);
    }, [employees]);

    // Función para convertir la fecha en formato dd/mm/yyyy a un objeto Date
    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`);
    };

    const handleAttendance = (employee, isPresent, date) => {
        if (!date) {
            Swal.fire({
                title: 'Selecciona una fecha',
                icon: 'warning',
                text: 'Por favor, selecciona una fecha antes de marcar la asistencia.',
            });
            return;
        }

        // Validar que la fecha seleccionada no sea anterior a la fecha de ingreso del empleado
        const joiningDate = parseDate(employee.fechaIngreso); // Usamos la función parseDate aquí
        if (date < joiningDate) {
            Swal.fire({
                title: 'Fecha no válida',
                icon: 'error',
                text: `No puedes marcar asistencia antes de la fecha de ingreso de ${employee.nombreCompleto}.`,
            });
            return;
        }

        const todayDate = date.toLocaleDateString();
        const employeeAttendance = attendanceData[employee.id] || {};

        if (employeeAttendance[todayDate]) {
            const currentStatus = employeeAttendance[todayDate].isPresent ? 'presente' : 'ausente';
            Swal.fire({
                title: 'Asistencia ya registrada',
                icon: 'info',
                text: `${employee.nombreCompleto} ya está marcado como ${currentStatus} el día ${todayDate}.`,
            });
            return;
        }

        setAttendancePercentage((prev) => {
            const newAttendance = { ...prev };
            const currentPercentage = newAttendance[employee.id] || 0;

            newAttendance[employee.id] = isPresent
                ? Math.min(currentPercentage + 5, 100)
                : Math.max(currentPercentage - 10, 0);

            localStorage.setItem('attendancePercentage', JSON.stringify(newAttendance));
            return newAttendance;
        });

        setAttendanceData((prevData) => {
            const newData = { ...prevData };

            if (!newData[employee.id]) {
                newData[employee.id] = {};
            }

            newData[employee.id][todayDate] = { isPresent, date: todayDate };
            localStorage.setItem('attendanceData', JSON.stringify(newData));
            return newData;
        });

        Swal.fire({
            title: isPresent ? '¡Empleado presente!' : '¡Empleado ausente!',
            icon: isPresent ? 'success' : 'error',
            text: `${employee.nombreCompleto} está ahora ${isPresent ? 'presente' : 'ausente'} el día ${todayDate}.`,
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

    const toggleAttendanceHistory = (employeeId) => {
        setVisibleAttendance((prev) => (prev === employeeId ? null : employeeId));
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
                        <th>Rol</th>
                        <th>Acciones</th>
                        <th>Asistencia</th>
                        <th>Asistencia Total</th>
                        <th>Historial de Asistencia</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map((employee) => {
                        const currentAttendance = attendancePercentage[employee.id] || 0;
                        const employeeAttendance = attendanceData[employee.id] || {};

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
                                            onClick={() => handleAttendance(employee, true, selectedDate)}
                                            className="attendance-button present"
                                            title="Marcar presente"
                                        >
                                            ✅
                                        </button>
                                        <button
                                            onClick={() => handleAttendance(employee, false, selectedDate)}
                                            className="attendance-button absent"
                                            title="Marcar ausente"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                    <button 
                                    className="calendar-button"
                                    onClick={() => setIsDatePickerVisible(prev => ({
                                        ...prev,
                                        [employee.id]: !prev[employee.id]
                                    }))}>
                                        🗓️
                                    </button>
                                    {isDatePickerVisible[employee.id] && (
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={(date) => setSelectedDate(date)}
                                            minDate={parseDate(employee.fechaIngreso)} // Usamos parseDate aquí
                                            dateFormat="dd/MM/yyyy"
                                            isClearable
                                        />
                                    )}
                                </td>
                                <td>{currentAttendance}%</td>
                                <td>
                                    <button
                                        className="eye-button"
                                        onClick={() => toggleAttendanceHistory(employee.id)}
                                    >
                                        👀
                                    </button>
                                    {visibleAttendance === employee.id && (
                                        <div className="attendance-modal">
                                            <div className="attendance-modal-content">
                                                <button
                                                    className="close-modal"
                                                    onClick={() => setVisibleAttendance(null)}
                                                >
                                                    X
                                                </button>
                                                <h3>Historial de Asistencia</h3>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Fecha</th>
                                                            <th>Estado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.keys(employeeAttendance).map(date => (
                                                            <tr key={date}>
                                                                <td>{date}</td>
                                                                <td>
                                                                    {employeeAttendance[date].isPresent
                                                                        ? 'Presente'
                                                                        : 'Ausente'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </td>
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

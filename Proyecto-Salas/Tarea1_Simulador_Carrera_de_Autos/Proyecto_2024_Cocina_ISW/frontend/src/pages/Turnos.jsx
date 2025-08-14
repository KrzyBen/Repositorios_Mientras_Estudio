import React, { useEffect, useState } from 'react';
import EmployeeList from '../components/EmployeeList';
import ShiftForm from '../components/ShiftForm';
import ShiftList from '../components/ShiftList';
import useShifts from '../hooks/useShifts';
import '@styles/Turnos.css';
import { getEmployees } from '../services/employee.service';

const Turnos = () => {
    const { shifts, assignShift } = useShifts();
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

    // Obtener el rol y el email del usuario desde sessionStorage
    const user = JSON.parse(sessionStorage.getItem('usuario')) || null;
    const userEmail = user?.email;
    const userRole = user?.rol;

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const employeeData = await getEmployees();

                // Filtrar empleados según el rol
                if (userRole === 'administrador') {
                    setEmployees(employeeData); // Mostrar todos los empleados si es administrador
                } else if (userEmail) {
                    const filteredEmployees = employeeData.filter(employee => employee.email === userEmail);
                    setEmployees(filteredEmployees); // Solo mostrar el empleado logueado
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, [userEmail, userRole]); // Dependencia para actualizar cuando cambia el usuario logueado

    // Función para eliminar un empleado
    const handleDeleteEmployee = (employeeId) => {
        setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== employeeId));
    };

    // Función para actualizar el estado de un empleado (activo/inactivo)
    const handleUpdateEmployeeStatus = (employeeId, status) => {
        setEmployees(prevEmployees => 
            prevEmployees.map(emp => 
                emp.id === employeeId ? { ...emp, status } : emp
            )
        );
    };

    // Asignar turno a un empleado
    const handleAssignShift = (employeeId) => {
        setSelectedEmployeeId(employeeId);
    };

    const handleSaveShift = (employeeId, shiftData) => {
        assignShift(employeeId, shiftData);
        setSelectedEmployeeId(null); // Cerrar el formulario después de guardar
    };

    return (
        <div className="turnos-page">
            <h2>Gestión de Turnos</h2>

            {/* Administrador: Solo ve la tabla de empleados */}
            {userRole === 'administrador' && (
                <div className="employee-list-container">
                    <EmployeeList 
                        employees={employees} 
                        onAssignShift={handleAssignShift} 
                        onDeleteEmployee={handleDeleteEmployee} 
                        onUpdateEmployeeStatus={handleUpdateEmployeeStatus}
                        userRole={userRole} 
                    />
                </div>
            )}

            {/* Cocinero y Mesero: Verán un mensaje si no hay empleados asignados */}
            {(userRole === 'cocinero' || userRole === 'mesero') && (
                <div className="employee-list-container">
                    {employees.length === 0 ? (
                        <div className="no-access-message">
                            <h3>El administrador aún no habilita el módulo.</h3>
                        </div>
                    ) : (
                        <EmployeeList 
                            employees={employees} 
                            onAssignShift={handleAssignShift} 
                            userRole={userRole} 
                        />
                    )}
                </div>
            )}

            {/* Formulario para asignar turnos */}
            {selectedEmployeeId && (
                <div className="shift-form-container">
                    <ShiftForm
                        employeeId={selectedEmployeeId}
                        onSave={handleSaveShift}
                    />
                </div>
            )}

            {/* Lista de turnos */}
            <div className="shift-list-container">
                <ShiftList shifts={shifts} />
            </div>
        </div>
    );
};

export default Turnos;

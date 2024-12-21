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

    // Obtener el usuario logueado desde sessionStorage
    const user = JSON.parse(sessionStorage.getItem('usuario')) || null;
    const userEmail = user?.email;  // Obtenemos el correo del usuario logueado
    const userRole = user?.rol;  // Obtenemos el rol del usuario logueado (admin o no)

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const employeeData = await getEmployees();

                // Verifica si la respuesta contiene los empleados correctos
                console.log("Empleado Data:", employeeData);

                // Guardar los empleados en sessionStorage para persistencia
                sessionStorage.setItem('employees', JSON.stringify(employeeData));

                // Filtrar empleados según el rol
                if (userRole === 'administrador') {
                    setEmployees(employeeData); // Mostrar todos los empleados si es administrador
                } else if (userEmail) {
                    const filteredEmployees = employeeData.filter((employee) => employee.email === userEmail);
                    console.log("Filtered Employees:", filteredEmployees);
                    setEmployees(filteredEmployees); // Solo mostrar el empleado logueado
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        // Primero intentar cargar empleados desde sessionStorage
        const storedEmployees = sessionStorage.getItem('employees');
        if (storedEmployees) {
            // Si ya tenemos empleados en sessionStorage, usarlos
            const parsedEmployees = JSON.parse(storedEmployees);
            if (userRole === 'administrador') {
                setEmployees(parsedEmployees);
            } else if (userEmail) {
                const filteredEmployees = parsedEmployees.filter(employee => employee.email === userEmail);
                setEmployees(filteredEmployees);
            }
        } else {
            // Si no hay empleados en sessionStorage, realizar la llamada a la API
            if (userEmail && userRole) {
                fetchEmployees();
            }
        }
    }, [userEmail, userRole]); // Dependemos de userEmail y userRole para obtener la lista adecuada de empleados

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

            {/* Muestra la lista de empleados */}
            <div className="employee-list-container">
                <EmployeeList 
                    employees={employees} 
                    onAssignShift={handleAssignShift} 
                    userRole={userRole}  // Pasamos el rol para que se pueda usar en EmployeeList
                />
            </div>

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

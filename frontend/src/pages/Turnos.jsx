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
    const [userRole, setUserRole] = useState(''); // Estado para el rol del usuario

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const employeeData = await getEmployees();
                setEmployees(employeeData);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();

        // Aquí deberías traer el rol del usuario desde el backend o autenticación
        const roleFromBackend = 'administrador';  // Esto es solo un ejemplo
        setUserRole(roleFromBackend); // Establecer el rol del usuario
    }, []);

    const handleAssignShift = (employeeId) => {
        setSelectedEmployeeId(employeeId);
    };

    const handleSaveShift = (employeeId, shiftData) => {
        assignShift(employeeId, shiftData);
        setSelectedEmployeeId(null);  // Cerrar el formulario después de guardar
    };

    return (
        <div className="turnos-page">
            <h2>Gestión de Turnos</h2>
            <div className="employee-list-container">
                {/* Pasamos el rol del usuario a EmployeeList */}
                <EmployeeList 
                    employees={employees} 
                    onAssignShift={handleAssignShift} 
                    userRole={userRole}  // Ahora pasamos el rol
                />
            </div>
            {selectedEmployeeId && (
                <div className="shift-form-container">
                    <ShiftForm
                        employeeId={selectedEmployeeId}
                        onSave={handleSaveShift}
                    />
                </div>
            )}
            <div className="shift-list-container">
                <ShiftList shifts={shifts} />
            </div>
        </div>
    );
};

export default Turnos;

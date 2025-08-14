import React from 'react';

const ShiftList = ({ shifts, employees }) => {
    if (!Array.isArray(shifts) || !Array.isArray(employees)) {
        return <div></div>;
    }

    return (
        <div>
            <h3></h3>
            <ul>
                {shifts.map((shift) => {
                    // Buscar el empleado por su ID
                    const employee = employees.find(emp => emp.id === shift.employeeId);
                    return employee ? (
                        <li key={shift.id}>
                            Empleado: {employee.name}, ID: {employee.id}, Fecha: {shift.shiftDate}, Tipo: {shift.shiftType}
                        </li>
                    ) : null; // Si no se encuentra el empleado, no renderizamos nada
                })}
            </ul>
        </div>
    );
};

export default ShiftList;

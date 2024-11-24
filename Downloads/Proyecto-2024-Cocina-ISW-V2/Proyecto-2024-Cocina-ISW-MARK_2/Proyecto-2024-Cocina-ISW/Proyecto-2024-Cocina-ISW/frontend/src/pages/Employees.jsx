// src/pages/Employees.jsx
import React, { useState } from 'react';
import useEmployees from '@hooks/useEmployees';
import EmployeeForm from '@components/EmployeeForm';
import PopupEmployee from '@components/PopupEmployee';
import useDeleteEmployee from '@hooks/useDeleteEmployee';
import '@styles/employees.css';

const Employees = () => {
    const { employees, fetchEmployees } = useEmployees();
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [rutFilter, setRutFilter] = useState(''); // Add a state for the RUT filter
    const { handleDelete } = useDeleteEmployee(fetchEmployees);

    const handleAddEmployee = () => {
        setSelectedEmployee(null);
        setIsPopupOpen(true);
    };

    const handleEditEmployee = (employee) => {
        setSelectedEmployee(employee);
        setIsPopupOpen(true);
    };

    // Filter employees by RUT
    const filteredEmployees = employees.filter(employee =>
        employee.rut.toLowerCase().includes(rutFilter.toLowerCase())
    );

    return (
        <div className="main-container">
            <h1>Gestión de Empleados</h1>
            <input
                type="text"
                value={rutFilter}
                onChange={(e) => setRutFilter(e.target.value)}
                placeholder="Filtrar por RUT"
                className="rut-filter-input"
            />
            <button onClick={handleAddEmployee}>Agregar Empleado</button>
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Nombre Completo</th>
                        <th>RUT</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.nombreCompleto}</td>
                            <td>{employee.rut}</td>
                            <td>{employee.email}</td>
                            <td>{employee.rol}</td>
                            <td>
                                <button onClick={() => handleEditEmployee(employee)} className="edit-button">
                                    ✏️
                                </button>
                                <button onClick={() => handleDelete(employee.id)} className="delete-button">
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
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

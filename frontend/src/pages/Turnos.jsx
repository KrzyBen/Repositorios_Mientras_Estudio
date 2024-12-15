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
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false); // Estado para controlar el bloqueo

    // Obtener el rol del usuario desde sessionStorage
    const user = JSON.parse(sessionStorage.getItem('usuario')) || null;
    const userRole = user?.rol;

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
    }, []);

    // Filtrar empleados en base al RUT ingresado solo si el RUT está completo
    const handleSearch = () => {
        if (searchTerm.length >= 8) {  // Considerando que el RUT completo tiene al menos 8 caracteres (ajustar según tu caso)
            const filtered = employees.filter((employee) =>
                employee.rut.includes(searchTerm)
            );
            setFilteredEmployees(filtered);

            // Bloquear el cuadro de texto y el botón durante 20 segundos
            setIsSearching(true);
            setTimeout(() => {
                setIsSearching(false); // Desbloquear después de 20 segundos
                setSearchTerm(''); // Limpiar el campo de búsqueda
                setFilteredEmployees([]); // Limpiar los resultados
            }, 40000); // 20 segundos
        } else {
            setFilteredEmployees([]); // Limpiar resultados si el RUT no está completo
        }
    };

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
                        userRole={userRole} 
                    />
                </div>
            )}

            {/* Cocinero y Mesero: Verán primero el formulario de búsqueda */}
            {(userRole === 'cocinero' || userRole === 'mesero') && (
                <>
                    {/* Formulario de búsqueda */}
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar por RUT"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={isSearching} // Bloquear el campo de texto si estamos buscando
                        />
                        <button 
                            onClick={handleSearch} 
                            disabled={isSearching || searchTerm.length < 8} // Deshabilitar el botón si estamos buscando o si el RUT no es válido
                        >
                            Buscar
                        </button>
                    </div>

                    {/* Mostrar la tabla solo si hay resultados */}
                    {filteredEmployees.length > 0 ? (
                        <div className="employee-list-container">
                            <EmployeeList 
                                employees={filteredEmployees} 
                                onAssignShift={handleAssignShift} 
                                userRole={userRole} 
                                showAllColumns // Asegura que todas las columnas estén visibles
                            />
                        </div>
                    ) : (
                        searchTerm && searchTerm.length >= 8 && !isSearching && (
                            <div className="no-results">
                                <p>No se encontraron resultados.</p>
                            </div>
                        )
                    )}
                </>
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

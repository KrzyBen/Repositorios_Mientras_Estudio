import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; 
import '@styles/EmployeeList.css'; 

const EmployeeList = ({ employees, userRole }) => {
    const [turnos, setTurnos] = useState({});

    // Cargar los turnos desde localStorage cuando el componente se monta
    useEffect(() => {
        const today = new Date().toLocaleDateString();
        const lastUpdateDate = localStorage.getItem('lastUpdateDate');
        const storedTurnos = JSON.parse(localStorage.getItem('turnos')) || {};

        if (lastUpdateDate !== today) {
            localStorage.setItem('lastUpdateDate', today);
            localStorage.setItem('turnos', JSON.stringify({}));
            setTurnos({});
        } else {
            setTurnos(storedTurnos);
        }
    }, []);

    const saveTurnosToLocalStorage = (updatedTurnos) => {
        localStorage.setItem('turnos', JSON.stringify(updatedTurnos));
    };

    const handleTurnoEntrada = (employeeId, estado) => {
        if (estado === 'inactivo') {
            Swal.fire({
                title: 'Empleado inactivo',
                text: 'No puedes marcar tu turno porque estás inactivo. Por favor, contacta a tu jefe.',
                icon: 'warning',
            });
            return;
        }

        Swal.fire({
            title: '¿Confirmas tu turno de entrada?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, marcar entrada',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                const horaEntrada = new Date().toLocaleTimeString();
                const updatedTurnos = {
                    ...turnos,
                    [employeeId]: { ...turnos[employeeId], entrada: horaEntrada, entradaMarcado: true },
                };
                setTurnos(updatedTurnos);
                saveTurnosToLocalStorage(updatedTurnos);
                Swal.fire('Turno marcado', `Has marcado tu turno de entrada a las ${horaEntrada}.`, 'success');
            }
        });
    };

    const handleTurnoSalida = (employeeId, estado) => {
        if (estado === 'inactivo') {
            Swal.fire({
                title: 'Empleado inactivo',
                text: 'No puedes marcar tu turno porque estás inactivo. Por favor, contacta a tu jefe.',
                icon: 'warning',
            });
            return;
        }

        Swal.fire({
            title: '¿Confirmas tu turno de salida?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, marcar salida',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                const horaSalida = new Date().toLocaleTimeString();
                const updatedTurnos = {
                    ...turnos,
                    [employeeId]: { ...turnos[employeeId], salida: horaSalida, salidaMarcado: true },
                };
                setTurnos(updatedTurnos);
                saveTurnosToLocalStorage(updatedTurnos);
                Swal.fire('Turno marcado', `Has marcado tu turno de salida a las ${horaSalida}.`, 'success');
            }
        });
    };

    return (
        <div className="employee-list">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>RUT</th>
                        <th>Cargo</th>
                        <th>Horario</th>
                        <th>Estado</th>
                        <th>Marcar Turno</th>
                        <th>Turnos Marcados</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => {
                        const [entrada, salida] = employee.horarioTrabajo
                            ? employee.horarioTrabajo.split('-')
                            : ['No asignado', 'No asignado'];

                        const turnoEntrada = turnos[employee.id]?.entrada || 'No marcado';
                        const turnoSalida = turnos[employee.id]?.salida || 'No marcado';
                        const entradaMarcado = turnos[employee.id]?.entradaMarcado ? 'Sí' : 'No';
                        const salidaMarcado = turnos[employee.id]?.salidaMarcado ? 'Sí' : 'No';

                        return (
                            <tr key={employee.id}>
                                <td>{employee.nombreCompleto}</td>
                                <td>{employee.rut}</td>
                                <td>{employee.cargo || 'No asignado'}</td>
                                <td>
                                    Entrada: {entrada} <br />
                                    Salida: {salida}
                                </td>
                                {userRole !== 'mesero' && userRole !== 'cocinero' && (
                                    <td>{employee.estado === 'activo' ? 'Activo' : 'Inactivo'}</td>
                                )}
                                <td>
                                    {userRole !== 'cocinero' && (
                                        <>
                                            <button
                                                className="btn-turno-entrada"
                                                onClick={() => handleTurnoEntrada(employee.id, employee.estado)}
                                            >
                                                🚪⏰🏁
                                            </button>
                                            <button
                                                className="btn-turno-salida"
                                                onClick={() => handleTurnoSalida(employee.id, employee.estado)}
                                            >
                                                🚶‍♂️⛔🏁
                                            </button>
                                        </>
                                    )}
                                </td>
                                <td>
                                    Entrada: {turnoEntrada} <br />
                                    Salida: {turnoSalida} <br />
                                    {entradaMarcado === 'Sí' && `Entrada marcada a las ${turnoEntrada}`} <br />
                                    {salidaMarcado === 'Sí' && `Salida marcada a las ${turnoSalida}`}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeList;

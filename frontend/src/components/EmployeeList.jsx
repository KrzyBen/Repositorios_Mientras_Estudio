import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import '@styles/EmployeeList.css'; // Archivo CSS para los estilos

const EmployeeList = ({ employees, userRole }) => {
    const [turnos, setTurnos] = useState({});
    const [bitacoras, setBitacoras] = useState({});
    const [editando, setEditando] = useState(null); // Estado para controlar qué bitácora se está editando
    const [nuevoTexto, setNuevoTexto] = useState(''); // Estado para almacenar el nuevo texto de la bitácora

    // Cargar los turnos y bitácoras desde localStorage cuando el componente se monta
    useEffect(() => {
        const today = new Date().toLocaleDateString();
        const lastUpdateDate = localStorage.getItem('lastUpdateDate');
        const storedTurnos = JSON.parse(localStorage.getItem('turnos')) || {};
        const storedBitacoras = JSON.parse(localStorage.getItem('bitacoras')) || {};

        if (lastUpdateDate !== today) {
            localStorage.setItem('lastUpdateDate', today);
            localStorage.setItem('turnos', JSON.stringify({}));
            localStorage.setItem('bitacoras', JSON.stringify({}));
            setTurnos({});
            setBitacoras({});
        } else {
            setTurnos(storedTurnos);
            setBitacoras(storedBitacoras);
        }
    }, []);

    const saveTurnosToLocalStorage = (updatedTurnos) => {
        localStorage.setItem('turnos', JSON.stringify(updatedTurnos));
    };

    const saveBitacorasToLocalStorage = (updatedBitacoras) => {
        localStorage.setItem('bitacoras', JSON.stringify(updatedBitacoras));
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

    const handleBitacoraChange = (employeeId, event) => {
        setNuevoTexto(event.target.value); // Actualiza el texto a medida que el usuario escribe
    };

    const handleEditBitacora = (employeeId) => {
        if (employees.find(emp => emp.id === employeeId).estado === 'inactivo') {
            Swal.fire({
                title: 'Empleado inactivo',
                text: 'No puedes editar la bitácora porque estás inactivo.',
                icon: 'warning',
            });
            return;
        }
        setEditando(employeeId); // Establece que se está editando esta bitácora
        setNuevoTexto(bitacoras[employeeId] || ''); // Carga el texto actual de la bitácora si existe
    };

    const handleSaveBitacora = (employeeId) => {
        const updatedBitacoras = { ...bitacoras, [employeeId]: nuevoTexto }; // Actualiza la bitácora con el nuevo texto
        setBitacoras(updatedBitacoras);
        saveBitacorasToLocalStorage(updatedBitacoras);
        setEditando(null); // Termina la edición
        Swal.fire('Bitácora guardada', 'La bitácora se ha actualizado correctamente.', 'success');
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
                        <th>Bitácora</th>
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
                        const bitacora = bitacoras[employee.id] || ''; // Obtener la bitácora actual

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
                                <td>
                                    {employee.estado === 'inactivo' ? (
                                        <p>No puedes editar la bitácora porque estás inactivo</p>
                                    ) : (
                                        editando === employee.id ? (
                                            <div>
                                                <textarea
                                                    value={nuevoTexto}
                                                    onChange={(e) => handleBitacoraChange(employee.id, e)}
                                                    placeholder="Escribe aquí la bitácora"
                                                />
                                                <button onClick={() => handleSaveBitacora(employee.id)}>Guardar</button>
                                            </div>
                                        ) : (
                                            <>
                                                <p>{bitacora || 'No hay bitácora disponible'}</p>
                                                <button onClick={() => handleEditBitacora(employee.id)}>Editar</button>
                                            </>
                                        )
                                    )}
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

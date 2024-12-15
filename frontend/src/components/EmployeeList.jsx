import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '@styles/EmployeeList.css';

const EmployeeList = ({ employees, userRole }) => {
    const [turnos, setTurnos] = useState({});
    const [bitacoras, setBitacoras] = useState({});
    const [attendancePercentage, setAttendancePercentage] = useState({});
    const [attendanceData, setAttendanceData] = useState({});
    const [editando, setEditando] = useState(null);
    const [nuevoTexto, setNuevoTexto] = useState('');
    const [attendanceHistoryVisible, setAttendanceHistoryVisible] = useState(null);

    // This effect runs once when the component mounts
    useEffect(() => {
        const today = new Date().toLocaleDateString();
        const lastUpdateDate = localStorage.getItem('lastUpdateDate');
        const storedTurnos = JSON.parse(localStorage.getItem('turnos')) || {};
        const storedBitacoras = JSON.parse(localStorage.getItem('bitacoras')) || {};
        const storedAttendance = JSON.parse(localStorage.getItem('attendancePercentage')) || {};
        const storedAttendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};

        // If the date has changed, reset the turnos (shifts)
        if (lastUpdateDate !== today) {
            localStorage.setItem('lastUpdateDate', today);
            localStorage.setItem('turnos', JSON.stringify({}));  // Reset turnos
            localStorage.setItem('bitacoras', JSON.stringify({}));  // Reset bitacoras
            localStorage.setItem('attendancePercentage', JSON.stringify({}));  // Reset attendance percentages
            localStorage.setItem('attendanceData', JSON.stringify({}));  // Reset attendance data

            // Reset state values
            setTurnos({});  // Reset turnos
            setBitacoras({});  // Reset bitacoras
            setAttendancePercentage({});  // Reset attendance percentages
            setAttendanceData({});  // Reset attendance data
        } else {
            setTurnos(storedTurnos);  // Load stored turnos
            setBitacoras(storedBitacoras);  // Load stored bitacoras
            setAttendancePercentage(storedAttendance);  // Load stored attendance percentages
            setAttendanceData(storedAttendanceData);  // Load stored attendance data
        }
    }, []);

    // Save updated data to localStorage
    const saveTurnosToLocalStorage = (updatedTurnos) => {
        localStorage.setItem('turnos', JSON.stringify(updatedTurnos));
    };

    const saveBitacorasToLocalStorage = (updatedBitacoras) => {
        localStorage.setItem('bitacoras', JSON.stringify(updatedBitacoras));
    };

    const saveAttendanceToLocalStorage = (updatedAttendance) => {
        localStorage.setItem('attendancePercentage', JSON.stringify(updatedAttendance));
    };

    const saveAttendanceDataToLocalStorage = (updatedAttendanceData) => {
        localStorage.setItem('attendanceData', JSON.stringify(updatedAttendanceData));
    };

    // Handle employee shift entry
    const handleTurnoEntrada = (employeeId, estado) => {
        if (estado === 'inactivo') {
            Swal.fire({
                title: 'Empleado inactivo',
                text: 'No puedes marcar tu turno porque estás inactivo. Por favor, contacta a tu jefe.',
                icon: 'warning',
            });
            return;
        }

        if (turnos[employeeId]?.entradaMarcado) {
            Swal.fire({
                title: 'Turno ya registrado',
                text: `Tu turno de entrada ya fue marcado a las ${turnos[employeeId].entrada}.`,
                icon: 'info',
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

    // Handle employee shift exit
    const handleTurnoSalida = (employeeId, estado) => {
        if (estado === 'inactivo') {
            Swal.fire({
                title: 'Empleado inactivo',
                text: 'No puedes marcar tu turno porque estás inactivo. Por favor, contacta a tu jefe.',
                icon: 'warning',
            });
            return;
        }

        if (turnos[employeeId]?.salidaMarcado) {
            Swal.fire({
                title: 'Turno ya registrado',
                text: `Tu turno de salida ya fue marcado a las ${turnos[employeeId].salida}.`,
                icon: 'info',
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

    // Handle attendance (presence or absence)
    const handleAttendance = (employeeId, isPresent) => {
        const todayDate = new Date().toLocaleDateString();

        if (attendanceData[employeeId]?.[todayDate]) {
            const currentStatus = attendanceData[employeeId][todayDate].isPresent ? 'presente' : 'ausente';
            Swal.fire({
                title: 'Asistencia ya registrada',
                icon: 'info',
                text: `Ya se ha registrado asistencia para ${employeeId} el día ${todayDate} como ${currentStatus}.`,
            });
            return;
        }

        setAttendancePercentage((prev) => {
            const newAttendance = { ...prev };
            const currentPercentage = newAttendance[employeeId] || 0;
            newAttendance[employeeId] = isPresent
                ? Math.min(currentPercentage + 5, 100)
                : Math.max(currentPercentage - 10, 0);

            saveAttendanceToLocalStorage(newAttendance);
            return newAttendance;
        });

        setAttendanceData((prevData) => {
            const newData = { ...prevData };
            newData[employeeId] = {
                ...newData[employeeId],
                [todayDate]: { isPresent, date: todayDate },
            };

            saveAttendanceDataToLocalStorage(newData);
            return newData;
        });

        Swal.fire({
            title: isPresent ? '¡Empleado presente!' : '¡Empleado ausente!',
            icon: isPresent ? 'success' : 'error',
            text: `${employeeId} está ahora ${isPresent ? 'presente' : 'ausente'} el día ${todayDate}.`,
        });
    };

    // Toggle attendance history visibility
    const toggleAttendanceHistory = (employeeId) => {
        setAttendanceHistoryVisible((prev) => (prev === employeeId ? null : employeeId));
    };

    // Handle bitacora text change
    const handleBitacoraChange = (employeeId, event) => {
        setNuevoTexto(event.target.value);
    };

    // Save bitacora
    const handleSaveBitacora = (employeeId) => {
        const updatedBitacoras = {
            ...bitacoras,
            [employeeId]: nuevoTexto,
        };

        setBitacoras(updatedBitacoras);
        saveBitacorasToLocalStorage(updatedBitacoras);

        setNuevoTexto('');
        setEditando(null);

        Swal.fire('¡Éxito!', 'La bitácora ha sido guardada correctamente.', 'success');
    };

    // Edit bitacora
    const handleEditBitacora = (employeeId) => {
        setEditando(employeeId);
        setNuevoTexto(bitacoras[employeeId] || '');
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
                        <th>% Asistencia</th>
                        <th>Historial Asistencia</th>
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
                        const bitacora = bitacoras[employee.id] || '';
                        const attendancePercentageValue = attendancePercentage[employee.id] || 0;
                        const employeeAttendance = attendanceData[employee.id] || {};

                        return (
                            <tr key={employee.id}>
                                <td>{employee.nombreCompleto}</td>
                                <td>{employee.rut}</td>
                                <td>{employee.cargo || 'No asignado'}</td>
                                <td>
                                    Entrada: {entrada} <br />
                                    Salida: {salida}
                                </td>
                                <td>{employee.estado === 'activo' ? 'Activo' : 'Inactivo'}</td>
                                <td>{attendancePercentageValue}%</td>
                                <td>
                                    <button onClick={() => toggleAttendanceHistory(employee.id)} className="btn-history">
                                        🗓️
                                    </button>
                                    {attendanceHistoryVisible === employee.id && (
                                        <div className="attendance-history-container">
                                            <div className="attendance-history-header">
                                                <h4>Historial de Asistencia</h4>
                                                <button className="close-history" onClick={() => setAttendanceHistoryVisible(null)}>
                                                    X
                                                </button>
                                            </div>
                                            {Object.keys(employeeAttendance).length > 0 ? (
                                                <table className="attendance-history-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Fecha</th>
                                                            <th>Estado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.keys(employeeAttendance).map((date) => (
                                                            <tr key={date}>
                                                                <td>{date}</td>
                                                                <td>{employeeAttendance[date].isPresent ? 'Presente' : 'Ausente'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div>No hay historial de asistencia.</div>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <button className="btn-turno-entrada" onClick={() => handleTurnoEntrada(employee.id, employee.estado)}>
                                        🚪⏰🏁
                                    </button>
                                    <button className="btn-turno-salida" onClick={() => handleTurnoSalida(employee.id, employee.estado)}>
                                        🚶‍♂️⛔🏁
                                    </button>
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
                                            <div>
                                                <p>{bitacora || 'No hay bitácora'}</p>
                                                <button onClick={() => handleEditBitacora(employee.id)}>Editar</button>
                                            </div>
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

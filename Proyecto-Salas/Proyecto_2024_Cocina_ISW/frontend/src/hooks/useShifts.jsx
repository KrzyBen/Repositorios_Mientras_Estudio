import { useState, useEffect } from 'react';  

import { getShifts, createShift } from '../services/shift.service';

const useShifts = () => {
    const [shifts, setShifts] = useState([]);  // Inicializa el estado de los turnos

    // Efecto para obtener los turnos al montar el componente
    useEffect(() => {
        const fetchShifts = async () => {
            const shiftData = await getShifts();  // Obtiene los turnos desde el backend
            setShifts(shiftData);  // Actualiza el estado con los turnos obtenidos
        };
        fetchShifts();  // Llama a la función de obtener turnos
    }, []);  // El array vacío asegura que solo se ejecute una vez al montar el componente

    // Función para asignar un turno a un empleado
    const assignShift = async (employeeId, shiftData) => {
        const newShift = await createShift(employeeId, shiftData);  // Crea un nuevo turno
        setShifts((prevShifts) => [...prevShifts, newShift]);  // Actualiza el estado con el nuevo turno
    };

    return { shifts, assignShift };  // Devuelve los turnos y la función para asignar un turno
};

export default useShifts;  // Exporta el hook para su uso en otros componentes

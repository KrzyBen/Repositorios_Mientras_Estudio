import axios from './root.service';

export const createShift = async (employeeId, shiftData) => {
  try {
    
    const dataToSend = {
      empleadoId: employeeId,
      nombreCompleto: shiftData.nombreCompleto,
      horarioTrabajo: shiftData.horarioTrabajo,
    };

  
    const response = await axios.post('/turnos/createOrUpdate', dataToSend);

    return response.data; 
  } catch (error) {
    console.error('Error creating shift:', error);
    throw error; // Lanza el error para manejarlo en el componente o función que lo llame
  }
};

// Obtener todos los turnos
export const getShifts = async () => {
  try {
    const response = await axios.get('/turnos/get');
    return response.data; // Retorna los datos de los turnos
  } catch (error) {
    console.error('Error fetching shifts:', error);
    throw error; // Lanza el error
  }
};

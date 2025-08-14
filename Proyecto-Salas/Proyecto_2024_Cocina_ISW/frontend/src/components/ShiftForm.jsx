import React, { useState } from 'react';

const ShiftForm = ({ employeeId, onSave }) => {
    const [shiftDate, setShiftDate] = useState('');
    const [shiftType, setShiftType] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(employeeId, { shiftDate, shiftType });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Fecha del Turno:</label>
                <input
                    type="date"
                    value={shiftDate}
                    onChange={(e) => setShiftDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Tipo de Turno:</label>
                <select
                    value={shiftType}
                    onChange={(e) => setShiftType(e.target.value)}
                    required
                >
                    <option value="">Seleccione un tipo</option>
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noche">Noche</option>
                </select>
            </div>
            <button type="submit">Asignar Turno</button>
        </form>
    );
};

export default ShiftForm;

import { useForm, useWatch } from 'react-hook-form';
import { useEffect, useState } from 'react';
import '@styles/form.css';

export default function CuponForm({ defaultValues, onSubmit, isEdit = false }) {
  const safeDefaults = defaultValues ?? {};
  const currentYear = new Date().getFullYear();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      año: safeDefaults.año || currentYear,
      mes: safeDefaults.mes || 1,
      monto: safeDefaults.monto || 1000,
      montoDescuento: safeDefaults.montoDescuento || 0,
      descripcionPago: safeDefaults.descripcionPago || 'Pago de cuota Mensual',
      estado: safeDefaults.estado || 'pendiente',
      tipo: safeDefaults.tipo || 'mensual',
      fechaPago: safeDefaults.fechaPago ? safeDefaults.fechaPago.slice(0, 10) : '',
      fechaCompromiso: safeDefaults.fechaCompromiso ? safeDefaults.fechaCompromiso.slice(0, 10) : '',
    }
  });

  const [limitesFecha, setLimitesFecha] = useState({ min: '', max: '' });

  const año = useWatch({ control, name: 'año' });
  const mes = useWatch({ control, name: 'mes' });

  useEffect(() => {
    if (año) {
      const inicio = new Date(año, 0, 1); // 1 enero
      const fin = new Date(año, 11, 31); // 31 diciembre
      const hoy = new Date();
      const minDate = new Date(Math.max(inicio, hoy));
      setLimitesFecha({
        min: minDate.toISOString().split('T')[0],
        max: fin.toISOString().split('T')[0]
      });
    }
  }, [año]);


  const handleInternalSubmit = (data) => {
    const cleaned = {
      ...data,
      fechaPago: data.fechaPago || null,
      fechaCompromiso: data.fechaCompromiso || null,
    };
    onSubmit(cleaned);
  };

  return (
    <form className="form" onSubmit={handleSubmit(handleInternalSubmit)}>
      <h2>{isEdit ? 'Editar Cupón' : 'Crear Cupón'}</h2>

      <div className="container_inputs">
        <label>Año</label>
        <input
          type="number"
          min={currentYear}
          max={2060}
          {...register('año', { required: 'Requerido' })}
        />
        {errors.año && <span>{errors.año.message}</span>}
      </div>

      <div className="container_inputs">
        <label>Mes</label>
        <select {...register('mes', { required: 'Requerido' })}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        {errors.mes && <span>{errors.mes.message}</span>}
      </div>

      <div className="container_inputs">
        <input
          type="number"
          min={0}
          step={10}
          {...register('monto', {
            required: 'Requerido',
            validate: (value) =>
              value % 10 === 0 || 'Debe ser múltiplo de 10',
          })}
        />
        {errors.monto && <span>{errors.monto.message}</span>}
      </div>

      <div className="container_inputs">
        <label>Descuento</label>
        <input
          type="number"
          min={0}
          step={10}
          {...register('montoDescuento', {
            validate: (value) => {
              const monto = parseInt(control._formValues.monto || 0);
              if (value % 10 !== 0) return 'Debe ser múltiplo de 10';
              if (value > monto) return 'No puede ser mayor que el monto';
              return true;
            }
          })}
        />
        {errors.montoDescuento && <span>{errors.montoDescuento.message}</span>}
      </div>

      <div className="container_inputs">
        <label>Descripción</label>
        <input type="text" {...register('descripcionPago')} />
      </div>

      <div className="container_inputs">
        <label>Estado</label>
        <select {...register('estado', { required: 'Requerido' })}>
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pagado</option>
          <option value="comprometido">Comprometido</option>
          <option value="oculto">Oculto</option>
        </select>
      </div>

      <div>
        <label>Tipo</label>
        <select {...register('tipo', { required: 'Requerido' })}>
          <option value="mensual">Mensual</option>
          <option value="renovación">Renovación</option>
          <option value="extraordinario">Extraordinario</option>
        </select>
      </div>
      
      <div className="container_inputs">
        <label>Fecha de Pago</label>
        <input
          type="date"
          {...register('fechaPago', {
            validate: (value) => {
              if (!value) return true; // es opcional
              const date = new Date(value);
              const min = new Date(limitesFecha.min);
              const max = new Date(limitesFecha.max);
              if (date < min) return 'Fecha fuera del rango permitido';
              if (date > max) return 'Fecha fuera del rango permitido';
              return true;
            }
          })}
          min={!isEdit ? limitesFecha.min : undefined}
          max={!isEdit ? limitesFecha.max : undefined}
        />
        {errors.fechaPago && <span>{errors.fechaPago.message}</span>}
      </div>

      <div className="container_inputs">
        <label>Fecha de Compromiso</label>
        <input
          type="date"
          {...register('fechaCompromiso', {
            validate: (value) => {
              if (!value) return true;
              const date = new Date(value);
              const min = new Date(limitesFecha.min);
              const max = new Date(limitesFecha.max);
              if (date < min) return 'Fecha fuera del rango permitido';
              if (date > max) return 'Fecha fuera del rango permitido';
              return true;
            }
          })}
          min={!isEdit ? limitesFecha.min : undefined}
          max={!isEdit ? limitesFecha.max : undefined}
        />
        {errors.fechaCompromiso && <span>{errors.fechaCompromiso.message}</span>}
      </div>

      <button type="submit">{isEdit ? 'Guardar Cambios' : 'Crear Cupón'}</button>
    </form>
  );
}
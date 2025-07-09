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
    if (año && mes) {
      const inicio = new Date(año, mes - 1, 1);
      const fin = new Date(año, mes, 0);
      const hoy = new Date();
      const minDate = new Date(Math.max(inicio, hoy));
      setLimitesFecha({
        min: minDate.toISOString().split('T')[0],
        max: fin.toISOString().split('T')[0]
      });
    }
  }, [año, mes]);

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
        <label>Monto</label>
        <input
          type="number"
          min={0}
          step={10}
          {...register('monto', { required: 'Requerido' })}
        />
        {errors.monto && <span>{errors.monto.message}</span>}
      </div>

      <div className="container_inputs">
        <label>Descuento</label>
        <input
          type="number"
          min={0}
          step={10}
          {...register('montoDescuento')}
        />
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
          {...register('fechaPago')}
          min={!isEdit ? limitesFecha.min : undefined}
          max={!isEdit ? limitesFecha.max : undefined}
        />
      </div>

      <div className="container_inputs">
        <label>Fecha de Compromiso</label>
        <input
          type="date"
          {...register('fechaCompromiso')}
          min={!isEdit ? limitesFecha.min : undefined}
          max={!isEdit ? limitesFecha.max : undefined}
        />
      </div>

      <button type="submit">{isEdit ? 'Guardar Cambios' : 'Crear Cupón'}</button>
    </form>
  );
}
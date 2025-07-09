import { useForm } from 'react-hook-form';

export default function PopupGenerarCupones({ show, setShow, onSubmit }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      año: new Date().getFullYear(),
      monto: 1000,
      descripcionPago: ''
    }
  });

  const handleClose = () => setShow(false);

  return show ? (
    <div className="popup">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Generar Cupones Anuales</h2>

        <label>Año</label>
        <input type="number" {...register('año', { required: true })} />

        <label>Monto</label>
        <input type="number" {...register('monto', { required: true })} />

        <label>Descripción</label>
        <input type="text" {...register('descripcionPago')} />

        <div className="form-actions">
          <button type="submit">Generar</button>
          <button type="button" onClick={handleClose}>Cancelar</button>
        </div>
      </form>
    </div>
  ) : null;
}

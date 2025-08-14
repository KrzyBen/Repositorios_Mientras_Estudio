import CuponForm from './CuponForm';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupCupon({ show, setShow, defaultValues, onSubmit, isEdit }) {
  if (!show) return null;

  return (
    <div className="bg">
      <div className="popup">
        <button className="close" onClick={() => setShow(false)}>
          <img src={CloseIcon} alt="Cerrar" />
        </button>

        <CuponForm
          defaultValues={defaultValues}
          isEdit={isEdit}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Table from '@components/Table';
import PopupCupon from '@components/PopupCuponForm';
import CuponForm from '@components/CuponForm';
import { obtenerCuponesPorVecino, editarCupon, eliminarCupon, crearCupon } from '@services/CouponsAdmin.service';
import '@styles/styles.css';
import '@styles/cuponesAdmin.css';

export default function CuponesVecinoAdmin() {
  const { vecinoId } = useParams();
  const navigate = useNavigate();

  const [cupones, setCupones] = useState([]);
  const [vecinoNombre, setVecinoNombre] = useState('');
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cuponEditar, setCuponEditar] = useState(null);

  const cargarCupones = async () => {
    const res = await obtenerCuponesPorVecino(vecinoId);
    if (res && res.data) {
      const ordenados = res.data.sort((a, b) => a.mes - b.mes);
      setCupones(ordenados);
      if (res.data.length > 0) {
        setVecinoNombre(res.data[0].vecino?.nombre || '');
      }
    }
  };

  useEffect(() => {
    cargarCupones();
  }, []);

  const columnasCupones = [
    { title: 'Año', field: 'año' },
    { title: 'Mes', field: 'mes' },
    { title: 'Monto', field: 'monto' },
    { title: 'Descuento', field: 'montoDescuento' },
    { title: 'Descripción', field: 'descripcionPago' },
    { title: 'Estado', field: 'estado' },
    {
      title: 'Tipo',
      field: 'tipo',
      formatter: (cell) => {
        const value = cell.getValue();
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
    },
    {
      title: 'Fecha de Pago',
      field: 'fechaPago',
      formatter: (cell) => {
        const value = cell.getValue();
        return value ? new Date(value).toLocaleDateString('es-CL') : '';
      }
    },
    {
      title: 'Fecha de Compromiso',
      field: 'fechaCompromiso',
      formatter: (cell) => {
        const value = cell.getValue();
        return value ? new Date(value).toLocaleDateString('es-CL') : '';
      }
    },
    {
      title: 'Acciones',
      formatter: (cell) => {
        const rowData = cell.getRow().getData();

        const container = document.createElement('div');

        const btnEditar = document.createElement('button');
        btnEditar.className = 'pcpa_btn_editar';
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => {
          setCuponEditar(rowData);
          setModoEdicion(true);
          setMostrarPopup(true);
        };

        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'pcpa_btn_eliminar';
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = () => {
          console.log("Eliminando cupón ID:", rowData.id);
          if (window.confirm('¿Está seguro que desea eliminar este cupón?')) {
            eliminarCupon(rowData.id).then((res) => {
              console.log("Respuesta al eliminar:", res);
              cargarCupones();
            }).catch((err) => {
              console.error("Error al eliminar cupón:", err);
              alert("Error al eliminar cupón");
            });
          }
        };


        container.appendChild(btnEditar);
        container.appendChild(btnEliminar);

        return container;
      }
    }
  ];

  const camposForm = [
    { label: 'Año', name: 'año', fieldType: 'input', type: 'number', required: true, defaultValue: cuponEditar?.año || '' },
    { label: 'Mes', name: 'mes', fieldType: 'input', type: 'number', required: true, defaultValue: cuponEditar?.mes || '' },
    { label: 'Monto', name: 'monto', fieldType: 'input', type: 'number', required: true, defaultValue: cuponEditar?.monto || '' },
    { label: 'Descuento', name: 'montoDescuento', fieldType: 'input', type: 'number', required: false, defaultValue: cuponEditar?.montoDescuento || '' },
    { label: 'Descripción', name: 'descripcionPago', fieldType: 'input', type: 'text', required: false, defaultValue: cuponEditar?.descripcionPago || '' },
    { label: 'Estado', name: 'estado', fieldType: 'select', required: true, defaultValue: cuponEditar?.estado || 'pendiente', options: [
      { label: 'Pendiente', value: 'pendiente' },
      { label: 'Pagado', value: 'pagado' },
      { label: 'Comprometido', value: 'comprometido' },
      { label: 'Oculto', value: 'oculto' }
    ] },
  ];

  const onSubmitCupon = (data) => {
  if (modoEdicion && cuponEditar) {
    const dataLimpia = { ...data };
    delete dataLimpia.vecinoId;

    editarCupon(cuponEditar.id, dataLimpia).then(() => {
      setMostrarPopup(false);
      cargarCupones();
      setModoEdicion(false);
      setCuponEditar(null);
    });
  } else {
    crearCupon({ ...data, vecinoId }).then(() => {
      setMostrarPopup(false);
      cargarCupones();
    });
  }
};

  return (
    <div className="pcpa_container">
      <h1 className="pcpa_title">Cupones de {vecinoNombre}</h1>

      <button className="pcpa_btn_crear_cupon" onClick={() => {
        setModoEdicion(false);
        setCuponEditar(null);
        setMostrarPopup(true);
      }}>
        Crear Cupón Individual
      </button>

      <Table data={cupones} columns={columnasCupones} />

      <button className="pcpa_btn_ver_cupones" onClick={() => navigate('/cupones-admin')}>
        Volver a Vecinos
      </button>

      <PopupCupon
          show={mostrarPopup}
          setShow={setMostrarPopup}
          defaultValues={cuponEditar}
          isEdit={modoEdicion}
          onSubmit={onSubmitCupon}
        />
    </div>
  );
}
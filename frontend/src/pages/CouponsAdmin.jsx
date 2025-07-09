import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@components/Table';
import PopupGenerarCupones from '@components/PopupGenerarCupones';
import useCuponesAdmin from '@hooks/cupones/useCuponesAdmin';
import '@styles/styles.css';
import '@styles/cuponesAdmin.css';

export default function CuponesAdmin() {
  const { vecinos, cargarVecinos, generarCupones } = useCuponesAdmin();
  const navigate = useNavigate();

  const [mostrarGenerador, setMostrarGenerador] = useState(false);

  useEffect(() => {
    cargarVecinos();
  }, []);

  const columnasVecinos = [
    { title: 'Nombre', field: 'nombre' },
    { title: 'Email', field: 'email' },
    { title: 'RUT', field: 'rut' },
    {
      title: "Acciones",
      headerSort: false,
      formatter: function(cell) {
        return "<button class='pcpa_btn_ver_cupones'>Ver Cupones</button>";
      },
      cellClick: function(e, cell) {
        const rowData = cell.getRow().getData();
        navigate(`/cupones-admin/vecino/${rowData.id}`);
      }
    }
  ];

  const handleGenerar = async (formData) => {
    await generarCupones({
      ...formData,
      monto: Number(formData.monto)
    });

    setMostrarGenerador(false);
    cargarVecinos(); // opcional, si quieres actualizar la tabla
  };

  return (
    <div className="pcpa_container">
      <h1 className="pcpa_title">Gestión de Cupones - Administrador</h1>

      <div className="pcpa_vecinos_section">
        <h2>Lista de Vecinos</h2>
        <button
          className="pcpa_btn_generar_anual"
          onClick={() => setMostrarGenerador(true)}
        >
          Generar Cupones Anuales
        </button>
        <Table data={vecinos} columns={columnasVecinos} />
      </div>

      <PopupGenerarCupones
        show={mostrarGenerador}
        setShow={setMostrarGenerador}
        onSubmit={handleGenerar}
      />
    </div>
  );
}

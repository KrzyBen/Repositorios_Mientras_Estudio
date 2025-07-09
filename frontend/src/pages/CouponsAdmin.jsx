import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@components/Table';
import useCuponesAdmin from '@hooks/cupones/useCuponesAdmin';
import '@styles/styles.css';
import '@styles/cuponesAdmin.css';

export default function CuponesAdmin() {
  const { vecinos, cargarVecinos, generarCupones } = useCuponesAdmin();
  const navigate = useNavigate();

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
      formatter: function(cell, formatterParams, onRendered) {
        return "<button class='pcpa_btn_ver_cupones'>Ver Cupones</button>";
      },
      cellClick: function(e, cell) {
        const rowData = cell.getRow().getData();
        // Aquí rediriges usando navigate
        navigate(`/cupones-admin/vecino/${rowData.id}`);
      }
    }
  ];

  return (
    <div className="pcpa_container">
      <h1 className="pcpa_title">Gestión de Cupones - Administrador</h1>

      <div className="pcpa_vecinos_section">
        <h2>Lista de Vecinos</h2>
        <button
          className="pcpa_btn_generar_anual"
          onClick={() =>
            generarCupones({ monto: 1000, año: new Date().getFullYear() })
          }
        >
          Generar Cupones Anuales
        </button>
        <Table data={vecinos} columns={columnasVecinos} />
      </div>
    </div>
  );
}
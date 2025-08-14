import useCuponesVecino from "@hooks/cupones/useCuponesVecino";
import Table from "@components/Table";
import '@styles/coupons.css';
import '@styles/table.css';

const Cupones = () => {
  const {
    cupones,
    handlePago,
    handleDescargarPDF,
    handleComprometer
  } = useCuponesVecino();

  const columns = [
    { title: "Año", field: "año", headerSort: false },
    { title: "Mes", field: "mes", headerSort: false },
    { title: "Monto", field: "monto", headerSort: false },
    { title: "Descuento", field: "montoDescuento", headerSort: false },
    { title: "Descripción", field: "descripcionPago", headerSort: false },
    { title: "Estado", field: "estado", headerSort: false },
    { title: "Fecha Pago", field: "fechaPago", headerSort: false },
    { title: "Fecha Compromiso", field: "fechaCompromiso", headerSort: false },
    {
      title: "Acciones",
      formatter: (cell) => {
        const cupon = cell.getRow().getData();
        if (cupon.estado === "pendiente") {
          return `
            <button class='btn-pagar'>Pagar</button>
            <button class='btn-comprometer'>Comprometer</button>
          `;
        } else if (cupon.estado === "comprometido") {
          return "<button class='btn-pagar'>Pagar</button>";
        } else if (cupon.estado === "pagado") {
          return "<button class='btn-descargar'>Descargar PDF</button>";
        }
        return "";
      },
      cellClick: (e, cell) => {
        const cupon = cell.getRow().getData();
        if (e.target.classList.contains("btn-pagar")) {
          handlePago(cupon.id);
        } else if (e.target.classList.contains("btn-descargar")) {
          handleDescargarPDF(cupon.id);
        } else if (e.target.classList.contains("btn-comprometer")) {
          handleComprometer(cupon.id, cupon.rawFechaPago);
        }
      },
      headerSort: false,
    },
  ];

  return (
    <div className="cupones-container">
      <h1>Mis Cupones</h1>
      <Table data={cupones} columns={columns} initialSortName="año" />
    </div>
  );
};

export default Cupones;
import { useEffect, useState } from "react";
import { getCuponesVecino, iniciarPagoCupon, descargarPdf, revertirPagoCupon } from "@services/Coupons.service";
import { showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert";
import Table from "@components/Table";
import { formatDate, formatCurrency } from '@helpers/formatDataCupon';
import '@styles/coupons.css';

const Cupones = () => {
  const [cupones, setCupones] = useState([]);

  useEffect(() => {
    fetchCupones();
    checkWebpayResult(); // Verifica si venimos de Webpay con éxito o error
  }, []);

  const fetchCupones = async () => {
    try {
      const response = await getCuponesVecino();
      const cuponesFormateados = response.map(c => ({
        ...c,
        monto: formatCurrency(c.monto),
        montoDescuento: formatCurrency(c.montoDescuento),
        fechaPago: formatDate(c.fechaPago),
        fechaCompromiso: formatDate(c.fechaCompromiso),
      }));
      setCupones(cuponesFormateados);
    } catch (error) {
      console.error("Error al cargar cupones:", error);
      showErrorAlert("Error", "No se pudieron cargar los cupones.");
    }
  };

  const handlePago = async (cuponId) => {
  try {
    const { url, token } = await iniciarPagoCupon(cuponId);

    // Crear y enviar formulario
    const form = document.createElement("form");
    form.action = url;
    form.method = "POST";
    form.target = "_blank";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "token_ws";
    input.value = token;
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
    form.remove();

  } catch (error) {
    console.error("Error al iniciar el pago:", error);
    showErrorAlert("Error", "No se pudo iniciar el pago.");
  }
};

  const handleDescargarPDF = async (cuponId) => {
    try {
      await descargarPdf(cuponId);
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
      showErrorAlert("Error", "No se pudo descargar el PDF.");
    }
  };

 const checkWebpayResult = () => {
  const params = new URLSearchParams(window.location.search);
  const estado = params.get("estado");
  const error = params.get("error");

  if (estado === "pagado") {
    showSuccessAlert("Pago exitoso", "Tu cupón ha sido pagado correctamente.");
    fetchCupones(); // 🔁 ACTUALIZA la tabla después del éxito
  } else if (error === "pago-fallido") {
    showErrorAlert("Pago fallido", "Hubo un problema con el pago. Inténtalo nuevamente.");
  } else if (error === "error-interno") {
    showErrorAlert("Error", "Ocurrió un error interno en el sistema.");
  }

  // 🔍 Limpia la URL para evitar alertas duplicadas al navegar
  if (estado || error) {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
};

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
        if (cupon.estado === "pendiente" || cupon.estado === "comprometido") {
          return "<button class='btn-pagar'>Pagar cupón</button>";
        } else if (cupon.estado === "pagado") {
          return "<button class='btn-descargar'>Descargar PDF</button>";
        }
        return "";
      },
      cellClick: (e, cell) => {
        const cupon = cell.getRow().getData();
        if (e.target.classList.contains('btn-pagar')) {
          handlePago(cupon.id);
        } else if (e.target.classList.contains('btn-descargar')) {
          handleDescargarPDF(cupon.id);
        }
      },
      headerSort: false,
    },
  ];

  return (
    <div className="cupones-container">
      <h1>Mis Cupones</h1>
      <Table
        data={cupones}
        columns={columns}
        initialSortName="año"
      />
    </div>
  );
};

export default Cupones;
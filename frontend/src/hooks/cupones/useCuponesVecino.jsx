import { useEffect, useState } from "react";
import {
  getCuponesVecino,
  iniciarPagoCupon,
  descargarPdf,
  comprometerPagoCupon
} from "@services/Coupons.service";
import {
  showErrorAlert,
  showSuccessAlert,
} from "@helpers/sweetAlert";
import { formatCurrency, formatDate, showInputDateAlert } from "@helpers/formatDataCupon";

const useCuponesVecino = () => {
  const [cupones, setCupones] = useState([]);

  useEffect(() => {
    fetchCupones();
    checkWebpayResult();
  }, []);

  const fetchCupones = async () => {
    try {
      const response = await getCuponesVecino();
      const cuponesFormateados = response.map((c) => ({
        ...c,
        monto: formatCurrency(c.monto),
        montoDescuento: formatCurrency(c.montoDescuento),
        fechaPago: formatDate(c.fechaPago),
        fechaCompromiso: formatDate(c.fechaCompromiso),
        rawFechaPago: c.fechaPago,
        rawFechaCompromiso: c.fechaCompromiso,
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
      console.error("Error al descargar PDF:", error);
      showErrorAlert("Error", "No se pudo descargar el PDF.");
    }
  };

  const handleComprometer = async (cuponId, rawFechaPago) => {
    const fechaMin = new Date(rawFechaPago);
    const fechaMax = new Date(rawFechaPago);
    fechaMax.setMonth(fechaMax.getMonth() + 2);

    const minStr = fechaMin.toISOString().split("T")[0];
    const maxStr = fechaMax.toISOString().split("T")[0];

    try {
      const { value: fecha } = await showInputDateAlert("Selecciona una fecha de compromiso", minStr, maxStr);

      if (!fecha) return;

      const fechaIngresada = new Date(fecha);
      if (fechaIngresada < fechaMin || fechaIngresada > fechaMax) {
        return showErrorAlert("Fecha inválida", `Selecciona una fecha entre ${minStr} y ${maxStr}.`);
      }
      
      await comprometerPagoCupon(cuponId, fecha);
      showSuccessAlert("¡Comprometido!", "El cupón ha sido comprometido con éxito.");
      fetchCupones();
    } catch (error) {
      console.error("Error al comprometer cupón:", error);
      showErrorAlert("Error", "No se pudo comprometer el cupón.");
    }
  };

  const checkWebpayResult = () => {
    const params = new URLSearchParams(window.location.search);
    const estado = params.get("estado");
    const error = params.get("error");

    if (estado === "pagado") {
      showSuccessAlert("Pago exitoso", "Tu cupón ha sido pagado correctamente.");
      fetchCupones();
    } else if (error === "pago-fallido") {
      showErrorAlert("Pago fallido", "Hubo un problema con el pago.");
    } else if (error === "error-interno") {
      showErrorAlert("Error", "Ocurrió un error interno.");
    }

    if (estado || error) {
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  };

  return {
    cupones,
    handlePago,
    handleDescargarPDF,
    handleComprometer
  };
};

export default useCuponesVecino;
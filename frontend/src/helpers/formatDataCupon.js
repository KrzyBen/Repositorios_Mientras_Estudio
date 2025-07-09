import Swal from 'sweetalert2';

export function formatDate(fecha) {
  if (!fecha) return '';
  const date = new Date(fecha);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatCurrency(monto) {
  if (typeof monto !== 'number') return '$ 0';
  return `$ ${monto.toLocaleString('es-CL')}`;
}

export const showInputDateAlert = async (title, min, max) => {
  return await Swal.fire({
    title,
    input: "date",
    inputAttributes: {
      min,
      max,
    },
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
  });
};
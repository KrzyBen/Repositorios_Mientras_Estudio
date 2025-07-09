import { useEffect, useState } from "react";
import { obtenerVecinos, obtenerCuponesPorVecino, generarCuponesAnuales, crearCupon, editarCupon, eliminarCupon } from "@services/CouponsAdmin.service";

const useCuponesAdmin = () => {
  const [vecinos, setVecinos] = useState([]);
  const [cupones, setCupones] = useState([]);
  const [vecinoSeleccionado, setVecinoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarVecinos = async () => {
    setLoading(true);
    setError(null);
    const res = await obtenerVecinos();
    if (res && res.data) {
      setVecinos(res.data);
    } else {
      setError(res.error || "No se pudo cargar la lista de vecinos");
    }
    setLoading(false);
  };

  const seleccionarVecino = async (vecino) => {
    setVecinoSeleccionado(vecino);
    setLoading(true);
    setError(null);
    const res = await obtenerCuponesPorVecino(vecino.id);
    if (res && res.data) {
      setCupones(res.data);
    } else {
      setCupones([]);
      setError(res.error || "No se pudieron obtener los cupones del vecino");
    }
    setLoading(false);
  };

  const generarCupones = async (formData) => {
    setLoading(true);
    setError(null);
    const res = await generarCuponesAnuales(formData);
    setLoading(false);
    return res;
  };

  const crearNuevoCupon = async (formData) => {
    setLoading(true);
    setError(null);
    const res = await crearCupon(formData);
    setLoading(false);
    return res;
  };

  const editarCuponExistente = async (cuponId, formData) => {
    setLoading(true);
    setError(null);
    const res = await editarCupon(cuponId, formData);
    setLoading(false);
    return res;
  };

  const eliminarCuponExistente = async (cuponId) => {
    setLoading(true);
    setError(null);
    const res = await eliminarCupon(cuponId);
    setLoading(false);
    return res;
  };

  useEffect(() => {
    cargarVecinos();
  }, []);

  return {
    vecinos,
    cupones,
    vecinoSeleccionado,
    cargarVecinos,
    seleccionarVecino,
    generarCupones,
    crearNuevoCupon,
    editarCuponExistente,
    eliminarCuponExistente,
    loading,
    error
  };
};

export default useCuponesAdmin;
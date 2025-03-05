import { useFormik } from "formik";
import Router from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../controllers/hooks/use_auth";
import HttpClient from "../../../controllers/utils/http_client";
import { Herramienta, ResponseData } from "../../../models";
import Sidebar from "../../components/sidebar";
import { Button } from "react-bootstrap";

const EditarHerramienta = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<Herramienta | null>(null);

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const mascotaId = Router.query.id as string;
      console.log(mascotaId);
      // Llama a la API para obtener la mascota y el cliente
      const response: ResponseData = await HttpClient(
        `/api/herramientas/${mascotaId}`,
        "GET",
        auth.usuario,
        auth.rol
      );

      console.log(response);
      if (response.success) {
        const herramienta = response.data;
        setInitialValues(herramienta);
        console.log(herramienta);
      } else {
        toast.error("Mascota no encontrada.");
      }

      setLoading(false);
    } else {
      setTimeout(loadData, 1000);
    }
  };

  const formik = useFormik<Herramienta>({
    enableReinitialize: true,
    initialValues: initialValues || {
        nombre: "",
        codigo: "",
        descripcion: "",
        serie: "",
        modelo: "",
        marca: "",
        NParte: "",
        ubicacion: "",
        estado: "",
        imagen: "",
        tipo: "",
        cantidad: 0,
        observacion: "",
        calibracion: ""
    },
    onSubmit: async (formData) => {
      setLoading(true);

      // Actualizar los datos de la mascota específica

      console.log("Cliente actualizado:", formData);

      // Hacer la solicitud PUT al backend
      const response: ResponseData = await HttpClient(
        `/api/herramientas`,
        "PUT",
        auth.usuario,
        auth.rol,
        formData
      );

      if (response.success) {
        toast.success("Herramienta actualizada correctamente!");
        Router.push(`/herramientas`);
      } else {
        toast.warning(response.message);
      }

      setLoading(false);
    },
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex h-screen">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 bg-blue-100">
          <div className="bg-white w-11/12 h-5/6 mx-auto">
            <div className="mt-6">
              <p className="md:text-4xl text-xl text-center pt-5 font-extrabold text-blue-500">
                Editar Herramienta: {initialValues?.nombre}
              </p>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-3 gap-4 px-4 py-2">
                <div>
                  <label>Nombre de la herramienta</label>
                  <input
                    type="text"
                    placeholder="nombre"
                    name="nombre"
                    value={formik.values.nombre}
                    onChange={formik.handleChange}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                </div>
                <div>
                  <label>Modelo de la herramienta</label>
                  <input
                    type="text"
                    placeholder="Modelo de la herramienta"
                    name="modelo"
                    value={formik.values.modelo}
                    onChange={formik.handleChange}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  />
                </div>
                <div>
                  <label>Marca de la herramienta</label>
                  <input
                    type="text"
                    placeholder="Marca de la herramienta"
                    name="marca"
                    value={formik.values.marca}
                    onChange={formik.handleChange}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  />
                </div>
                <div>
                  <label>Numero de parte</label>
                  <input
                    type="text"
                    placeholder="Numero de parte de la herramienta"
                    name="NParte"
                    value={formik.values.NParte}
                    onChange={formik.handleChange}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  />
                </div>
                <div>
                  <label>Ubicacion de la herramienta</label>
                  <input
                    type="text"
                    placeholder="Ubicacion de la herramienta"
                    name="ubicacion"
                    value={formik.values.ubicacion}
                    onChange={formik.handleChange}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  />
                </div>
                <div>
                  <label>Estado de la herramienta</label>
                  <select
                    name="estado"
                    value={formik.values.estado}
                    onChange={formik.handleChange}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  >
                    <option value="">Seleccione un estado</option>
                    <option value="Disponible">Disponible</option>
                    <option value="En uso">En uso</option>
                  </select>
                </div>
                <div>
                  <label>Calibracion de la herramienta</label>
                  <select
                    name="calibracion"
                    value={formik.values.calibracion}
                    onChange={formik.handleChange}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  >
                    <option value="">Seleccione un estado</option>
                    <option value="Calibrada">Calibrada</option>
                    <option value="No calibrada">No calibrada</option>
                  </select>
                </div>
              </div>
              <div className="text-center mt-6">
                <Button
                  type="submit"
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
                >
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditarHerramienta;

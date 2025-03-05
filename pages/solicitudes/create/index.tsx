/* eslint-disable react/no-unescaped-entities */
import { Button } from "react-bootstrap";
import Sidebar from "../../components/sidebar";
import { useAuth } from "../../../controllers/hooks/use_auth";
import { useFormik } from "formik";
import Router from "next/router";
import { toast } from "react-toastify";
import { Herramienta, Solicitude, ResponseData } from "../../../models";
import HttpClient from "../../../controllers/utils/http_client";
import { useEffect, useState } from "react";
import FormatedDate from "../../../controllers/utils/formated_date";
import Select from "react-select";

export const RegistroCreate = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [herramientas, setHerramientas] = useState<Herramienta[]>([]);
  const [selectedTool, setSelectedTool] = useState(null);

  // Cargar herramientas disponibles
  const loadProducts = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/herramientas",
      "GET",
      auth.usuario,
      auth.rol
    );
    setHerramientas(response.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Valores iniciales para la solicitud
  const initialValues: Solicitude = {
    number: 0, // Generar un número si es necesario
    herramientas: [],
    fecha: FormatedDate(), // Fecha formateada
    solicitante: auth?.nombre || "",
    receptor: "",
  };

  // Configuración de Formik
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      // Validaciones manuales antes de enviar
      if (!values.receptor.trim()) {
        toast.warning("El campo 'Receptor' es obligatorio.");
        return;
      }

      if (values.herramientas.length === 0) {
        toast.warning("Debes agregar al menos una herramienta.");
        return;
      }

      // Si pasa las validaciones, se envía el formulario
      setLoading(true);
      console.log("Valores del formulario:", values);

      const response: ResponseData = await HttpClient(
        "/api/solicitudes",
        "POST",
        auth.usuario,
        auth.rol,
        values
      );

      if (response.success) {
        toast.success("Registro creado correctamente!");
        Router.back();
      } else {
        toast.warning(response.message);
      }

      setLoading(false);
    },
  });

  // Filtrar herramientas ya seleccionadas
  const herramientasDisponibles = herramientas.filter(
    (h) => !formik.values.herramientas.some((selected) => selected.id === h.id)
  );

  // Opciones para el Select con búsqueda
  const toolOptions = herramientasDisponibles.map((tool) => ({
    value: tool.id,
    label: `${tool.nombre} - ${tool.codigo}`,
  }));

  // Agregar herramienta
  const addHerramienta = () => {
    if (!selectedTool) return;
    const selectedToolData = herramientas.find(
      (tool) => tool.id === selectedTool.value
    );
    if (selectedToolData) {
      formik.setFieldValue("herramientas", [
        ...formik.values.herramientas,
        selectedToolData,
      ]);
      setSelectedTool(null);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="md:w-1/6 max-w-none">
        <Sidebar />
      </div>
      <div className="w-12/12 md:w-5/6 bg-blue-100 p-4">
        <div className="bg-white w-5/6 mx-auto p-6 m-5 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-blue-500 text-center mb-4">
            Crear registro de herramientas prestadas
          </h1>
          <form onSubmit={formik.handleSubmit}>
            {/* Datos del cliente */}
            <div className="mb-4">
              <label className="block text-blue-500 font-bold mb-2">
                Solicitante
              </label>
              <input
                type="text"
                name="solicitante"
                onChange={formik.handleChange}
                value={formik.values.solicitante}
                className="border p-2 w-full rounded-lg"
                placeholder="Nombre del solicitante"
              />
            </div>
            <div className="mb-4">
              <label className="block text-blue-500 font-bold mb-2">
                Receptor
              </label>
              <input
                type="text"
                name="receptor"
                onChange={formik.handleChange}
                value={formik.values.receptor}
                className="border p-2 w-full rounded-lg"
                placeholder="A quién se le entrega"
              />
            </div>
            <div className="mb-4">
              <label className="block text-blue-500 font-bold mb-2">
                Fecha
              </label>
              <input
                type="text"
                name="fecha"
                value={formik.values.fecha}
                disabled
                className="border p-2 w-full bg-gray-200 rounded-lg"
              />
            </div>

            {/* Agregar herramientas */}
            <div className="mb-4">
              <p className="text-xl font-bold text-blue-500 mb-2">
                Agregar Herramientas
              </p>
              <div className="flex items-center gap-2">
                <div className="w-full">
                  <Select
                    value={selectedTool}
                    onChange={setSelectedTool}
                    options={toolOptions}
                    isSearchable
                    placeholder="Buscar herramienta..."
                    className="w-full"
                  />
                </div>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                  type="button"
                  onClick={addHerramienta}
                >
                  Agregar
                </Button>
              </div>
            </div>

            {/* Listado de herramientas agregadas */}
            <div className="mb-4">
              <p className="text-xl font-bold text-blue-500 mb-2">
                Herramientas agregadas
              </p>
              {formik.values.herramientas.length === 0 ? (
                <p className="text-gray-500">No hay herramientas agregadas.</p>
              ) : (
                <ul className="border rounded-lg p-3 bg-gray-50">
                  {formik.values.herramientas.map((tool, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center border-b last:border-b-0 p-2"
                    >
                      <span>
                        {tool.nombre} - {tool.codigo}
                      </span>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg"
                        size="sm"
                        onClick={() => {
                          const updatedTools =
                            formik.values.herramientas.filter(
                              (_, i) => i !== index
                            );
                          formik.setFieldValue("herramientas", updatedTools);
                        }}
                      >
                        Eliminar
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg w-full"
            >
              {loading ? "Enviando..." : "Enviar Registro"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroCreate;

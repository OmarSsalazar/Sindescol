import { useState, useEffect } from "react";
import { ModalCrearAfiliado } from "../components/afiliados/ModalCrearAfiliado";
import { getAfiliados, createAfiliado } from "../services/api";
import "./Afiliados.css";

function Afiliados() {
  const [afiliados, setAfiliados] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarAfiliados();
  }, []);

  const cargarAfiliados = async () => {
    try {
      setLoading(true);
      console.log("Iniciando carga de afiliados...");
      const response = await fetch("/api/afiliados");
      console.log("Respuesta del servidor:", response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      console.log("Texto recibido:", text.slice(0, 200));

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Error parseando JSON:", e);
        throw new Error("Respuesta no es JSON válido");
      }

      console.log("Datos parseados:", data);
      if (data.success) {
        setAfiliados(data.data || []);
      } else {
        console.warn("Respuesta sin éxito:", data.error);
      }
    } catch (error) {
      console.error("Error completo:", error);
      setAfiliados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearAfiliado = async (formData) => {
    try {
      console.log("Enviando datos del afiliado:", formData);
      const response = await fetch("/api/afiliados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Respuesta POST:", response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Respuesta no es JSON válido");
      }

      if (data.success) {
        console.log("Afiliado creado exitosamente");
        setModalOpen(false);
        cargarAfiliados();
      } else {
        console.error("Error del servidor:", data.error);
      }
    } catch (error) {
      console.error("Error creando afiliado:", error);
    }
  };

  return (
    <div className="afiliados-container">
      <div className="afiliados-header">
        <h1>Gestión de Afiliados</h1>
        <button className="btn-crear" onClick={() => setModalOpen(true)}>
          + Nuevo Afiliado
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="afiliados-table">
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Cargo</th>
              <th>Institución</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {afiliados.map((afiliado) => (
              <tr key={afiliado.id_afiliado}>
                <td>{afiliado.cedula}</td>
                <td>{afiliado.nombres}</td>
                <td>{afiliado.apellidos}</td>
                <td>{afiliado.nombre_cargo || "-"}</td>
                <td>{afiliado.nombre_institucion || "-"}</td>
                <td>
                  <button className="btn-edit">Editar</button>
                  <button className="btn-delete">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ModalCrearAfiliado
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCrearAfiliado}
      />
    </div>
  );
}

export default Afiliados;

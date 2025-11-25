import { useState, useEffect } from "react";
import { ModalCrearAfiliado } from "../components/afiliados/ModalCrearAfiliado";
import { ModalVerAfiliado } from "../components/afiliados/ModalVerAfiliado";
import { ModalEditarAfiliado } from "../components/afiliados/ModalEditarAfiliado";
import { ModalEliminarAfiliado } from "../components/afiliados/ModalEliminarAfiliado";
import { getAfiliados, createAfiliado } from "../services/api";
import "./Afiliados.css";

function Afiliados() {
  const [afiliados, setAfiliados] = useState([]);
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalVerOpen, setModalVerOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
  const [afiliadoSeleccionado, setAfiliadoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarAfiliados();
  }, []);

  const cargarAfiliados = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/afiliados");

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Respuesta no es JSON válido");
      }

      if (data.success) {
        setAfiliados(data.data || []);
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
        setModalCrearOpen(false);
        cargarAfiliados();
        alert("✅ Afiliado creado exitosamente");
      } else {
        console.error("Error del servidor:", data.error);
        alert("❌ Error al crear afiliado: " + data.error);
      }
    } catch (error) {
      console.error("Error creando afiliado:", error);
      alert("❌ Error al crear afiliado");
    }
  };

  const handleEditarAfiliado = async (id, formData) => {
    try {
      console.log("Editando afiliado:", id, formData);
      const response = await fetch(`/api/afiliados/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

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
        console.log("Afiliado actualizado exitosamente");
        setModalEditarOpen(false);
        setAfiliadoSeleccionado(null);
        cargarAfiliados();
        alert("✅ Afiliado actualizado exitosamente");
      } else {
        console.error("Error del servidor:", data.error);
        alert("❌ Error al actualizar afiliado: " + data.error);
      }
    } catch (error) {
      console.error("Error actualizando afiliado:", error);
      alert("❌ Error al actualizar afiliado");
    }
  };

  const handleEliminarAfiliado = async () => {
    try {
      console.log("Eliminando afiliado:", afiliadoSeleccionado);
      const response = await fetch(`/api/afiliados/${afiliadoSeleccionado}`, {
        method: "DELETE",
      });

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
        console.log("Afiliado eliminado exitosamente");
        setModalEliminarOpen(false);
        setAfiliadoSeleccionado(null);
        cargarAfiliados();
        alert("✅ Afiliado eliminado exitosamente");
      } else {
        console.error("Error del servidor:", data.error);
        alert("❌ Error al eliminar afiliado: " + data.error);
      }
    } catch (error) {
      console.error("Error eliminando afiliado:", error);
      alert("❌ Error al eliminar afiliado");
    }
  };

  const handleVerAfiliado = (id) => {
    setAfiliadoSeleccionado(id);
    setModalVerOpen(true);
  };

  const abrirModalEditar = (id) => {
    setAfiliadoSeleccionado(id);
    setModalEditarOpen(true);
  };

  const abrirModalEliminar = (id) => {
    setAfiliadoSeleccionado(id);
    setModalEliminarOpen(true);
  };

  return (
    <div className="afiliados-container">
      <div className="afiliados-header">
        <h1>Gestión de Afiliados</h1>
        <button className="btn-crear" onClick={() => setModalCrearOpen(true)}>
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
                  <button 
                    className="btn-view"
                    onClick={() => handleVerAfiliado(afiliado.id_afiliado)}
                  >
                    👁️ Ver
                  </button>
                  <button 
                    className="btn-edit"
                    onClick={() => abrirModalEditar(afiliado.id_afiliado)}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => abrirModalEliminar(afiliado.id_afiliado)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Crear */}
      <ModalCrearAfiliado
        isOpen={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onSubmit={handleCrearAfiliado}
      />

      {/* Modal Ver */}
      <ModalVerAfiliado
        isOpen={modalVerOpen}
        onClose={() => {
          setModalVerOpen(false);
          setAfiliadoSeleccionado(null);
        }}
        afiliadoId={afiliadoSeleccionado}
      />

      {/* Modal Editar */}
      <ModalEditarAfiliado
        isOpen={modalEditarOpen}
        onClose={() => {
          setModalEditarOpen(false);
          setAfiliadoSeleccionado(null);
        }}
        afiliadoId={afiliadoSeleccionado}
        onSubmit={handleEditarAfiliado}
      />

      {/* Modal Eliminar */}
      <ModalEliminarAfiliado
        isOpen={modalEliminarOpen}
        onClose={() => {
          setModalEliminarOpen(false);
          setAfiliadoSeleccionado(null);
        }}
        onConfirm={handleEliminarAfiliado}
        afiliado={afiliados.find(a => a.id_afiliado === afiliadoSeleccionado)}
      />
    </div>
  );
}

export default Afiliados;
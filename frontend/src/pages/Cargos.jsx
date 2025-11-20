import { useState, useEffect } from "react";
import * as api from "../services/api";

export default function Cargos() {
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({ nombre_cargo: "" });

  useEffect(() => {
    fetchCargos();
  }, []);

  const fetchCargos = async () => {
    setLoading(true);
    try {
      const { data } = await api.getCargos();
      setCargos(data.data || []);
    } catch (error) {
      showAlert("Error al cargar cargos", "danger");
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({ nombre_cargo: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateCargo(editingId, formData);
        showAlert("Cargo actualizado", "success");
      } else {
        await api.createCargo(formData);
        showAlert("Cargo creado", "success");
      }
      resetForm();
      fetchCargos();
    } catch (error) {
      showAlert(error.response?.data?.error || "Error al guardar", "danger");
    }
  };

  const handleEdit = (cargo) => {
    setFormData({ nombre_cargo: cargo.nombre_cargo });
    setEditingId(cargo.id_cargo);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este cargo?")) {
      try {
        await api.deleteCargo(id);
        showAlert("Cargo eliminado", "success");
        fetchCargos();
      } catch (error) {
        showAlert("Error al eliminar", "danger");
      }
    }
  };

  const resetForm = () => {
    setFormData({ nombre_cargo: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>💼 Gestión de Cargos</h1>
        <p>Administra los cargos disponibles</p>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? "✕ Cancelar" : "➕ Nuevo Cargo"}
      </button>

      {showForm && (
        <div className="card" style={{ marginTop: "2rem", background: "var(--light-blue)" }}>
          <h3>{editingId ? "Editar Cargo" : "Crear Nuevo Cargo"}</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
            <div className="form-group">
              <label>Nombre del Cargo *</label>
              <input
                type="text"
                value={formData.nombre_cargo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" className="btn btn-success">
                {editingId ? "Actualizar" : "Crear"} Cargo
              </button>
              <button type="button" className="btn btn-warning" onClick={resetForm}>
                Limpiar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : cargos.length === 0 ? (
        <div className="empty-state">
          <p>No hay cargos registrados</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Crear el primer cargo
          </button>
        </div>
      ) : (
        <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {cargos.map((cargo) => (
            <div key={cargo.id_cargo} className="card">
              <h4 style={{ color: "var(--primary-blue)", marginBottom: "1rem" }}>
                {cargo.nombre_cargo}
              </h4>
              <div className="action-buttons">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEdit(cargo)}
                >
                  ✏️ Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(cargo.id_cargo)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

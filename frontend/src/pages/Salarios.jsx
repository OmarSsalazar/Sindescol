import { useState, useEffect } from "react";
import * as api from "../services/api";

export default function Salarios() {
  const [salarios, setSalarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [cargos, setCargos] = useState([]);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    id_cargo: "",
    departamento: "",
    salario: "",
  });

  useEffect(() => {
    fetchSalarios();
    fetchCargos();
  }, []);

  const fetchSalarios = async () => {
    setLoading(true);
    try {
      const { data } = await api.getSalarios();
      setSalarios(data.data || []);
    } catch (error) {
      showAlert("Error al cargar salarios", "danger");
    }
    setLoading(false);
  };

  const fetchCargos = async () => {
    try {
      const { data } = await api.getCargos();
      setCargos(data.data || []);
    } catch (error) {
      console.error("Error cargando cargos:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateSalario(editingId, formData);
        showAlert("Salario actualizado", "success");
      } else {
        await api.createSalario(formData);
        showAlert("Salario creado", "success");
      }
      resetForm();
      fetchSalarios();
    } catch (error) {
      showAlert(error.response?.data?.error || "Error al guardar", "danger");
    }
  };

  const handleEdit = (salario) => {
    setFormData(salario);
    setEditingId(salario.id_salario);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este salario?")) {
      try {
        await api.deleteSalario(id);
        showAlert("Salario eliminado", "success");
        fetchSalarios();
      } catch (error) {
        showAlert("Error al eliminar", "danger");
      }
    }
  };

  const resetForm = () => {
    setFormData({ id_cargo: "", departamento: "", salario: "" });
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
        <h1>💵 Gestión de Salarios</h1>
        <p>Administra los salarios por cargo y departamento</p>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? "✕ Cancelar" : "➕ Nuevo Salario"}
      </button>

      {showForm && (
        <div className="card" style={{ marginTop: "2rem", background: "var(--light-blue)" }}>
          <h3>{editingId ? "Editar Salario" : "Crear Nuevo Salario"}</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
            <div className="form-row">
              <div className="form-group">
                <label>Cargo *</label>
                <select name="id_cargo" value={formData.id_cargo} onChange={handleInputChange} required>
                  <option value="">Seleccionar cargo</option>
                  {cargos.map((cargo) => (
                    <option key={cargo.id_cargo} value={cargo.id_cargo}>
                      {cargo.nombre_cargo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Departamento *</label>
                <input
                  type="text"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Salario *</label>
              <input
                type="number"
                name="salario"
                value={formData.salario}
                onChange={handleInputChange}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" className="btn btn-success">
                {editingId ? "Actualizar" : "Crear"} Salario
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
      ) : salarios.length === 0 ? (
        <div className="empty-state">
          <p>No hay salarios registrados</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Crear el primer salario
          </button>
        </div>
      ) : (
        <div style={{ marginTop: "2rem", overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Salario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {salarios.map((salario) => (
                <tr key={salario.id_salario}>
                  <td>{salario.nombre_cargo || "N/A"}</td>
                  <td>{salario.departamento}</td>
                  <td style={{ fontWeight: "bold", color: "var(--primary-blue)" }}>
                    ${salario.salario.toLocaleString()}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(salario)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(salario.id_salario)}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

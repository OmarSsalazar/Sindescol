import { useState, useEffect } from "react";
import * as api from "../services/api";

export default function Cuotas() {
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    cedula: "",
    mes: "",
    anio: new Date().getFullYear(),
    valor: "",
  });

  useEffect(() => {
    fetchCuotas();
  }, []);

  const fetchCuotas = async () => {
    setLoading(true);
    try {
      const { data } = await api.getCuotas();
      setCuotas(data.data || []);
    } catch (error) {
      showAlert("Error al cargar cuotas", "danger");
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateCuota(editingId, formData);
        showAlert("Cuota actualizada", "success");
      } else {
        await api.createCuota(formData);
        showAlert("Cuota creada", "success");
      }
      resetForm();
      fetchCuotas();
    } catch (error) {
      showAlert(error.response?.data?.error || "Error al guardar", "danger");
    }
  };

  const handleEdit = (cuota) => {
    setFormData(cuota);
    setEditingId(cuota.id_cuota);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta cuota?")) {
      try {
        await api.deleteCuota(id);
        showAlert("Cuota eliminada", "success");
        fetchCuotas();
      } catch (error) {
        showAlert("Error al eliminar", "danger");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      cedula: "",
      mes: "",
      anio: new Date().getFullYear(),
      valor: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  return (
    <div className="container">
      <div className="page-header">
        <h1>💰 Gestión de Cuotas</h1>
        <p>Administra las cuotas de los afiliados</p>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? "✕ Cancelar" : "➕ Nueva Cuota"}
      </button>

      {showForm && (
        <div className="card" style={{ marginTop: "2rem", background: "var(--light-blue)" }}>
          <h3>{editingId ? "Editar Cuota" : "Crear Nueva Cuota"}</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
            <div className="form-row">
              <div className="form-group">
                <label>Cédula del Afiliado *</label>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mes *</label>
                <select name="mes" value={formData.mes} onChange={handleInputChange} required>
                  <option value="">Seleccionar mes</option>
                  {meses.map((mes) => (
                    <option key={mes} value={mes}>{mes}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Año *</label>
                <input
                  type="number"
                  name="anio"
                  value={formData.anio}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Valor *</label>
                <input
                  type="number"
                  name="valor"
                  value={formData.valor}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" className="btn btn-success">
                {editingId ? "Actualizar" : "Crear"} Cuota
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
      ) : cuotas.length === 0 ? (
        <div className="empty-state">
          <p>No hay cuotas registradas</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Crear la primera cuota
          </button>
        </div>
      ) : (
        <div style={{ marginTop: "2rem", overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Cédula</th>
                <th>Mes</th>
                <th>Año</th>
                <th>Valor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.map((cuota) => (
                <tr key={cuota.id_cuota}>
                  <td>{cuota.cedula}</td>
                  <td>{cuota.mes}</td>
                  <td>{cuota.anio}</td>
                  <td style={{ fontWeight: "bold", color: "var(--primary-blue)" }}>
                    ${cuota.valor.toLocaleString()}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(cuota)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(cuota.id_cuota)}
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

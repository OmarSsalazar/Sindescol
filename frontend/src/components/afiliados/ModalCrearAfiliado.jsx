import { useState, useEffect } from "react";
import "./ModalCrearAfiliado.css";

export const ModalCrearAfiliado = ({ isOpen, onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState("personales");
  const [formData, setFormData] = useState({
    // Personales
    cedula: "",
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    religion_id: "",
    foto_afiliado: null,
    
    // Domicilio
    direccion_domicilio: "",
    municipio_domicilio: "",
    
    // Residencia
    direccion_residencia: "",
    municipio_residencia: "",
    
    // Seguridad Social
    id_eps: "",
    id_arl: "",
    id_pension: "",
    id_cesantias: "",
    
    // Laborales
    id_cargo: "",
    id_institucion: "",
    fecha_afiliacion: "",
  });

  const [opciones, setOpciones] = useState({
    religiones: [],
    municipios: [],
    eps: [],
    arl: [],
    pension: [],
    cesantias: [],
    cargos: [],
    instituciones: [],
  });

  useEffect(() => {
    if (isOpen) {
      cargarOpciones();
    }
  }, [isOpen]);

  const cargarOpciones = async () => {
    try {
      console.log("Iniciando carga de opciones...");
      const endpoints = {
        religiones: "/api/religiones",
        municipios: "/api/municipios",
        eps: "/api/eps",
        arl: "/api/arl",
        pension: "/api/pension",
        cesantias: "/api/cesantias",
        cargos: "/api/cargos",
        instituciones: "/api/instituciones",
      };

      const data = {};
      for (const [key, url] of Object.entries(endpoints)) {
        try {
          console.log(`Cargando ${key} desde ${url}...`);
          const response = await fetch(url);
          console.log(`${key} - Status: ${response.status}`);
          
          if (!response.ok) {
            console.warn(`${key} retornó ${response.status}, usando array vacío`);
            data[key] = [];
            continue;
          }
          
          const text = await response.text();
          let result;
          try {
            result = JSON.parse(text);
            data[key] = result.data || result || [];
          } catch (e) {
            console.warn(`${key} no es JSON válido, usando array vacío`);
            data[key] = [];
          }
        } catch (err) {
          console.error(`Error cargando ${key}:`, err);
          data[key] = [];
        }
      }

      console.log("Opciones cargadas:", data);
      setOpciones(data);
    } catch (error) {
      console.error("Error cargando opciones:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    const requeridos = ["cedula", "nombres", "apellidos", "id_cargo", "id_institucion"];
    const incompletos = requeridos.filter((campo) => !formData[campo]);
    
    if (incompletos.length > 0) {
      alert(`Faltan campos requeridos: ${incompletos.join(", ")}`);
      return;
    }

    onSubmit(formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      cedula: "",
      nombres: "",
      apellidos: "",
      fecha_nacimiento: "",
      religion_id: "",
      foto_afiliado: null,
      direccion_domicilio: "",
      municipio_domicilio: "",
      direccion_residencia: "",
      municipio_residencia: "",
      id_eps: "",
      id_arl: "",
      id_pension: "",
      id_cesantias: "",
      id_cargo: "",
      id_institucion: "",
      fecha_afiliacion: "",
    });
    setActiveTab("personales");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Crear Nuevo Afiliado</h2>
          <button className="close-btn" onClick={() => { onClose(); resetForm(); }}>
            ×
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === "personales" ? "active" : ""}`}
            onClick={() => setActiveTab("personales")}
          >
            Datos Personales
          </button>
          <button
            className={`tab-btn ${activeTab === "seguridad" ? "active" : ""}`}
            onClick={() => setActiveTab("seguridad")}
          >
            Seguridad Social
          </button>
          <button
            className={`tab-btn ${activeTab === "laborales" ? "active" : ""}`}
            onClick={() => setActiveTab("laborales")}
          >
            Datos Laborales
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* TAB: DATOS PERSONALES */}
          {activeTab === "personales" && (
            <div className="tab-content">
              <div className="form-row">
                <div className="form-group">
                  <label>Cédula *</label>
                  <input
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    placeholder="Ej: 12345678"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nombres *</label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    placeholder="Ej: Juan"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Apellidos *</label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    placeholder="Ej: Pérez"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Religión</label>
                  <select
                    name="religion_id"
                    value={formData.religion_id}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar...</option>
                    {opciones.religiones.map((r) => (
                      <option key={r.id_religion} value={r.id_religion}>
                        {r.nombre_religion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Foto</label>
                  <input
                    type="file"
                    name="foto_afiliado"
                    onChange={handleChange}
                    accept="image/*"
                  />
                </div>
              </div>

              <fieldset className="fieldset">
                <legend>Domicilio</legend>
                <div className="form-row">
                  <div className="form-group">
                    <label>Dirección Domicilio</label>
                    <input
                      type="text"
                      name="direccion_domicilio"
                      value={formData.direccion_domicilio}
                      onChange={handleChange}
                      placeholder="Ej: Calle 10 #2-30"
                    />
                  </div>
                  <div className="form-group">
                    <label>Municipio Domicilio</label>
                    <select
                      name="municipio_domicilio"
                      value={formData.municipio_domicilio}
                      onChange={handleChange}
                    >
                      <option value="">Seleccionar...</option>
                      {opciones.municipios.map((m) => (
                        <option key={m.id_municipio} value={m.id_municipio}>
                          {m.nombre_municipio}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>

              <fieldset className="fieldset">
                <legend>Residencia</legend>
                <div className="form-row">
                  <div className="form-group">
                    <label>Dirección Residencia</label>
                    <input
                      type="text"
                      name="direccion_residencia"
                      value={formData.direccion_residencia}
                      onChange={handleChange}
                      placeholder="Ej: Carrera 4 #5-6"
                    />
                  </div>
                  <div className="form-group">
                    <label>Municipio Residencia</label>
                    <select
                      name="municipio_residencia"
                      value={formData.municipio_residencia}
                      onChange={handleChange}
                    >
                      <option value="">Seleccionar...</option>
                      {opciones.municipios.map((m) => (
                        <option key={m.id_municipio} value={m.id_municipio}>
                          {m.nombre_municipio}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>
            </div>
          )}

          {/* TAB: SEGURIDAD SOCIAL */}
          {activeTab === "seguridad" && (
            <div className="tab-content">
              <div className="form-row">
                <div className="form-group">
                  <label>EPS</label>
                  <select
                    name="id_eps"
                    value={formData.id_eps}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar...</option>
                    {opciones.eps.map((e) => (
                      <option key={e.id_eps} value={e.id_eps}>
                        {e.nombre_eps}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>ARL</label>
                  <select
                    name="id_arl"
                    value={formData.id_arl}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar...</option>
                    {opciones.arl.map((a) => (
                      <option key={a.id_arl} value={a.id_arl}>
                        {a.nombre_arl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pensión</label>
                  <select
                    name="id_pension"
                    value={formData.id_pension}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar...</option>
                    {opciones.pension.map((p) => (
                      <option key={p.id_pension} value={p.id_pension}>
                        {p.nombre_pension}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Cesantías</label>
                  <select
                    name="id_cesantias"
                    value={formData.id_cesantias}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar...</option>
                    {opciones.cesantias.map((c) => (
                      <option key={c.id_cesantias} value={c.id_cesantias}>
                        {c.nombre_cesantias}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DATOS LABORALES */}
          {activeTab === "laborales" && (
            <div className="tab-content">
              <div className="form-row">
                <div className="form-group">
                  <label>Cargo *</label>
                  <select
                    name="id_cargo"
                    value={formData.id_cargo}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {opciones.cargos.map((c) => (
                      <option key={c.id_cargo} value={c.id_cargo}>
                        {c.nombre_cargo}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Institución Educativa *</label>
                  <select
                    name="id_institucion"
                    value={formData.id_institucion}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {opciones.instituciones.map((i) => (
                      <option key={i.id_institucion} value={i.id_institucion}>
                        {i.nombre_institucion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de Afiliación</label>
                  <input
                    type="date"
                    name="fecha_afiliacion"
                    value={formData.fecha_afiliacion}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => { onClose(); resetForm(); }}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Crear Afiliado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

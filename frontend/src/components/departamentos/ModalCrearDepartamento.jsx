import { useState } from "react";
import "../../pages/Departamentos.css";

export const ModalCrearDepartamento = ({ isOpen, onClose, onSubmit }) => {
  const [departamento, setDepartamento] = useState("");
  const [municipios, setMunicipios] = useState([]);
  const [municipioActual, setMunicipioActual] = useState("");

  const agregarMunicipio = () => {
    if (municipioActual.trim()) {
      setMunicipios([...municipios, municipioActual.trim()]);
      setMunicipioActual("");
    }
  };

  const eliminarMunicipio = (index) => {
    setMunicipios(municipios.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!departamento.trim()) {
      alert("El nombre del departamento es requerido");
      return;
    }

    if (municipios.length === 0) {
      alert("Debes agregar al menos un municipio");
      return;
    }

    onSubmit({ departamento: departamento.trim(), municipios });
    resetForm();
  };

  const resetForm = () => {
    setDepartamento("");
    setMunicipios([]);
    setMunicipioActual("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      agregarMunicipio();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-departamentos">
      <div className="modal-departamentos-content">
        <div className="modal-departamentos-header">
          <h2>Crear Nuevo Departamento</h2>
          <button className="modal-close-btn" onClick={() => { onClose(); resetForm(); }}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-departamentos-body">
            <div className="form-group">
              <label>Nombre del Departamento *</label>
              <input
                type="text"
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                placeholder="Ej: Nariño"
                required
              />
            </div>

            <div className="form-group">
              <label>Agregar Municipios *</label>
              <div className="municipio-input-group">
                <input
                  type="text"
                  value={municipioActual}
                  onChange={(e) => setMunicipioActual(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nombre del municipio"
                />
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={agregarMunicipio}
                >
                  + Agregar
                </button>
              </div>
              <small style={{ color: "#666", fontSize: "12px" }}>
                Presiona Enter o haz clic en "Agregar" para añadir cada municipio
              </small>
            </div>

            {municipios.length > 0 && (
              <div className="municipios-agregados">
                <h4>Municipios agregados ({municipios.length}):</h4>
                <div>
                  {municipios.map((muni, index) => (
                    <span key={index} className="municipio-tag">
                      {muni}
                      <button
                        type="button"
                        onClick={() => eliminarMunicipio(index)}
                        title="Eliminar"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="modal-departamentos-footer">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => { onClose(); resetForm(); }}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-submit">
              Crear Departamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
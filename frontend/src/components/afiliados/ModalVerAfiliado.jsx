import { useState, useEffect } from "react";
import * as api from "../../services/api";
import "./ModalVerAfiliado.css";

export const ModalVerAfiliado = ({ isOpen, onClose, afiliadoId }) => {
  const [activeTab, setActiveTab] = useState("personales");
  const [afiliado, setAfiliado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [salarioCalculado, setSalarioCalculado] = useState(null);
  const [actas, setActas] = useState({
    nombramiento: null,
    posesion: null
  });
  const [otrosCargos, setOtrosCargos] = useState([]);

  useEffect(() => {
    if (isOpen && afiliadoId) {
      cargarDatosAfiliado();
    }
  }, [isOpen, afiliadoId]);

  // Cargar salario cuando se cargue el afiliado
  useEffect(() => {
    const cargarSalario = async () => {
      if (afiliado?.id_cargo && afiliado?.municipio_trabajo) {
        try {
          const { data } = await api.getSalarios();
          if (data.success && data.data.length > 0) {
            const salario = data.data.find(s => s.id_cargo === afiliado.id_cargo && s.id_municipio === afiliado.municipio_trabajo);
            setSalarioCalculado(salario?.salario || null);
          } else {
            setSalarioCalculado(null);
          }
        } catch (error) {
          console.error("Error consultando salario:", error);
          setSalarioCalculado(null);
        }
      }
    };

    cargarSalario();
  }, [afiliado]);

  const cargarDatosAfiliado = async () => {
    setLoading(true);
    try {
      // Cargar datos del afiliado
      const { data: afiliadoData } = await api.getAfiliadoById(afiliadoId);
      if (afiliadoData.success) {
        setAfiliado(afiliadoData.data);
      }

      // Cargar actas de nombramiento
      const { data: dataNombramiento } = await api.getActaNombramiento(afiliadoId);
      if (dataNombramiento.success && dataNombramiento.data.length > 0) {
        setActas(prev => ({ ...prev, nombramiento: dataNombramiento.data[0] }));
      }

      // Cargar actas de posesión
      const { data: dataPosesion } = await api.getActaPosesion(afiliadoId);
      if (dataPosesion.success && dataPosesion.data.length > 0) {
        setActas(prev => ({ ...prev, posesion: dataPosesion.data[0] }));
      }

      // Cargar otros cargos
      const { data: dataOtros } = await api.getOtrosCargos(afiliadoId);
      if (dataOtros.success) {
        setOtrosCargos(dataOtros.data || []);
      }

    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const descargarArchivo = (base64Data, filename, mimeType) => {
    try {
      if (!base64Data) {
        alert("No hay archivo disponible para descargar");
        return;
      }

      console.log("Descargando archivo:", filename);
      console.log("Tipo MIME:", mimeType);
      console.log("Tamaño Base64:", base64Data.length);

      // Convertir base64 a blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log("✅ Archivo descargado exitosamente");
    } catch (error) {
      console.error("❌ Error descargando archivo:", error);
      alert("Error al descargar el archivo. Revisa la consola para más detalles.");
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando información...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!afiliado) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>No se encontró información del afiliado</p>
          <button className="btn-close" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-ver">
        <div className="modal-header">
          <div className="header-info">
            <h2>Información del Afiliado</h2>
            <p className="afiliado-nombre">
              {afiliado.nombres} {afiliado.apellidos}
            </p>
            <p className="afiliado-cedula">CC: {afiliado.cedula}</p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Foto del afiliado */}
        {afiliado.foto_afiliado && (
          <div className="foto-afiliado-container">
            <img 
              src={`data:image/jpeg;base64,${afiliado.foto_afiliado}`}
              alt={`${afiliado.nombres} ${afiliado.apellidos}`}
              className="foto-afiliado"
            />
          </div>
        )}

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === "personales" ? "active" : ""}`}
            onClick={() => setActiveTab("personales")}
          >
            📋 Datos Personales
          </button>
          <button
            className={`tab-btn ${activeTab === "seguridad" ? "active" : ""}`}
            onClick={() => setActiveTab("seguridad")}
          >
            🏥 Seguridad Social
          </button>
          <button
            className={`tab-btn ${activeTab === "laborales" ? "active" : ""}`}
            onClick={() => setActiveTab("laborales")}
          >
            💼 Datos Laborales
          </button>
          <button
            className={`tab-btn ${activeTab === "documentos" ? "active" : ""}`}
            onClick={() => setActiveTab("documentos")}
          >
            📄 Documentos
          </button>
        </div>

        <div className="modal-body">
          {/* TAB: DATOS PERSONALES */}
          {activeTab === "personales" && (
            <div className="tab-content">
              <div className="info-section">
                <h3 className="section-title">Información Básica</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Cédula:</span>
                    <span className="info-value">{afiliado.cedula}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Nombres:</span>
                    <span className="info-value">{afiliado.nombres}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Apellidos:</span>
                    <span className="info-value">{afiliado.apellidos}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fecha de Nacimiento:</span>
                    <span className="info-value">{formatearFecha(afiliado.fecha_nacimiento)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Religión:</span>
                    <span className="info-value">{afiliado.nombre_religion || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fecha de Afiliación:</span>
                    <span className="info-value">{formatearFecha(afiliado.fecha_afiliacion)}</span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3 className="section-title">Domicilio</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Dirección:</span>
                    <span className="info-value">{afiliado.direccion_domicilio || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Municipio:</span>
                    <span className="info-value">{afiliado.municipio_domicilio || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3 className="section-title">Residencia</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Dirección:</span>
                    <span className="info-value">{afiliado.direccion_residencia || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Municipio:</span>
                    <span className="info-value">{afiliado.municipio_residencia || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SEGURIDAD SOCIAL */}
          {activeTab === "seguridad" && (
            <div className="tab-content">
              <div className="info-section">
                <h3 className="section-title">Entidades de Seguridad Social</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">EPS:</span>
                    <span className="info-value">{afiliado.nombre_eps || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">ARL:</span>
                    <span className="info-value">{afiliado.nombre_arl || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Pensión:</span>
                    <span className="info-value">{afiliado.nombre_pension || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Cesantías:</span>
                    <span className="info-value">{afiliado.nombre_cesantias || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DATOS LABORALES */}
          {activeTab === "laborales" && (
            <div className="tab-content">
              <div className="info-section">
                <h3 className="section-title">Información Laboral</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Cargo:</span>
                    <span className="info-value">{afiliado.nombre_cargo || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Municipio de Trabajo:</span>
                    <span className="info-value">{afiliado.municipio_trabajo_nombre || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Salario:</span>
                    <span className="info-value" style={{ color: "var(--primary-blue)", fontWeight: "bold" }}>
                      {salarioCalculado ? `$${salarioCalculado.toLocaleString()}` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3 className="section-title">Institución Educativa</h3>
                <div className="info-grid">
                  <div className="info-item full-width">
                    <span className="info-label">Nombre:</span>
                    <span className="info-value">{afiliado.nombre_institucion || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Correo:</span>
                    <span className="info-value">{afiliado.correo_institucional || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Teléfono:</span>
                    <span className="info-value">{afiliado.telefono_institucional || "N/A"}</span>
                  </div>
                  <div className="info-item full-width">
                    <span className="info-label">Dirección:</span>
                    <span className="info-value">{afiliado.direccion_institucion || "N/A"}</span>
                  </div>
                </div>
              </div>

              {otrosCargos.length > 0 && (
                <div className="info-section">
                  <h3 className="section-title">Otros Cargos</h3>
                  <div className="otros-cargos-list">
                    {otrosCargos.map((cargo, index) => (
                      <div key={index} className="cargo-item">
                        <h4>{cargo.nombre_cargo}</h4>
                        <p>
                          <strong>Período:</strong> {formatearFecha(cargo.fecha_inicio)} - {cargo.fecha_fin ? formatearFecha(cargo.fecha_fin) : "Actual"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: DOCUMENTOS */}
          {activeTab === "documentos" && (
            <div className="tab-content">
              <div className="info-section">
                <h3 className="section-title">Acta de Nombramiento</h3>
                {actas.nombramiento ? (
                  <div className="documento-info">
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Tipo de Documento:</span>
                        <span className="info-value">{actas.nombramiento.tipo_documento}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Número:</span>
                        <span className="info-value">{actas.nombramiento.numero_resolucion}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Fecha:</span>
                        <span className="info-value">{formatearFecha(actas.nombramiento.fecha_resolucion)}</span>
                      </div>
                    </div>
                    {actas.nombramiento.archivo_documento ? (
                      <div style={{ marginTop: "15px" }}>
                        <button 
                          className="btn-download"
                          onClick={() => {
                            console.log("📄 Intentando descargar nombramiento");
                            console.log("Datos del archivo:", {
                              existe: !!actas.nombramiento.archivo_documento,
                              longitud: actas.nombramiento.archivo_documento?.length,
                              primeros20: actas.nombramiento.archivo_documento?.substring(0, 20)
                            });
                            descargarArchivo(
                              actas.nombramiento.archivo_documento,
                              `nombramiento_${afiliado.cedula}.pdf`,
                              'application/pdf'
                            );
                          }}
                        >
                          📥 Descargar Documento
                        </button>
                        <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
                          Archivo disponible ({actas.nombramiento.archivo_documento.length} caracteres)
                        </p>
                      </div>
                    ) : (
                      <p className="no-data">No hay archivo adjunto</p>
                    )}
                  </div>
                ) : (
                  <p className="no-data">No hay acta de nombramiento registrada</p>
                )}
              </div>

              <div className="info-section">
                <h3 className="section-title">Acta de Posesión</h3>
                {actas.posesion ? (
                  <div className="documento-info">
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Número de Acta:</span>
                        <span className="info-value">{actas.posesion.numero_acta}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Fecha:</span>
                        <span className="info-value">{formatearFecha(actas.posesion.fecha_acta)}</span>
                      </div>
                    </div>
                    {actas.posesion.documento_acta ? (
                      <div style={{ marginTop: "15px" }}>
                        <button 
                          className="btn-download"
                          onClick={() => {
                            console.log("📄 Intentando descargar posesión");
                            console.log("Datos del archivo:", {
                              existe: !!actas.posesion.documento_acta,
                              longitud: actas.posesion.documento_acta?.length,
                              primeros20: actas.posesion.documento_acta?.substring(0, 20)
                            });
                            descargarArchivo(
                              actas.posesion.documento_acta,
                              `posesion_${afiliado.cedula}.pdf`,
                              'application/pdf'
                            );
                          }}
                        >
                          📥 Descargar Documento
                        </button>
                        <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
                          Archivo disponible ({actas.posesion.documento_acta.length} caracteres)
                        </p>
                      </div>
                    ) : (
                      <p className="no-data">No hay archivo adjunto</p>
                    )}
                  </div>
                ) : (
                  <p className="no-data">No hay acta de posesión registrada</p>
                )}
              </div>

              {afiliado.foto_afiliado && (
                <div className="info-section">
                  <h3 className="section-title">Fotografía</h3>
                  <div className="documento-info">
                    <div className="foto-preview">
                      <img 
                        src={`data:image/jpeg;base64,${afiliado.foto_afiliado}`}
                        alt="Foto del afiliado"
                        onError={(e) => {
                          console.error("Error cargando imagen");
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23ddd' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3ESin imagen%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <button 
                      className="btn-download"
                      onClick={() => {
                        console.log("📷 Intentando descargar foto");
                        console.log("Datos de la foto:", {
                          existe: !!afiliado.foto_afiliado,
                          longitud: afiliado.foto_afiliado?.length,
                          primeros20: afiliado.foto_afiliado?.substring(0, 20)
                        });
                        descargarArchivo(
                          afiliado.foto_afiliado,
                          `foto_${afiliado.cedula}.jpg`,
                          'image/jpeg'
                        );
                      }}
                    >
                      📥 Descargar Foto
                    </button>
                    <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
                      Foto disponible ({afiliado.foto_afiliado.length} caracteres)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-close-footer" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
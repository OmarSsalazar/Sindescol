import "./ModalEliminarAfiliado.css";

export const ModalEliminarAfiliado = ({ isOpen, onClose, onConfirm, afiliado }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-eliminar">
        <div className="modal-header-eliminar">
          <div className="icon-warning">⚠️</div>
          <h2>Confirmar Eliminación</h2>
        </div>

        <div className="modal-body-eliminar">
          <p className="warning-text">
            ¿Estás seguro que deseas eliminar este afiliado?
          </p>

          {afiliado && (
            <div className="afiliado-info-eliminar">
              <div className="info-row">
                <span className="label">Cédula:</span>
                <span className="value">{afiliado.cedula}</span>
              </div>
              <div className="info-row">
                <span className="label">Nombre Completo:</span>
                <span className="value">{afiliado.nombres} {afiliado.apellidos}</span>
              </div>
              <div className="info-row">
                <span className="label">Cargo:</span>
                <span className="value">{afiliado.nombre_cargo || "N/A"}</span>
              </div>
              <div className="info-row">
                <span className="label">Institución:</span>
                <span className="value">{afiliado.nombre_institucion || "N/A"}</span>
              </div>
            </div>
          )}

          <div className="alert-eliminar">
            <p><strong>⚠️ Esta acción no se puede deshacer</strong></p>
            <p>Se eliminarán todos los datos asociados al afiliado incluyendo:</p>
            <ul>
              <li>Actas de nombramiento y posesión</li>
              <li>Registros de otros cargos</li>
              <li>Historial de cuotas</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer-eliminar">
          <button className="btn-cancelar-eliminar" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-confirmar-eliminar" onClick={onConfirm}>
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
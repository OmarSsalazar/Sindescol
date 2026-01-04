// frontend/src/components/cuotas/FiltrosCuotas.jsx
export function FiltrosCuotas({ filtros, onChange, onLimpiar }) {
  // Generar años disponibles (últimos 5 años + próximos 2)
  const generarAnios = () => {
    const anioActual = new Date().getFullYear();
    const anios = [];
    for (let i = anioActual - 5; i <= anioActual + 2; i++) {
      anios.push(i);
    }
    return anios;
  };

  return (
    <div className="card cuotas-filtros-card">
      <h3 className="cuotas-filtros-title">🔍 Filtros</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Buscar por Cédula o Nombre</label>
          <input
            type="text"
            name="busqueda"
            value={filtros.busqueda}
            onChange={(e) => onChange(e.target.name, e.target.value)}
            placeholder="Ingresa cédula o nombre..."
          />
        </div>
        <div className="form-group">
          <label>Año *</label>
          <select 
            name="anio" 
            value={filtros.anio} 
            onChange={(e) => onChange(e.target.name, e.target.value)}
          >
            {generarAnios().map(anio => (
              <option key={anio} value={anio}>{anio}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="cuotas-filtros-footer">
        <button 
          type="button" 
          className="btn btn-warning" 
          onClick={onLimpiar}
        >
          🔄 Limpiar Filtros
        </button>
      </div>
    </div>
  );
}
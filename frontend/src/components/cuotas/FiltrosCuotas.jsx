// frontend/src/components/cuotas/FiltrosCuotas.jsx
export function FiltrosCuotas({ filtros, onChange, onLimpiar }) {
  // Generar años disponibles (desde 2000 hasta 20 años en el futuro)
  const generarAnios = () => {
    const anioActual = new Date().getFullYear();
    const anios = [];
    const anioInicio = 2000; // Puedes cambiar este valor si necesitas años más antiguos
    const anioFin = anioActual + 100; // 20 años hacia el futuro
    
    for (let i = anioInicio; i <= anioFin; i++) {
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
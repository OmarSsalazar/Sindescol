export default function Home() {
  return (
    <div className="container">
      <div className="page-header">
        <h1>🏢 Bienvenido al Sistema Sindescol</h1>
        <p>Gestión integral del sindicato</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
        <div className="card">
          <h3 style={{ color: "var(--primary-blue)", marginBottom: "1rem" }}>👥 Afiliados</h3>
          <p>Gestiona la información de todos los afiliados del sindicato.</p>
          <a href="/afiliados" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Ir a Afiliados
          </a>
        </div>

        <div className="card">
          <h3 style={{ color: "var(--primary-blue)", marginBottom: "1rem" }}>💼 Cargos</h3>
          <p>Administra los diferentes cargos disponibles en la organización.</p>
          <a href="/cargos" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Ir a Cargos
          </a>
        </div>

        <div className="card">
          <h3 style={{ color: "var(--primary-blue)", marginBottom: "1rem" }}>💰 Cuotas</h3>
          <p>Controla las cuotas de los afiliados por mes y año.</p>
          <a href="/cuotas" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Ir a Cuotas
          </a>
        </div>

        <div className="card">
          <h3 style={{ color: "var(--primary-blue)", marginBottom: "1rem" }}>💵 Salarios</h3>
          <p>Gestiona los salarios por cargo y departamento.</p>
          <a href="/salarios" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Ir a Salarios
          </a>
        </div>
      </div>
    </div>
  );
}

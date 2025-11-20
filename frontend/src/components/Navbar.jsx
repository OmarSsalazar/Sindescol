import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary-yellow)" }}>
          📋 SINDESCOL
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/" className={isActive("/")}>Inicio</Link>
          <Link to="/afiliados" className={isActive("/afiliados")}>Afiliados</Link>
          <Link to="/cargos" className={isActive("/cargos")}>Cargos</Link>
          <Link to="/cuotas" className={isActive("/cuotas")}>Cuotas</Link>
          <Link to="/salarios" className={isActive("/salarios")}>Salarios</Link>
        </div>
      </div>
    </nav>
  );
}

import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav>
      <div className="container" style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        padding: "0.5rem 2rem"
      }}>
        {/* Logo y Nombre */}
        <Link to="/" style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "1rem",
          textDecoration: "none"
        }}>
          <img 
            src="/escudo_sindescol.png" 
            alt="SINDESCOL Logo" 
            style={{ 
              width: "50px", 
              height: "50px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #FFC107",
              boxShadow: "0 2px 8px rgba(255, 193, 7, 0.3)"
            }}
          />
          <div style={{ 
            fontSize: "1.5rem", 
            fontWeight: "bold", 
            color: "#FFC107",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)"
          }}>
            SINDESCOL
            <div style={{ 
              fontSize: "0.65rem", 
              fontWeight: "normal", 
              color: "#E3F2FD",
              marginTop: "-5px"
            }}>
              Subdirectiva Nariño
            </div>
          </div>
        </Link>

        {/* Enlaces de navegación */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link to="/" className={isActive("/")}>Inicio</Link>
          <Link to="/afiliados" className={isActive("/afiliados")}>Afiliados</Link>
          <Link to="/cargos" className={isActive("/cargos")}>Cargos</Link>
          <Link to="/cuotas" className={isActive("/cuotas")}>Cuotas</Link>
          <Link to="/salarios" className={isActive("/salarios")}>Salarios</Link>
          <Link to="/departamentos" className={isActive("/departamentos")}>Departamentos</Link>
        </div>
      </div>
    </nav>
  );
}
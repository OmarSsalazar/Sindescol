import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Afiliados from "./pages/Afiliados";
import Cargos from "./pages/Cargos";
import Cuotas from "./pages/Cuotas";
import Salarios from "./pages/Salarios";
import "./styles/global.css";

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/afiliados" element={<Afiliados />} />
        <Route path="/cargos" element={<Cargos />} />
        <Route path="/cuotas" element={<Cuotas />} />
        <Route path="/salarios" element={<Salarios />} />
      </Routes>
    </Router>
  );
}

export default App;

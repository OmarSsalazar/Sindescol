import express from "express";
import cors from "cors";
import afiliadsRoutes from "./routes/afiliadsRoutes.js";
import salarioRoutes from "./routes/salariosDepartamentosRoutes.js";
import religionesRoutes from "./routes/religionesRoutes.js";
import municipiosRoutes from "./routes/municipiosRoutes.js";
import cargosRoutes from "./routes/cargosRoutes.js";
import epsRoutes from "./routes/epsRoutes.js";
import arlRoutes from "./routes/arlRoutes.js";
import pensionRoutes from "./routes/pensionRoutes.js";
import cesantiasRoutes from "./routes/cesantiasRoutes.js";
import institucionesRoutes from "./routes/institucionesRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/afiliados", afiliadsRoutes);
app.use("/api/salarios", salarioRoutes);
app.use("/api/religiones", religionesRoutes);
app.use("/api/municipios", municipiosRoutes);
app.use("/api/cargos", cargosRoutes);
app.use("/api/eps", epsRoutes);
app.use("/api/arl", arlRoutes);
app.use("/api/pension", pensionRoutes);
app.use("/api/cesantias", cesantiasRoutes);
app.use("/api/instituciones", institucionesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

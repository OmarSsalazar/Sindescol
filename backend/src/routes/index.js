import express from "express";

let afiliadosRoutes, cargosRoutes, cuotasRoutes, salariosDepartamentosRoutes;

try {
  afiliadosRoutes = (await import("./afiliadosRoutes.js")).default;
  console.log("✅ afiliadosRoutes importado");
} catch (err) {
  console.error("❌ Error importando afiliadosRoutes:", err.message);
}

try {
  cargosRoutes = (await import("./cargosRoutes.js")).default;
  console.log("✅ cargosRoutes importado");
} catch (err) {
  console.error("❌ Error importando cargosRoutes:", err.message);
}

try {
  cuotasRoutes = (await import("./cuotasRoutes.js")).default;
  console.log("✅ cuotasRoutes importado");
} catch (err) {
  console.error("❌ Error importando cuotasRoutes:", err.message);
}

try {
  salariosDepartamentosRoutes = (await import("./salariosDepartamentosRoutes.js")).default;
  console.log("✅ salariosDepartamentosRoutes importado");
} catch (err) {
  console.error("❌ Error importando salariosDepartamentosRoutes:", err.message);
}

const router = express.Router();

if (afiliadosRoutes) router.use("/afiliados", afiliadosRoutes);
if (cargosRoutes) router.use("/cargos", cargosRoutes);
if (cuotasRoutes) router.use("/cuotas", cuotasRoutes);
if (salariosDepartamentosRoutes) router.use("/salarios", salariosDepartamentosRoutes);

console.log("✅ Todas las rutas cargadas");

export default router;

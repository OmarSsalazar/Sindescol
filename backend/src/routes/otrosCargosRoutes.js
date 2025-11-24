import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Obtener otros cargos por afiliado
router.get("/:id_afiliado", async (req, res) => {
  try {
    const { id_afiliado } = req.params;
    const [cargos] = await db.query(
      "SELECT * FROM otros_cargos WHERE id_afiliado = ? ORDER BY fecha_inicio DESC",
      [id_afiliado]
    );
    res.json({ success: true, data: cargos });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
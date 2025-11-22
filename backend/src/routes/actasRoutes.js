import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Obtener actas de nombramiento por afiliado
router.get("/nombramiento/:id_afiliado", async (req, res) => {
  try {
    const { id_afiliado } = req.params;
    const [actas] = await db.query(
      "SELECT * FROM actas_nombramiento WHERE id_afiliado = ?",
      [id_afiliado]
    );
    res.json({ success: true, data: actas });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener actas de posesión por afiliado
router.get("/posesion/:id_afiliado", async (req, res) => {
  try {
    const { id_afiliado } = req.params;
    const [actas] = await db.query(
      "SELECT * FROM actas_posesion WHERE id_afiliado = ?",
      [id_afiliado]
    );
    res.json({ success: true, data: actas });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
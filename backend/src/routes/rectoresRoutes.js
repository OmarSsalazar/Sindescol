import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Obtener rector por institución
router.get("/:id_institucion", async (req, res) => {
  try {
    const { id_institucion } = req.params;
    const [rectores] = await db.query(
      "SELECT * FROM rectores WHERE id_institucion = ? LIMIT 1",
      [id_institucion]
    );
    
    if (rectores.length > 0) {
      res.json({ success: true, data: rectores[0] });
    } else {
      res.json({ success: true, data: null });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
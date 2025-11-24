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
    
    // Convertir BLOB a Base64
    const actasConBase64 = actas.map(acta => {
      if (acta.archivo_documento) {
        return {
          ...acta,
          archivo_documento: acta.archivo_documento.toString('base64')
        };
      }
      return acta;
    });
    
    res.json({ success: true, data: actasConBase64 });
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
    
    // Convertir BLOB a Base64
    const actasConBase64 = actas.map(acta => {
      if (acta.documento_acta) {
        return {
          ...acta,
          documento_acta: acta.documento_acta.toString('base64')
        };
      }
      return acta;
    });
    
    res.json({ success: true, data: actasConBase64 });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
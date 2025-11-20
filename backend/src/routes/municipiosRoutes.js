import express from "express";
import db from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [municipios] = await db.query("SELECT * FROM municipios");
    res.json({ success: true, data: municipios });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

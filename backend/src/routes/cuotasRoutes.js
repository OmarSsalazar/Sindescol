import express from "express";
import * as cuotasController from "../controllers/cuotasController.js";

const router = express.Router();

router.get("/", cuotasController.getCuotas);
router.get("/:id", cuotasController.getCuotaById);
router.get("/cedula/:cedula", cuotasController.getCuotasByCedula);
router.post("/", cuotasController.createCuota);
router.put("/:id", cuotasController.updateCuota);
router.delete("/:id", cuotasController.deleteCuota);

export default router;

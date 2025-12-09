import express from "express";
import * as cargosController from "../controllers/cargosController.js";

const router = express.Router();

router.get("/", cargosController.getCargos);
router.get("/:id", cargosController.getCargoById);
router.get("/:id/municipios", cargosController.getMunicipiosByCargo);
router.post("/", cargosController.createCargo);
router.put("/:id", cargosController.updateCargo);
router.delete("/:id", cargosController.deleteCargo);

export default router;
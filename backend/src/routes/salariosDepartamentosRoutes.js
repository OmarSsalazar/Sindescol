import express from "express";
import * as salarioController from "../controllers/salariosDepartamentosController.js";

const router = express.Router();

router.get("/", salarioController.getSalarios);
router.get("/:id", salarioController.getSalarioById);
router.post("/", salarioController.createSalario);
router.put("/:id", salarioController.updateSalario);
router.delete("/:id", salarioController.deleteSalario);

export default router;

import express from "express";
import * as afiliadosController from "../controllers/afiliadosController.js";

const router = express.Router();

router.get("/", afiliadosController.getAfiliados);
router.get("/:id", afiliadosController.getAfiliadoById);
router.get("/cedula/:cedula", afiliadosController.getAfiliadoByCedula);
router.post("/", afiliadosController.createAfiliado);
router.put("/:id", afiliadosController.updateAfiliado);
router.delete("/:id", afiliadosController.deleteAfiliado);

export default router;

import express from "express";
import * as afiliadsController from "../controllers/afiliadsController.js";

const router = express.Router();

router.get("/", afiliadsController.getAfiliados);
router.get("/search", afiliadsController.searchAfiliados);
router.get("/:id", afiliadsController.getAfiliadoById);
router.get("/cedula/:cedula", afiliadsController.getAfiliadoByCedula);
router.post("/", afiliadsController.createAfiliado);
router.put("/:id", afiliadsController.updateAfiliado);
router.delete("/:id", afiliadsController.deleteAfiliado);

export default router;

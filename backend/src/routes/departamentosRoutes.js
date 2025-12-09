import express from "express";
import * as departamentosController from "../controllers/departamentosController.js";

const router = express.Router();

// Obtener todos los departamentos
router.get("/", departamentosController.getDepartamentos);

// Obtener municipios de un departamento
router.get("/:departamento/municipios", departamentosController.getMunicipiosByDepartamento);

// Crear departamento con municipios
router.post("/crear-con-municipios", departamentosController.createDepartamentoConMunicipios);

// CRUD de municipios individuales
router.post("/municipio", departamentosController.createMunicipio);
router.put("/municipio/:id", departamentosController.updateMunicipio);
router.delete("/municipio/:id", departamentosController.deleteMunicipio);

export default router;
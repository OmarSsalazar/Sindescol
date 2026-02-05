import express from "express";
import * as salariosController from "../controllers/salariosController.js";

const router = express.Router();

// IMPORTANTE: Las rutas más específicas deben ir ANTES que las genéricas
// Ruta para obtener todos los salarios (filtrado automáticamente por departamento)
router.get("/", salariosController.salariosController.getSalarios);

// Ruta para obtener un salario por ID (debe estar después de la ruta con query params)
router.get("/:id", salariosController.salariosController.getSalarioById);

// Crear un nuevo salario
router.post("/", salariosController.salariosController.createSalario);

// Actualizar un salario
router.put("/:id", salariosController.salariosController.updateSalario);

// Eliminar un salario
router.delete("/:id", salariosController.salariosController.deleteSalario);

export default router;

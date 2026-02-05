import express from 'express';
import { cargosController } from '../controllers/otrosControllers.js';

const router = express.Router();

// Listar todos los cargos (filtrado automático por departamento)
router.get('/', cargosController.getCargos);

// Obtener cargo por ID
router.get('/:id', cargosController.getCargoById);

// Crear cargo
router.post('/', cargosController.createCargo);

// Actualizar cargo
router.put('/:id', cargosController.updateCargo);

// Eliminar cargo (validación automática de departamento)
router.delete('/:id', cargosController.deleteCargo);

export default router;
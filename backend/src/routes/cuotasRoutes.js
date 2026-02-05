import express from 'express';
import { cuotasController } from '../controllers/otrosControllers.js';

const router = express.Router();

// Listar todas las cuotas (filtrado automático por departamento)
router.get('/', cuotasController.getCuotas);

// Obtener cuota por ID
router.get('/:id', cuotasController.getCuotaById);

// Obtener cuotas por cédula
router.get('/cedula/:cedula', cuotasController.getCuotasByCedula);

// Crear cuota (validación automática de departamento)
router.post('/', cuotasController.createCuota);

// Actualizar cuota (validación automática de departamento)
router.put('/:id', cuotasController.updateCuota);

// Eliminar cuota (validación automática de departamento)
router.delete('/:id', cuotasController.deleteCuota);

export default router;
import express from 'express';
import {
  getAfiliados,
  getAfiliadoById,
  getAfiliadoByCedula,
  createAfiliado,
  updateAfiliado,
  deleteAfiliado,
  searchAfiliados
} from '../controllers/afiliadsController.js';

const router = express.Router();

// ============================================
// RUTAS DE AFILIADOS
// ============================================
// NOTA: Ya no necesitamos filtrarPorDepartamento como middleware
// El filtrado se hace automáticamente en el servicio usando:
// - req.user.departamento
// - req.user.rol

// Listar todos los afiliados (filtrado automático por departamento)
router.get('/', getAfiliados);

// Buscar afiliados (filtrado automático por departamento)
router.get('/search', searchAfiliados);

// Obtener afiliado por ID
router.get('/:id', getAfiliadoById);

// Obtener afiliado por cédula
router.get('/cedula/:cedula', getAfiliadoByCedula);

// Crear afiliado (validación automática de departamento)
router.post('/', createAfiliado);

// Actualizar afiliado (validación automática de departamento)
router.put('/:id', updateAfiliado);

// Eliminar afiliado (validación automática de departamento)
router.delete('/:id', deleteAfiliado);

export default router;
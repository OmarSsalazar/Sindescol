import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

// Importar rutas
import authRoutes from './authRoutes.js';
import afiliadsRoutes from './afiliadsRoutes.js';
import cargosRoutes from './cargosRoutes.js';
import cuotasRoutes from './cuotasRoutes.js';
import salariosRoutes from './salariosRoutes.js';
import municipiosRoutes from './municipiosRoutes.js';
import institucionesRoutes from './institucionesRoutes.js';
import religionesRoutes from './religionesRoutes.js';
import entidadesRoutes from './entidadesRoutes.js';
import estadisticasRoutes from './estadisticasRoutes.js';

const router = express.Router();

// ============================================
// RUTAS PÚBLICAS (sin autenticación)
// ============================================
router.use('/auth', authRoutes);

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================
// IMPORTANTE: El filtrado por departamento ahora se hace automáticamente
// en los servicios usando req.user.departamento y req.user.rol

router.use('/afiliados', authenticateToken, afiliadsRoutes);
router.use('/cargos', authenticateToken, cargosRoutes);
router.use('/cuotas', authenticateToken, cuotasRoutes);
router.use('/salarios', authenticateToken, salariosRoutes);
router.use('/municipios', authenticateToken, municipiosRoutes);
router.use('/instituciones', authenticateToken, institucionesRoutes);
router.use('/religiones', authenticateToken, religionesRoutes);
router.use('/entidades', authenticateToken, entidadesRoutes);
router.use('/estadisticas', authenticateToken, estadisticasRoutes);

export default router;
// backend/src/routes/usuariosRoutes.js
import express from "express";
import * as usuariosController from "../controllers/usuariosController.js";
import { verificarPermisoGestionUsuarios } from "../middleware/auth.js";

const router = express.Router();

// Todas estas rutas requieren permisos de gestión
router.use(verificarPermisoGestionUsuarios);

router.get("/", usuariosController.getUsuarios);
router.post("/", usuariosController.createUsuario);
router.put("/:id", usuariosController.updateUsuario);
router.delete("/:id", usuariosController.deleteUsuario);
router.patch("/:id/toggle-activo", usuariosController.toggleActivo);

export default router;
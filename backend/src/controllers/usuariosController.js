// backend/src/controllers/usuariosController.js
import * as usuariosService from "../services/usuariosService.js";

export const getUsuarios = async (req, res) => {
  try {
    const rol = req.user.rol;
    const departamento = req.user.departamento;
    
    const usuarios = await usuariosService.getUsuarios(rol, departamento);
    res.json({ success: true, data: usuarios });
  } catch (error) {
    console.error("Error en getUsuarios:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPresidencias = async (req, res) => {
  try {
    const rol = req.user.rol;
    const departamento = req.user.departamento;
    
    const presidencias = await usuariosService.getPresidencias(rol, departamento);
    res.json({ success: true, data: presidencias });
  } catch (error) {
    console.error("Error en getPresidencias:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const rolCreador = req.user.rol;
    const departamentoCreador = req.user.departamento;
    
    const usuario = await usuariosService.createUsuario(
      req.body, 
      rolCreador, 
      departamentoCreador
    );
    
    res.status(201).json({ success: true, data: usuario });
  } catch (error) {
    console.error("Error en createUsuario:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const rolCreador = req.user.rol;
    const departamentoCreador = req.user.departamento;
    
    const usuario = await usuariosService.updateUsuario(
      id, 
      req.body, 
      rolCreador, 
      departamentoCreador
    );
    
    if (!usuario) {
      return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }
    
    res.json({ success: true, data: usuario });
  } catch (error) {
    console.error("Error en updateUsuario:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const rolCreador = req.user.rol;
    const idUsuarioActual = req.user.id_usuario;
    
    const deleted = await usuariosService.deleteUsuario(
      id, 
      rolCreador, 
      idUsuarioActual
    );
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }
    
    res.json({ success: true, message: "Usuario eliminado" });
  } catch (error) {
    console.error("Error en deleteUsuario:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

export const toggleActivo = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await usuariosService.toggleActivo(id);
    
    if (!usuario) {
      return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }
    
    res.json({ success: true, data: usuario });
  } catch (error) {
    console.error("Error en toggleActivo:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
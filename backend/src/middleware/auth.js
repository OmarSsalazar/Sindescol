// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.log('❌ No se proporcionó token');
    return res.status(401).json({ 
      success: false, 
      error: 'No autorizado - Token requerido' 
    });
  }
  
  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'sindescol-super-secreto-2025-cambiar-en-produccion'
    );
    
    console.log('✅ Token válido para usuario:', decoded.email, 'Rol:', decoded.rol);
    req.usuario = decoded;
    next();
  } catch (error) {
    console.log('❌ Token inválido:', error.message);
    return res.status(401).json({ 
      success: false, 
      error: 'Token inválido o expirado' 
    });
  }
};

export const filtrarPorDepartamento = (req, res, next) => {
  // Si es presidencia_nacional, no filtrar
  if (req.usuario.rol === 'presidencia_nacional') {
    req.departamento = null; // null = ver todos
    console.log('🔓 Presidencia Nacional - Acceso total');
  } else {
    req.departamento = req.usuario.departamento;
    console.log('🔒 Filtro aplicado - Departamento:', req.departamento);
  }
  next();
};

// Nuevo middleware para verificar permisos de gestión de usuarios
export const verificarPermisoGestionUsuarios = (req, res, next) => {
  const rol = req.usuario.rol;
  
  if (rol === 'usuario') {
    return res.status(403).json({ 
      success: false, 
      error: 'No tienes permisos para gestionar usuarios' 
    });
  }
  
  console.log('✅ Permiso de gestión de usuarios verificado para:', req.usuario.email);
  next();
};

// Middleware para verificar si es presidencia nacional
export const verificarPresidenciaNacional = (req, res, next) => {
  if (req.usuario.rol !== 'presidencia_nacional') {
    return res.status(403).json({ 
      success: false, 
      error: 'Solo Presidencia Nacional puede realizar esta acción' 
    });
  }
  
  console.log('✅ Verificado como Presidencia Nacional');
  next();
};
import jwt from 'jsonwebtoken';

/**
 * Middleware para autenticar el token JWT
 * Extrae: id_usuario, correo, rol, departamento
 */
export const authenticateToken = (req, res, next) => {
  // Obtener el token del header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Token no proporcionado. Acceso denegado.' 
    });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ⭐ IMPORTANTE: Agregar toda la información del usuario a req.user
    req.user = {
      id_usuario: decoded.id_usuario,
      email: decoded.email,
      rol: decoded.rol,                     
      departamento: decoded.departamento    
    };

    console.log('🔐 Usuario autenticado:', {
      email: req.user.email,
      rol: req.user.rol,
      departamento: req.user.departamento || 'TODOS (Presidencia Nacional)'
    });

    next();
  } catch (error) {
    console.error('❌ Error verificando token:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        success: false,
        message: 'Token expirado. Por favor, inicia sesión nuevamente.' 
      });
    }
    
    return res.status(403).json({ 
      success: false,
      message: 'Token inválido. Acceso denegado.' 
    });
  }
};

/**
 * Middleware para verificar que el usuario tiene un rol específico
 * Uso: router.delete('/afiliados/:id', authenticateToken, requireRole('presidencia_nacional'), deleteAfiliado)
 */
export const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      return res.status(401).json({ 
        success: false,
        message: 'Usuario no autenticado' 
      });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ 
        success: false,
        message: `Acceso denegado. Se requiere rol: ${rolesPermitidos.join(' o ')}` 
      });
    }

    next();
  };
};

/**
 * Middleware para verificar que el usuario tiene presidencia_nacional
 */
export const requirePresidenciaNacional = requireRole('presidencia_nacional');
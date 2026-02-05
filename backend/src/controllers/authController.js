import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

/**
 * Login de usuario
 * Genera un token JWT con: id_usuario, correo, rol, departamento
 */
export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Validar datos
    if (!correo || !contrasena) {
      return res.status(400).json({ 
        success: false,
        message: 'Correo y contraseña son requeridos' 
      });
    }

    console.log('🔑 Intento de login:', correo);

    // Buscar usuario en la base de datos
    const [usuarios] = await db.query(
      'SELECT id_usuario, correo, contrasena, rol, departamento FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (usuarios.length === 0) {
      console.log('❌ Usuario no encontrado:', correo);
      return res.status(401).json({ 
        success: false,
        message: 'Correo o contraseña incorrectos' 
      });
    }

    const usuario = usuarios[0];

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordValido) {
      console.log('❌ Contraseña incorrecta para:', correo);
      return res.status(401).json({ 
        success: false,
        message: 'Correo o contraseña incorrectos' 
      });
    }

    // ⭐ GENERAR TOKEN JWT CON ROL Y DEPARTAMENTO
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo,
        rol: usuario.rol,                     // ⭐ presidencia_nacional, presidencia, usuario
        departamento: usuario.departamento    // ⭐ Antioquia, Nariño, Valle del Cauca, Cesar, o NULL
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Token expira en 24 horas
    );

    console.log('✅ Login exitoso:', {
      correo: usuario.correo,
      rol: usuario.rol,
      departamento: usuario.departamento || 'TODOS (Presidencia Nacional)'
    });

    // Retornar token y datos del usuario (sin contraseña)
    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo,
        rol: usuario.rol,
        departamento: usuario.departamento
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error del servidor al procesar el login' 
    });
  }
};

/**
 * Registro de nuevo usuario
 * Solo presidencia_nacional puede crear usuarios
 */
export const register = async (req, res) => {
  try {
    const { correo, contrasena, rol, departamento } = req.body;

    // Validar datos requeridos
    if (!correo || !contrasena || !rol) {
      return res.status(400).json({ 
        success: false,
        message: 'Correo, contraseña y rol son requeridos' 
      });
    }

    // Validar rol
    const rolesValidos = ['presidencia_nacional', 'presidencia', 'usuario'];
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({ 
        success: false,
        message: `Rol inválido. Debe ser: ${rolesValidos.join(', ')}` 
      });
    }

    // Validar que presidencia y usuario tengan departamento
    if ((rol === 'presidencia' || rol === 'usuario') && !departamento) {
      return res.status(400).json({ 
        success: false,
        message: 'El departamento es requerido para los roles presidencia y usuario' 
      });
    }

    // Validar que presidencia_nacional NO tenga departamento
    if (rol === 'presidencia_nacional' && departamento) {
      return res.status(400).json({ 
        success: false,
        message: 'El rol presidencia_nacional no debe tener departamento asignado' 
      });
    }

    console.log('📝 Registro de nuevo usuario:', { correo, rol, departamento });

    // Verificar si el correo ya existe
    const [existente] = await db.query(
      'SELECT id_usuario FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (existente.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'El correo ya está registrado' 
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(contrasena, salt);

    // Insertar nuevo usuario
    const [result] = await db.query(
      'INSERT INTO usuarios (correo, contrasena, rol, departamento) VALUES (?, ?, ?, ?)',
      [correo, contrasenaHash, rol, departamento || null]
    );

    console.log('✅ Usuario registrado:', { 
      id_usuario: result.insertId, 
      correo, 
      rol, 
      departamento: departamento || 'NULL' 
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      usuario: {
        id_usuario: result.insertId,
        correo,
        rol,
        departamento: departamento || null
      }
    });

  } catch (error) {
    console.error('❌ Error en register:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error del servidor al registrar usuario' 
    });
  }
};

/**
 * Verificar token (para validar si el usuario sigue autenticado)
 */
export const verifyToken = async (req, res) => {
  try {
    // req.user ya está disponible gracias al middleware authenticateToken
    res.json({
      success: true,
      message: 'Token válido',
      usuario: {
        id_usuario: req.user.id_usuario,
        correo: req.user.correo,
        rol: req.user.rol,
        departamento: req.user.departamento
      }
    });
  } catch (error) {
    console.error('❌ Error en verifyToken:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error del servidor al verificar token' 
    });
  }
};

/**
 * Logout (en el backend no hay mucho que hacer, el frontend debe eliminar el token)
 */
export const logout = async (req, res) => {
  try {
    console.log('👋 Logout de usuario:', req.user.correo);
    
    res.json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    console.error('❌ Error en logout:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error del servidor al cerrar sesión' 
    });
  }
};

/**
 * Cambiar contraseña
 */
export const changePassword = async (req, res) => {
  try {
    const { contrasenaActual, contrasenaNueva } = req.body;

    if (!contrasenaActual || !contrasenaNueva) {
      return res.status(400).json({ 
        success: false,
        message: 'Contraseña actual y nueva son requeridas' 
      });
    }

    // Obtener usuario actual
    const [usuarios] = await db.query(
      'SELECT contrasena FROM usuarios WHERE id_usuario = ?',
      [req.user.id_usuario]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    // Verificar contraseña actual
    const passwordValido = await bcrypt.compare(contrasenaActual, usuarios[0].contrasena);

    if (!passwordValido) {
      return res.status(401).json({ 
        success: false,
        message: 'Contraseña actual incorrecta' 
      });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(contrasenaNueva, salt);

    // Actualizar contraseña
    await db.query(
      'UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?',
      [contrasenaHash, req.user.id_usuario]
    );

    console.log('✅ Contraseña cambiada para usuario:', req.user.correo);

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error en changePassword:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error del servidor al cambiar contraseña' 
    });
  }
};
const db = require('../Conexion/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; 

// Registro
/**
 * POST /registro | Crea nuevo usuario en sistema.
 * Recibe {username, password} en body. Hashea contraseña.
 * Retorna éxito (201) o error de BD (500).
 */

const registroUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO Usuarios (username, password_hash) VALUES (?, ?)',
      [username, hashed]
    );
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (err) {
    console.error('registroUser:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Login
/**
 * POST /login | Autentica usuario existente.
 * Recibe {username, password} en body. Verifica credenciales.
 * Retorna token JWT (200), error de credenciales (401) o error servidor (500).
 */
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Paso 1: Buscar usuario incluyendo el campo 'activo'
    const [rows] = await db.query(
      'SELECT * FROM Usuarios WHERE username = ?',
      [username]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    const user = rows[0];
    
    // Paso 2: Verificar si está desactivado
    if (!user.activo) {
      return res.status(401).json({ error: 'Usuario desactivado' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    // Firma token con id y tipo
    const token = jwt.sign(
      { id: user.id, tipo: user.tipo },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, message: `¡Bienvenido ${user.username}!` });
  } catch (err) {
    console.error('loginUser:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { registroUser, loginUser };

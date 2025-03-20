const db = require('../Conexion/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro
const registroUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.query(
      'INSERT INTO usuarios (username, password_hash) VALUES (?, ?)',
      [username, hashedPassword]
    );
    
    res.status(201).json({ message: 'Usuario creado exitosamente' });
    
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
      const { username, password } = req.body;

      //Buscar usuario
      const [users] = await db.query(
          'SELECT * FROM usuarios WHERE username = ?',
          [username]
      );

      if (users.length === 0) {
          return res.status(401).json({ 
              success: false,
              error: 'Usuario no encontrado' 
          });
      }

      const user = users[0];

      //Comparar contraseñas
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
          return res.status(401).json({ 
              success: false,
              error: 'Contraseña incorrecta' 
          });
      }

      //JWT
      const token = jwt.sign(
          { id: user.id },
          'tu_clave_secreta_jwt', 
          { expiresIn: '1h' }
      );
      res.json({ 
          success: true,
          token: token,
          message: '¡Bienvenido ' + user.username + '!' 
      });

  } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ 
          success: false,
          error: 'Error en el servidor' 
      });
  }
};

module.exports = { registroUser, loginUser };
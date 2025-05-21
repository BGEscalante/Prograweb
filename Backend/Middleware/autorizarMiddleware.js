const jwt = require('jsonwebtoken');
const db = require('../Conexion/db'); 
const JWT_SECRET = process.env.JWT_SECRET;

exports.verificarToken = async (req, res, next) => { 
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Acceso denegado' });

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await db.query(
      'SELECT activo FROM Usuarios WHERE id = ?',
      [decoded.id]
    );
    
    if (!rows.length || !rows[0].activo) {
      return res.status(401).json({ error: 'Usuario desactivado' });
    }
    req.user = {
      id: decoded.id,
      tipo: decoded.tipo,
      activo: rows[0].activo
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    console.error('Error en verificarToken:', err);
    res.status(500).json({ error: 'Error de servidor' });
  }
};

exports.esAdmin = (req, res, next) => {
  if (req.user.tipo !== 'admin') {
    return res.status(403).json({ error: 'Acceso solo para administradores' });
  }
  next();
};
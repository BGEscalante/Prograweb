const db = require('../Conexion/db');

/**
 * GET /usuarios | Obtiene todos los usuarios (solo admin)
 * Retorna lista de usuarios sin password_hash (200) o error (500)
 */
exports.obtenerUsuarios = async (req, res) => {
    try {
      const [usuarios] = await db.query(`
        SELECT 
          id,
          username AS nombre,  
          CASE tipo             
            WHEN 'admin' THEN 'admin'
            WHEN 'cliente' THEN 'usuario'
          END AS rol,
          activo
        FROM usuarios
      `);
      res.json(usuarios);
    } catch (err) {
      console.error('obtenerUsuarios:', err);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  };

/**
 * PUT /usuarios/:id/estado | Actualiza estado de usuario (admin)
 * Recibe {activo} en body. Retorna éxito (200) o error (500/404)
 */
exports.actualizarEstadoUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;
    
    await db.query(
      'UPDATE Usuarios SET activo = ? WHERE id = ?',
      [activo, id]
    );
    
    res.status(200).json({ message: 'Estado actualizado' });
  } catch (err) {
    console.error('actualizarEstadoUsuario:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};
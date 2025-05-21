const db = require('../Conexion/db');

/**
 * POST /peliculas | Crea nueva película (admin). 
 * Recibe {nombre, imagen_url} en body. 
 * Retorna ID de película creada (201) o error (500).
 */
exports.crearPelicula = async (req, res) => {
  try {
    const { nombre, imagen_url } = req.body;
    const [result] = await db.query(
      'INSERT INTO Peliculas (nombre, imagen_url) VALUES (?, ?)',
      [nombre, imagen_url]
    );
    res.status(201).json({
      message: 'Película creada',
      id: result.insertId
    });
  } catch (err) {
    console.error('crearPelicula:', err);
    res.status(500).json({ error: 'Error al crear película' });
  }
};

/**
 * GET /peliculas | Obtiene todas las películas. 
 * No requiere parámetros. Retorna lista JSON (200) 
 * o error en consulta (500).
 */
exports.obtenerPeliculas = async (req, res) => {
  try {
    const [pelis] = await db.query(
      'SELECT id, nombre, imagen_url FROM Peliculas'
    );
    res.json(pelis);
  } catch (err) {
    console.error('obtenerPeliculas:', err);
    res.status(500).json({ error: 'Error al obtener películas' });
  }
};

/**
 * PUT /peliculas/:id | Actualiza película por ID (admin). 
 * Recibe {nombre, imagen_url} en body. 
 * Retorna confirmación (200) o error (500/404).
 */
exports.actualizarPelicula = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, imagen_url } = req.body;
    await db.query(
      'UPDATE Peliculas SET nombre = ?, imagen_url = ? WHERE id = ?',
      [nombre, imagen_url, id]
    );
    res.json({ message: 'Película actualizada' });
  } catch (err) {
    console.error('actualizarPelicula:', err);
    res.status(500).json({ error: 'Error al actualizar película' });
  }
};

/**
 * DELETE /peliculas/:id | Elimina película por ID (admin). 
 * Valida existencia previa. 
 * Retorna confirmación (200) o error (500/404).
 */
exports.eliminarPelicula = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM Peliculas WHERE id = ?', [id]);
    res.json({ message: 'Película eliminada' });
  } catch (err) {
    console.error('eliminarPelicula:', err);
    res.status(500).json({ error: 'Error al eliminar película' });
  }
};

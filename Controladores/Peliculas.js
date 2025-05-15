const db = require('../Conexion/db');

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

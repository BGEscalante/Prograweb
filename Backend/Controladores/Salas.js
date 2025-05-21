const db = require('../Conexion/db');


/**
 * POST /salas | Crea nueva sala (admin). 
 * Recibe {nombre, pelicula_id, filas, columnas}. 
 * Retorna ID de sala (201) o error (500).
 */
exports.crearSala = async (req, res) => {
  try {
    const { nombre, pelicula_id, filas, columnas } = req.body;
    const adminId = req.user.id;
    const [result] = await db.query(
      `INSERT INTO Salas (nombre, pelicula_id, filas, columnas, admin_id)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, pelicula_id, filas, columnas, adminId]
    );
    res.status(201).json({ message: 'Sala creada', id: result.insertId });
  } catch (err) {
    console.error('crearSala:', err);
    res.status(500).json({ error: 'Error al crear sala' });
  }
};


/**
 * GET /salas | Lista salas con disponibilidad calculada. 
 * Retorna JSON con datos de salas y películas (200) 
 * o error (500).
 */
exports.obtenerSalas = async (req, res) => {
  try {
    const [salas] = await db.query(`
      SELECT
        S.id,
        S.nombre               AS sala_nombre,
        S.filas               AS filas,
        S.columnas             AS columnas,
        P.nombre               AS pelicula_nombre,
        P.imagen_url           AS pelicula_imagen_url,
        (S.filas * S.columnas) - IFNULL(reservas.cant, 0) AS disponibles
      FROM Salas S
      JOIN Peliculas P ON S.pelicula_id = P.id
      LEFT JOIN (
        SELECT R.sala_id, COUNT(*) AS cant
        FROM Reservaciones R
        JOIN AsientosReservados A ON R.id = A.reservacion_id
        GROUP BY R.sala_id
      ) reservas ON S.id = reservas.sala_id
    `);
    res.json(salas);
  } catch (err) {
    console.error('obtenerSalas:', err);
    res.status(500).json({ error: 'Error al obtener salas' });
  }
};

/**
 * GET /salas | Lista salas con disponibilidad calculada. 
 * Retorna JSON con datos de salas y películas (200) 
 * o error (500).
 */
exports.actualizarSala = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, pelicula_id } = req.body;
    await db.query(
      `UPDATE Salas
       SET nombre = ?, pelicula_id = ?
       WHERE id = ? AND admin_id = ?`,
      [nombre, pelicula_id, id, req.user.id]
    );
    res.json({ message: 'Sala actualizada' });
  } catch (err) {
    console.error('actualizarSala:', err);
    res.status(500).json({ error: 'Error al actualizar sala' });
  }
};

/**
 * DELETE /salas/:id | Elimina sala sin reservas activas (admin). 
 * Retorna confirmación (200) o error (400/500).
 */
exports.eliminarSala = async (req, res) => {
  try {
    const { id } = req.params;
    const [reservas] = await db.query(
      'SELECT id FROM Reservaciones WHERE sala_id = ?',
      [id]
    );
    if (reservas.length > 0) {
      return res.status(400).json({ error: 'No se puede eliminar: hay reservas activas' });
    }
    await db.query('DELETE FROM Salas WHERE id = ?', [id]);
    res.json({ message: 'Sala eliminada' });
  } catch (err) {
    console.error('eliminarSala:', err);
    res.status(500).json({ error: 'Error al eliminar sala' });
  }
};

  
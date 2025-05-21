const db = require('../Conexion/db');

/**
 * POST /reservas | Crea reservación verificando asientos. 
 * Recibe {sala_id, fecha_reserva, asientos[]} en body. 
 * Retorna éxito (201) o asientos ocupados (400).
 */
exports.crearReservacion = async (req, res) => {
  try {
    const { sala_id, fecha_reserva, asientos } = req.body;
    const usuario_id = req.user.id;

    // Verificar disponibilidad
    const [ocupados] = await db.query(
      `SELECT A.fila, A.columna
       FROM AsientosReservados A
       JOIN Reservaciones R ON A.reservacion_id = R.id
       WHERE R.sala_id = ? AND R.fecha_reserva = ?`,
      [sala_id, fecha_reserva]
    );
    const conflictos = asientos.filter(a =>
      ocupados.some(o => o.fila === a.fila && o.columna === a.columna)
    );
    if (conflictos.length) {
      return res.status(400).json({
        error: 'Algunos asientos están ocupados',
        asientosConflictivos: conflictos
      });
    }

    // Crear reserva
    const [result] = await db.query(
      'INSERT INTO Reservaciones (usuario_id, sala_id, fecha_reserva) VALUES (?, ?, ?)',
      [usuario_id, sala_id, fecha_reserva]
    );
    const reservacion_id = result.insertId;

    // Guarda asientos
    await Promise.all(
      asientos.map(a =>
        db.query(
          'INSERT INTO AsientosReservados (reservacion_id, fila, columna) VALUES (?, ?, ?)',
          [reservacion_id, a.fila, a.columna]
        )
      )
    );

    res.status(201).json({ message: 'Reserva exitosa' });
  } catch (err) {
    console.error('crearReservacion:', err);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
};

/**
 * GET /reservas | Lista reservaciones del usuario. 
 * Usa user.id del token. Retorna JSON con sala 
 * y asientos (200) o error (500).
 */
exports.obtenerReservaciones = async (req, res) => {
  try {
   const [reservas] = await db.query(`
     SELECT
       R.id,
       R.fecha_reserva,
       S.nombre AS sala,
       -- Usamos LEFT JOIN para incluir reservas sin asientos
       IFNULL(GROUP_CONCAT(CONCAT(A.fila,'-',A.columna)), '') AS asientos
     FROM Reservaciones R
     JOIN Salas S
       ON R.sala_id = S.id
     LEFT JOIN AsientosReservados A
       ON R.id = A.reservacion_id
     WHERE R.usuario_id = ?
     GROUP BY R.id`, [req.user.id]
    );

    res.json(reservas);
  } catch (error) {
    console.error('Error en obtenerReservaciones:', error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

/**
 * DELETE /reservas/:id | Cancela reservación. 
 * Valida propiedad (usuario o admin). 
 * Retorna confirmación (200) o error (403/404).
 */
exports.cancelarReservacion = async (req, res) => {
  try {
    const { id } = req.params;
    const [row] = await db.query(
      'SELECT usuario_id FROM Reservaciones WHERE id = ?',
      [id]
    );
    const reserva = row[0];
    if (!reserva) return res.status(404).json({ error: 'Reserva no existe' });
    if (reserva.usuario_id !== req.user.id && req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }
    await db.query('DELETE FROM Reservaciones WHERE id = ?', [id]);
    res.json({ message: 'Reserva cancelada' });
  } catch (err) {
    console.error('cancelarReservacion:', err);
    res.status(500).json({ error: 'Error al cancelar reserva' });
  }
};


/**
 * POST /reservas/disponibilidad | Consulta disponibilidad. 
 * Recibe {sala_id, fecha_reserva}. Retorna grid de asientos 
 * con estado (200) o error (404/500).
 */
exports.obtenerDisponibilidad = async (req, res) => {
  try {
    const { sala_id, fecha_reserva } = req.body;

    //Recuperamos la configuración de la sala (filas y columnas)
    const [[sala]] = await db.query(
      'SELECT filas, columnas FROM Salas WHERE id = ?',
      [sala_id]
    );
    if (!sala) return res.status(404).json({ error: 'Sala no encontrada' });

    const { filas, columnas } = sala;

    //Obténemos los asientos ya reservados en esa fecha
    const [ocupados] = await db.query(
      `SELECT A.fila, A.columna
       FROM AsientosReservados A
       JOIN Reservaciones R ON A.reservacion_id = R.id
       WHERE R.sala_id = ? AND R.fecha_reserva = ?`,
      [sala_id, fecha_reserva]
    );

    // se construye la matriz de butacas
    const grid = [];
    for (let f = 1; f <= filas; f++) {
      const row = { fila: f, columnas: [] };
      for (let c = 1; c <= columnas; c++) {
        const isReserved = ocupados.some(a => a.fila === f && a.columna === c);
        row.columnas.push({ columna: c, reserved: isReserved });
      }
      grid.push(row);
    }

    res.json(grid);
  } catch (err) {
    console.error('Error en obtenerDisponibilidad:', err);
    res.status(500).json({ error: 'Error al obtener disponibilidad' });
  }
};
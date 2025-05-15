const express = require('express');
const router = express.Router();
const { verificarToken } = require('../Middleware/autorizarMiddleware');
const {
  crearReservacion,
  obtenerReservaciones,
  cancelarReservacion
} = require('../Controladores/Reservaciones');

// solo usuarios autenticados pueden gestionar reservas
router.post('/', verificarToken, crearReservacion);
router.get('/', verificarToken, obtenerReservaciones);
router.delete('/:id', verificarToken, cancelarReservacion);

module.exports = router;
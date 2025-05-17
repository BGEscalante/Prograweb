const express = require('express');
const router = express.Router();
const { verificarToken } = require('../Middleware/autorizarMiddleware');
const {
  crearReservacion,
  obtenerReservaciones,
  cancelarReservacion
} = require('../Controladores/Reservaciones');

const {
  obtenerDisponibilidad 
} = require('../Controladores/Reservaciones');

// solo usuarios autenticados pueden gestionar reservas
router.post('/', verificarToken, crearReservacion);
router.get('/', verificarToken, obtenerReservaciones);
router.delete('/:id', verificarToken, cancelarReservacion);


// Endpoint para la disponibilidad de butacas
router.post('/disponibilidad', verificarToken, obtenerDisponibilidad);

module.exports = router;
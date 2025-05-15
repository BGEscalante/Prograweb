const express = require('express');
const router = express.Router();
const { verificarToken, esAdmin } = require('../Middleware/autorizarMiddleware');
const {
  crearSala,
  obtenerSalas,
  actualizarSala,
  eliminarSala
} = require('../Controladores/Salas');

// Solo el admin puede crear, actualizar o eliminar salas
router.post('/', verificarToken, esAdmin, crearSala);
router.get('/', obtenerSalas);
router.put('/:id', verificarToken, esAdmin, actualizarSala);
router.delete('/:id', verificarToken, esAdmin, eliminarSala);

module.exports = router;
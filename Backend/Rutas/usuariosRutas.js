const express = require('express');
const router = express.Router();
const { verificarToken, esAdmin } = require('../Middleware/autorizarMiddleware');
const { obtenerUsuarios, actualizarEstadoUsuario } = require('../Controladores/Usuarios');

router.get('/', verificarToken, esAdmin, obtenerUsuarios);
router.put('/:id/estado', verificarToken, esAdmin, actualizarEstadoUsuario);

module.exports = router;
const express = require('express');
const router = express.Router();
const { verificarToken, esAdmin } = require('../Middleware/autorizarMiddleware');
const {
  crearPelicula,
  obtenerPeliculas,
  actualizarPelicula,
  eliminarPelicula
} = require('../Controladores/Peliculas');

// Solo admin puede crear, actualizar o eliminar
router.post('/',    verificarToken, esAdmin, crearPelicula);
router.get('/',     obtenerPeliculas);
router.put('/:id',  verificarToken, esAdmin, actualizarPelicula);
router.delete('/:id', verificarToken, esAdmin, eliminarPelicula);

module.exports = router;

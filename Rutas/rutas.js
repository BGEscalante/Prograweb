const express = require('express');
const router = express.Router();

//sub-rutas
const authRoutes = require('./autentificacionRutas');        
const salasRoutes = require('./salasRutas');      
const reservasRoutes = require('./reservasRutas');
const peliculasRoutes = require('./peliculasRutas')

//rutas con prefijos
router.use('/autentificacion', authRoutes);      
router.use('/salas', salasRoutes);    
router.use('/reservas', reservasRoutes);
router.use('/peliculas', peliculasRoutes);

module.exports = router;
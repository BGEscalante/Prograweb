const express = require('express');
const router = express.Router();
const { registroUser, loginUser } = require('../Controladores/autentificacion');

router.post('/registro', registroUser);
router.post('/login', loginUser);

module.exports = router;
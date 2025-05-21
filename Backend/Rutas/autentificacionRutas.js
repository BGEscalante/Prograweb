const express = require('express');
const router = express.Router();
const { registroUser, loginUser } = require('../Controladores/autentificacion');

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Registro y login de usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UsuarioRegistro:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: "usuario123"
 *         password:
 *           type: string
 *           example: "contraseñaSegura123"
 *     UsuarioLogin:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: "usuario123"
 *         password:
 *           type: string
 *           example: "contraseñaSegura123"
 */

/**
 * @swagger
 * /autentificacion/registro:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioRegistro'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       500:
 *         description: Error en el servidor
 */
router.post('/registro', registroUser);


/**
 * @swagger
 * /autentificacion/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioLogin'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error en el servidor
 */
router.post('/login', loginUser);

module.exports = router;
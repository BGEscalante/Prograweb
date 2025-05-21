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

/**
 * @swagger
 * tags:
 *   name: Salas
 *   description: Gestión de salas de cine
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SalaRequest:
 *       type: object
 *       required:
 *         - nombre
 *         - pelicula_id
 *         - filas
 *         - columnas
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Sala Premium 3D"
 *         pelicula_id:
 *           type: integer
 *           example: 5
 *         filas:
 *           type: integer
 *           example: 10
 *         columnas:
 *           type: integer
 *           example: 15
 */

// POST /salas
/**
 * @swagger
 * /salas:
 *   post:
 *     summary: Crear nueva sala (Admin)
 *     tags: [Salas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalaRequest'
 *     responses:
 *       201:
 *         description: Sala creada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Sala creada"
 *               id: 8
 *       500:
 *         description: Error del servidor
 */
router.post('/', verificarToken, esAdmin, crearSala);

/**
 * @swagger
 * /salas:
 *   get:
 *     summary: Obtener todas las salas
 *     tags: [Salas]
 *     responses:
 *       200:
 *         description: Listado de salas disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   sala_nombre:
 *                     type: string
 *                   pelicula_nombre:
 *                     type: string
 *                   disponibles:
 *                     type: integer
 *       500:
 *         description: Error del servidor
 */
router.get('/', obtenerSalas);

/**
 * @swagger
 * /salas/{id}:
 *   put:
 *     summary: Actualizar sala (Admin)
 *     tags: [Salas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sala
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               pelicula_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Sala actualizada
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', verificarToken, esAdmin, actualizarSala);

/**
 * @swagger
 * /salas/{id}:
 *   delete:
 *     summary: Eliminar sala (Admin)
 *     tags: [Salas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sala
 *     responses:
 *       200:
 *         description: Sala eliminada exitosamente
 *       400:
 *         description: No se puede eliminar (reservas activas)
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', verificarToken, esAdmin, eliminarSala);

module.exports = router;
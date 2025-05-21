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

/**
 * @swagger
 * tags:
 *   name: Películas
 *   description: Gestión de películas (requiere admin)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Pelicula:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *           example: "El Padrino"
 *         imagen_url:
 *           type: string
 *           example: "https://ejemplo.com/poster.jpg"
 */

/**
 * @swagger
 * /peliculas:
 *   post:
 *     summary: Crear nueva película (Admin)
 *     tags: [Películas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pelicula'
 *     responses:
 *       201:
 *         description: Película creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: integer
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post('/',    verificarToken, esAdmin, crearPelicula);

/**
 * @swagger
 * /peliculas:
 *   get:
 *     summary: Obtener todas las películas
 *     tags: [Películas]
 *     responses:
 *       200:
 *         description: Lista de películas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pelicula'
 *       500:
 *         description: Error del servidor
 */
router.get('/',     obtenerPeliculas);

/**
 * @swagger
 * /peliculas/{id}:
 *   put:
 *     summary: Actualizar película (Admin)
 *     tags: [Películas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pelicula'
 *     responses:
 *       200:
 *         description: Película actualizada
 *       404:
 *         description: Película no encontrada
 *       500:
 *         description: Error del servidor
 *   delete:
 *     summary: Eliminar película (Admin)
 *     tags: [Películas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Película eliminada
 *       404:
 *         description: Película no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id',  verificarToken, esAdmin, actualizarPelicula);

/**
 * @swagger
 * /peliculas/{id}:
 *   delete:
 *     summary: Eliminar película (Admin)
 *     description: Elimina permanentemente una película del sistema
 *     tags: [Películas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID numérico de la película a eliminar
 *     responses:
 *       200:
 *         description: Película eliminada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Película eliminada"
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 *       403:
 *         description: Acceso prohibido (requiere rol de admin)
 *       404:
 *         description: Película no encontrada
 *         content:
 *           application/json:
 *             example:
 *               error: "Película no existe"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al eliminar película"
 */
router.delete('/:id', verificarToken, esAdmin, eliminarPelicula);

module.exports = router;

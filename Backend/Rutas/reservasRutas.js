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

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Gestión de reservaciones de butacas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ReservaRequest:
 *       type: object
 *       required:
 *         - sala_id
 *         - fecha_reserva
 *         - asientos
 *       properties:
 *         sala_id:
 *           type: integer
 *           example: 1
 *         fecha_reserva:
 *           type: string
 *           format: date-time
 *           example: "2024-12-31 20:00:00"
 *         asientos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               fila:
 *                 type: integer
 *                 example: 3
 *               columna:
 *                 type: integer
 *                 example: 5
 *     DisponibilidadRequest:
 *       type: object
 *       required:
 *         - sala_id
 *         - fecha_reserva
 *       properties:
 *         sala_id:
 *           type: integer
 *           example: 1
 *         fecha_reserva:
 *           type: string
 *           format: date-time
 *           example: "2024-12-31 20:00:00"
 */

// POST /reservas
/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crear nueva reservación
 *     tags: [Reservas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservaRequest'
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *       400:
 *         description: Asientos no disponibles
 *         content:
 *           application/json:
 *             example:
 *               error: "Algunos asientos están ocupados"
 *               asientosConflictivos: [{"fila": 3, "columna": 5}]
 *       500:
 *         description: Error del servidor
 */
router.post('/', verificarToken, crearReservacion);

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Obtener reservaciones del usuario
 *     tags: [Reservas]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservaciones activas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   fecha_reserva:
 *                     type: string
 *                   sala:
 *                     type: string
 *                   asientos:
 *                     type: string
 *       500:
 *         description: Error del servidor
 */
router.get('/', verificarToken, obtenerReservaciones);

/**
 * @swagger
 * /reservas/{id}:
 *   delete:
 *     summary: Cancelar reservación
 *     tags: [Reservas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reservación
 *     responses:
 *       200:
 *         description: Reservación cancelada exitosamente
 *       403:
 *         description: No tienes permiso para esta acción
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', verificarToken, cancelarReservacion);


// Endpoint para la disponibilidad de butacas

/**
 * @swagger
 * /reservas/disponibilidad:
 *   post:
 *     summary: Verificar disponibilidad de asientos
 *     tags: [Reservas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DisponibilidadRequest'
 *     responses:
 *       200:
 *         description: Estado de disponibilidad
 *         content:
 *           application/json:
 *             example:
 *               - fila: 1
 *                 columnas:
 *                   - columna: 1
 *                     reserved: false
 *                   - columna: 2
 *                     reserved: true
 *       404:
 *         description: Sala no encontrada
 *       500:
 *         description: Error del servidor
 */
router.post('/disponibilidad', verificarToken, obtenerDisponibilidad);

module.exports = router;
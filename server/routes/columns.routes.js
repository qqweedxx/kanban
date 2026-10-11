const express = require('express')
const ctrl = require('../controllers/columns.controller')
const authMiddleware = require('../middleware/auth')
const roleMiddleware = require('../middleware/role')

const router = express.Router()
router.use(authMiddleware)

/**
 * @swagger
 * /api/columns:
 *   post:
 *     tags: [Columns]
 *     summary: Создать колонку
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, boardId]
 *             properties:
 *               title: { type: string }
 *               boardId: { type: string }
 *               wipLimit: { type: integer, nullable: true }
 *     responses:
 *       201: { description: Колонка создана }
 */
router.post('/', ctrl.create)

/**
 * @swagger
 * /api/columns/{id}:
 *   patch:
 *     tags: [Columns]
 *     summary: Обновить колонку (переименовать, WIP-лимит)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               wipLimit: { type: integer, nullable: true }
 *               order: { type: integer }
 *     responses:
 *       200: { description: Колонка обновлена }
 */
router.patch('/:id', ctrl.update)

/**
 * @swagger
 * /api/columns/{id}:
 *   delete:
 *     tags: [Columns]
 *     summary: Удалить колонку
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Колонка удалена }
 */
router.delete('/:id', roleMiddleware('admin', 'manager'), ctrl.remove)

module.exports = router
const express = require('express')
const ctrl = require('../controllers/boards.controller')
const authMiddleware = require('../middleware/auth')
const roleMiddleware = require('../middleware/role')

const router = express.Router()
router.use(authMiddleware)

/**
 * @swagger
 * /api/boards:
 *   get:
 *     tags: [Boards]
 *     summary: Список досок
 *     responses:
 *       200: { description: Массив досок }
 */
router.get('/', ctrl.list)

/**
 * @swagger
 * /api/boards/{id}:
 *   get:
 *     tags: [Boards]
 *     summary: Доска со всеми колонками и карточками
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Доска с колонками и карточками }
 *       404: { description: Доска не найдена }
 */
router.get('/:id', ctrl.getById)

/**
 * @swagger
 * /api/boards:
 *   post:
 *     tags: [Boards]
 *     summary: Создать доску
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, projectId]
 *             properties:
 *               name: { type: string }
 *               projectId: { type: string }
 *     responses:
 *       201: { description: Доска создана }
 */
router.post('/', ctrl.create)

/**
 * @swagger
 * /api/boards/{id}:
 *   patch:
 *     tags: [Boards]
 *     summary: Обновить доску
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
 *               name: { type: string }
 *     responses:
 *       200: { description: Доска обновлена }
 */
router.patch('/:id', ctrl.update)

/**
 * @swagger
 * /api/boards/{id}:
 *   delete:
 *     tags: [Boards]
 *     summary: Удалить доску
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Доска удалена }
 */
router.delete('/:id', roleMiddleware('admin', 'manager'), ctrl.remove)

module.exports = router
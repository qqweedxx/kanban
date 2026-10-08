const express = require('express')
const ctrl = require('../controllers/projects.controller')
const authMiddleware = require('../middleware/auth')

const router = express.Router()
router.use(authMiddleware)

/**
 * @swagger
 * /api/projects:
 *   get:
 *     tags: [Projects]
 *     summary: Список проектов
 *     responses:
 *       200: { description: Массив проектов }
 */
router.get('/', ctrl.list)

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     tags: [Projects]
 *     summary: Проект с досками
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Проект }
 *       404: { description: Не найден }
 */
router.get('/:id', ctrl.getById)

/**
 * @swagger
 * /api/projects:
 *   post:
 *     tags: [Projects]
 *     summary: Создать проект
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Проект создан }
 */
router.post('/', ctrl.create)

/**
 * @swagger
 * /api/projects/{id}:
 *   patch:
 *     tags: [Projects]
 *     summary: Обновить проект
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
 *               description: { type: string }
 *     responses:
 *       200: { description: Проект обновлён }
 */
router.patch('/:id', ctrl.update)

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     tags: [Projects]
 *     summary: Удалить проект
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Проект удалён }
 */
router.delete('/:id', ctrl.remove)

module.exports = router
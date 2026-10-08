const express = require('express')
const cardsController = require('../controllers/cards.controller')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// Все роуты карточек требуют авторизации
router.use(authMiddleware)

/**
 * @swagger
 * /api/cards:
 *   get:
 *     tags: [Cards]
 *     summary: Список карточек с фильтрами
 *     parameters:
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [low, medium, high] }
 *       - in: query
 *         name: label
 *         schema: { type: string }
 *       - in: query
 *         name: assigneeId
 *         schema: { type: string }
 *       - in: query
 *         name: columnId
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: Массив карточек }
 */
router.get('/', cardsController.list)

/**
 * @swagger
 * /api/cards:
 *   post:
 *     tags: [Cards]
 *     summary: Создать карточку
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, columnId]
 *             properties:
 *               title: { type: string }
 *               columnId: { type: string }
 *               description: { type: string }
 *               priority: { type: string, enum: [low, medium, high] }
 *               deadline: { type: string, format: date-time }
 *               labels: { type: string }
 *               attachmentUrl: { type: string }
 *               assigneeId: { type: string }
 *     responses:
 *       201: { description: Карточка создана }
 */
router.post('/', cardsController.create)

/**
 * @swagger
 * /api/cards/{id}:
 *   get:
 *     tags: [Cards]
 *     summary: Получить карточку с комментариями и историей
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Карточка }
 *       404: { description: Не найдена }
 */
router.get('/:id', cardsController.getById)

/**
 * @swagger
 * /api/cards/{id}:
 *   patch:
 *     tags: [Cards]
 *     summary: Обновить карточку
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
 *               description: { type: string }
 *               priority: { type: string, enum: [low, medium, high] }
 *               deadline: { type: string, format: date-time }
 *               labels: { type: string }
 *               attachmentUrl: { type: string }
 *               assigneeId: { type: string }
 *     responses:
 *       200: { description: Карточка обновлена }
 */
router.patch('/:id', cardsController.update)

/**
 * @swagger
 * /api/cards/{id}:
 *   delete:
 *     tags: [Cards]
 *     summary: Удалить карточку
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Карточка удалена }
 */
router.delete('/:id', cardsController.remove)

/**
 * @swagger
 * /api/cards/{id}/move:
 *   post:
 *     tags: [Cards]
 *     summary: Переместить карточку в другую колонку
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [targetColumnId]
 *             properties:
 *               targetColumnId: { type: string }
 *     responses:
 *       200: { description: Карточка перемещена }
 *       400: { description: WIP-лимит достигнут }
 */
router.post('/:id/move', cardsController.move)

/**
 * @swagger
 * /api/cards/{id}/comments:
 *   post:
 *     tags: [Cards]
 *     summary: Добавить комментарий
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text: { type: string }
 *     responses:
 *       201: { description: Комментарий добавлен }
 */
router.post('/:id/comments', cardsController.addComment)

module.exports = router
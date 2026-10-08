const express = require('express')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Регистрация
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               name: { type: string }
 *     responses:
 *       201:
 *         description: Пользователь создан, возвращает токен
 *       400:
 *         description: Ошибка валидации
 */
router.post('/register', authController.register)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Вход
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Возвращает токен и пользователя
 *       401:
 *         description: Неверный email или пароль
 */
router.post('/login', authController.login)

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Текущий пользователь
 *     responses:
 *       200:
 *         description: Данные пользователя
 *       401:
 *         description: Нет токена
 */
router.get('/me', authMiddleware, authController.me)

module.exports = router
const express = require('express')
const cardsController = require('../controllers/cards.controller')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// Все роуты карточек требуют авторизации
router.use(authMiddleware)

router.get('/', cardsController.list)
router.post('/', cardsController.create)
router.get('/:id', cardsController.getById)
router.patch('/:id', cardsController.update)
router.delete('/:id', cardsController.remove)
router.post('/:id/move', cardsController.move)
router.post('/:id/comments', cardsController.addComment)

module.exports = router
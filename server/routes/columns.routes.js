const express = require('express')
const ctrl = require('../controllers/columns.controller')
const authMiddleware = require('../middleware/auth')

const router = express.Router()
router.use(authMiddleware)

router.post('/', ctrl.create)
router.patch('/:id', ctrl.update)
router.delete('/:id', ctrl.remove)

module.exports = router
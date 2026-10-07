const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header) {
    return res.status(401).json({ error: 'Нет токена' })
  }

  const token = header.replace('Bearer ', '')

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.userId
    req.userRole = payload.role
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Неверный токен' })
  }
}

module.exports = authMiddleware
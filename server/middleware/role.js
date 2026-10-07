function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Нет доступа' })
    }
    next()
  }
}

module.exports = roleMiddleware
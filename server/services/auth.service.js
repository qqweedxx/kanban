const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../prisma')

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

async function register({ email, password, name }) {
  if (!email || !password || !name) {
    throw new Error('email, password и name обязательны')
  }
  if (password.length < 6) {
    throw new Error('Пароль минимум 6 символов')
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new Error('Пользователь с таким email уже существует')
  }

  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, password: hash, name, role: 'developer' },
  })

  const token = generateToken(user)
  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } }
}

async function login({ email, password }) {
  if (!email || !password) {
    throw new Error('email и password обязательны')
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error('Неверный email или пароль')
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new Error('Неверный email или пароль')
  }

  const token = generateToken(user)
  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } }
}

async function me(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('Пользователь не найден')
  return { id: user.id, email: user.email, name: user.name, role: user.role }
}

module.exports = { register, login, me }
const request = require('supertest')
const app = require('../app')

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('создаёт пользователя и возвращает токен', async () => {
      const email = `test${Date.now()}@test.com`
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email, password: 'secret123', name: 'Тест' })

      expect(res.statusCode).toBe(201)
      expect(res.body.token).toBeDefined()
      expect(res.body.user.email).toBe(email)
      expect(res.body.user.password).toBeUndefined()
    })

    it('ошибка, если email уже занят', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'admin@test.com', password: 'secret123', name: 'Дубликат' })

      expect(res.statusCode).toBe(400)
      expect(res.body.error).toMatch(/уже существует/i)
    })

    it('ошибка, если пароль короче 6 символов', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: `short${Date.now()}@test.com`, password: '123', name: 'Короткий' })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('POST /api/auth/login', () => {
    it('успешный вход администратора', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', password: 'password123' })

      expect(res.statusCode).toBe(200)
      expect(res.body.token).toBeDefined()
      expect(res.body.user.role).toBe('admin')
    })

    it('ошибка при неверном пароле', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', password: 'wrongpassword' })

      expect(res.statusCode).toBe(401)
    })
  })

  describe('GET /api/auth/me', () => {
    it('возвращает 401 без токена', async () => {
      const res = await request(app).get('/api/auth/me')
      expect(res.statusCode).toBe(401)
    })

    it('возвращает данные пользователя с токеном', async () => {
      const login = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', password: 'password123' })

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${login.body.token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.email).toBe('admin@test.com')
    })
  })
})
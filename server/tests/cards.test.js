const request = require('supertest')
const app = require('../app')

let token
let boardData

beforeAll(async () => {
  // Логинимся и получаем токен
  const login = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'password123' })
  token = login.body.token

  // Получаем доску
  const board = await request(app)
    .get('/api/boards/seed-board')
    .set('Authorization', `Bearer ${token}`)
  boardData = board.body
})

describe('Cards API', () => {
  describe('POST /api/cards', () => {
    it('создаёт карточку', async () => {
      const columnId = boardData.columns[0].id
      const res = await request(app)
        .post('/api/cards')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Тестовая карточка', columnId })

      expect(res.statusCode).toBe(201)
      expect(res.body.title).toBe('Тестовая карточка')
      expect(res.body.id).toBeDefined()

      // Удаляем за собой
      await request(app)
        .delete(`/api/cards/${res.body.id}`)
        .set('Authorization', `Bearer ${token}`)
    })

    it('ошибка без названия', async () => {
      const columnId = boardData.columns[0].id
      const res = await request(app)
        .post('/api/cards')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '', columnId })

      expect(res.statusCode).toBe(400)
    })

    it('ошибка без токена', async () => {
      const res = await request(app)
        .post('/api/cards')
        .send({ title: 'Без токена', columnId: 'abc' })

      expect(res.statusCode).toBe(401)
    })
  })

  describe('GET /api/cards', () => {
    it('возвращает список карточек', async () => {
      const res = await request(app)
        .get('/api/cards')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
    })
  })

  describe('GET /api/boards/:id', () => {
    it('возвращает доску со всеми колонками', async () => {
      const res = await request(app)
        .get('/api/boards/seed-board')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe('seed-board')
      expect(Array.isArray(res.body.columns)).toBe(true)
      expect(res.body.columns.length).toBeGreaterThan(0)
    })

    it('404 на несуществующей доске', async () => {
      const res = await request(app)
        .get('/api/boards/does-not-exist')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(404)
    })
  })
})
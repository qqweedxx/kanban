const request = require('supertest')
const app = require('../app')

let token
let projectId
let boardId
let columnId
let cardId

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'password123' })
  token = res.body.token

  const proj = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Test Project', description: 'desc' })
  projectId = proj.body.id
})

afterAll(async () => {
  if (projectId) {
    await request(app)
      .delete(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
  }
})

describe('Boards API', () => {
  it('GET /api/boards — список', async () => {
    const res = await request(app)
      .get('/api/boards')
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('POST /api/boards — создаёт доску', async () => {
    const res = await request(app)
      .post('/api/boards')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Board', projectId })
    expect(res.statusCode).toBe(201)
    expect(res.body.name).toBe('Test Board')
    boardId = res.body.id
  })

  it('POST /api/boards без name → 400', async () => {
    const res = await request(app)
      .post('/api/boards')
      .set('Authorization', `Bearer ${token}`)
      .send({ projectId })
    expect(res.statusCode).toBe(400)
  })

  it('POST /api/boards без projectId → 400', async () => {
    const res = await request(app)
      .post('/api/boards')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Board' })
    expect(res.statusCode).toBe(400)
  })

  it('GET /api/boards/:id — доска', async () => {
    const res = await request(app)
      .get(`/api/boards/${boardId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(boardId)
  })

  it('GET /api/boards/:id — 404', async () => {
    const res = await request(app)
      .get('/api/boards/nonexistent')
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(404)
  })

  it('PATCH /api/boards/:id — обновляет имя', async () => {
    const res = await request(app)
      .patch(`/api/boards/${boardId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Renamed Board' })
    expect(res.statusCode).toBe(200)
    expect(res.body.name).toBe('Renamed Board')
  })

  it('DELETE /api/boards/:id — удаляет', async () => {
    const tmp = await request(app)
      .post('/api/boards')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'ToDelete', projectId })
    const res = await request(app)
      .delete(`/api/boards/${tmp.body.id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
  })
})

describe('Columns API', () => {
  it('POST /api/columns — создаёт колонку', async () => {
    const res = await request(app)
      .post('/api/columns')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Column', boardId })
    expect(res.statusCode).toBe(201)
    expect(res.body.title).toBe('Test Column')
    columnId = res.body.id
  })

  it('POST /api/columns без title → 400', async () => {
    const res = await request(app)
      .post('/api/columns')
      .set('Authorization', `Bearer ${token}`)
      .send({ boardId })
    expect(res.statusCode).toBe(400)
  })

  it('POST /api/columns без boardId → 400', async () => {
    const res = await request(app)
      .post('/api/columns')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Column' })
    expect(res.statusCode).toBe(400)
  })

  it('PATCH /api/columns/:id — обновляет', async () => {
    const res = await request(app)
      .patch(`/api/columns/${columnId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Renamed Column', wipLimit: 5 })
    expect(res.statusCode).toBe(200)
    expect(res.body.title).toBe('Renamed Column')
    expect(res.body.wipLimit).toBe(5)
  })

  it('PATCH /api/columns/:id — снимает WIP-лимит', async () => {
    const res = await request(app)
      .patch(`/api/columns/${columnId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ wipLimit: null })
    expect(res.statusCode).toBe(200)
    expect(res.body.wipLimit).toBe(null)
  })
})

describe('Cards API (дополнительно)', () => {
  it('POST /api/cards — создаёт карточку', async () => {
    const res = await request(app)
      .post('/api/cards')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Card', columnId })
    expect(res.statusCode).toBe(201)
    cardId = res.body.id
  })

  it('GET /api/cards/:id — карточка', async () => {
    const res = await request(app)
      .get(`/api/cards/${cardId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(cardId)
  })

  it('PATCH /api/cards/:id — обновляет все поля', async () => {
    const res = await request(app)
      .patch(`/api/cards/${cardId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Title',
        description: 'Updated desc',
        priority: 'high',
        labels: 'bug,urgent',
        assigneeName: 'Иван',
        attachmentUrl: 'https://example.com'
      })
    expect(res.statusCode).toBe(200)
    expect(res.body.title).toBe('Updated Title')
    expect(res.body.priority).toBe('high')
    expect(res.body.assigneeName).toBe('Иван')
  })

  it('POST /api/cards/:id/comments — добавляет комментарий', async () => {
    const res = await request(app)
      .post(`/api/cards/${cardId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Тестовый комментарий' })
    expect(res.statusCode).toBe(201)
    expect(res.body.text).toBe('Тестовый комментарий')
  })

  it('POST /api/cards/:id/comments без text → 400', async () => {
    const res = await request(app)
      .post(`/api/cards/${cardId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: '' })
    expect(res.statusCode).toBe(400)
  })

  it('POST /api/cards/:id/move — перемещает в другую колонку', async () => {
    const col2 = await request(app)
      .post('/api/columns')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Col2', boardId })

    const res = await request(app)
      .post(`/api/cards/${cardId}/move`)
      .set('Authorization', `Bearer ${token}`)
      .send({ targetColumnId: col2.body.id })
    expect(res.statusCode).toBe(200)
    expect(res.body.columnId).toBe(col2.body.id)
  })

  it('DELETE /api/cards/:id — удаляет', async () => {
    const res = await request(app)
      .delete(`/api/cards/${cardId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
  })

  it('DELETE /api/columns/:id — удаляет колонку', async () => {
    const res = await request(app)
      .delete(`/api/columns/${columnId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
  })
})

describe('Projects API', () => {
  it('GET /api/projects — список', async () => {
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /api/projects/:id — проект', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(projectId)
  })

  it('GET /api/projects/:id — 404', async () => {
    const res = await request(app)
      .get('/api/projects/nonexistent')
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(404)
  })

  it('PATCH /api/projects/:id — обновляет', async () => {
    const res = await request(app)
      .patch(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Renamed Project', description: 'new desc' })
    expect(res.statusCode).toBe(200)
    expect(res.body.name).toBe('Renamed Project')
  })

  it('POST /api/projects без name → 400', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({})
    expect(res.statusCode).toBe(400)
  })
})
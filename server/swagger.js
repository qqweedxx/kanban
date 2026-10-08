const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kanban API',
      version: '1.0.0',
      description: 'API для Kanban-доски (аналог Jira)',
    },
    servers: [
      { url: 'http://localhost:4000', description: 'Локальный сервер' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Регистрация и вход' },
      { name: 'Boards', description: 'Доски' },
      { name: 'Columns', description: 'Колонки' },
      { name: 'Cards', description: 'Карточки' },
      { name: 'Projects', description: 'Проекты' },
    ],
  },
  apis: ['./routes/*.js'],
}

module.exports = swaggerJsdoc(options)
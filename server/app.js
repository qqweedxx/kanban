const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth.routes')
const cardsRoutes = require('./routes/cards.routes')
const columnsRoutes = require('./routes/columns.routes')
const boardsRoutes = require('./routes/boards.routes')
const projectsRoutes = require('./routes/projects.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Сервер работает' })
})

app.use('/api/auth', authRoutes)
app.use('/api/cards', cardsRoutes)
app.use('/api/columns', columnsRoutes)
app.use('/api/boards', boardsRoutes)
app.use('/api/projects', projectsRoutes)

module.exports = app
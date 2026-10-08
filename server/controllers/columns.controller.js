const columnsService = require('../services/columns.service')

async function create(req, res) {
  try {
    const column = await columnsService.create(req.body, req.userId)
    res.status(201).json(column)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function update(req, res) {
  try {
    const column = await columnsService.update(req.params.id, req.body)
    res.json(column)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function remove(req, res) {
  try {
    await columnsService.remove(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

module.exports = { create, update, remove }
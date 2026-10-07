const cardsService = require('../services/cards.service')

async function list(req, res) {
  try {
    const cards = await cardsService.list(req.query)
    res.json(cards)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function getById(req, res) {
  try {
    const card = await cardsService.getById(req.params.id)
    res.json(card)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

async function create(req, res) {
  try {
    const card = await cardsService.create(req.body, req.userId)
    res.status(201).json(card)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function update(req, res) {
  try {
    const card = await cardsService.update(req.params.id, req.body, req.userId)
    res.json(card)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function remove(req, res) {
  try {
    await cardsService.remove(req.params.id, req.userId)
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function move(req, res) {
  try {
    const { targetColumnId } = req.body
    const card = await cardsService.move(req.params.id, targetColumnId, req.userId)
    res.json(card)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function addComment(req, res) {
  try {
    const comment = await cardsService.addComment(
      req.params.id,
      req.body.text,
      req.userId
    )
    res.status(201).json(comment)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

module.exports = { list, getById, create, update, remove, move, addComment }
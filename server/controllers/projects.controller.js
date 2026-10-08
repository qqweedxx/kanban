const projectsService = require('../services/projects.service')

async function list(req, res) {
  try { res.json(await projectsService.list()) }
  catch (err) { res.status(400).json({ error: err.message }) }
}

async function getById(req, res) {
  try { res.json(await projectsService.getById(req.params.id)) }
  catch (err) { res.status(404).json({ error: err.message }) }
}

async function create(req, res) {
  try { res.status(201).json(await projectsService.create(req.body)) }
  catch (err) { res.status(400).json({ error: err.message }) }
}

async function update(req, res) {
  try { res.json(await projectsService.update(req.params.id, req.body)) }
  catch (err) { res.status(400).json({ error: err.message }) }
}

async function remove(req, res) {
  try { await projectsService.remove(req.params.id); res.json({ ok: true }) }
  catch (err) { res.status(400).json({ error: err.message }) }
}

module.exports = { list, getById, create, update, remove }
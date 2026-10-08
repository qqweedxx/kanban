const prisma = require('../prisma')

async function create(data, userId) {
  if (!data.title || !data.title.trim()) throw new Error('Название обязательно')
  if (!data.boardId) throw new Error('boardId обязателен')

  const count = await prisma.column.count({ where: { boardId: data.boardId } })

  return prisma.column.create({
    data: {
      title: data.title.trim(),
      order: data.order ?? count,
      wipLimit: data.wipLimit ?? null,
      boardId: data.boardId,
    },
  })
}

async function update(id, data) {
  return prisma.column.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.wipLimit !== undefined && { wipLimit: data.wipLimit }),
      ...(data.order !== undefined && { order: data.order }),
    },
  })
}

async function remove(id) {
  await prisma.column.delete({ where: { id } })
  return { ok: true }
}

module.exports = { create, update, remove }
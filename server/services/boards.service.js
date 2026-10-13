const prisma = require('../prisma')

async function list() {
  return prisma.board.findMany({
    include: {
      project: true,
      _count: { select: { columns: true } },
    },
    orderBy: { createdAt: 'asc' },
  })
}

async function getById(id) {
  const board = await prisma.board.findUnique({
    where: { id },
    include: {
      project: true,
      columns: {
        orderBy: { order: 'asc' },
        include: {
          cards: {
            orderBy: { order: 'asc' },
            include: {
              assignee: true,
              comments: {
                include: { author: true },
                orderBy: { createdAt: 'asc' },
              },
              _count: { select: { comments: true } },
            },
          },
        },
      },
    },
  })
  if (!board) throw new Error('Доска не найдена')
  return board
}

async function create(data) {
  if (!data.name || !data.name.trim()) throw new Error('Название обязательно')
  if (!data.projectId) throw new Error('projectId обязателен')

  return prisma.board.create({
    data: {
      name: data.name.trim(),
      projectId: data.projectId,
      columns: {
        create: [
          { title: 'To Do', order: 0 },
          { title: 'In Progress', order: 1, wipLimit: 3 },
          { title: 'Done', order: 2 },
        ],
      },
    },
    include: { columns: true },
  })
}

async function update(id, data) {
  return prisma.board.update({
    where: { id },
    data: { ...(data.name !== undefined && { name: data.name }) },
  })
}

async function remove(id) {
  await prisma.board.delete({ where: { id } })
  return { ok: true }
}

module.exports = { list, getById, create, update, remove }
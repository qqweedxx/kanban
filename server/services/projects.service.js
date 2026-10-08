const prisma = require('../prisma')

async function list() {
  return prisma.project.findMany({
    include: { boards: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'asc' },
  })
}

async function getById(id) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { boards: true },
  })
  if (!project) throw new Error('Проект не найден')
  return project
}

async function create(data) {
  if (!data.name || !data.name.trim()) throw new Error('Название обязательно')
  return prisma.project.create({
    data: {
      name: data.name.trim(),
      description: data.description || null,
    },
  })
}

async function update(id, data) {
  return prisma.project.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
    },
  })
}

async function remove(id) {
  await prisma.project.delete({ where: { id } })
  return { ok: true }
}

module.exports = { list, getById, create, update, remove }
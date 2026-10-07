const prisma = require('../prisma')

async function list(filters = {}) {
  const where = {}
  if (filters.priority) where.priority = filters.priority
  if (filters.assigneeId) where.assigneeId = filters.assigneeId
  if (filters.columnId) where.columnId = filters.columnId
  if (filters.search) {
    where.title = { contains: filters.search }
  }

  const cards = await prisma.card.findMany({
    where,
    include: { assignee: true, comments: true },
    orderBy: { order: 'asc' },
  })

  // Фильтр по меткам (у нас метки — строка "bug,urgent")
  let result = cards
  if (filters.label) {
    result = cards.filter((c) =>
      c.labels.split(',').map((l) => l.trim()).includes(filters.label)
    )
  }

  return result
}

async function getById(id) {
  const card = await prisma.card.findUnique({
    where: { id },
    include: {
      assignee: true,
      comments: { include: { author: true } },
      history: { include: { user: true }, orderBy: { createdAt: 'desc' } },
    },
  })
  if (!card) throw new Error('Карточка не найдена')
  return card
}

async function create(data, userId) {
  if (!data.title || !data.title.trim()) {
    throw new Error('Название обязательно')
  }
  if (!data.columnId) {
    throw new Error('columnId обязателен')
  }

  const card = await prisma.card.create({
    data: {
      title: data.title.trim(),
      description: data.description || null,
      priority: data.priority || 'medium',
      deadline: data.deadline ? new Date(data.deadline) : null,
      labels: data.labels || '',
      attachmentUrl: data.attachmentUrl || null,
      columnId: data.columnId,
      assigneeId: data.assigneeId || null,
    },
  })

  await prisma.history.create({
    data: {
      action: 'created',
      details: `Карточка создана: ${card.title}`,
      cardId: card.id,
      userId,
    },
  })

  return card
}

async function update(id, data, userId) {
  const card = await prisma.card.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.deadline !== undefined && {
        deadline: data.deadline ? new Date(data.deadline) : null,
      }),
      ...(data.labels !== undefined && { labels: data.labels }),
      ...(data.attachmentUrl !== undefined && { attachmentUrl: data.attachmentUrl }),
      ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId }),
    },
  })

  await prisma.history.create({
    data: {
      action: 'updated',
      details: `Карточка изменена: ${card.title}`,
      cardId: card.id,
      userId,
    },
  })

  return card
}

async function remove(id, userId) {
  const card = await prisma.card.findUnique({ where: { id } })
  if (!card) throw new Error('Карточка не найдена')

  await prisma.history.create({
    data: {
      action: 'deleted',
      details: `Карточка удалена: ${card.title}`,
      cardId: card.id,
      userId,
    },
  })

  await prisma.card.delete({ where: { id } })
}

async function move(id, targetColumnId, userId) {
  const card = await prisma.card.findUnique({ where: { id } })
  if (!card) throw new Error('Карточка не найдена')

  const targetColumn = await prisma.column.findUnique({
    where: { id: targetColumnId },
    include: { cards: true },
  })
  if (!targetColumn) throw new Error('Колонка не найдена')

  if (
    targetColumn.wipLimit !== null &&
    targetColumn.cards.length >= targetColumn.wipLimit &&
    card.columnId !== targetColumnId
  ) {
    throw new Error(
      `В колонке "${targetColumn.title}" достигнут WIP-лимит (${targetColumn.wipLimit})`
    )
  }

  const updated = await prisma.card.update({
    where: { id },
    data: { columnId: targetColumnId },
  })

  await prisma.history.create({
    data: {
      action: 'moved',
      details: `Карточка перемещена в "${targetColumn.title}"`,
      cardId: card.id,
      userId,
    },
  })

  return updated
}

async function addComment(cardId, text, userId) {
  if (!text || !text.trim()) throw new Error('Текст комментария обязателен')
  return prisma.comment.create({
    data: { text: text.trim(), cardId, authorId: userId },
    include: { author: true },
  })
}

module.exports = { list, getById, create, update, remove, move, addComment }
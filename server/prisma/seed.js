const bcrypt = require('bcrypt')
const { PrismaClient } = require('../generated/prisma/client')
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: passwordHash,
      name: 'Админ',
      role: 'admin',
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager@test.com' },
    update: {},
    create: {
      email: 'manager@test.com',
      password: passwordHash,
      name: 'Менеджер',
      role: 'manager',
    },
  })

  const dev = await prisma.user.upsert({
    where: { email: 'dev@test.com' },
    update: {},
    create: {
      email: 'dev@test.com',
      password: passwordHash,
      name: 'Разработчик',
      role: 'developer',
    },
  })

  const project = await prisma.project.upsert({
    where: { id: 'seed-project' },
    update: {},
    create: {
      id: 'seed-project',
      name: 'Учебный проект',
      description: 'Kanban-доска для лабораторной',
    },
  })

  await prisma.board.upsert({
    where: { id: 'seed-board' },
    update: {},
    create: {
      id: 'seed-board',
      name: 'Основная доска',
      projectId: project.id,
      columns: {
        create: [
          { title: 'To Do', order: 0, wipLimit: null },
          { title: 'In Progress', order: 1, wipLimit: 3 },
          { title: 'Done', order: 2, wipLimit: null },
        ],
      },
    },
  })

  console.log('✅ Seed выполнен:')
  console.log('   admin@test.com / password123')
  console.log('   manager@test.com / password123')
  console.log('   dev@test.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
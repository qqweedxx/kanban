# Kanban-доска (аналог Jira)

Учебный проект по дисциплине «Поддержка и тестирование программных модулей».

## Стек

- **Frontend:** React + Vite, @dnd-kit, React Router
- **Backend:** Node.js + Express 5, Prisma ORM, SQLite
- **Аутентификация:** JWT + bcrypt
- **Тестирование:** Jest, Supertest, Playwright, k6, OWASP ZAP
- **CI/CD:** GitHub Actions

## Запуск проекта

### Backend

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
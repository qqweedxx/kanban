Kanban-доска (аналог Jira)
==========================

Учебный проект по дисциплине «Поддержка и тестирование программных модулей».

Клиент-серверное приложение Kanban-доски с полным циклом тестирования (модульные, интеграционные, E2E, нагрузочные, security) и CI/CD.

Стек

Frontend: React + Vite, @dnd-kit (drag-and-drop), React Router
Backend: Node.js + Express 5, Prisma ORM 7, SQLite
Аутентификация: JWT + bcrypt
Тестирование: Jest + Supertest (unit/integration), Playwright (E2E), k6 (нагрузочные), OWASP ZAP (security)
CI/CD: GitHub Actions
Документация API: Swagger (OpenAPI 3.0)

Требования
Node.js 18+ (проверено на 24)
npm 10+
Git

Запуск проекта

Проект состоит из двух частей: backend (папка server/) и frontend (корень проекта). Обе надо запустить одновременно — в двух терминалах.

Backend
В первом терминале:

cd server
npm install
node_modules.bin\prisma.cmd generate
node_modules.bin\prisma.cmd migrate dev
node_modules.bin\prisma.cmd db seed
npm run dev

Backend запустится на http://localhost:4000

ВАЖНО: в проекте используется Prisma 7, где npx prisma может не работать в Windows — используйте node_modules.bin\prisma.cmd

Frontend
Во втором терминале (не закрывайте backend):

cd C:\kanban-partner\kanban
npm install
npm run dev

Frontend запустится на http://localhost:5173

Проверка работы
Frontend: http://localhost:5173
Backend health: http://localhost:4000/api/health
Swagger API: http://localhost:4000/api-docs

Тестовые аккаунты

После выполнения prisma db seed создаются три пользователя:

admin@test.com / password123 / admin
manager@test.com / password123 / manager
dev@test.com / password123 / developer

Тестовая доска: seed-board с тремя колонками (To Do, In Progress, Done).

Права доступа по ролям

admin — все действия
manager — все действия, кроме управления пользователями
developer — создание и редактирование карточек, БЕЗ права удаления (DELETE-эндпоинты возвращают 403)

API

Полная документация API доступна в Swagger UI:

http://localhost:4000/api-docs

Основные эндпоинты:

POST /api/auth/register Регистрация
POST /api/auth/login Вход (возвращает JWT)
GET /api/auth/me Текущий пользователь

GET /api/boards Список досок
GET /api/boards/:id Доска со всеми колонками и карточками
POST /api/boards Создать доску
PATCH /api/boards/:id Обновить доску
DELETE /api/boards/:id Удалить доску (admin/manager)

POST /api/columns Создать колонку
PATCH /api/columns/:id Обновить колонку
DELETE /api/columns/:id Удалить колонку (admin/manager)

GET /api/cards Список карточек (с фильтрами)
POST /api/cards Создать карточку
PATCH /api/cards/:id Обновить карточку
DELETE /api/cards/:id Удалить карточку (admin/manager)
POST /api/cards/:id/move Переместить карточку
POST /api/cards/:id/comments Добавить комментарий

GET /api/projects Список проектов
POST /api/projects Создать проект

Все эндпоинты, кроме /api/auth/register и /api/auth/login, требуют заголовок:

Authorization: Bearer <JWT-токен>

Тестирование

Модульные и интеграционные тесты (Jest + Supertest)
cd server
npm test

Запускается 14 тестов:

Health check
Регистрация, вход, /me, ошибки валидации
Создание, чтение, удаление карточек
Проверка прав доступа (401 без токена)
Проверка WIP-лимита

Нагрузочные тесты (k6)
cd load
k6 run test.js
Сценарий эмулирует 100 виртуальных пользователей: логин → получение доски → получение карточек. Параметры нагрузки: разгон → удержание → сброс.

E2E-тесты (Playwright)
npx playwright test

Сценарии:

1. Регистрация → вход → доска → создание карточки → перемещение → выход
2. Проверка прав доступа
3. Поиск и фильтрация

Безопасность

cd server
npm audit

Плюс сканирование OWASP ZAP (см. TEST_REPORT.md).

CI/CD

Пайплайн настроен через GitHub Actions (.github/workflows/ci.yml).

При каждом push в main автоматически:

1. Устанавливаются зависимости
2. Генерируется Prisma Client
3. Применяются миграции
4. Заполняется БД seed-данными
5. Запускаются Jest-тесты (14 тестов)
 
Статус CI: https://github.com/qqweedxx/kanban/actions

Структура проекта

kanban/
├── src/ Frontend (React)
│ ├── components/ Компоненты (Card, Column, Header, ...)
│ ├── pages/ Страницы (Login, Register)
│ ├── api.js Обёртка над fetch
│ ├── App.jsx Главный компонент
│ └── data.js Начальные данные
│
├── server/ Backend (Node.js + Express)
│ ├── controllers/ Обработчики HTTP-запросов
│ ├── services/ Бизнес-логика
│ ├── routes/ Маршруты API
│ ├── middleware/ authMiddleware, roleMiddleware
│ ├── prisma/
│ │ ├── schema.prisma Схема БД
│ │ ├── migrations/ Миграции
│ │ └── seed.js Тестовые данные
│ ├── tests/ Jest-тесты
│ ├── swagger.js Swagger-конфигурация
│ ├── app.js Express-приложение
│ └── index.js Точка входа
│
├── load/ k6 нагрузочные тесты
├── e2e/ Playwright E2E-тесты
├── .github/workflows/ci.yml CI/CD
├── README.md Этот файл
├── STACK.md Обоснование выбора стека
└── TEST_REPORT.md Отчёт о тестировании

Переменные окружения

Файл server/.env (не в Git, создаётся вручную — см. server/.env.example):

PORT=4000
JWT_SECRET=your_secret_here
DATABASE_URL="file:./dev.db"

Авторы

Беликова
Галанова
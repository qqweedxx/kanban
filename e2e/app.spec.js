import { test, expect } from '@playwright/test'

const TEST_EMAIL = 'admin@test.com'
const TEST_PASSWORD = 'password123'

async function login(page) {
  await page.goto('/')
  await page.fill('input[type="email"]', TEST_EMAIL)
  await page.fill('input[type="password"]', TEST_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForSelector('.board', { timeout: 10000 })
}

test.describe('Kanban-доска', () => {

  test('1. Логин и загрузка доски', async ({ page }) => {
    await login(page)
    await expect(page.locator('.board')).toBeVisible()
    await expect(page.locator('.column').first()).toBeVisible()
  })

  test('2. Создание карточки', async ({ page }) => {
    await login(page)
    const uniqueTitle = `E2E-${Date.now()}`
    const firstColumn = page.locator('.column').first()
    await firstColumn.locator('.add-card-btn').click()
    await firstColumn.locator('input[placeholder="Название карточки"]').fill(uniqueTitle)
    await firstColumn.locator('input[placeholder="Название карточки"]').press('Enter')
    await expect(page.locator('.card').filter({ hasText: uniqueTitle }).first()).toBeVisible()
  })

  test('3. Поиск карточек', async ({ page }) => {
    await login(page)
    const uniqueTitle = `Поиск-${Date.now()}`
    const firstColumn = page.locator('.column').first()
    await firstColumn.locator('.add-card-btn').click()
    await firstColumn.locator('input[placeholder="Название карточки"]').fill(uniqueTitle)
    await firstColumn.locator('input[placeholder="Название карточки"]').press('Enter')

    const searchInput = page.locator('.search-bar__input')
    await searchInput.fill(uniqueTitle)
    await expect(page.locator('.card').filter({ hasText: uniqueTitle }).first()).toBeVisible()
    await searchInput.fill('')
  })

  test('4. Открытие модалки карточки', async ({ page }) => {
    await login(page)
    const firstCard = page.locator('.card').first()
    await firstCard.dblclick()
    await expect(page.locator('.modal')).toBeVisible({ timeout: 5000 })
    await page.locator('.modal-close').click()
    await expect(page.locator('.modal')).not.toBeVisible()
  })

  test('5. Logout через меню профиля', async ({ page }) => {
    await login(page)
    await page.locator('.header__right button').nth(1).click()
    await page.locator('.header__menu-logout').click()
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

})
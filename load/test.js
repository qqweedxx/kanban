import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.05'],
  },
}

const BASE_URL = 'http://localhost:4000'

export default function () {
  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email: 'admin@test.com', password: 'password123' }),
    { headers: { 'Content-Type': 'application/json' } }
  )
  check(loginRes, { 'login OK': (r) => r.status === 200 })

  const token = loginRes.json('token')
  if (!token) return

  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }

  const boardRes = http.get(`${BASE_URL}/api/boards/seed-board`, authHeaders)
  check(boardRes, { 'board OK': (r) => r.status === 200 })

  const cardsRes = http.get(`${BASE_URL}/api/cards`, authHeaders)
  check(cardsRes, { 'cards OK': (r) => r.status === 200 })

  sleep(1)
}
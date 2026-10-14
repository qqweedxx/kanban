const API_URL = 'http://localhost:4000/api'

function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token) {
  localStorage.setItem('token', token)
}

export function clearToken() {
  localStorage.removeItem('token')
}

export function isLoggedIn() {
  return !!getToken()
}

async function request(path, options = {}) {
  const res = await fetch(API_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
      ...options.headers,
    },
  })

  if (res.status === 401) {
    clearToken()
    window.location.reload()
    throw new Error('Требуется вход')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Ошибка запроса')
  }

  return res.json()
}

export const api = {
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/auth/me'),

  getBoards: () => request('/boards'),
  getBoard: (id) => request(`/boards/${id}`),
  createBoard: (data) => request('/boards', { method: 'POST', body: JSON.stringify(data) }),
  updateBoard: (id, data) => request(`/boards/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteBoard: (id) => request(`/boards/${id}`, { method: 'DELETE' }),

  createColumn: (data) => request('/columns', { method: 'POST', body: JSON.stringify(data) }),
  updateColumn: (id, data) => request(`/columns/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteColumn: (id) => request(`/columns/${id}`, { method: 'DELETE' }),

  createCard: (data) => request('/cards', { method: 'POST', body: JSON.stringify(data) }),
  updateCard: (id, data) => request(`/cards/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteCard: (id) => request(`/cards/${id}`, { method: 'DELETE' }),
  moveCard: (id, targetColumnId) => request(`/cards/${id}/move`, { method: 'POST', body: JSON.stringify({ targetColumnId }) }),
  addComment: (id, text) => request(`/cards/${id}/comments`, { method: 'POST', body: JSON.stringify({ text }) }),

  getProjects: () => request('/projects'),
  createProject: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
}
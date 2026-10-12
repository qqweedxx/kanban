import { useState } from 'react'
import { api, setToken } from '../api'

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const data = isRegister
        ? await api.register({ email, password, name })
        : await api.login({ email, password })
      setToken(data.token)
      onLogin(data.user)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h1>{isRegister ? 'Регистрация' : 'Вход'}</h1>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8, fontSize: 14 }}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8, fontSize: 14 }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8, fontSize: 14 }}
        />
        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: 10, fontSize: 16, cursor: 'pointer' }}>
          {isRegister ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>
      <button
        onClick={() => setIsRegister(!isRegister)}
        style={{ marginTop: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#0079bf' }}
      >
        {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
      </button>
      <div style={{ marginTop: 20, fontSize: 12, color: '#666' }}>
        Тестовые аккаунты:<br />
        admin@test.com / password123<br />
        manager@test.com / password123<br />
        dev@test.com / password123
      </div>
    </div>
  )
}
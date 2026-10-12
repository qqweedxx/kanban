import { useState, useEffect, useRef } from 'react'
import './Header.css'

function Header({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="header">
      <div className="header__left">
        <span className="header__logo">📋</span>
        <h1 className="header__title">My Kanban</h1>
      </div>

      <div className="header__right" ref={menuRef}>
        <button
          className="header__btn"
          title="Уведомления"
          onClick={() => alert('Уведомлений пока нет')}
        >
          🔔
        </button>

        <button
          className="header__btn"
          title="Профиль"
          onClick={() => setMenuOpen((v) => !v)}
        >
          👤
        </button>

        {menuOpen && user && (
          <div className="header__menu">
            <div className="header__menu-info">
              <div className="header__menu-name">{user.name}</div>
              <div className="header__menu-email">{user.email}</div>
              <div className="header__menu-role">Роль: {user.role}</div>
            </div>
            <button className="header__menu-logout" onClick={onLogout}>
              Выйти
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
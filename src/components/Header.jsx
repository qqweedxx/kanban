import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <span className="header__logo">📋</span>
        <h1 className="header__title">My Kanban</h1>
      </div>

      <div className="header__right">
        <button className="header__btn" title="Уведомления">
          🔔
        </button>
        <button className="header__btn" title="Профиль">
          👤
        </button>
      </div>
    </header>
  )
}

export default Header
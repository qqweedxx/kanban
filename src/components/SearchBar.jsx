import './SearchBar.css'

function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <span className="search-bar__icon">🔍</span>

      <input
        type="text"
        className="search-bar__input"
        placeholder="Поиск карточек..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {value && (
        <button
          className="search-bar__clear"
          onClick={() => onChange('')}
          title="Очистить"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default SearchBar
import { useState } from 'react'
import Card from './Card'

function Column({ id, title, cards, onAddCard }) {
    const [isAdding, setIsAdding] = useState(false)
    const [newTitle, setNewTitle] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        const trimmed = newTitle.trim()
        if (!trimmed) return
        onAddCard(id, trimmed)
        setNewTitle('')
        setIsAdding(false)
    }

  return (
    <div className="column">
      <h2>{title}</h2>

      {cards.map((card) => (
        <Card key={card.id} title={card.title} />
      ))}

      {isAdding ? (
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Название карточки"
            onBlur={() => setIsAdding(false)}
          />
        </form>
      ) : (
        <button
          className="add-card-btn"
          onClick={() => setIsAdding(true)}
        >
          + Добавить карточку
        </button>
      )}
    </div>
  )
}

export default Column
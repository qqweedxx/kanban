import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import DraggableCard from './DraggableCard'

function Column({ id, title, cards, onAddCard }) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const { setNodeRef } = useDroppable({ id })

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = newTitle.trim()
    if (!trimmed) return
    onAddCard(id, trimmed)
    setNewTitle('')
    setIsAdding(false)
  }

  return (
    <div className="column" ref={setNodeRef}>
      <h2>
        {title} <span className="count">({cards.length})</span>
      </h2>

      {cards.map((card) => (
        <DraggableCard key={card.id} id={card.id} title={card.title} />
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
        <button className="add-card-btn" onClick={() => setIsAdding(true)}>
          + Добавить карточку
        </button>
      )}
    </div>
  )
}

export default Column
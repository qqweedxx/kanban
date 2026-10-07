import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import DraggableCard from './DraggableCard'
import './Column.css'

function Column({ id, title, cards, wipLimit, onAddCard, onDeleteCard, onSetWipLimit }) {
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
        {title}{' '}
        <span
          className={`count ${
            wipLimit && cards.length >= wipLimit ? 'over-limit' : ''
          }`}
        >
          ({cards.length}
          {wipLimit ? ` / ${wipLimit}` : ''})
        </span>

        <button
          className="limit-btn"
          onClick={() => {
            const value = prompt('WIP-лимит (пусто — без лимита):', wipLimit ?? '')
            if (value === null) return
            if (value === '') {
              onSetWipLimit(id, null)
              return
            }
            const num = Number(value)
            if (isNaN(num) || num < 1) {
              alert('Введите положительное число')
              return
            }
            onSetWipLimit(id, num)
          }}
        >
          Лимит
        </button>
      </h2>

      {cards.map((card) => (
        <DraggableCard
          key={card.id}
          id={card.id}
          title={card.title}
          onDelete={() => onDeleteCard(card.id)}
        />
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
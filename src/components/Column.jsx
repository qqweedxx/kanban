import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import DraggableCard from './DraggableCard'
import './Column.css'

function Column({ id, title, cards, wipLimit, onAddCard, onDeleteCard, onSetWipLimit, onOpenCard, onRenameColumn, onDeleteColumn }) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [isEditingLimit, setIsEditingLimit] = useState(false)
  const [limitInput, setLimitInput] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleInput, setTitleInput] = useState(title)

  const { setNodeRef } = useDroppable({ id })

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = newTitle.trim()
    if (!trimmed) return
    onAddCard(id, trimmed)
    setNewTitle('')
    setIsAdding(false)
  }

  function openLimitEditor() {
    setLimitInput(wipLimit ?? '')
    setIsEditingLimit(true)
  }

  function saveLimit(e) {
    e.preventDefault()
    const trimmed = limitInput.trim()
    if (trimmed === '') {
      onSetWipLimit(id, null)
      setIsEditingLimit(false)
      return
    }
    const num = Number(trimmed)
    if (isNaN(num) || num < 1 || !Number.isInteger(num)) {
      alert('Введите целое положительное число')
      return
    }
    onSetWipLimit(id, num)
    setIsEditingLimit(false)
  }

  return (
    <div className="column" ref={setNodeRef}>
<h2>
  {isEditingTitle ? (
    <input
      autoFocus
      value={titleInput}
      onChange={(e) => setTitleInput(e.target.value)}
      onBlur={() => {
        onRenameColumn(id, titleInput)
        setIsEditingTitle(false)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onRenameColumn(id, titleInput)
          setIsEditingTitle(false)
        }
      }}
      style={{ fontSize: 16, width: 140 }}
    />
  ) : (
    <span onDoubleClick={() => { setTitleInput(title); setIsEditingTitle(true) }}>
      {title}
    </span>
  )}{' '}
  <span className={`count ${wipLimit && cards.length >= wipLimit ? 'over-limit' : ''}`}>
    ({cards.length}{wipLimit ? ` / ${wipLimit}` : ''})
  </span>

  {isEditingLimit ? (
    <form onSubmit={saveLimit} style={{ display: 'inline' }}>
      <input
        autoFocus
        type="number"
        value={limitInput}
        onChange={(e) => setLimitInput(e.target.value)}
        placeholder="Лимит"
        style={{ width: 50, marginLeft: 6 }}
        onBlur={() => setIsEditingLimit(false)}
      />
    </form>
  ) : (
    <button className="limit-btn" onClick={openLimitEditor}>Лимит</button>
  )}

  <button
    className="limit-btn"
    onClick={() => onDeleteColumn(id)}
    title="Удалить колонку"
  >
    ×
  </button>
</h2>

      {cards.map((card) => (
        <DraggableCard
          key={card.id}
          id={card.id}
          title={card.title}
          card={card}
          onDelete={onDeleteCard}
          onOpen={() => onOpenCard(card.id)}
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
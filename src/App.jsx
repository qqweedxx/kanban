import { useState, useEffect } from 'react'
import { DndContext } from '@dnd-kit/core'
import './App.css'
import Column from './components/Column'
import { initialColumns } from './data'
import Header from './components/Header'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import CardModal from './components/CardModal'

function App() {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem('kanban-columns')
    return saved ? JSON.parse(saved) : initialColumns
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [editingCardId, setEditingCardId] = useState(null)

  useEffect(() => {
    localStorage.setItem('kanban-columns', JSON.stringify(columns))
  }, [columns])

  function addCard(columnId, title) {
    setColumns((prev) => {
      const targetColumn = prev.find((col) => col.id === columnId)
      if (!targetColumn) return prev

      if (
        targetColumn.wipLimit !== null &&
        targetColumn.cards.length >= targetColumn.wipLimit
      ) {
        alert(
          `В колонке "${targetColumn.title}" достигнут WIP-лимит (${targetColumn.wipLimit}). ` +
            `Сначала завершите текущие задачи.`
        )
        return prev
      }

      return prev.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: [
                ...col.cards,
                { id: Date.now().toString(), title },
              ],
            }
          : col
      )
    })
  }

  function deleteCard(cardId) {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.filter((c) => c.id !== cardId),
      }))
    )
  }

  function updateCard(cardId, updates) {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.map((c) =>
          c.id === cardId ? { ...c, ...updates } : c
        ),
      }))
    )
  }

  function addComment(cardId, text) {
    const comment = {
      id: Date.now().toString(),
      author: 'Вы',
      text,
      date: new Date().toISOString(),
    }
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.map((c) =>
          c.id === cardId
            ? { ...c, comments: [...(c.comments || []), comment] }
            : c
        ),
      }))
    )
  }

  function setWipLimit(columnId, limit) {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, wipLimit: limit } : col
      )
    )
  }

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over) return

    const cardId = active.id
    const targetColumnId = over.id

    const sourceColumn = columns.find((col) =>
      col.cards.some((c) => c.id === cardId)
    )
    if (!sourceColumn) return
    if (sourceColumn.id === targetColumnId) return

    const targetColumn = columns.find((col) => col.id === targetColumnId)
    if (!targetColumn) return

    if (
      targetColumn.wipLimit !== null &&
      targetColumn.cards.length >= targetColumn.wipLimit
    ) {
      alert(
        `В колонке "${targetColumn.title}" достигнут WIP-лимит (${targetColumn.wipLimit}). ` +
          `Сначала завершите текущие задачи.`
      )
      return
    }

    const draggedCard = sourceColumn.cards.find((c) => c.id === cardId)
    if (!draggedCard) return

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === sourceColumn.id) {
          return { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
        }
        if (col.id === targetColumnId) {
          return { ...col, cards: [...col.cards, draggedCard] }
        }
        return col
      })
    )
  }

  const editingCard = editingCardId
    ? columns.flatMap((c) => c.cards).find((c) => c.id === editingCardId)
    : null

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Header />
      <div className="app">
        <h1>Моя Kanban-доска</h1>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <div className="board">
          {columns.map((column) => {
            const filteredCards = searchQuery.trim()
              ? column.cards.filter((card) =>
                  card.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
                )
              : column.cards

            return (
              <Column
                key={column.id}
                id={column.id}
                title={column.title}
                cards={filteredCards}
                wipLimit={column.wipLimit}
                onAddCard={addCard}
                onDeleteCard={deleteCard}
                onSetWipLimit={setWipLimit}
                onOpenCard={(cardId) => setEditingCardId(cardId)}
              />
            )
          })}
        </div>
      </div>
      <Footer />

      {editingCard && (
        <CardModal
          card={editingCard}
          onClose={() => setEditingCardId(null)}
          onSave={updateCard}
          onAddComment={addComment}
        />
      )}
    </DndContext>
  )
}

export default App
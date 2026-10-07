import { useState, useEffect } from 'react'
import { DndContext } from '@dnd-kit/core'
import './App.css'
import Column from './components/Column'
import { initialColumns } from './data'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem('kanban-columns')
    return saved ? JSON.parse(saved) : initialColumns
  })

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

    setColumns((prev) => {
      let draggedCard = null
      let sourceColumn = null
      for (const col of prev) {
        const found = col.cards.find((c) => c.id === cardId)
        if (found) {
          draggedCard = found
          sourceColumn = col
          break
        }
      }
      if (!draggedCard || !sourceColumn) return prev

      if (sourceColumn.id === targetColumnId) return prev

      const targetColumn = prev.find((col) => col.id === targetColumnId)
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

      return prev.map((col) => {
        if (col.id === sourceColumn.id) {
          return { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
        }
        if (col.id === targetColumnId) {
          return { ...col, cards: [...col.cards, draggedCard] }
        }
        return col
      })
    })
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Header />
      <div className="app">
        <h1>Моя Kanban-доска</h1>
        <div className="board">
          {columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              cards={column.cards}
              wipLimit={column.wipLimit}
              onAddCard={addCard}
              onDeleteCard={deleteCard}
              onSetWipLimit={setWipLimit}
            />
          ))}
        </div>
      </div>
      <Footer />
    </DndContext>
  )
}

export default App
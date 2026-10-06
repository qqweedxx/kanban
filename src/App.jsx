import { useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import './App.css'
import Column from './components/Column'
import { initialColumns } from './data'

function App() {
  const [columns, setColumns] = useState(initialColumns)

  function addCard(columnId, title) {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, { id: Date.now().toString(), title }] }
          : col
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
      for (const col of prev) {
        const found = col.cards.find((c) => c.id === cardId)
        if (found) {
          draggedCard = found
          break
        }
      }
      if (!draggedCard) return prev

      const sourceColumn = prev.find((col) =>
        col.cards.some((c) => c.id === cardId)
      )
      if (sourceColumn.id === targetColumnId) return prev

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
      <div className="app">
        <h1>Моя Kanban-доска</h1>
        <div className="board">
          {columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              cards={column.cards}
              onAddCard={addCard}
            />
          ))}
        </div>
      </div>
    </DndContext>
  )
}

export default App
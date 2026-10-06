import { useState } from 'react'
import './App.css'
import Column from './components/Column'
import { initialColumns } from './data'

function App() {
  const [columns, setColumns] = useState(initialColumns)

  function addCard(columnId, title) {
    setColumns((prev) =>
      prev.map((col) =>
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
    )
  }

  return (
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
  )
}

export default App
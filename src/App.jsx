import './App.css'
import Column from './components/Column'
import { initialColumns } from './data'

function App() {
  return (
    <div className="app">
      <h1>Моя Kanban-доска</h1>

      <div className="board">
        {initialColumns.map((column) => (
          <Column
            key={column.id}
            title={column.title}
            cards={column.cards}
          />
        ))}
      </div>
    </div>
  )
}

export default App
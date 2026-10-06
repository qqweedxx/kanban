import './App.css'

function App() {
  return (
    <div className="app">
      <h1>Моя Kanban-доска</h1>

      <div className="board">
        <div className="column">
          <h2>To Do</h2>
          <div className="card">Купить хлеб</div>
          <div className="card">Позвонить маме</div>
        </div>

        <div className="column">
          <h2>In Progress</h2>
          <div className="card">Доделать лабораторную</div>
        </div>

        <div className="column">
          <h2>Done</h2>
        </div>
      </div>
    </div>
  )
}

export default App
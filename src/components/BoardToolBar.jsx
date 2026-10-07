import { useState } from 'react'
import './BoardToolbar.css'

function BoardToolbar({
  projects,
  boards,
  currentBoardId,
  onSelectBoard,
  onCreateBoard,
  onCreateProject,
  onDeleteBoard,
}) {
  const [isCreatingBoard, setIsCreatingBoard] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')

  function submitBoard(e) {
    e.preventDefault()
    if (!newBoardName.trim()) return
    onCreateBoard(newBoardName.trim())
    setNewBoardName('')
    setIsCreatingBoard(false)
  }

  return (
    <div className="board-toolbar">
      <select
        className="board-toolbar__select"
        value={currentBoardId}
        onChange={(e) => onSelectBoard(e.target.value)}
      >
        {projects.map((p) => (
          <optgroup key={p.id} label={p.name}>
            {boards
              .filter((b) => b.projectId === p.id)
              .map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
          </optgroup>
        ))}
      </select>

      {isCreatingBoard ? (
        <form className="board-toolbar__form" onSubmit={submitBoard}>
          <input
            autoFocus
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="Название доски"
            onBlur={() => {
              if (!newBoardName.trim()) setIsCreatingBoard(false)
            }}
          />
          <button type="submit">OK</button>
          <button
            type="button"
            onClick={() => {
              setNewBoardName('')
              setIsCreatingBoard(false)
            }}
          >
            ×
          </button>
        </form>
      ) : (
        <>
          <button
            className="board-toolbar__btn"
            onClick={() => setIsCreatingBoard(true)}
          >
            + Доска
          </button>
          <button
            className="board-toolbar__btn"
            onClick={onCreateProject}
          >
            + Проект
          </button>
          <button
            className="board-toolbar__btn board-toolbar__btn--danger"
            onClick={() => onDeleteBoard(currentBoardId)}
            disabled={boards.length <= 1}
            title={
              boards.length <= 1
                ? 'Нельзя удалить последнюю доску'
                : 'Удалить доску'
            }
          >
            Удалить доску
          </button>
        </>
      )}
    </div>
  )
}

export default BoardToolbar
import { useState, useEffect } from 'react'
import './BoardTitle.css'

function BoardTitle({ title, onRename }) {
  const [isEditing, setIsEditing] = useState(false)
  const [input, setInput] = useState(title)

  useEffect(() => {
    setInput(title)
  }, [title])

  function finish() {
    onRename(input)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <input
        autoFocus
        className="board-title-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onBlur={finish}
        onKeyDown={(e) => {
          if (e.key === 'Enter') finish()
          if (e.key === 'Escape') {
            setInput(title)
            setIsEditing(false)
          }
        }}
      />
    )
  }

  return (
    <h1
      className="board-title"
      onDoubleClick={() => setIsEditing(true)}
      title="Двойной клик для переименования"
    >
      {title}
    </h1>
  )
}

export default BoardTitle
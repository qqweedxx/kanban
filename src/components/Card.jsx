import './Card.css'

function Card({ title, card = {}, onDelete, onOpen }) {
  const priorityClass = card.priority ? `priority-${card.priority}` : ''

  return (
    <div className={`card ${priorityClass}`} onDoubleClick={onOpen}>
      {card.labels && card.labels.length > 0 && (
        <div className="card-labels">
          {card.labels.map((label) => (
            <span key={label} className="card-label">{label}</span>
          ))}
        </div>
      )}

      <span className="card-title">{title}</span>

      <div className="card-meta">
        {card.deadline && <span className="card-deadline">📅 {card.deadline}</span>}
        {card.assignee && <span className="card-assignee">👤 {card.assignee}</span>}
        {card.comments && card.comments.length > 0 && (
          <span className="card-comments">💬 {card.comments.length}</span>
        )}
      </div>

      <button
        className="card-delete"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onDelete}
        title="Удалить"
      >
        ×
      </button>
    </div>
  )
}

export default Card
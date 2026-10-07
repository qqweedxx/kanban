import './Card.css'

function Card({ title, onDelete, onOpen }) {
  return (
    <div className="card" onDoubleClick={onOpen}>
      <span className="card-title">{title}</span>
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
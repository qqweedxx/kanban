import { useDraggable } from '@dnd-kit/core'
import Card from './Card'

function DraggableCard({ id, title, onDelete }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card title={title} onDelete={onDelete} />
    </div>
  )
}

export default DraggableCard
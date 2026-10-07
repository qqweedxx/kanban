import { useState } from 'react'
import './CardModal.css'

function CardModal({ card, onClose, onSave, onAddComment }) {
  const [title, setTitle] = useState(card.title || '')
  const [description, setDescription] = useState(card.description || '')
  const [priority, setPriority] = useState(card.priority || 'medium')
  const [deadline, setDeadline] = useState(card.deadline || '')
  const [labelsText, setLabelsText] = useState((card.labels || []).join(', '))
  const [assignee, setAssignee] = useState(card.assignee || '')
  const [attachmentUrl, setAttachmentUrl] = useState(card.attachmentUrl || '')
  const [commentText, setCommentText] = useState('')

  function handleSave() {
    const labels = labelsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    onSave(card.id, {
      title: title.trim() || 'Без названия',
      description,
      priority,
      deadline: deadline || null,
      labels,
      assignee,
      attachmentUrl,
    })
    onClose()
  }

  function handleAddComment() {
    const trimmed = commentText.trim()
    if (!trimmed) return
    onAddComment(card.id, trimmed)
    setCommentText('')
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <input
            className="modal-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <label>Описание</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Что нужно сделать..."
          />

          <label>Приоритет</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>

          <label>Дедлайн</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <label>Метки (через запятую)</label>
          <input
            value={labelsText}
            onChange={(e) => setLabelsText(e.target.value)}
            placeholder="bug, frontend, срочно"
          />

          <label>Исполнитель</label>
          <input
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Имя исполнителя"
          />

          <label>Вложение (ссылка)</label>
          <input
            value={attachmentUrl}
            onChange={(e) => setAttachmentUrl(e.target.value)}
            placeholder="https://..."
          />

          <label>Комментарии</label>
          <div className="comments">
            {(card.comments || []).map((c) => (
              <div key={c.id} className="comment">
                <div className="comment-author">{c.author}</div>
                <div className="comment-text">{c.text}</div>
              </div>
            ))}
            {(card.comments || []).length === 0 && (
              <div className="comments-empty">Пока нет комментариев</div>
            )}
          </div>
          <div className="comment-add">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Новый комментарий..."
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button onClick={handleAddComment}>Добавить</button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Отмена</button>
          <button className="btn-primary" onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  )
}

export default CardModal
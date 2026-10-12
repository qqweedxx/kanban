import { useState, useEffect } from 'react'
import { DndContext } from '@dnd-kit/core'
import './App.css'
import Column from './components/Column'
import Header from './components/Header'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import CardModal from './components/CardModal'
import BoardToolbar from './components/BoardToolBar'
import BoardTitle from './components/BoardTitle'
import FilterBar from './components/FilterBar'
import Login from './pages/Login'
import { api, isLoggedIn, clearToken } from './api'

// Конвертация из формата API в формат фронта
function cardFromAPI(card) {
  return {
    ...card,
    labels: card.labels ? card.labels.split(',').map((s) => s.trim()).filter(Boolean) : [],
    assignee: card.assignee?.name || '',
    comments: card.comments || [],
  }
}

function columnFromAPI(col) {
  return {
    ...col,
    cards: (col.cards || []).map(cardFromAPI),
  }
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [boards, setBoards] = useState([])
  const [currentBoardId, setCurrentBoardId] = useState(null)
  const [columns, setColumns] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [labelFilter, setLabelFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [editingCardId, setEditingCardId] = useState(null)
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  useEffect(() => {
    if (!isLoggedIn()) { setLoading(false); return }
    api.me().then(setUser).catch(() => clearToken()).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!user) return
    Promise.all([api.getProjects(), api.getBoards()])
      .then(([p, b]) => {
        setProjects(p); setBoards(b)
        if (b.length > 0 && !currentBoardId) setCurrentBoardId(b[0].id)
      })
      .catch((err) => console.error(err))
  }, [user])

  useEffect(() => {
    if (!currentBoardId) return
    api.getBoard(currentBoardId)
      .then((board) => setColumns((board.columns || []).map(columnFromAPI)))
      .catch((err) => alert(err.message))
  }, [currentBoardId])

  async function reloadBoard() {
    if (!currentBoardId) return
    const board = await api.getBoard(currentBoardId)
    setColumns((board.columns || []).map(columnFromAPI))
  }

  function handleLogout() {
    clearToken(); setUser(null); setProjects([]); setBoards([])
    setColumns([]); setCurrentBoardId(null)
  }

  const currentBoard = boards.find((b) => b.id === currentBoardId)

  async function addCard(columnId, title) {
    try { await api.createCard({ title, columnId }); await reloadBoard() }
    catch (err) { alert(err.message) }
  }

  async function deleteCard(cardId) {
    try { await api.deleteCard(cardId); await reloadBoard() }
    catch (err) { alert(err.message) }
  }

  async function updateCard(cardId, updates) {
    try {
      const apiUpdates = {}
      if (updates.title !== undefined) apiUpdates.title = updates.title
      if (updates.description !== undefined) apiUpdates.description = updates.description
      if (updates.priority !== undefined) apiUpdates.priority = updates.priority
      if (updates.deadline !== undefined) apiUpdates.deadline = updates.deadline
      if (updates.attachmentUrl !== undefined) apiUpdates.attachmentUrl = updates.attachmentUrl
      if (updates.labels !== undefined) {
        apiUpdates.labels = Array.isArray(updates.labels) ? updates.labels.join(',') : updates.labels
      }
      await api.updateCard(cardId, apiUpdates)
      await reloadBoard()
    } catch (err) { alert(err.message) }
  }

  async function addComment(cardId, text) {
    try { await api.addComment(cardId, text); await reloadBoard() }
    catch (err) { alert(err.message) }
  }

  async function setWipLimit(columnId, limit) {
    try { await api.updateColumn(columnId, { wipLimit: limit }); await reloadBoard() }
    catch (err) { alert(err.message) }
  }

  async function addColumn(title) {
    const trimmed = title.trim()
    if (!trimmed || !currentBoardId) return
    try {
      await api.createColumn({ title: trimmed, boardId: currentBoardId })
      await reloadBoard(); setNewColumnTitle(''); setIsAddingColumn(false)
    } catch (err) { alert(err.message) }
  }

  function handleAddColumnSubmit(e) { e.preventDefault(); addColumn(newColumnTitle) }

  async function renameColumn(columnId, newTitle) {
    if (!newTitle || !newTitle.trim()) return
    try { await api.updateColumn(columnId, { title: newTitle.trim() }); await reloadBoard() }
    catch (err) { alert(err.message) }
  }

  async function deleteColumn(columnId) {
    if (!confirm('Удалить колонку со всеми карточками?')) return
    try { await api.deleteColumn(columnId); await reloadBoard() }
    catch (err) { alert(err.message) }
  }

  async function handleDragEnd(event) {
    const { active, over } = event
    if (!over) return
    const cardId = active.id
    const targetColumnId = over.id
    const sourceColumn = columns.find((col) => col.cards.some((c) => c.id === cardId))
    if (!sourceColumn || sourceColumn.id === targetColumnId) return
    try { await api.moveCard(cardId, targetColumnId); await reloadBoard() }
    catch (err) { alert(err.message) }
  }

  function selectBoard(boardId) {
    setCurrentBoardId(boardId); setEditingCardId(null); setSearchQuery('')
    setPriorityFilter('all'); setLabelFilter('all'); setAssigneeFilter('all')
  }

  async function createBoard(name) {
    const projectId = currentBoard?.projectId || projects[0]?.id
    if (!projectId) { alert('Нет проекта для создания доски'); return }
    try {
      const board = await api.createBoard({ name, projectId })
      setBoards((prev) => [...prev, board]); setCurrentBoardId(board.id)
    } catch (err) { alert(err.message) }
  }

  async function deleteBoard(boardId) {
    if (boards.length <= 1) { alert('Нельзя удалить последнюю доску'); return }
    if (!confirm('Удалить доску со всеми колонками и карточками?')) return
    try {
      await api.deleteBoard(boardId)
      const remaining = boards.filter((b) => b.id !== boardId)
      setBoards(remaining)
      if (boardId === currentBoardId) setCurrentBoardId(remaining[0].id)
    } catch (err) { alert(err.message) }
  }

  async function renameBoard(boardId, newName) {
    if (!newName || !newName.trim()) return
    try {
      await api.updateBoard(boardId, { name: newName.trim() })
      setBoards((prev) => prev.map((b) => (b.id === boardId ? { ...b, name: newName.trim() } : b)))
    } catch (err) { alert(err.message) }
  }

  async function createProject() {
    const name = prompt('Название проекта:')
    if (!name || !name.trim()) return
    try {
      const project = await api.createProject({ name: name.trim() })
      setProjects((prev) => [...prev, project])
      const board = await api.createBoard({ name: 'Основная доска', projectId: project.id })
      setBoards((prev) => [...prev, board]); setCurrentBoardId(board.id)
    } catch (err) { alert(err.message) }
  }

  const allCards = columns.flatMap((c) => c.cards)
  const availableLabels = Array.from(new Set(allCards.flatMap((c) => c.labels || []))).sort()
  const availableAssignees = Array.from(new Set(allCards.map((c) => c.assignee).filter(Boolean))).sort()

  function filterCards(cards) {
    return cards.filter((card) => {
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase()
        if (!card.title.toLowerCase().includes(q)) return false
      }
      if (priorityFilter !== 'all' && (card.priority || 'medium') !== priorityFilter) return false
      if (labelFilter !== 'all' && (!card.labels || !card.labels.includes(labelFilter))) return false
      if (assigneeFilter !== 'all' && card.assignee !== assigneeFilter) return false
      return true
    })
  }

  function resetFilters() {
    setPriorityFilter('all'); setLabelFilter('all'); setAssigneeFilter('all')
  }

  const editingCard = editingCardId
    ? columns.flatMap((c) => c.cards).find((c) => c.id === editingCardId)
    : null

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Загрузка...</div>
  if (!user) return <Login onLogin={setUser} />

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Header user={user} onLogout={handleLogout} />
      <div className="app">
        <BoardTitle
          title={currentBoard?.name || 'Моя Kanban-доска'}
          onRename={(newName) => renameBoard(currentBoardId, newName)}
        />
        

        <BoardToolbar
          projects={projects}
          boards={boards}
          currentBoardId={currentBoardId}
          onSelectBoard={selectBoard}
          onCreateBoard={createBoard}
          onCreateProject={createProject}
          onDeleteBoard={deleteBoard}
        />

        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterBar
          priorityFilter={priorityFilter}
          labelFilter={labelFilter}
          assigneeFilter={assigneeFilter}
          availableLabels={availableLabels}
          availableAssignees={availableAssignees}
          onChangePriority={setPriorityFilter}
          onChangeLabel={setLabelFilter}
          onChangeAssignee={setAssigneeFilter}
          onReset={resetFilters}
        />

        <div className="board">
          {columns.map((column) => {
            const filteredCards = filterCards(column.cards)
            return (
              <Column
                key={column.id}
                id={column.id}
                title={column.title}
                cards={filteredCards}
                wipLimit={column.wipLimit}
                onAddCard={addCard}
                onDeleteCard={deleteCard}
                onSetWipLimit={setWipLimit}
                onOpenCard={(cardId) => setEditingCardId(cardId)}
                onRenameColumn={renameColumn}
                onDeleteColumn={deleteColumn}
              />
            )
          })}

          {isAddingColumn ? (
            <form className="add-column-form" onSubmit={handleAddColumnSubmit}>
              <input
                autoFocus
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Название колонки"
                onBlur={() => { if (!newColumnTitle.trim()) setIsAddingColumn(false) }}
              />
              <div className="add-column-actions">
                <button type="submit">Добавить</button>
                <button type="button" onClick={() => { setNewColumnTitle(''); setIsAddingColumn(false) }}>×</button>
              </div>
            </form>
          ) : (
            <button className="add-column-btn" onClick={() => setIsAddingColumn(true)}>+ Колонка</button>
          )}
        </div>
      </div>
      <Footer />

      {editingCard && (
        <CardModal
          card={editingCard}
          onClose={() => setEditingCardId(null)}
          onSave={updateCard}
          onAddComment={addComment}
        />
      )}
    </DndContext>
  )
}

export default App
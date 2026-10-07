import { useState, useEffect } from 'react'
import { DndContext } from '@dnd-kit/core'
import './App.css'
import Column from './components/Column'
import { initialColumns } from './data'
import Header from './components/Header'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import CardModal from './components/CardModal'
import BoardToolbar from './components/BoardToolbar'
import BoardTitle from './components/BoardTitle'
import FilterBar from './components/FilterBar'

let idCounter = 0
function uid() {
  idCounter += 1
  return `${Date.now()}-${idCounter}`
}

function App() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('kanban-projects')
    return saved ? JSON.parse(saved) : [{ id: 'p1', name: 'Учебный проект' }]
  })

  const [boards, setBoards] = useState(() => {
    const saved = localStorage.getItem('kanban-boards')
    if (saved) return JSON.parse(saved)

    const oldColumns = localStorage.getItem('kanban-columns')
    return [
      {
        id: 'b1',
        projectId: 'p1',
        name: 'Основная доска',
        columns: oldColumns ? JSON.parse(oldColumns) : initialColumns,
      },
    ]
  })

  const [currentBoardId, setCurrentBoardId] = useState(() => {
    return localStorage.getItem('kanban-currentBoardId') || 'b1'
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [labelFilter, setLabelFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')

  const [editingCardId, setEditingCardId] = useState(null)
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  useEffect(() => {
    localStorage.setItem('kanban-projects', JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    localStorage.setItem('kanban-boards', JSON.stringify(boards))
  }, [boards])

  useEffect(() => {
    localStorage.setItem('kanban-currentBoardId', currentBoardId)
  }, [currentBoardId])

  const currentBoard = boards.find((b) => b.id === currentBoardId)
  const columns = currentBoard?.columns || []

  function updateColumns(updater) {
    setBoards((prev) =>
      prev.map((b) =>
        b.id === currentBoardId
          ? {
              ...b,
              columns:
                typeof updater === 'function' ? updater(b.columns) : updater,
            }
          : b
      )
    )
  }

  function addCard(columnId, title) {
    updateColumns((prev) => {
      const targetColumn = prev.find((col) => col.id === columnId)
      if (!targetColumn) return prev

      if (
        targetColumn.wipLimit !== null &&
        targetColumn.cards.length >= targetColumn.wipLimit
      ) {
        alert(
          `В колонке "${targetColumn.title}" достигнут WIP-лимит (${targetColumn.wipLimit}). ` +
            `Сначала завершите текущие задачи.`
        )
        return prev
      }

      return prev.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: [...col.cards, { id: uid(), title }],
            }
          : col
      )
    })
  }

  function deleteCard(cardId) {
    updateColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.filter((c) => c.id !== cardId),
      }))
    )
  }

  function updateCard(cardId, updates) {
    updateColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.map((c) =>
          c.id === cardId ? { ...c, ...updates } : c
        ),
      }))
    )
  }

  function addComment(cardId, text) {
    const comment = {
      id: uid(),
      author: 'Вы',
      text,
      date: new Date().toISOString(),
    }
    updateColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.map((c) =>
          c.id === cardId
            ? { ...c, comments: [...(c.comments || []), comment] }
            : c
        ),
      }))
    )
  }

  function setWipLimit(columnId, limit) {
    updateColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, wipLimit: limit } : col
      )
    )
  }

  function addColumn(title) {
    const trimmed = title.trim()
    if (!trimmed) return
    updateColumns((prev) => [
      ...prev,
      {
        id: uid(),
        title: trimmed,
        wipLimit: null,
        cards: [],
      },
    ])
    setNewColumnTitle('')
    setIsAddingColumn(false)
  }

  function handleAddColumnSubmit(e) {
    e.preventDefault()
    addColumn(newColumnTitle)
  }

  function renameColumn(columnId, newTitle) {
    if (!newTitle || !newTitle.trim()) return
    updateColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, title: newTitle.trim() } : col
      )
    )
  }

  function deleteColumn(columnId) {
    if (!confirm('Удалить колонку со всеми карточками?')) return
    updateColumns((prev) => prev.filter((col) => col.id !== columnId))
  }

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over) return

    const cardId = active.id
    const targetColumnId = over.id

    const sourceColumn = columns.find((col) =>
      col.cards.some((c) => c.id === cardId)
    )
    if (!sourceColumn) return
    if (sourceColumn.id === targetColumnId) return

    const targetColumn = columns.find((col) => col.id === targetColumnId)
    if (!targetColumn) return

    if (
      targetColumn.wipLimit !== null &&
      targetColumn.cards.length >= targetColumn.wipLimit
    ) {
      alert(
        `В колонке "${targetColumn.title}" достигнут WIP-лимит (${targetColumn.wipLimit}). ` +
          `Сначала завершите текущие задачи.`
      )
      return
    }

    const draggedCard = sourceColumn.cards.find((c) => c.id === cardId)
    if (!draggedCard) return

    updateColumns((prev) =>
      prev.map((col) => {
        if (col.id === sourceColumn.id) {
          return { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
        }
        if (col.id === targetColumnId) {
          return { ...col, cards: [...col.cards, draggedCard] }
        }
        return col
      })
    )
  }

  function selectBoard(boardId) {
    setCurrentBoardId(boardId)
    setEditingCardId(null)
    setSearchQuery('')
    setPriorityFilter('all')
    setLabelFilter('all')
    setAssigneeFilter('all')
  }

  function createBoard(name) {
    const newId = uid()
    const projectId = currentBoard?.projectId || projects[0]?.id || 'p1'

    setBoards((prev) => [
      ...prev,
      {
        id: newId,
        projectId,
        name,
        columns: [
          { id: uid(), title: 'To Do', wipLimit: null, cards: [] },
          { id: uid(), title: 'In Progress', wipLimit: 3, cards: [] },
          { id: uid(), title: 'Done', wipLimit: null, cards: [] },
        ],
      },
    ])
    setCurrentBoardId(newId)
  }

  function deleteBoard(boardId) {
    if (boards.length <= 1) {
      alert('Нельзя удалить последнюю доску')
      return
    }
    if (!confirm('Удалить доску со всеми колонками и карточками?')) return

    const boardToDelete = boards.find((b) => b.id === boardId)
    const remainingBoards = boards.filter((b) => b.id !== boardId)

    setBoards(remainingBoards)

    if (boardToDelete) {
      const projectStillHasBoards = remainingBoards.some(
        (b) => b.projectId === boardToDelete.projectId
      )
      if (!projectStillHasBoards) {
        setProjects((prev) =>
          prev.filter((p) => p.id !== boardToDelete.projectId)
        )
      }
    }

    if (boardId === currentBoardId) {
      setCurrentBoardId(remainingBoards[0].id)
    }
  }

  function renameBoard(boardId, newName) {
    if (!newName || !newName.trim()) return
    setBoards((prev) =>
      prev.map((b) =>
        b.id === boardId ? { ...b, name: newName.trim() } : b
      )
    )
  }

  function createProject() {
    const name = prompt('Название проекта:')
    if (!name || !name.trim()) return

    const newProjectId = uid()
    setProjects((prev) => [...prev, { id: newProjectId, name: name.trim() }])

    const newBoardId = uid()
    setBoards((prev) => [
      ...prev,
      {
        id: newBoardId,
        projectId: newProjectId,
        name: 'Основная доска',
        columns: [
          { id: uid(), title: 'To Do', wipLimit: null, cards: [] },
          { id: uid(), title: 'In Progress', wipLimit: 3, cards: [] },
          { id: uid(), title: 'Done', wipLimit: null, cards: [] },
        ],
      },
    ])
    setCurrentBoardId(newBoardId)
  }

  // Собираем все доступные метки и исполнителей на текущей доске
  const allCards = columns.flatMap((c) => c.cards)
  const availableLabels = Array.from(
    new Set(allCards.flatMap((c) => c.labels || []))
  ).sort()
  const availableAssignees = Array.from(
    new Set(allCards.map((c) => c.assignee).filter(Boolean))
  ).sort()

  function filterCards(cards) {
    return cards.filter((card) => {
      // Поиск по названию
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase()
        if (!card.title.toLowerCase().includes(q)) return false
      }
      // Приоритет
      if (priorityFilter !== 'all') {
        if ((card.priority || 'medium') !== priorityFilter) return false
      }
      // Метка
      if (labelFilter !== 'all') {
        if (!card.labels || !card.labels.includes(labelFilter)) return false
      }
      // Исполнитель
      if (assigneeFilter !== 'all') {
        if (card.assignee !== assigneeFilter) return false
      }
      return true
    })
  }

  function resetFilters() {
    setPriorityFilter('all')
    setLabelFilter('all')
    setAssigneeFilter('all')
  }

  const editingCard = editingCardId
    ? columns.flatMap((c) => c.cards).find((c) => c.id === editingCardId)
    : null

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Header />
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
                onBlur={() => {
                  if (!newColumnTitle.trim()) setIsAddingColumn(false)
                }}
              />
              <div className="add-column-actions">
                <button type="submit">Добавить</button>
                <button
                  type="button"
                  onClick={() => {
                    setNewColumnTitle('')
                    setIsAddingColumn(false)
                  }}
                >
                  ×
                </button>
              </div>
            </form>
          ) : (
            <button
              className="add-column-btn"
              onClick={() => setIsAddingColumn(true)}
            >
              + Колонка
            </button>
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
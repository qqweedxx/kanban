import './FilterBar.css'

function FilterBar({
  priorityFilter,
  labelFilter,
  assigneeFilter,
  availableLabels,
  availableAssignees,
  onChangePriority,
  onChangeLabel,
  onChangeAssignee,
  onReset,
}) {
  const hasActiveFilter =
    priorityFilter !== 'all' ||
    labelFilter !== 'all' ||
    assigneeFilter !== 'all'

  return (
    <div className="filter-bar">
      <select
        className="filter-bar__select"
        value={priorityFilter}
        onChange={(e) => onChangePriority(e.target.value)}
      >
        <option value="all">Все приоритеты</option>
        <option value="low">Низкий</option>
        <option value="medium">Средний</option>
        <option value="high">Высокий</option>
      </select>

      <select
        className="filter-bar__select"
        value={labelFilter}
        onChange={(e) => onChangeLabel(e.target.value)}
      >
        <option value="all">Все метки</option>
        {availableLabels.map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </select>

      <select
        className="filter-bar__select"
        value={assigneeFilter}
        onChange={(e) => onChangeAssignee(e.target.value)}
      >
        <option value="all">Все исполнители</option>
        {availableAssignees.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      {hasActiveFilter && (
        <button className="filter-bar__reset" onClick={onReset}>
          Сбросить фильтры
        </button>
      )}
    </div>
  )
}

export default FilterBar
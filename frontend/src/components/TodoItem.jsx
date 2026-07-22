import { useState } from "react";

const PRIORITY_LABEL = { low: "Low", normal: "Normal", high: "High" };

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const [draftPriority, setDraftPriority] = useState(todo.priority);
  const [busy, setBusy] = useState(false);

  function startEdit() {
    setDraftTitle(todo.title);
    setDraftPriority(todo.priority);
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
  }

  async function saveEdit() {
    const trimmed = draftTitle.trim();
    if (!trimmed) return;
    if (trimmed === todo.title && draftPriority === todo.priority) {
      setIsEditing(false);
      return;
    }
    await onEdit(todo.id, trimmed, draftPriority);
    setIsEditing(false);
  }

  async function handleToggle() {
    if (busy) return;
    setBusy(true);
    try {
      await onToggle(todo.id);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await onDelete(todo.id);
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className={`todo-card todo-card--${todo.priority} ${todo.completed ? "todo-card--done" : ""}`}>
      <button
        className={`todo-check ${todo.completed ? "todo-check--checked" : ""}`}
        onClick={handleToggle}
        aria-label={todo.completed ? "Mark as not done" : "Mark as done"}
        disabled={busy}
      >
        <svg viewBox="0 0 24 24" className="todo-check__icon">
          <polyline points="4 12.5 9.5 18 20 6" />
        </svg>
      </button>

      <div className="todo-card__body">
        {isEditing ? (
          <div className="todo-edit">
            <input
              className="todo-edit__input"
              value={draftTitle}
              autoFocus
              onChange={(e) => setDraftTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") cancelEdit();
              }}
            />
            <select
              className="todo-edit__select"
              value={draftPriority}
              onChange={(e) => setDraftPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
            <div className="todo-edit__actions">
              <button className="link-btn" onClick={saveEdit}>
                Save
              </button>
              <button className="link-btn link-btn--muted" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="todo-card__title">{todo.title}</span>
            <span className="todo-card__meta">
              <span className={`priority-dot priority-dot--${todo.priority}`} />
              {PRIORITY_LABEL[todo.priority]}
            </span>
          </>
        )}
      </div>

      {!isEditing && (
        <div className="todo-card__actions">
          <button className="icon-btn" onClick={startEdit} aria-label="Edit task">
            <svg viewBox="0 0 24 24">
              <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z" />
            </svg>
          </button>
          <button
            className="icon-btn icon-btn--danger"
            onClick={handleDelete}
            aria-label="Delete task"
            disabled={busy}
          >
            <svg viewBox="0 0 24 24">
              <path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
            </svg>
          </button>
        </div>
      )}
    </li>
  );
}

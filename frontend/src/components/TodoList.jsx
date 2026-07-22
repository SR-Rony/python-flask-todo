import TodoItem from "./TodoItem.jsx";

export default function TodoList({ todos, onToggle, onEdit, onDelete }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__mark" aria-hidden="true">
          ✦
        </div>
        <p>Nothing here. Add a task above, or switch filters.</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";

const FILTERS = ["all", "active", "completed"];

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      setLoading(true);
      const data = await api.list();
      setTodos(data);
      setError("");
    } catch (err) {
      setError("Couldn't reach the server. Is the Flask backend running?");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(title, priority) {
    const created = await api.create(title, priority);
    setTodos((prev) => [created, ...prev]);
  }

  async function handleToggle(id) {
    const updated = await api.toggle(id);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function handleEdit(id, title, priority) {
    const updated = await api.update(id, { title, priority });
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function handleDelete(id) {
    await api.remove(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  const filtered = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="page">
      <div className="app-shell">
        <header className="app-header">
          <span className="eyebrow">A calmer way to get things done</span>
          <h1>
            Today's <em>focus</em>
          </h1>
          <p className="subhead">
            {todos.length === 0
              ? "Nothing on your plate yet — add the first thing."
              : `${remaining} task${remaining === 1 ? "" : "s"} left to grow`}
          </p>
        </header>

        <TodoForm onCreate={handleCreate} />

        {error && <div className="banner banner--error">{error}</div>}

        <nav className="filter-pills">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`pill ${filter === f ? "pill--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </nav>

        {loading ? (
          <p className="loading-text">Loading your list…</p>
        ) : (
          <TodoList
            todos={filtered}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

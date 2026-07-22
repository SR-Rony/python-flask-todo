"""
Todo List API — Flask backend
Clean, single-responsibility layout:
    app.py        -> Flask app, routes (this file)
    database.py   -> DB connection + schema setup
    models.py      -> Todo data-access functions (CRUD)
"""

from flask import Flask, jsonify, request
from flask_cors import CORS

from database import init_db
import models

app = Flask(__name__)
CORS(app)  # allow the React dev server (different port) to call this API

# Make sure the database + table exist before the first request
init_db()


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/api/todos")
def get_todos():
    """Return all todos, newest first."""
    todos = models.get_all_todos()
    return jsonify(todos), 200


@app.post("/api/todos")
def create_todo():
    """Create a new todo. Body: { title: str, priority?: str }"""
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()

    if not title:
        return jsonify({"error": "Title is required"}), 400

    priority = data.get("priority", "normal")
    if priority not in ("low", "normal", "high"):
        priority = "normal"

    todo = models.create_todo(title, priority)
    return jsonify(todo), 201


@app.put("/api/todos/<int:todo_id>")
def update_todo(todo_id):
    """Update a todo's title / priority / completed state."""
    data = request.get_json(silent=True) or {}

    existing = models.get_todo(todo_id)
    if existing is None:
        return jsonify({"error": "Todo not found"}), 404

    title = data.get("title", existing["title"])
    priority = data.get("priority", existing["priority"])
    completed = data.get("completed", existing["completed"])

    if not str(title).strip():
        return jsonify({"error": "Title cannot be empty"}), 400

    todo = models.update_todo(todo_id, title.strip(), priority, bool(completed))
    return jsonify(todo), 200


@app.patch("/api/todos/<int:todo_id>/toggle")
def toggle_todo(todo_id):
    """Flip the completed flag — used by the checkbox click."""
    existing = models.get_todo(todo_id)
    if existing is None:
        return jsonify({"error": "Todo not found"}), 404

    todo = models.toggle_todo(todo_id, not existing["completed"])
    return jsonify(todo), 200


@app.delete("/api/todos/<int:todo_id>")
def delete_todo(todo_id):
    existing = models.get_todo(todo_id)
    if existing is None:
        return jsonify({"error": "Todo not found"}), 404

    models.delete_todo(todo_id)
    return jsonify({"message": "Deleted", "id": todo_id}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)

"""Data-access layer for todos — every DB query lives here, not in app.py."""

from database import get_connection


def _row_to_dict(row):
    if row is None:
        return None
    return {
        "id": row["id"],
        "title": row["title"],
        "completed": bool(row["completed"]),
        "priority": row["priority"],
        "created_at": row["created_at"],
    }


def get_all_todos():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM todos ORDER BY id DESC").fetchall()
    conn.close()
    return [_row_to_dict(r) for r in rows]


def get_todo(todo_id):
    conn = get_connection()
    row = conn.execute("SELECT * FROM todos WHERE id = ?", (todo_id,)).fetchone()
    conn.close()
    return _row_to_dict(row)


def create_todo(title, priority="normal"):
    conn = get_connection()
    cursor = conn.execute(
        "INSERT INTO todos (title, priority) VALUES (?, ?)", (title, priority)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return get_todo(new_id)


def update_todo(todo_id, title, priority, completed):
    conn = get_connection()
    conn.execute(
        "UPDATE todos SET title = ?, priority = ?, completed = ? WHERE id = ?",
        (title, priority, int(completed), todo_id),
    )
    conn.commit()
    conn.close()
    return get_todo(todo_id)


def toggle_todo(todo_id, completed):
    conn = get_connection()
    conn.execute(
        "UPDATE todos SET completed = ? WHERE id = ?", (int(completed), todo_id)
    )
    conn.commit()
    conn.close()
    return get_todo(todo_id)


def delete_todo(todo_id):
    conn = get_connection()
    conn.execute("DELETE FROM todos WHERE id = ?", (todo_id,))
    conn.commit()
    conn.close()

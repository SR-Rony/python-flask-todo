"""Database connection + schema setup, kept separate from route logic."""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "todo.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create the todos table if it doesn't already exist."""
    conn = get_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS todos (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            title       TEXT NOT NULL,
            completed   INTEGER NOT NULL DEFAULT 0,
            priority    TEXT NOT NULL DEFAULT 'normal',
            created_at  TEXT NOT NULL DEFAULT (datetime('now'))
        )
        """
    )
    conn.commit()
    conn.close()

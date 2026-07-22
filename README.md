# Sprout — Todo List

A full-stack todo list app: **React (Vite)** frontend + **Flask** backend, with full Create / Read / Update / Delete support and a custom-designed UI.

## Folder structure

```
todo-app/
├── backend/                 # Flask API
│   ├── app.py                # Routes only
│   ├── database.py           # DB connection + schema
│   ├── models.py              # All CRUD queries
│   └── requirements.txt
│
└── frontend/                 # React (Vite) app
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js             # All fetch calls to the backend
        ├── index.css          # Design system + styles
        └── components/
            ├── TodoForm.jsx
            ├── TodoList.jsx
            └── TodoItem.jsx
```

## Run the backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The API runs at `http://127.0.0.1:5000`. A `todo.db` SQLite file is created automatically on first run.

## Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The dev server proxies `/api` calls to the Flask backend, so both need to be running.

## API reference

| Method | Route                     | Description              |
|--------|----------------------------|---------------------------|
| GET    | `/api/todos`               | List all todos            |
| POST   | `/api/todos`               | Create a todo `{ title, priority }` |
| PUT    | `/api/todos/<id>`          | Update title/priority/completed |
| PATCH  | `/api/todos/<id>/toggle`   | Flip completed state       |
| DELETE | `/api/todos/<id>`          | Delete a todo              |

## Design

- **Palette**: warm linen background, deep forest green primary, amber and terracotta accents for priority levels.
- **Type**: Fraunces (serif, headline) paired with Inter (UI/body).
- **Signature interaction**: circular checkbox that fills and reveals a checkmark with a spring-like animation; cards lift and their left accent bar brightens on hover; edit/delete icons fade in only on hover to keep the list calm at rest.

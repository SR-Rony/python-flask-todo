// Thin wrapper around fetch — every HTTP call to the Flask API lives here
// so components never touch fetch/JSON directly.

const BASE_URL = "/api/todos";

async function handle(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
}

export const api = {
  list: () => fetch(BASE_URL).then(handle),

  create: (title, priority) =>
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, priority }),
    }).then(handle),

  update: (id, payload) =>
    fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handle),

  toggle: (id) =>
    fetch(`${BASE_URL}/${id}/toggle`, { method: "PATCH" }).then(handle),

  remove: (id) =>
    fetch(`${BASE_URL}/${id}`, { method: "DELETE" }).then(handle),
};

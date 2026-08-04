import { generateCorrelationId } from '../utils/correlationId';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'X-Correlation-ID': generateCorrelationId(),
  };
}

export async function getNotes(token, search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await fetch(`${API_URL}/api/notes${query}`, {
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch notes');
  return data.notes;
}

export async function createNote(token, title, content) {
  const res = await fetch(`${API_URL}/api/notes`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ title, content }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create note');
  return data.note;
}

export async function updateNote(token, id, title, content) {
  const res = await fetch(`${API_URL}/api/notes/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ title, content }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update note');
  return data.note;
}

export async function deleteNote(token, id) {
  const res = await fetch(`${API_URL}/api/notes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete note');
  return data;
}

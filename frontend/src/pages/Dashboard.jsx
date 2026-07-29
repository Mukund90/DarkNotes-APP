import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotes, deleteNote } from '../api/notesApi';
import { downloadAllNotesAsPDF } from '../utils/pdfExport';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';

export default function Dashboard() {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function loadNotes(searchTerm = '') {
    setLoading(true);
    setError('');
    try {
      const data = await getNotes(token, searchTerm);
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearchChange(e) {
    const value = e.target.value;
    setSearch(value);
    loadNotes(value);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this note?')) return;
    try {
      await deleteNote(token, id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(note) {
    navigate(`/notes/${note.id}`, { state: { note } });
  }

  function handleDownloadAll() {
    if (notes.length === 0) return;
    downloadAllNotesAsPDF(notes);
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <h2 style={{ margin: 0 }}>Your Notes</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-outline"
              onClick={handleDownloadAll}
              disabled={notes.length === 0}
            >
              Download All (PDF)
            </button>
            <button className="btn" onClick={() => navigate('/notes/new')}>
              + New Note
            </button>
          </div>
        </div>

        <input
          className="search-bar"
          placeholder="Search notes by title..."
          value={search}
          onChange={handleSearchChange}
        />

        {error && <div className="error-text">{error}</div>}

        {loading ? (
          <div className="loading-text">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            No notes yet. Create your first one!
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createNote, updateNote } from '../api/notesApi';
import { downloadNoteAsPDF } from '../utils/pdfExport';
import Navbar from '../components/Navbar';

export default function NoteEditor() {
  const { token } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const existingNote = location.state?.note || null;
  const isEditing = id !== 'new' && existingNote;

  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    try {
      if (isEditing) {
        await updateNote(token, existingNote.id, title, content);
      } else {
        await createNote(token, title, content);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container" style={{ maxWidth: 640 }}>
        <h2>{isEditing ? 'Edit Note' : 'New Note'}</h2>
        {error && <div className="error-text">{error}</div>}
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Note'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() =>
                  downloadNoteAsPDF({ ...existingNote, title, content })
                }
              >
                Download PDF
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

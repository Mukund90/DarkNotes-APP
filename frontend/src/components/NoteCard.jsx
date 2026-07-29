import React from 'react';
import { downloadNoteAsPDF } from '../utils/pdfExport';

export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <div className="note-actions">
        <button className="icon-btn" onClick={() => onEdit(note)}>
          Edit
        </button>
        <button className="icon-btn" onClick={() => downloadNoteAsPDF(note)}>
          Download PDF
        </button>
        <button className="icon-btn" onClick={() => onDelete(note.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
